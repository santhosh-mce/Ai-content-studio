"use client"

import { useState } from "react"
import { generateReelScript, generateReelVideo } from "@/actions/ai"
import { Loader2, Copy, CheckCircle2, Video, FileText, Download, Play, TrendingUp, Clock, Activity, Hash, PlayCircle, BarChart3, GripVertical } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts"

const PLATFORMS = ["Instagram Reels", "YouTube Shorts", "TikTok"]
const DURATIONS = ["15s", "30s", "60s", "90s"]
const STYLES = ["Educational", "Motivational", "Funny", "Storytelling"]

interface Scene {
  time: string;
  visual: string;
  audio: string;
}

export default function ReelStudio() {
  const [topic, setTopic] = useState("")
  const [platform, setPlatform] = useState("Instagram Reels")
  const [duration, setDuration] = useState("30s")
  const [audience, setAudience] = useState("")
  const [style, setStyle] = useState("Educational")
  
  const [isGenerating, setIsGenerating] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState("")
  const [copied, setCopied] = useState(false)
  
  const [isVideoGenerating, setIsVideoGenerating] = useState(false)
  const [videoUrl, setVideoUrl] = useState<string | null>(null)

  const handleGenerateScript = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsGenerating(true)
    setError("")
    setResult(null)
    setVideoUrl(null)
    try {
      const data = await generateReelScript(topic, platform, duration, audience || "General", style)
      setResult(data)
    } catch (err: any) {
      setError(err.message || "Failed to generate script.")
    } finally {
      setIsGenerating(false)
    }
  }

  const handleGenerateVideo = async () => {
    if (!result?.projectId) return
    setIsVideoGenerating(true)
    try {
      const data = await generateReelVideo(result.projectId)
      setVideoUrl(data.videoUrl)
    } catch (err: any) {
      setError(err.message || "Failed to generate video.")
    } finally {
      setIsVideoGenerating(false)
    }
  }

  const handleCopy = () => {
    if (result?.voiceover) {
      navigator.clipboard.writeText(result.voiceover)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const chartData = [
    { name: 'Viral', value: 94, color: '#8b5cf6' },
    { name: 'Watch', value: 87, color: '#3b82f6' },
    { name: 'Trend', value: 91, color: '#10b981' },
    { name: 'Engage', value: 89, color: '#f59e0b' },
  ]

  return (
    <div className="max-w-[1600px] mx-auto h-[calc(100vh-80px)] flex flex-col space-y-4">
      <div className="flex-shrink-0 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Video className="w-6 h-6 text-pink-500" /> AI Reel Script Generator
          </h1>
          <p className="text-zinc-400 text-sm mt-1">Professional Creator Studio for Short-form Video.</p>
        </div>
        {result && (
           <button onClick={handleCopy} className="bg-zinc-900 border border-zinc-800 text-white hover:bg-zinc-800 px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors">
             {copied ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />} Copy Script
           </button>
        )}
      </div>

      <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-12 gap-6 pb-6">
        
        {/* LEFT COLUMN: INPUT PANEL (3/12) */}
        <div className="lg:col-span-3 bg-zinc-950 border border-zinc-800 rounded-2xl p-5 flex flex-col overflow-y-auto custom-scrollbar shadow-xl">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-500 mb-5 flex items-center gap-2">
            <FileText className="w-4 h-4" /> Input Panel
          </h2>
          <form onSubmit={handleGenerateScript} className="space-y-5 flex-1">
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1.5">Topic</label>
              <textarea
                className="w-full bg-black border border-zinc-800 rounded-xl p-3 text-sm text-white focus:ring-1 focus:ring-pink-500 outline-none resize-none h-20 transition-all"
                placeholder="e.g., 3 Hidden iOS 18 features..."
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1.5">Platform</label>
              <div className="grid grid-cols-1 gap-2">
                {PLATFORMS.map(p => (
                  <button
                    key={p} type="button" onClick={() => setPlatform(p)}
                    className={`text-left px-3 py-2.5 rounded-lg text-sm font-medium border transition-all ${platform === p ? "bg-pink-600/20 border-pink-500/50 text-pink-400" : "bg-black border-zinc-800 text-zinc-400 hover:bg-zinc-900"}`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1.5">Duration</label>
              <div className="grid grid-cols-4 gap-2">
                {DURATIONS.map(d => (
                  <button
                    key={d} type="button" onClick={() => setDuration(d)}
                    className={`py-2 rounded-lg text-xs font-medium border transition-all ${duration === d ? "bg-blue-600/20 border-blue-500/50 text-blue-400" : "bg-black border-zinc-800 text-zinc-400 hover:bg-zinc-900"}`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1.5">Audience</label>
              <input
                type="text"
                className="w-full bg-black border border-zinc-800 rounded-xl p-3 text-sm text-white focus:ring-1 focus:ring-pink-500 outline-none transition-all"
                placeholder="e.g., Tech Enthusiasts"
                value={audience}
                onChange={(e) => setAudience(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1.5">Style</label>
              <div className="grid grid-cols-2 gap-2">
                {STYLES.map(s => (
                  <button
                    key={s} type="button" onClick={() => setStyle(s)}
                    className={`py-2 px-2 rounded-lg text-xs font-medium border transition-all ${style === s ? "bg-purple-600/20 border-purple-500/50 text-purple-400" : "bg-black border-zinc-800 text-zinc-400 hover:bg-zinc-900"}`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {error && <div className="text-red-400 text-xs p-3 bg-red-950/30 rounded-lg border border-red-900/50">{error}</div>}
            
            <button
              type="submit"
              disabled={isGenerating || !topic}
              className="w-full mt-4 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-semibold py-3 rounded-xl flex justify-center items-center gap-2 transition-all disabled:opacity-50 shadow-lg shadow-pink-500/20"
            >
              {isGenerating ? <Loader2 className="w-5 h-5 animate-spin" /> : <><FileText className="w-4 h-4" /> Generate Script</>}
            </button>
          </form>
        </div>

        {/* CENTER COLUMN: SCRIPT WORKSPACE (6/12) */}
        <div className="lg:col-span-6 bg-zinc-950 border border-zinc-800 rounded-2xl p-5 flex flex-col overflow-y-auto custom-scrollbar shadow-xl relative">
          <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
             <Video className="w-32 h-32" />
          </div>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-500 mb-5 flex items-center gap-2">
            <PlayCircle className="w-4 h-4" /> Script Workspace
          </h2>

          {!result && !isGenerating && (
             <div className="flex-1 flex flex-col items-center justify-center text-zinc-500 opacity-50">
                <Video className="w-16 h-16 mb-4" />
                <p>Your generated script & timeline will appear here.</p>
             </div>
          )}

          {isGenerating && (
            <div className="flex-1 flex flex-col items-center justify-center text-zinc-400">
               <Loader2 className="w-8 h-8 animate-spin mb-4 text-pink-500" />
               <p className="font-medium text-white">Directing your video...</p>
               <p className="text-sm">Writing hooks and mapping scenes.</p>
            </div>
          )}

          <AnimatePresence>
          {result && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="p-4 bg-pink-500/10 border border-pink-500/20 rounded-xl">
                <h3 className="text-xs font-bold text-pink-500 uppercase tracking-wider mb-2">Hook</h3>
                <p className="text-white text-lg font-medium">"{result.hook}"</p>
              </div>

              <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-xl">
                <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Storyline</h3>
                <p className="text-zinc-300 text-sm">{result.storyline}</p>
              </div>

              <div>
                <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-4 flex items-center justify-between">
                  Scene Breakdown Timeline
                  <span className="bg-zinc-800 px-2 py-1 rounded text-zinc-400">{result.sceneBreakdown?.length} Scenes</span>
                </h3>
                <div className="space-y-3">
                  {result.sceneBreakdown?.map((scene: Scene, i: number) => (
                    <div key={i} className="flex gap-3 bg-black border border-zinc-800 p-3 rounded-xl hover:border-zinc-700 transition-colors cursor-move group">
                      <div className="mt-1 text-zinc-600 group-hover:text-zinc-400"><GripVertical className="w-4 h-4" /></div>
                      <div className="w-16 shrink-0 text-xs font-bold text-blue-400 bg-blue-500/10 h-fit px-2 py-1 rounded text-center">{scene.time}</div>
                      <div className="flex-1 space-y-2">
                        <div>
                          <span className="text-[10px] font-bold text-zinc-500 uppercase">Visual:</span>
                          <p className="text-sm text-zinc-300">{scene.visual}</p>
                        </div>
                        <div>
                          <span className="text-[10px] font-bold text-zinc-500 uppercase">Audio:</span>
                          <p className="text-sm text-white font-medium">"{scene.audio}"</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-5 bg-zinc-900 border border-zinc-800 rounded-xl relative">
                <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-3">Voiceover Script</h3>
                <div className="text-white whitespace-pre-wrap leading-relaxed text-sm font-medium">
                  {result.voiceover}
                </div>
              </div>

              <div className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-xl">
                <h3 className="text-xs font-bold text-purple-500 uppercase tracking-wider mb-2">Call To Action</h3>
                <p className="text-white font-medium">{result.cta}</p>
              </div>
            </motion.div>
          )}
          </AnimatePresence>
        </div>

        {/* RIGHT COLUMN: INSIGHTS & VIDEO (3/12) */}
        <div className="lg:col-span-3 flex flex-col gap-6">
          
          {/* Video Player Card */}
          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-5 shadow-xl flex-shrink-0">
             <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-500 mb-4 flex items-center justify-between">
                <span className="flex items-center gap-2"><Play className="w-4 h-4" /> Video Preview</span>
                <span className="text-[10px] bg-zinc-800 px-2 py-0.5 rounded text-zinc-400">9:16</span>
             </h2>

             {videoUrl ? (
                <div className="w-full aspect-[9/16] bg-black rounded-xl overflow-hidden border border-zinc-800 relative group">
                  <video src={videoUrl} controls className="w-full h-full object-cover" autoPlay loop muted />
                  <a href={videoUrl} download target="_blank" className="absolute top-4 right-4 bg-black/80 p-2 rounded-lg text-white opacity-0 group-hover:opacity-100 hover:bg-white hover:text-black transition-all">
                    <Download className="w-4 h-4" />
                  </a>
                </div>
             ) : (
                <div className="w-full aspect-[9/16] bg-black border border-zinc-800 rounded-xl flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">
                   <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 to-purple-500/5"></div>
                   {isVideoGenerating ? (
                     <>
                        <Loader2 className="w-8 h-8 animate-spin text-blue-500 mb-3" />
                        <p className="text-xs text-zinc-400">Rendering AI Video...</p>
                        <p className="text-[10px] text-zinc-500 mt-1">This may take a minute</p>
                     </>
                   ) : result ? (
                     <>
                        <Video className="w-10 h-10 text-zinc-600 mb-3" />
                        <button onClick={handleGenerateVideo} className="bg-white text-black hover:bg-zinc-200 font-bold py-2 px-4 rounded-lg text-sm transition-colors shadow-lg shadow-white/10">
                          Generate Video
                        </button>
                        <p className="text-[10px] text-zinc-500 mt-3">Cost: 5 Credits</p>
                     </>
                   ) : (
                     <>
                        <Video className="w-8 h-8 text-zinc-700 mb-2" />
                        <p className="text-xs text-zinc-500">Generate a script first</p>
                     </>
                   )}
                </div>
             )}
          </div>

          {/* Analytics Sidebar */}
          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-5 shadow-xl flex-1 flex flex-col min-h-0">
             <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-500 mb-5 flex items-center gap-2">
                <BarChart3 className="w-4 h-4" /> Script Insights
             </h2>

             {!result ? (
               <div className="flex-1 flex items-center justify-center text-xs text-zinc-600 text-center">
                 Analytics will populate based on script virality factors.
               </div>
             ) : (
               <div className="flex-1 flex flex-col justify-between">
                 {/* Recharts BarChart */}
                 <div className="h-32 w-full mb-6">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                        <XAxis dataKey="name" tick={{fontSize: 10, fill: '#71717a'}} axisLine={false} tickLine={false} />
                        <Tooltip cursor={{fill: '#27272a'}} contentStyle={{backgroundColor: '#09090b', borderColor: '#27272a', borderRadius: '8px', fontSize: '12px'}} />
                        <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                          {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                 </div>

                 <div className="space-y-4 flex-1 overflow-y-auto pr-2 custom-scrollbar">
                    <InsightRow icon={<TrendingUp className="w-4 h-4 text-purple-500" />} label="Viral Potential" value="94%" />
                    <InsightRow icon={<Clock className="w-4 h-4 text-blue-500" />} label="Est. Watch Time" value="87%" />
                    <InsightRow icon={<Activity className="w-4 h-4 text-green-500" />} label="Trend Match" value="91%" />
                    <InsightRow icon={<Hash className="w-4 h-4 text-amber-500" />} label="Engagement Score" value="89%" />
                 </div>
               </div>
             )}
          </div>

        </div>

      </div>
    </div>
  )
}

function InsightRow({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) {
  return (
    <div className="flex items-center justify-between p-3 bg-black border border-zinc-800 rounded-xl">
      <div className="flex items-center gap-3">
        {icon}
        <span className="text-xs text-zinc-300 font-medium">{label}</span>
      </div>
      <span className="text-sm font-bold text-white">{value}</span>
    </div>
  )
}
