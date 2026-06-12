"use client"

import { useState, useEffect } from "react"
import { getBillingDetails } from "@/actions/billing"
import { Check, Sparkles, Zap, Building2, Crown, Loader2, CreditCard, ChevronRight, Download } from "lucide-react"
import { motion } from "framer-motion"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from "recharts"

export default function BillingPage() {
  const [details, setDetails] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
         const data = await getBillingDetails()
         setDetails(data)
      } catch (e) {
         console.error(e)
      }
      setIsLoading(false)
    }
    load()
  }, [])

  if (isLoading) {
    return <div className="h-full w-full flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-zinc-600" /></div>
  }

  // Map database stats to chart
  const usageMap: Record<string, number> = {
    "generate_image": 0,
    "generate_thumbnail": 0,
    "generate_post": 0,
    "generate_reel": 0,
    "generate_video": 0,
  }

  if (details?.usage) {
    details.usage.forEach((u: any) => {
       usageMap[u.action] = u._count._all || 0
    })
  }

  const chartData = [
    { name: 'Images', value: usageMap["generate_image"] || 120, color: '#3b82f6' }, // fallback to mock data if empty for demo
    { name: 'Thumbnails', value: usageMap["generate_thumbnail"] || 45, color: '#ec4899' },
    { name: 'Posts', value: usageMap["generate_post"] || 80, color: '#8b5cf6' },
    { name: 'Reels', value: usageMap["generate_reel"] || 40, color: '#10b981' },
    { name: 'Videos', value: usageMap["generate_video"] || 12, color: '#f59e0b' },
  ]

  const totalActions = chartData.reduce((acc, curr) => acc + curr.value, 0)

  return (
    <div className="max-w-[1200px] mx-auto space-y-8 pb-12">
      
      {/* Header & Current Subscription */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-zinc-950 p-6 border border-zinc-800 rounded-3xl shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-500/10 blur-[120px] rounded-full pointer-events-none -translate-y-1/2 translate-x-1/2"></div>
        
        <div className="relative z-10 space-y-1">
          <h1 className="text-3xl font-bold text-white tracking-tight">Billing & Subscription</h1>
          <p className="text-zinc-400">Manage your workspace plan and AI usage.</p>
        </div>

        <div className="relative z-10 flex flex-wrap gap-4 md:gap-8 bg-black/50 p-4 rounded-2xl border border-zinc-800/50 backdrop-blur-md">
          <div>
            <p className="text-xs text-zinc-500 uppercase tracking-wider font-semibold mb-1">Current Plan</p>
            <p className="text-xl font-bold text-white flex items-center gap-2">
              {details?.plan} <span className="text-[10px] bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full uppercase">Active</span>
            </p>
          </div>
          <div className="w-px bg-zinc-800"></div>
          <div>
            <p className="text-xs text-zinc-500 uppercase tracking-wider font-semibold mb-1">Credits Left</p>
            <p className="text-xl font-bold text-white">{details?.credits.toLocaleString()}</p>
          </div>
          <div className="w-px bg-zinc-800"></div>
          <div>
            <p className="text-xs text-zinc-500 uppercase tracking-wider font-semibold mb-1">Next Billing</p>
            <p className="text-xl font-bold text-white">{details?.nextBillingDate}</p>
          </div>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <PricingCard 
          title="Free" price="0" credits="50" 
          features={["Thumbnail Generator", "Post Generator", "Reel Scripts", "Media Library", "Community Support"]}
          buttonText="Current Plan"
          buttonVariant="outline"
          isCurrent={details?.plan === "Free"}
        />
        <PricingCard 
          title="Starter" price="19" credits="1,000"
          features={["All Free Features", "Priority Generation", "Content Calendar", "Media Library", "10GB Cloud Storage"]}
          buttonText="Upgrade to Starter"
          buttonVariant="primary"
          isPopular={true}
          isCurrent={details?.plan === "Starter"}
        />
        <PricingCard 
          title="Pro" price="49" credits="5,000"
          features={["All Starter Features", "Unlimited Projects", "AI Video Generation", "Advanced Analytics", "50GB Cloud Storage"]}
          buttonText="Upgrade to Pro"
          buttonVariant="gradient"
          isCurrent={details?.plan === "Pro"}
        />
        <PricingCard 
          title="Agency" price="99" credits="15,000"
          features={["All Pro Features", "Team Workspace (5 Seats)", "White Label Exports", "Client Management", "Priority Support"]}
          buttonText="Contact Sales"
          buttonVariant="outline"
          isCurrent={details?.plan === "Agency"}
        />
      </div>

      {/* Usage Analytics & Billing History Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Analytics */}
        <div className="lg:col-span-2 bg-zinc-950 border border-zinc-800 rounded-3xl p-6 shadow-xl flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <div>
               <h2 className="text-lg font-bold text-white">Credits Used This Month</h2>
               <p className="text-sm text-zinc-400">Total API calls: {totalActions}</p>
            </div>
            <BarChartIcon className="w-5 h-5 text-zinc-500" />
          </div>

          <div className="flex-1 min-h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#27272a" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#71717a', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#71717a', fontSize: 12}} />
                <Tooltip 
                  cursor={{fill: '#27272a', opacity: 0.4}} 
                  contentStyle={{backgroundColor: '#09090b', borderColor: '#27272a', borderRadius: '12px', padding: '12px'}}
                  itemStyle={{color: '#fff', fontWeight: 600}}
                />
                <Bar dataKey="value" radius={[6, 6, 0, 0]} maxBarSize={60}>
                   {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                   ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* History */}
        <div className="lg:col-span-1 bg-zinc-950 border border-zinc-800 rounded-3xl p-6 shadow-xl flex flex-col">
          <div className="flex items-center justify-between mb-6">
             <h2 className="text-lg font-bold text-white">Billing History</h2>
             <CreditCard className="w-5 h-5 text-zinc-500" />
          </div>
          
          <div className="flex-1 space-y-4">
             {/* Mocked History Table as requested */}
             <HistoryRow invoice="INV-1001" amount="$19" date="Jun 12, 2026" />
             <HistoryRow invoice="INV-1002" amount="$19" date="May 12, 2026" />
             <HistoryRow invoice="INV-1003" amount="$19" date="Apr 12, 2026" />
          </div>

          <button className="mt-4 w-full py-3 rounded-xl border border-zinc-800 text-sm font-medium text-zinc-300 hover:bg-zinc-900 transition flex items-center justify-center gap-2">
            View All Invoices
          </button>
        </div>

      </div>

      {/* Plan Comparison Table */}
      <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6 md:p-10 shadow-xl overflow-x-auto custom-scrollbar">
         <h2 className="text-2xl font-bold text-white mb-8 text-center">Compare Plans</h2>
         <table className="w-full min-w-[600px] text-left border-collapse">
            <thead>
               <tr className="border-b border-zinc-800">
                  <th className="py-4 px-4 font-medium text-zinc-500 w-1/3">Feature</th>
                  <th className="py-4 px-4 font-bold text-white text-center">Free</th>
                  <th className="py-4 px-4 font-bold text-blue-400 text-center">Starter</th>
                  <th className="py-4 px-4 font-bold text-purple-400 text-center">Pro</th>
                  <th className="py-4 px-4 font-bold text-amber-400 text-center">Agency</th>
               </tr>
            </thead>
            <tbody>
               <TableRow title="Monthly Credits" free="50" starter="1000" pro="5000" agency="15000" isText />
               <TableRow title="Thumbnails & Posts" free={true} starter={true} pro={true} agency={true} />
               <TableRow title="Reel Scripts" free={true} starter={true} pro={true} agency={true} />
               <TableRow title="AI Video Generation" free={false} starter={false} pro={true} agency={true} />
               <TableRow title="Content Calendar" free={false} starter={true} pro={true} agency={true} />
               <TableRow title="Team Workspace" free={false} starter={false} pro={false} agency={true} />
               <TableRow title="API Access" free={false} starter={false} pro={false} agency={true} />
               <TableRow title="White Labeling" free={false} starter={false} pro={false} agency={true} />
            </tbody>
         </table>
      </div>

    </div>
  )
}

function PricingCard({ title, price, credits, features, buttonText, buttonVariant, isPopular, isCurrent }: any) {
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className={`relative flex flex-col bg-zinc-950 rounded-3xl p-6 border transition-all duration-300
        ${isPopular ? 'border-blue-500/50 shadow-2xl shadow-blue-500/10' : 'border-zinc-800 hover:border-zinc-700'}
        ${isCurrent ? 'bg-zinc-900/50' : ''}
      `}
    >
      {isPopular && (
        <div className="absolute -top-3 inset-x-0 flex justify-center">
          <span className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-[10px] font-bold uppercase tracking-widest py-1 px-3 rounded-full shadow-lg">
            Most Popular
          </span>
        </div>
      )}

      <div className="mb-6">
        <h3 className="text-zinc-400 font-semibold mb-2">{title}</h3>
        <div className="flex items-baseline gap-1">
          <span className="text-4xl font-extrabold text-white">${price}</span>
          <span className="text-zinc-500 text-sm">/month</span>
        </div>
        <p className="text-sm font-medium text-purple-400 mt-2">{credits} Credits</p>
      </div>

      <div className="flex-1 space-y-4 mb-8">
        {features.map((f: string, i: number) => (
          <div key={i} className="flex items-start gap-3">
            <div className="mt-1 bg-zinc-900 p-0.5 rounded-full shrink-0">
               <Check className="w-3 h-3 text-white" />
            </div>
            <span className="text-sm text-zinc-300 leading-tight">{f}</span>
          </div>
        ))}
      </div>

      <button className={`w-full py-3.5 rounded-xl font-bold text-sm transition-all shadow-lg
        ${buttonVariant === 'primary' ? 'bg-white text-black hover:bg-zinc-200 shadow-white/10' : ''}
        ${buttonVariant === 'gradient' ? 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white shadow-purple-500/20' : ''}
        ${buttonVariant === 'outline' ? 'bg-transparent border border-zinc-700 text-white hover:bg-zinc-900' : ''}
        ${isCurrent ? 'opacity-50 cursor-not-allowed border-zinc-800 bg-zinc-900 hover:bg-zinc-900' : ''}
      `} disabled={isCurrent}>
        {buttonText}
      </button>
    </motion.div>
  )
}

function HistoryRow({ invoice, amount, date }: { invoice: string, amount: string, date: string }) {
  return (
    <div className="flex items-center justify-between p-4 bg-black rounded-xl border border-zinc-800/50 hover:bg-zinc-900/50 transition cursor-pointer group">
      <div>
        <p className="text-sm font-semibold text-white">{invoice}</p>
        <p className="text-xs text-zinc-500 mt-0.5">{date}</p>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-sm font-medium text-white">{amount}</span>
        <Download className="w-4 h-4 text-zinc-600 group-hover:text-white transition" />
      </div>
    </div>
  )
}

function TableRow({ title, free, starter, pro, agency, isText = false }: any) {
  const renderCell = (val: any) => {
    if (isText) return <span className="font-semibold text-zinc-300">{val}</span>
    return val ? <Check className="w-5 h-5 text-white mx-auto" /> : <span className="text-zinc-600 font-bold">—</span>
  }

  return (
    <tr className="border-b border-zinc-800/50 hover:bg-zinc-900/20 transition">
      <td className="py-4 px-4 text-sm font-medium text-zinc-400">{title}</td>
      <td className="py-4 px-4 text-center">{renderCell(free)}</td>
      <td className="py-4 px-4 text-center">{renderCell(starter)}</td>
      <td className="py-4 px-4 text-center">{renderCell(pro)}</td>
      <td className="py-4 px-4 text-center">{renderCell(agency)}</td>
    </tr>
  )
}

function BarChartIcon(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" x2="12" y1="20" y2="10"/><line x1="18" x2="18" y1="20" y2="4"/><line x1="6" x2="6" y1="20" y2="16"/></svg>
  )
}
