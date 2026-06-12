"use client"

import { useState, useEffect } from "react"
import { generateThumbnail } from "@/actions/ai"
import { getRecentThumbnails } from "@/actions/media"
import { Image as ImageIcon, Loader2, Download, History, Eye, TerminalSquare, ExternalLink, RefreshCw } from "lucide-react"
import Link from "next/link"

const STYLES = ["MrBeast", "Finance", "Tech", "Gaming", "Luxury", "News", "Cinematic", "Minimalist"]
const EMOTIONS = ["Shocked", "Excited", "Mysterious", "Angry", "Happy", "Sad", "Curious", "None"]

export default function ThumbnailStudio() {
  const [title, setTitle] = useState("")
  const [style, setStyle] = useState("Tech")
  const [emotion, setEmotion] = useState("Shocked")
  const [isGenerating, setIsGenerating] = useState(false)
  const [result, setResult] = useState<{ prompt: string; imageUrl: string } | null>(null)
  const [error, setError] = useState("")
  
  const [historyItems, setHistoryItems] = useState<any[]>([])
  
  // Fake CTR score calculation when a result is generated
  const ctrScore = result ? (Math.random() * (9.9 - 7.5) + 7.5).toFixed(1) : null

  useEffect(() => {
    loadHistory()
  }, [])

  async function loadHistory() {
    try {
      const items = await getRecentThumbnails(8)
      setHistoryItems(items)
    } catch (e) {
      console.error(e)
    }
  }

  const handleGenerate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    setIsGenerating(true)
    setError("")
    
    try {
      const data = await generateThumbnail(title, style, emotion)
      setResult(data)
      loadHistory() // Refresh history with the new item
    } catch (err: any) {
      setError(err.message || "Something went wrong")
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Thumbnail Studio</h1>
        <p className="text-zinc-400">Generate high-CTR YouTube thumbnails instantly.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: FORM (40%) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 border border-zinc-800 rounded-2xl bg-zinc-950/50 backdrop-blur-sm">
            <form onSubmit={handleGenerate} className="space-y-6">
              
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">Video Title</label>
                <input
                  type="text"
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-white focus:ring-2 focus:ring-blue-600 outline-none transition-all"
                  placeholder="e.g., Top 10 AI Tools in 2026"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              {/* Style Selector */}
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">Choose Style</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {STYLES.map(s => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setStyle(s)}
                      className={`py-2 px-3 rounded-lg text-xs font-medium border transition-all ${
                        style === s 
                          ? "bg-blue-600/20 border-blue-600 text-blue-400" 
                          : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-300"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Emotion Selector */}
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">Emotion / Vibe</label>
                <div className="grid grid-cols-4 gap-2">
                  {EMOTIONS.map(e => (
                    <button
                      key={e}
                      type="button"
                      onClick={() => setEmotion(e)}
                      className={`py-2 px-2 rounded-lg text-xs font-medium border transition-all ${
                        emotion === e 
                          ? "bg-purple-600/20 border-purple-600 text-purple-400" 
                          : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-300"
                      }`}
                    >
                      {e}
                    </button>
                  ))}
                </div>
              </div>

              {error && <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-500 text-sm rounded-lg">{error}</div>}

              <button
                type="submit"
                disabled={isGenerating || !title}
                className="w-full bg-white text-black hover:bg-zinc-200 font-semibold py-3.5 rounded-xl flex justify-center items-center gap-2 transition-colors disabled:opacity-50"
              >
                {isGenerating ? <Loader2 className="w-5 h-5 animate-spin" /> : "Generate Thumbnail (6 Credits)"}
              </button>
            </form>
          </div>
        </div>

        {/* RIGHT COLUMN: PREVIEW & HISTORY (60%) */}
        <div className="lg:col-span-7 flex flex-col space-y-6">
          
          {/* PREVIEW SECTION */}
          <div className="bg-zinc-950/50 border border-zinc-800 rounded-2xl p-6 backdrop-blur-sm">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Eye className="w-5 h-5 text-blue-500" /> Preview
            </h2>
            
            <div className="space-y-6">
              <div className="aspect-video bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden relative flex items-center justify-center">
                {isGenerating ? (
                  <div className="flex flex-col items-center text-zinc-500">
                    <Loader2 className="w-8 h-8 animate-spin mb-3 text-blue-500" />
                    <p className="text-sm">Crafting your thumbnail...</p>
                  </div>
                ) : result ? (
                  <img src={result.imageUrl} alt="Generated Thumbnail" className="w-full h-full object-cover" />
                ) : (
                  <div className="flex flex-col items-center text-zinc-600">
                    <ImageIcon className="w-12 h-12 mb-3 opacity-50" />
                    <p className="text-sm">Your generated thumbnail will appear here</p>
                  </div>
                )}
              </div>

              {result && !isGenerating && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* CTR Score Card */}
                  <div className="bg-zinc-900/80 border border-zinc-800 p-4 rounded-xl flex items-center justify-between">
                    <div>
                      <p className="text-xs text-zinc-400 font-medium uppercase tracking-wider mb-1">Predicted CTR</p>
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold text-white">🔥 {ctrScore}</span>
                        <span className="text-zinc-500">/ 10</span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-1 text-[10px] text-zinc-400 text-right">
                      <span className="bg-green-500/10 text-green-400 px-2 py-0.5 rounded-full border border-green-500/20">High Contrast</span>
                      <span className="bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded-full border border-blue-500/20">Strong Emotion</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2 justify-center">
                    <div className="flex gap-2">
                      <a 
                        href={result.imageUrl} 
                        download="thumbnail.png"
                        target="_blank"
                        rel="noreferrer"
                        className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white text-sm font-medium py-2 rounded-lg flex items-center justify-center gap-2 transition-colors"
                      >
                        <Download className="w-4 h-4" /> Download
                      </a>
                      <button 
                        onClick={() => handleGenerate()}
                        className="flex-none bg-zinc-800 hover:bg-zinc-700 text-white p-2 rounded-lg transition-colors"
                        title="Regenerate"
                      >
                        <RefreshCw className="w-4 h-4" />
                      </button>
                    </div>
                    <Link 
                      href="/media"
                      className="w-full bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 text-sm font-medium py-2 rounded-lg flex items-center justify-center gap-2 transition-colors border border-blue-500/20"
                    >
                      <ExternalLink className="w-4 h-4" /> View in Media Library
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* HISTORY SECTION */}
          {historyItems.length > 0 && (
            <div className="bg-zinc-950/50 border border-zinc-800 rounded-2xl p-6 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-white flex items-center gap-2">
                  <History className="w-5 h-5 text-blue-500" /> Recent Thumbnails
                </h3>
                <Link href="/media" className="text-xs text-blue-400 hover:text-blue-300">View All</Link>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {historyItems.map((item) => (
                  <div key={item.id} className="group relative aspect-video bg-zinc-900 rounded-lg overflow-hidden border border-zinc-800 cursor-pointer" onClick={() => {
                    setResult({ prompt: item.prompt || "", imageUrl: item.imageUrl })
                  }}>
                    <img src={item.imageUrl} alt={item.title || "Thumbnail"} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                      <span className="text-xs font-medium text-white flex items-center gap-1">
                        <Eye className="w-3.5 h-3.5" /> View
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
        </div>
      </div>
    </div>
  )
}
