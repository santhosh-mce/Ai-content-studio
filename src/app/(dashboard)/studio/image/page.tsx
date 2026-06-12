"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { ImageIcon, Wand2, Loader2, Download, Settings2 } from "lucide-react"

export default function ImageStudioPage() {
  const [prompt, setPrompt] = useState("")
  const [aspectRatio, setAspectRatio] = useState("16:9")
  const [model, setModel] = useState("grok-imagine")
  const [enableTranslation, setEnableTranslation] = useState(true)
  
  const [isGenerating, setIsGenerating] = useState(false)
  const [resultImage, setResultImage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function handleGenerate() {
    if (!prompt) return
    
    setIsGenerating(true)
    setError(null)
    
    try {
      // Note: We'll implement the server action call here next
      // const res = await generateAdvancedImage({ prompt, aspectRatio, model, enableTranslation })
      // setResultImage(res.imageUrl)
      
      // Simulate for now
      await new Promise(r => setTimeout(r, 2000))
      setResultImage("https://res.cloudinary.com/demo/image/upload/sample.jpg")
    } catch (err: any) {
      setError(err.message || "Failed to generate image")
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Left Pane - Controls */}
      <div className="lg:col-span-4 space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Image Studio</h1>
          <p className="text-gray-400">Generate high-fidelity AI images with Grok Imagine.</p>
        </div>

        <Card className="p-6 bg-[#1A1A1A] border-gray-800 space-y-6">
          <div className="space-y-3">
            <Label className="text-gray-300">Prompt</Label>
            <Textarea 
              placeholder="A futuristic cyberpunk city at night with neon lights..."
              className="bg-[#242424] border-gray-700 min-h-[120px] resize-none"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
          </div>

          <div className="space-y-3">
            <Label className="text-gray-300 flex items-center gap-2">
              <Settings2 className="w-4 h-4" /> Aspect Ratio
            </Label>
            <Select value={aspectRatio} onValueChange={(val) => setAspectRatio(val || "16:9")}>
              <SelectTrigger className="bg-[#242424] border-gray-700">
                <SelectValue placeholder="Select ratio" />
              </SelectTrigger>
              <SelectContent className="bg-[#242424] border-gray-700">
                <SelectItem value="16:9">16:9 (Widescreen)</SelectItem>
                <SelectItem value="9:16">9:16 (Portrait)</SelectItem>
                <SelectItem value="1:1">1:1 (Square)</SelectItem>
                <SelectItem value="21:9">21:9 (Ultra-wide)</SelectItem>
                <SelectItem value="4:3">4:3 (Standard)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <Label className="text-gray-300">Model</Label>
            <Select value={model} onValueChange={(val) => setModel(val || "grok-imagine")}>
              <SelectTrigger className="bg-[#242424] border-gray-700">
                <SelectValue placeholder="Select model" />
              </SelectTrigger>
              <SelectContent className="bg-[#242424] border-gray-700">
                <SelectItem value="grok-imagine">Grok Imagine (Image Quality)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between pt-2">
            <Label className="text-gray-300 cursor-pointer" htmlFor="auto-translate">
              Auto-Translate (Non-English)
            </Label>
            <Switch 
              id="auto-translate" 
              checked={enableTranslation}
              onCheckedChange={setEnableTranslation}
            />
          </div>

          {error && <p className="text-red-500 text-sm font-medium">{error}</p>}

          <Button 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium h-12 text-lg mt-4"
            disabled={!prompt || isGenerating}
            onClick={handleGenerate}
          >
            {isGenerating ? (
              <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Generating...</>
            ) : (
              <><Wand2 className="w-5 h-5 mr-2" /> Generate Image (5 Credits)</>
            )}
          </Button>
        </Card>
      </div>

      {/* Right Pane - Preview */}
      <div className="lg:col-span-8">
        <Card className="h-[calc(100vh-12rem)] min-h-[600px] bg-[#1A1A1A] border-gray-800 overflow-hidden flex flex-col">
          <div className="p-4 border-b border-gray-800 flex justify-between items-center bg-[#1A1A1A] z-10">
            <h3 className="font-semibold text-white flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-gray-400" /> Canvas Preview
            </h3>
            {resultImage && (
              <a 
                href={resultImage} 
                download="grok-image.png" 
                target="_blank" 
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium border border-gray-700 bg-transparent hover:bg-gray-800 text-white h-8 px-3"
              >
                <Download className="w-4 h-4" /> Download
              </a>
            )}
          </div>
          
          <div className="flex-1 relative flex items-center justify-center bg-[#0A0A0A] p-8 overflow-hidden">
            {isGenerating ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center gap-4"
              >
                <div className="w-16 h-16 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
                <p className="text-blue-400 font-medium animate-pulse">Running Grok Imagine...</p>
                <p className="text-gray-500 text-sm">This may take up to 20 seconds.</p>
              </motion.div>
            ) : resultImage ? (
              <motion.img 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                src={resultImage} 
                alt="Generated output" 
                className="max-w-full max-h-full object-contain rounded-lg shadow-2xl border border-gray-800"
              />
            ) : (
              <div className="text-center space-y-3 opacity-50">
                <ImageIcon className="w-16 h-16 mx-auto text-gray-600" />
                <p className="text-gray-400 font-medium">Your masterpiece will appear here</p>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  )
}
