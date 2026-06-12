"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import CountUp from "react-countup"
import Lenis from "lenis"
import { ArrowRight, Sparkles, Image as ImageIcon, Video, FileText, Calendar, CheckCircle2, Play, LayoutDashboard, Database, Wand2, ArrowDown } from "lucide-react"

export default function LandingClient({ session }: { session: any }) {
  useEffect(() => {
    const lenis = new Lenis()
    function raf(time: number) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }
    requestAnimationFrame(raf)
    return () => lenis.destroy()
  }, [])

  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePosition({ x: e.clientX, y: e.clientY })
  }

  const dashboardTabs = ["Thumbnail Studio", "Post Generator", "Reel Generator", "Content Calendar", "Media Library"]
  const [activeDashTab, setActiveDashTab] = useState(0)
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveDashTab(prev => (prev + 1) % dashboardTabs.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  const commandSteps = [
    { title: "Prompt Input", desc: "A YouTube thumbnail for a crypto video about Bitcoin hitting $100k...", color: "bg-blue-500" },
    { title: "Naraya AI Processing", desc: "Analyzing prompt and generating layout parameters...", color: "bg-purple-500" },
    { title: "FLUX Context Render", desc: "Rendering hyper-realistic 16:9 4K image...", color: "bg-pink-500" },
    { title: "Asset Finalization", desc: "Adding glowing text and dynamic shadows...", color: "bg-orange-500" },
    { title: "Ready for Publication", desc: "Saved to Media Library. Ready to schedule.", color: "bg-green-500" }
  ]
  const [commandStep, setCommandStep] = useState(0)
  useEffect(() => {
    const interval = setInterval(() => {
      setCommandStep(prev => (prev + 1) % commandSteps.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div onMouseMove={handleMouseMove} className="relative min-h-screen bg-black text-white selection:bg-purple-600 font-sans overflow-hidden">
      
      {/* Mouse Glow Tracker */}
      <motion.div 
        className="pointer-events-none fixed top-0 left-0 w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[120px] z-[100] mix-blend-screen"
        animate={{ x: mousePosition.x - 300, y: mousePosition.y - 300 }}
        transition={{ type: "tween", ease: "backOut", duration: 0.5 }}
      />

      {/* Navigation */}
      <nav className="border-b border-zinc-800/50 bg-black/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-purple-600 to-blue-600 flex items-center justify-center font-bold shadow-lg shadow-purple-500/20">AI</div>
            <span className="font-bold tracking-tight text-xl hidden sm:inline-block">Content Studio</span>
          </div>
          
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-400">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#pipeline" className="hover:text-white transition-colors">Pipeline</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
          </div>

          <div className="flex items-center gap-4">
            {session ? (
              <Link href="/dashboard" className="bg-white text-black hover:bg-zinc-200 text-sm font-semibold px-5 py-2 rounded-full transition-colors shadow-lg shadow-white/10">
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link href="/api/auth/signin" className="text-sm font-medium text-zinc-300 hover:text-white transition-colors hidden sm:inline-block">
                  Log in
                </Link>
                <Link href="/api/auth/signin" className="bg-white text-black hover:bg-zinc-200 text-sm font-semibold px-5 py-2 rounded-full transition-colors shadow-lg shadow-white/10">
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20">
        {/* Floating AI Orbs */}
        <motion.div animate={{ y: [0, -30, 0], x: [0, 20, 0] }} transition={{ duration: 8, repeat: Infinity }} className="absolute top-20 left-[10%] w-96 h-96 bg-purple-500/20 blur-[120px] rounded-full" />
        <motion.div animate={{ y: [0, 40, 0], x: [0, -30, 0] }} transition={{ duration: 10, repeat: Infinity, delay: 1 }} className="absolute top-40 right-[10%] w-96 h-96 bg-blue-500/20 blur-[120px] rounded-full" />
        
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="text-left z-10">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 text-sm font-medium mb-8 text-zinc-300 shadow-xl">
              <Sparkles className="w-4 h-4 text-purple-400" /> Powered by Naraya & FLUX
            </motion.div>
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-5xl md:text-7xl font-extrabold tracking-tighter mb-6 bg-gradient-to-r from-white via-zinc-200 to-zinc-500 bg-clip-text text-transparent leading-[1.1]">
              Create Viral Content in Seconds.
            </motion.h1>
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-lg md:text-xl text-zinc-400 mb-10 leading-relaxed max-w-xl">
              The premium creator workspace. Generate Thumbnails, Reels, Posts, and Content Calendars with state-of-the-art AI models.
            </motion.p>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="flex flex-col sm:flex-row gap-4">
              <Link href={session ? "/dashboard" : "/api/auth/signin"} className="bg-white text-black hover:bg-zinc-200 font-semibold px-8 py-4 rounded-full transition-all flex items-center justify-center gap-2 text-lg shadow-[0_0_40px_rgba(255,255,255,0.2)] hover:scale-105">
                Start Creating Free
              </Link>
            </motion.div>
          </div>

          {/* Rotating Dashboard Preview */}
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4 }} className="relative z-10">
            <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/20 to-blue-500/20 rounded-3xl blur-2xl"></div>
            <div className="relative rounded-3xl border border-zinc-800 bg-zinc-950/80 backdrop-blur-xl shadow-2xl overflow-hidden aspect-[4/3] flex flex-col">
              <div className="h-12 border-b border-zinc-800 flex items-center px-4 gap-2 bg-black/50">
                <div className="flex gap-1.5"><div className="w-3 h-3 rounded-full bg-red-500"></div><div className="w-3 h-3 rounded-full bg-yellow-500"></div><div className="w-3 h-3 rounded-full bg-green-500"></div></div>
                <div className="ml-4 flex gap-4 text-xs font-medium text-zinc-500">
                  {dashboardTabs.map((tab, i) => (
                    <span key={tab} className={`transition-colors ${i === activeDashTab ? 'text-white' : ''}`}>{tab}</span>
                  ))}
                </div>
              </div>
              <div className="flex-1 p-8 flex items-center justify-center relative overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeDashTab}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    {activeDashTab === 0 && <img src="https://images.openai.com/static-rsc-4/LKgjwfWz0SI3S2VTly8tLr0mKhp3lfQfGHPi-JuNsTRkpyF6Fh2ssvRYauOe-XnJXwjZxbLLPaqXgRsabtJPew-R7Yf8iJgB1qgbkGIdVgWNbPRzzlia1k7cCMCBhSdcmQNs2a_FGHJsv2lpAFRabu-LN3QRvNUfg-F5LQtIOwSFjBmuTIOIx5d6_R1uDhgk?purpose=fullsize" alt="Thumbnail" className="w-full h-full object-cover opacity-80" />}
                    {activeDashTab === 1 && <img src="https://images.openai.com/static-rsc-4/nttwfq1_3l6Qj3vl1KZCKE-DOcGjw9vYWlTWBb_xvDMizV-hf_eJ3xm7PQT-YUxVV4am8Qj0x9aLnoGLN_IYvHOHuV2m2mZvdMXOsF0AVMarw5ilbC3V9uFbUBKY4-9hnR--0RAveyra6ET_eMhO6kcCBPspkB7WDSm-mMyV3gFhRPKK6odBZwCI3A8AvT4x?purpose=fullsize" alt="Post" className="w-full h-full object-cover opacity-80" />}
                    {activeDashTab === 2 && <img src="https://images.openai.com/static-rsc-4/qrqsY5EB8ikmKh0ZbJn8ERhL-92Q7fkzU6YU3FetQcLa3zxGOPMiIv7UUAh_3rh5pdVqk3OzkgY35uiT1_QmM8EVFv2Pn8Qlye9JmcmIXUGavdjPUI7tfkOU-G7NNywgk0DH1lkeLrTgfemdZPEuBjrkmh5dz64iGq5R4x3jDsxAyricwQAO4k-fnwVoD6j5?purpose=fullsize" alt="Reel" className="w-full h-full object-cover opacity-80" />}
                    {activeDashTab === 3 && <img src="/calendar-demo.png" alt="Calendar" className="w-full h-full object-cover opacity-80 object-top" />}
                    {activeDashTab === 4 && <img src="/library-demo.png" alt="Library" className="w-full h-full object-cover opacity-80 object-top" />}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Animated Stats */}
      <section className="py-12 border-y border-zinc-800/50 bg-zinc-950/50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
           {[
             { label: "Active Creators", value: 50000, suffix: "+" },
             { label: "Assets Generated", value: 2.5, suffix: "M+", decimals: 1 },
             { label: "Hours Saved", value: 500, suffix: "K+" },
             { label: "Uptime", value: 99.9, suffix: "%", decimals: 1 }
           ].map((stat, i) => (
             <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
               <div className="text-3xl md:text-5xl font-extrabold text-white mb-2">
                 <CountUp end={stat.value} decimals={stat.decimals || 0} duration={2.5} enableScrollSpy scrollSpyOnce />{stat.suffix}
               </div>
               <div className="text-sm font-medium text-zinc-500 uppercase tracking-wider">{stat.label}</div>
             </motion.div>
           ))}
        </div>
      </section>

      {/* AI Command Center Live Demo */}
      <section className="py-32 bg-black relative overflow-hidden">
        <div className="absolute inset-0 bg-grid animate-grid opacity-30"></div>
        <div className="max-w-4xl mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">AI Command Center</h2>
            <p className="text-zinc-400 text-lg">Watch the AI pipeline process requests in real-time.</p>
          </div>
          
          <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-8 shadow-[0_0_100px_-20px_rgba(168,85,247,0.15)] relative">
             <div className="absolute top-0 left-0 w-full h-1 bg-zinc-900 rounded-t-3xl overflow-hidden">
                <motion.div className="h-full bg-gradient-to-r from-purple-500 to-blue-500" initial={{ width: "0%" }} animate={{ width: "100%" }} transition={{ duration: 3, repeat: Infinity, ease: "linear" }} />
             </div>
             
             <div className="space-y-4">
               <AnimatePresence mode="popLayout">
                  {commandSteps.slice(0, commandStep + 1).map((step, i) => (
                    <motion.div 
                      key={i} 
                      initial={{ opacity: 0, x: -20, height: 0 }} 
                      animate={{ opacity: 1, x: 0, height: "auto" }} 
                      className="flex items-start gap-4 p-4 rounded-2xl bg-black border border-zinc-800"
                    >
                       <div className={`w-3 h-3 rounded-full mt-1.5 ${step.color} shadow-[0_0_10px_currentColor]`} />
                       <div>
                         <p className="font-bold text-white mb-1">{step.title}</p>
                         <p className="text-sm text-zinc-400 font-mono">{step.desc}</p>
                       </div>
                    </motion.div>
                  ))}
               </AnimatePresence>
             </div>
          </div>
        </div>
      </section>

      {/* Feature Cards with Premium Hover */}
      <section id="features" className="py-32 bg-zinc-950">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-bold mb-6">Built for Scale</h2>
            <p className="text-zinc-400 text-xl max-w-2xl mx-auto">Every tool you need to dominate social media, packaged in one blazing-fast workspace.</p>
          </div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={{
              visible: { transition: { staggerChildren: 0.1 } },
              hidden: {}
            }}
          >
            {[
              { title: "Thumbnail Studio", desc: "FLUX-powered image generation with built-in typography safe zones.", icon: ImageIcon },
              { title: "Post Generator", desc: "Naraya AI crafts perfect captions for Instagram, X, and LinkedIn.", icon: FileText },
              { title: "Reel Scripts", desc: "Viral storytelling structures, hook variations, and scene breakdowns.", icon: Video },
              { title: "Content Calendar", desc: "Drag-and-drop planning view to organize your monthly content pipeline.", icon: Calendar },
              { title: "Media Library", desc: "Cloudinary integration stores all your high-res assets securely.", icon: Database },
            ].map((feature, i) => (
              <motion.div 
                key={i}
                variants={{
                  hidden: { opacity: 0, y: 50 },
                  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 50 } }
                }}
                whileHover={{ scale: 1.02, y: -5 }}
                className="glow-hover p-8 rounded-3xl border border-zinc-800 bg-black relative overflow-hidden group"
              >
                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity transform group-hover:scale-110">
                  <feature.icon className="w-32 h-32" />
                </div>
                <div className="w-12 h-12 bg-zinc-900 border border-zinc-800 rounded-xl flex items-center justify-center mb-6 group-hover:bg-purple-500/10 group-hover:text-purple-400 group-hover:border-purple-500/30 transition-colors">
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-zinc-400 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-32 bg-black relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-bold mb-6">Simple Pricing</h2>
            <p className="text-zinc-400 text-xl">Start for free, upgrade when you scale.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <PricingCard title="Starter" price="$19" credits="1,000" features={["All AI Tools", "Priority Generation", "Media Library"]} />
            <PricingCard title="Pro" price="$49" credits="5,000" features={["Unlimited Projects", "AI Video Generation", "Advanced Analytics"]} highlighted />
            <PricingCard title="Agency" price="$99" credits="15,000" features={["Team Workspace", "White Label", "API Access"]} />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-800/50 py-12 bg-zinc-950">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded bg-gradient-to-tr from-purple-600 to-blue-600 flex items-center justify-center font-bold text-xs">AI</div>
            <span className="font-bold text-lg">Content Studio</span>
          </div>
          <div className="text-sm text-zinc-500 flex items-center gap-2">
            <Sparkles className="w-4 h-4" /> Built for the future of creation.
          </div>
        </div>
      </footer>
    </div>
  )
}

function PricingCard({ title, price, credits, features, highlighted = false }: { title: string, price: string, credits: string, features: string[], highlighted?: boolean }) {
  return (
    <motion.div 
      whileHover={{ y: -10 }}
      className={`p-8 rounded-3xl border ${highlighted ? 'border-purple-500 bg-purple-900/10 shadow-[0_0_40px_rgba(168,85,247,0.15)] relative' : 'border-zinc-800 bg-zinc-950'}`}
    >
      {highlighted && <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-purple-500 text-white text-xs font-bold px-4 py-1 rounded-full">MOST POPULAR</div>}
      <h3 className="text-xl font-medium text-zinc-400 mb-2">{title}</h3>
      <div className="text-5xl font-bold mb-2">{price}<span className="text-xl text-zinc-500 font-normal">/mo</span></div>
      <p className="text-sm text-purple-400 font-medium mb-8">{credits} Credits</p>
      
      <ul className="space-y-4 mb-8">
        {features.map((f, i) => (
          <li key={i} className="flex items-center gap-3 text-sm text-zinc-300">
            <CheckCircle2 className="w-5 h-5 text-purple-500" /> {f}
          </li>
        ))}
      </ul>
      <button className={`w-full py-3.5 rounded-xl font-bold transition-all ${highlighted ? 'bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-500/20' : 'bg-zinc-900 hover:bg-zinc-800 text-white'}`}>
        Choose {title}
      </button>
    </motion.div>
  )
}
