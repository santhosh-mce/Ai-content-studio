"use client"

import { useState, useEffect } from "react"
import { getCalendarPosts, updatePostDate, generate30DayPlan } from "@/actions/calendar"
import { DndContext, closestCenter, DragOverlay, useSensor, useSensors, PointerSensor, DragEndEvent } from '@dnd-kit/core'
import { useDroppable } from '@dnd-kit/core'
import { useDraggable } from '@dnd-kit/core'
import { Calendar, ChevronLeft, ChevronRight, Filter, Sparkles, Loader2, LayoutList, GripVertical } from "lucide-react"
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, startOfWeek, endOfWeek } from "date-fns"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"

export default function CalendarStudio() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [posts, setPosts] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isGenerating, setIsGenerating] = useState(false)
  const [filter, setFilter] = useState("All")
  const [niche, setNiche] = useState("")
  const [activeId, setActiveId] = useState<string | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  )

  useEffect(() => {
    fetchPosts()
  }, [])

  async function fetchPosts() {
    setIsLoading(true)
    try {
      const data = await getCalendarPosts()
      setPosts(data)
    } catch (e) {
      console.error(e)
    }
    setIsLoading(false)
  }

  const handleDragStart = (event: any) => {
    setActiveId(event.active.id)
  }

  const handleDragEnd = async (event: DragEndEvent) => {
    setActiveId(null)
    const { active, over } = event
    
    if (!over) return

    const postId = active.id as string
    const newDateStr = over.id as string
    const newDate = new Date(newDateStr)

    // Optimistic update
    const originalPosts = [...posts]
    setPosts(posts.map(p => p.id === postId ? { ...p, publishDate: newDate } : p))

    try {
      await updatePostDate(postId, newDate)
    } catch (e) {
      // Revert on error
      setPosts(originalPosts)
    }
  }

  const handleGeneratePlan = async () => {
    if (!niche) return alert("Enter a niche to generate ideas")
    setIsGenerating(true)
    try {
      await generate30DayPlan(niche)
      await fetchPosts()
      setNiche("")
    } catch (e) {
      alert("Failed to generate plan.")
    }
    setIsGenerating(false)
  }

  // Calendar Grid Logic
  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(monthStart)
  const startDate = startOfWeek(monthStart, { weekStartsOn: 1 })
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 })
  const calendarDays = eachDayOfInterval({ start: startDate, end: endDate })

  const filteredPosts = posts.filter(p => filter === "All" || p.platform === filter)

  // Analytics
  const publishedCount = posts.filter(p => p.status === "Published").length
  const scheduledCount = posts.filter(p => p.status === "Scheduled").length
  const draftCount = posts.filter(p => p.status === "Draft").length

  const chartData = [
    { name: 'Published', value: publishedCount || 1, color: '#10b981' },
    { name: 'Scheduled', value: scheduledCount || 1, color: '#3b82f6' },
    { name: 'Drafts', value: draftCount || 1, color: '#6366f1' },
  ]

  const activePost = activeId ? posts.find(p => p.id === activeId) : null

  return (
    <div className="max-w-[1600px] mx-auto h-[calc(100vh-80px)] flex flex-col space-y-4">
      
      {/* Top Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-zinc-950 p-4 border border-zinc-800 rounded-2xl shadow-xl shrink-0">
        <div className="flex items-center gap-4">
          <button onClick={() => setCurrentDate(subMonths(currentDate, 1))} className="p-2 hover:bg-zinc-800 rounded-lg transition">
            <ChevronLeft className="w-5 h-5 text-zinc-400" />
          </button>
          <h2 className="text-xl font-bold w-40 text-center">{format(currentDate, "MMMM yyyy")}</h2>
          <button onClick={() => setCurrentDate(addMonths(currentDate, 1))} className="p-2 hover:bg-zinc-800 rounded-lg transition">
            <ChevronRight className="w-5 h-5 text-zinc-400" />
          </button>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 rounded-lg px-2">
            <Filter className="w-4 h-4 text-zinc-500" />
            <select className="bg-transparent text-sm text-zinc-300 p-2 outline-none" value={filter} onChange={(e) => setFilter(e.target.value)}>
              <option value="All">All Platforms</option>
              <option value="Instagram">Instagram</option>
              <option value="YouTube">YouTube</option>
              <option value="LinkedIn">LinkedIn</option>
              <option value="TikTok">TikTok</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <input 
              type="text" 
              placeholder="e.g., Tech Startup" 
              className="bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white outline-none w-32 focus:w-48 transition-all"
              value={niche}
              onChange={(e) => setNiche(e.target.value)}
            />
            <button 
              onClick={handleGeneratePlan}
              disabled={isGenerating || !niche}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-sm font-medium px-4 py-2 rounded-lg flex items-center gap-2 transition-all disabled:opacity-50 shadow-lg shadow-blue-500/20"
            >
              {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              Generate 30-Day Plan
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 min-h-0 flex gap-6">
        
        {/* Calendar Grid */}
        <div className="flex-1 bg-zinc-950 border border-zinc-800 rounded-2xl flex flex-col overflow-hidden shadow-xl">
          {/* Days Header */}
          <div className="grid grid-cols-7 border-b border-zinc-800 bg-zinc-900/50">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
              <div key={day} className="p-3 text-center text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                {day}
              </div>
            ))}
          </div>

          {/* Grid */}
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {isLoading ? (
              <div className="h-full flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-zinc-600" />
              </div>
            ) : (
              <DndContext sensors={sensors} collisionDetection={closestCenter} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
                <div className="grid grid-cols-7 auto-rows-[minmax(120px,auto)] min-h-full">
                  {calendarDays.map((day, i) => {
                    const dateStr = day.toISOString()
                    const dayPosts = filteredPosts.filter(p => isSameDay(new Date(p.publishDate), day))
                    const isCurrentMonth = isSameMonth(day, currentDate)
                    
                    return (
                      <DroppableCell key={dateStr} id={dateStr} date={day} isCurrentMonth={isCurrentMonth}>
                        {dayPosts.map(post => (
                          <DraggablePost key={post.id} post={post} />
                        ))}
                      </DroppableCell>
                    )
                  })}
                </div>
                
                <DragOverlay>
                  {activePost ? <DraggablePost post={activePost} isOverlay /> : null}
                </DragOverlay>
              </DndContext>
            )}
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="w-80 flex flex-col gap-6 overflow-y-auto custom-scrollbar">
          
          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-5 shadow-xl shrink-0">
            <h3 className="text-sm font-semibold text-white mb-4">Campaign Progress</h3>
            <div className="h-40 relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    innerRadius={40}
                    outerRadius={60}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{backgroundColor: '#09090b', borderColor: '#27272a', borderRadius: '8px', fontSize: '12px'}} />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-2xl font-bold text-white">{posts.length}</span>
                <span className="text-[10px] text-zinc-500 uppercase">Total</span>
              </div>
            </div>
            
            <div className="space-y-3 mt-2">
               <div className="flex justify-between items-center text-sm">
                 <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-emerald-500"></div><span className="text-zinc-400">Published</span></div>
                 <span className="font-semibold">{publishedCount}</span>
               </div>
               <div className="flex justify-between items-center text-sm">
                 <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-blue-500"></div><span className="text-zinc-400">Scheduled</span></div>
                 <span className="font-semibold">{scheduledCount}</span>
               </div>
               <div className="flex justify-between items-center text-sm">
                 <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-indigo-500"></div><span className="text-zinc-400">Drafts</span></div>
                 <span className="font-semibold">{draftCount}</span>
               </div>
            </div>
          </div>

          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-5 shadow-xl flex-1 flex flex-col min-h-[300px]">
            <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
               <LayoutList className="w-4 h-4 text-blue-500" /> Ideas Pipeline
            </h3>
            <div className="flex-1 space-y-3 overflow-y-auto pr-2 custom-scrollbar">
              {draftCount === 0 && <p className="text-xs text-zinc-500">No ideas in pipeline. Generate a 30-day plan!</p>}
              {posts.filter(p => p.status === "Draft").slice(0, 10).map(draft => (
                <div key={draft.id} className="p-3 bg-zinc-900 border border-zinc-800 rounded-xl hover:border-zinc-700 transition cursor-pointer">
                   <p className="text-xs font-semibold text-white mb-1 line-clamp-1">{draft.title}</p>
                   <div className="flex justify-between items-center">
                     <span className="text-[10px] text-zinc-400">{draft.platform} • {draft.contentType}</span>
                     <span className="text-[10px] text-indigo-400 bg-indigo-500/10 px-1.5 py-0.5 rounded">Draft</span>
                   </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

function DroppableCell({ id, date, isCurrentMonth, children }: { id: string, date: Date, isCurrentMonth: boolean, children: React.ReactNode }) {
  const { isOver, setNodeRef } = useDroppable({ id })

  return (
    <div 
      ref={setNodeRef}
      className={`border-b border-r border-zinc-800 p-2 min-h-[120px] transition-colors
        ${!isCurrentMonth ? 'bg-zinc-950/50 opacity-50' : ''}
        ${isOver ? 'bg-zinc-900/80 ring-2 ring-blue-500/50 inset-0' : ''}
      `}
    >
      <div className={`text-xs font-semibold mb-2 ${isSameDay(date, new Date()) ? 'w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center' : 'text-zinc-500'}`}>
        {format(date, "d")}
      </div>
      <div className="space-y-1.5">
        {children}
      </div>
    </div>
  )
}

function DraggablePost({ post, isOverlay = false }: { post: any, isOverlay?: boolean }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: post.id,
    data: post
  })

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    zIndex: 50,
  } : undefined

  if (isDragging && !isOverlay) {
    return <div ref={setNodeRef} className="h-16 border-2 border-dashed border-zinc-700 rounded-lg opacity-50 bg-zinc-900/50" />
  }

  const platformColors: any = {
    "Instagram": "bg-pink-500/10 text-pink-500 border-pink-500/20",
    "YouTube": "bg-red-500/10 text-red-500 border-red-500/20",
    "LinkedIn": "bg-blue-500/10 text-blue-500 border-blue-500/20",
    "TikTok": "bg-cyan-500/10 text-cyan-500 border-cyan-500/20"
  }
  const colorClass = platformColors[post.platform] || "bg-zinc-800 text-zinc-300 border-zinc-700"

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      className={`p-2 border rounded-lg bg-zinc-950 cursor-grab active:cursor-grabbing hover:border-zinc-600 transition-colors ${colorClass} ${isOverlay ? 'shadow-2xl scale-105 rotate-2' : ''}`}
    >
      <div className="flex items-start gap-1">
        <div {...listeners} {...attributes} className="mt-0.5 text-zinc-500 hover:text-white shrink-0">
          <GripVertical className="w-3.5 h-3.5" />
        </div>
        <div className="min-w-0">
          <p className="text-xs font-semibold truncate text-white">{post.title}</p>
          <div className="flex items-center gap-1 mt-1">
            <span className="text-[9px] font-medium uppercase tracking-wider">{post.platform} {post.contentType}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
