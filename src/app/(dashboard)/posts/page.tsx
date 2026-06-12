"use client"

import { useState, useEffect } from "react"
import { generateSocialPost } from "@/actions/ai"
import { getRecentPosts } from "@/actions/media"
import { Loader2, Copy, CheckCircle2, Download, Image as ImageIcon, MessageSquare, ExternalLink, RefreshCw, Layers } from "lucide-react"
import Link from "next/link"

const PLATFORMS = ["Instagram", "LinkedIn", "Twitter (X)", "Facebook"]
const TONES = ["Professional", "Casual", "Humorous", "Inspirational", "Educational"]
const GOALS = ["Lead Generation", "Engagement", "Brand Awareness", "Sales", "Education"]

export default function PostStudio() {
  const [topic, setTopic] = useState("")
  const [platform, setPlatform] = useState("Instagram")
  const [tone, setTone] = useState("Professional")
  const [audience, setAudience] = useState("")
  const [goal, setGoal] = useState("Engagement")
  
  const [isGenerating, setIsGenerating] = useState(false)
  const [result, setResult] = useState<{ caption: string; imageUrl: string } | null>(null)
  const [error, setError] = useState("")
  const [copied, setCopied] = useState(false)
  const [recentPosts, setRecentPosts] = useState<any[]>([])

  useEffect(() => {
    loadRecentPosts()
  }, [])

  async function loadRecentPosts() {
    try {
      const posts = await getRecentPosts(6)
      setRecentPosts(posts)
    } catch (e) {
      console.error(e)
    }
  }

  const handleGenerate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    setIsGenerating(true)
    setError("")
    setCopied(false)
    try {
      const data = await generateSocialPost(topic, platform, tone, audience || "General Audience", goal)
      setResult(data)
      loadRecentPosts()
    } catch (err: any) {
      setError(err.message || "Something went wrong")
    } finally {
      setIsGenerating(false)
    }
  }

  const handleCopy = () => {
    if (result?.caption) {
      navigator.clipboard.writeText(result.caption)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">AI Social Post Generator</h1>
        <p className="text-zinc-400">Generate viral captions and AI images for any platform.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: FORM (40%) */}
        <div className="xl:col-span-5 space-y-6">
          <div className="p-6 border border-zinc-800 rounded-2xl bg-zinc-950/50 backdrop-blur-md shadow-xl">
            <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-purple-500" /> Generate Post
            </h2>
            
            <form onSubmit={handleGenerate} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">Topic / Idea</label>
                <textarea
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-white focus:ring-2 focus:ring-purple-600 outline-none resize-none h-24 transition-all"
                  placeholder="e.g., 5 AI Tools Every Small Business Should Use..."
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">Platform</label>
                <div className="grid grid-cols-2 gap-2">
                  {PLATFORMS.map(p => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setPlatform(p)}
                      className={`py-2 px-3 rounded-lg text-sm font-medium border transition-all ${
                        platform === p 
                          ? "bg-purple-600/20 border-purple-600 text-purple-400" 
                          : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-300"
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">Tone</label>
                  <select 
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-2.5 text-sm text-white focus:ring-2 focus:ring-purple-600 outline-none transition-all"
                    value={tone}
                    onChange={(e) => setTone(e.target.value)}
                  >
                    {TONES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">Goal</label>
                  <select 
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-2.5 text-sm text-white focus:ring-2 focus:ring-purple-600 outline-none transition-all"
                    value={goal}
                    onChange={(e) => setGoal(e.target.value)}
                  >
                    {GOALS.map(g => <option key={g} value={g}>{g}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">Target Audience</label>
                <input
                  type="text"
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-2.5 text-sm text-white focus:ring-2 focus:ring-purple-600 outline-none transition-all"
                  placeholder="e.g., Entrepreneurs, Designers"
                  value={audience}
                  onChange={(e) => setAudience(e.target.value)}
                />
              </div>

              {error && <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-500 text-sm rounded-lg">{error}</div>}

              <button
                type="submit"
                disabled={isGenerating || !topic}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3.5 rounded-xl flex justify-center items-center gap-2 transition-colors disabled:opacity-50"
              >
                {isGenerating ? <Loader2 className="w-5 h-5 animate-spin" /> : "Generate Post (6 Credits)"}
              </button>
            </form>
          </div>
          
          {/* Features Card Mini */}
          <div className="p-6 border border-zinc-800 rounded-2xl bg-zinc-950/50 backdrop-blur-md hidden md:block">
             <h3 className="text-sm font-semibold text-zinc-400 mb-4 uppercase tracking-wider">Features Included</h3>
             <div className="grid grid-cols-2 gap-3">
               {["AI Captions", "Smart Hashtags", "CTA Suggestions", "Platform Optimization", "AI Image Generation", "Multi-Platform Ready"].map(f => (
                 <div key={f} className="flex items-center gap-2 text-xs text-zinc-500">
                   <CheckCircle2 className="w-3.5 h-3.5 text-purple-500" /> {f}
                 </div>
               ))}
             </div>
          </div>
        </div>

        {/* RIGHT COLUMN: PREVIEW (60%) */}
        <div className="xl:col-span-7 flex flex-col space-y-6">
          <div className="bg-zinc-950/50 border border-zinc-800 rounded-2xl p-6 backdrop-blur-md min-h-[600px] flex flex-col">
            <h2 className="text-lg font-semibold text-white mb-6 flex items-center justify-between">
              <span className="flex items-center gap-2"><ImageIcon className="w-5 h-5 text-blue-500" /> Live Preview</span>
              {result && (
                <div className="flex gap-2">
                  <button onClick={handleCopy} className="text-xs bg-zinc-800 hover:bg-zinc-700 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 font-medium">
                    {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />} Copy Text
                  </button>
                  <button onClick={() => handleGenerate()} className="text-xs bg-zinc-800 hover:bg-zinc-700 p-1.5 rounded-lg transition-colors">
                    <RefreshCw className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </h2>

            {isGenerating ? (
              <div className="flex-1 flex flex-col items-center justify-center text-zinc-500">
                <Loader2 className="w-8 h-8 animate-spin mb-4 text-purple-500" />
                <p className="font-medium text-white mb-1">Analyzing Topic...</p>
                <p className="text-sm">Writing caption and rendering image</p>
              </div>
            ) : result ? (
              <div className="flex-1 max-w-lg mx-auto w-full bg-black border border-zinc-800 rounded-xl overflow-hidden shadow-2xl flex flex-col">
                {/* Mock Social Header */}
                <div className="p-4 border-b border-zinc-800 flex items-center gap-3 bg-zinc-950">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-500 to-blue-500 shrink-0"></div>
                  <div>
                    <div className="text-sm font-semibold text-white">Your Brand</div>
                    <div className="text-xs text-zinc-500">Just now • {platform}</div>
                  </div>
                </div>
                
                {/* Social Image */}
                {result.imageUrl && (
                  <div className="w-full aspect-square bg-zinc-900 overflow-hidden relative group">
                    <img src={result.imageUrl} alt="Generated post image" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <a href={result.imageUrl} download="post-image.png" target="_blank" rel="noreferrer" className="bg-white text-black px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-zinc-200">
                        <Download className="w-4 h-4" /> Download Image
                      </a>
                    </div>
                  </div>
                )}
                
                {/* Social Caption */}
                <div className="p-4 bg-zinc-950 flex-1">
                  <div className="text-sm text-zinc-300 whitespace-pre-wrap leading-relaxed">
                    {result.caption}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-zinc-600 border-2 border-dashed border-zinc-800 rounded-xl p-8 text-center max-w-lg mx-auto w-full">
                <Layers className="w-12 h-12 mb-4 opacity-50" />
                <h3 className="text-white font-medium mb-2">No Post Generated</h3>
                <p className="text-sm text-zinc-500 max-w-xs">Fill out the form on the left to instantly generate a tailored social media post.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* RECENT POSTS */}
      {recentPosts.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">Generated Assets</h2>
            <Link href="/media" className="text-sm text-purple-400 hover:text-purple-300 flex items-center gap-1">
              View Media Library <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {recentPosts.map((post) => (
              <div key={post.id} className="group relative aspect-square bg-zinc-900 rounded-xl overflow-hidden border border-zinc-800 cursor-pointer" onClick={() => {
                setResult({ caption: post.prompt || "", imageUrl: post.imageUrl })
              }}>
                <img src={post.imageUrl} alt={post.title || "Post"} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition-opacity p-4 text-center">
                  <span className="text-xs font-bold text-white mb-1 truncate w-full">{post.title}</span>
                  <span className="text-[10px] text-zinc-400 bg-zinc-900/80 px-2 py-0.5 rounded-full mt-2">View Post</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
