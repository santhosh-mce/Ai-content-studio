"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { getMedia, uploadAsset } from "@/actions/media"
import { useInView } from "react-intersection-observer"
import { useDropzone } from "react-dropzone"
import { Search, UploadCloud, Folder, Image as ImageIcon, Video, FileText, Download, Trash2, LayoutGrid, List, Sparkles, Loader2, Copy } from "lucide-react"
import { format } from "date-fns"

export default function MediaLibrary() {
  const [assets, setAssets] = useState<any[]>([])
  const [selectedAsset, setSelectedAsset] = useState<any>(null)
  const [search, setSearch] = useState("")
  const [typeFilter, setTypeFilter] = useState("All")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  
  const [cursor, setCursor] = useState<string | undefined>(undefined)
  const [hasNextPage, setHasNextPage] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [isUploading, setIsUploading] = useState(false)

  const { ref, inView } = useInView()

  const fetchAssets = useCallback(async (reset = false) => {
    if (isLoading || (!hasNextPage && !reset)) return
    setIsLoading(true)

    try {
      const data = await getMedia(typeFilter, search, 20, reset ? undefined : cursor)
      setAssets(prev => reset ? data.items : [...prev, ...data.items])
      setCursor(data.nextCursor)
      setHasNextPage(!!data.nextCursor)
    } catch (e) {
      console.error(e)
    } finally {
      setIsLoading(false)
    }
  }, [cursor, hasNextPage, isLoading, search, typeFilter])

  // Initial load & search/filter change
  useEffect(() => {
    fetchAssets(true)
  }, [search, typeFilter]) // eslint-disable-line react-hooks/exhaustive-deps

  // Infinite scroll trigger
  useEffect(() => {
    if (inView) {
      fetchAssets()
    }
  }, [inView]) // eslint-disable-line react-hooks/exhaustive-deps

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setIsUploading(true)
    for (const file of acceptedFiles) {
      try {
        const formData = new FormData()
        formData.append("file", file)
        
        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData
        })
        const data = await res.json()
        
        if (data.error) throw new Error(data.error)
        
        const type = file.type.startsWith('video/') ? 'video' : 'image'
        
        // Pass the actual Cloudinary secure URL and dimensions to our database action
        await uploadAsset(file.name, data.url, type, file.size, data.width, data.height)
      } catch (e) {
        console.error("Upload failed", e)
      }
    }
    await fetchAssets(true)
    setIsUploading(false)
  }, [fetchAssets])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: {'image/*': ['.png', '.jpg', '.jpeg', '.webp'], 'video/*': ['.mp4', '.mov']} })

  const copyPrompt = () => {
    if (selectedAsset?.prompt) {
      navigator.clipboard.writeText(selectedAsset.prompt)
    }
  }

  // Calculate stats for the sidebar
  const totalAssets = assets.length
  const imageCount = assets.filter(a => a.type === 'image' || a.type === 'thumbnail').length
  const videoCount = assets.filter(a => a.type === 'video' || a.type === 'reel_video').length
  const postCount = assets.filter(a => a.type === 'post').length

  return (
    <div className="max-w-[1600px] mx-auto h-[calc(100vh-80px)] flex flex-col space-y-4">
      
      {/* Top Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-zinc-950 p-4 border border-zinc-800 rounded-2xl shadow-xl shrink-0">
        <div className="flex flex-1 items-center gap-4">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input 
              type="text" 
              placeholder="Search assets by title or prompt..." 
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:ring-1 focus:ring-purple-500 outline-none transition-all"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          
          <div className="flex items-center gap-2 p-1 bg-zinc-900 border border-zinc-800 rounded-lg">
             <button onClick={() => setViewMode("grid")} className={`p-1.5 rounded-md ${viewMode === 'grid' ? 'bg-zinc-700 text-white' : 'text-zinc-500'}`}><LayoutGrid className="w-4 h-4" /></button>
             <button onClick={() => setViewMode("list")} className={`p-1.5 rounded-md ${viewMode === 'list' ? 'bg-zinc-700 text-white' : 'text-zinc-500'}`}><List className="w-4 h-4" /></button>
          </div>
        </div>

        <div className="flex items-center gap-4">
           <div {...getRootProps()} className={`cursor-pointer flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${isDragActive ? 'bg-purple-600/20 text-purple-400 border border-purple-500/50' : 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white shadow-lg shadow-purple-500/20'}`}>
             <input {...getInputProps()} />
             {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <UploadCloud className="w-4 h-4" />}
             {isDragActive ? "Drop here..." : "Upload Asset"}
           </div>
        </div>
      </div>

      <div className="flex-1 min-h-0 flex gap-6">
        
        {/* Left Sidebar: Collections */}
        <div className="w-64 shrink-0 flex flex-col gap-6 overflow-y-auto custom-scrollbar">
          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-4 shadow-xl">
            <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-3 px-2">Collections</h3>
            <div className="space-y-1">
               {["All", "Images", "Thumbnails", "Videos", "Posts"].map(c => (
                 <button 
                   key={c}
                   onClick={() => setTypeFilter(c === "All" ? "All" : c.toLowerCase().slice(0, -1))}
                   className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${typeFilter === (c === "All" ? "All" : c.toLowerCase().slice(0, -1)) ? 'bg-purple-500/10 text-purple-400' : 'text-zinc-400 hover:text-white hover:bg-zinc-900'}`}
                 >
                   <Folder className="w-4 h-4" /> {c}
                 </button>
               ))}
            </div>
          </div>

          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-4 shadow-xl">
             <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-3 px-2">Storage Analytics</h3>
             <div className="px-2 space-y-4">
               <div>
                  <div className="flex justify-between text-xs mb-1"><span className="text-zinc-400">Total Assets</span><span className="text-white font-medium">{totalAssets}</span></div>
                  <div className="w-full bg-zinc-900 rounded-full h-1.5"><div className="bg-purple-500 h-1.5 rounded-full w-full"></div></div>
               </div>
               <div>
                  <div className="flex justify-between text-xs mb-1"><span className="text-zinc-400">Images</span><span className="text-white font-medium">{imageCount}</span></div>
                  <div className="w-full bg-zinc-900 rounded-full h-1.5"><div className="bg-blue-500 h-1.5 rounded-full" style={{width: `${(imageCount/Math.max(totalAssets, 1))*100}%`}}></div></div>
               </div>
               <div>
                  <div className="flex justify-between text-xs mb-1"><span className="text-zinc-400">Videos</span><span className="text-white font-medium">{videoCount}</span></div>
                  <div className="w-full bg-zinc-900 rounded-full h-1.5"><div className="bg-pink-500 h-1.5 rounded-full" style={{width: `${(videoCount/Math.max(totalAssets, 1))*100}%`}}></div></div>
               </div>
             </div>
          </div>
        </div>

        {/* Main Content: Asset Grid */}
        <div className="flex-1 bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden shadow-xl flex flex-col">
          <div className="flex-1 overflow-y-auto p-5 custom-scrollbar">
            {assets.length === 0 && !isLoading ? (
               <div className="h-full flex flex-col items-center justify-center text-zinc-500">
                  <ImagePlus className="w-16 h-16 mb-4 opacity-50" />
                  <p>No assets found.</p>
                  <p className="text-sm">Upload files or generate AI content.</p>
               </div>
            ) : (
               <div className={viewMode === 'grid' ? "columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4" : "space-y-2"}>
                 {assets.map((asset) => (
                   <div 
                     key={asset.id} 
                     onClick={() => setSelectedAsset(asset)}
                     className={`group relative overflow-hidden rounded-xl border cursor-pointer transition-all ${selectedAsset?.id === asset.id ? 'border-purple-500 ring-2 ring-purple-500/20' : 'border-zinc-800 hover:border-zinc-600'} ${viewMode === 'list' ? 'flex items-center gap-4 p-2' : 'break-inside-avoid'}`}
                   >
                     {asset.type.includes('video') ? (
                       <video src={asset.imageUrl} className={`${viewMode === 'list' ? 'w-16 h-16 object-cover rounded-lg' : 'w-full rounded-lg'}`} muted playsInline />
                     ) : (
                       <img src={asset.imageUrl} alt={asset.title} className={`${viewMode === 'list' ? 'w-16 h-16 object-cover rounded-lg' : 'w-full rounded-lg'}`} />
                     )}
                     
                     {viewMode === 'grid' && (
                       <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                         <a href={asset.imageUrl} target="_blank" download className="p-2 bg-white/10 hover:bg-white/20 rounded-full text-white backdrop-blur-sm transition">
                           <Download className="w-4 h-4" />
                         </a>
                       </div>
                     )}

                     {viewMode === 'list' && (
                       <div className="flex-1 flex justify-between items-center pr-4">
                         <div>
                           <p className="text-sm font-medium text-white line-clamp-1">{asset.title}</p>
                           <p className="text-xs text-zinc-500">{format(new Date(asset.createdAt), "MMM d, yyyy")} • {asset.type}</p>
                         </div>
                       </div>
                     )}
                   </div>
                 ))}
                 
                 {/* Infinite Scroll Trigger */}
                 <div ref={ref} className="h-10 w-full flex items-center justify-center">
                   {isLoading && <Loader2 className="w-5 h-5 animate-spin text-zinc-600" />}
                 </div>
               </div>
            )}
          </div>
        </div>

        {/* Right Sidebar: Selected Asset Inspector */}
        <div className="w-80 shrink-0 bg-zinc-950 border border-zinc-800 rounded-2xl shadow-xl flex flex-col overflow-hidden">
          {selectedAsset ? (
            <div className="flex-1 overflow-y-auto custom-scrollbar p-5 flex flex-col gap-6">
               <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Asset Preview</h3>
               <div className="w-full bg-black rounded-xl border border-zinc-800 overflow-hidden flex items-center justify-center">
                 {selectedAsset.type.includes('video') ? (
                   <video src={selectedAsset.imageUrl} controls className="w-full h-auto max-h-64 object-contain" />
                 ) : (
                   <img src={selectedAsset.imageUrl} alt={selectedAsset.title} className="w-full h-auto max-h-64 object-contain" />
                 )}
               </div>
               
               <div>
                  <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-3">Details</h3>
                  <div className="space-y-3 bg-black p-4 rounded-xl border border-zinc-800">
                     <div>
                       <span className="text-[10px] text-zinc-500 uppercase block mb-1">Title</span>
                       <span className="text-sm text-white font-medium truncate block">{selectedAsset.title}</span>
                     </div>
                     <div className="grid grid-cols-2 gap-2">
                       <div>
                         <span className="text-[10px] text-zinc-500 uppercase block mb-1">Type</span>
                         <span className="text-sm text-zinc-300 capitalize">{selectedAsset.type.replace('_', ' ')}</span>
                       </div>
                       <div>
                         <span className="text-[10px] text-zinc-500 uppercase block mb-1">Created</span>
                         <span className="text-sm text-zinc-300">{format(new Date(selectedAsset.createdAt), "MMM d")}</span>
                       </div>
                       {selectedAsset.width && selectedAsset.height && (
                         <div>
                           <span className="text-[10px] text-zinc-500 uppercase block mb-1">Dimensions</span>
                           <span className="text-sm text-zinc-300">{selectedAsset.width} × {selectedAsset.height}</span>
                         </div>
                       )}
                       {selectedAsset.size && (
                         <div>
                           <span className="text-[10px] text-zinc-500 uppercase block mb-1">Size</span>
                           <span className="text-sm text-zinc-300">{(selectedAsset.size / 1024).toFixed(0)} KB</span>
                         </div>
                       )}
                     </div>
                  </div>
               </div>

               {selectedAsset.prompt && (
                 <div>
                    <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                      <Sparkles className="w-3.5 h-3.5 text-purple-500" /> AI Prompt History
                    </h3>
                    <div className="relative group">
                      <div className="text-xs text-zinc-300 bg-purple-500/5 border border-purple-500/20 p-4 rounded-xl whitespace-pre-wrap leading-relaxed">
                        {selectedAsset.prompt}
                      </div>
                      <button onClick={copyPrompt} className="absolute top-2 right-2 p-1.5 bg-black/50 hover:bg-purple-500/20 text-zinc-400 hover:text-purple-400 rounded-md backdrop-blur-sm transition-colors opacity-0 group-hover:opacity-100">
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                    </div>
                 </div>
               )}

               <div className="mt-auto pt-4 flex gap-2">
                  <a href={selectedAsset.imageUrl} download target="_blank" className="flex-1 bg-white hover:bg-zinc-200 text-black text-sm font-semibold py-2.5 rounded-lg flex items-center justify-center gap-2 transition-colors">
                    <Download className="w-4 h-4" /> Download
                  </a>
                  <button className="p-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 rounded-lg transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
               </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-zinc-500 p-6 text-center">
               <ImageIcon className="w-12 h-12 mb-4 opacity-30" />
               <p className="text-sm font-medium text-zinc-400">No Asset Selected</p>
               <p className="text-xs mt-1">Select an item from the grid to view details, prompt history, and download options.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}

function ImagePlus(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v4" />
      <circle cx="9" cy="9" r="2" />
      <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
      <path d="M16 10h6" />
      <path d="M19 7v6" />
    </svg>
  )
}
