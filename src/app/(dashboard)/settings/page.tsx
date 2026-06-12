"use client"

import { useState, useEffect } from "react"
import { useTheme } from "next-themes"
import { getSettingsData, updateProfile, updateAvatar, updatePreferences, generateApiKey, revokeApiKey, deleteAccount } from "@/actions/settings"
import { User, Building2, Palette, Sparkles, Bell, CreditCard, Link as LinkIcon, Users, Lock, Key, HardDrive, AlertTriangle, Loader2, UploadCloud, CheckCircle2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

const TABS = [
  { id: "profile", label: "Profile", icon: User },
  { id: "appearance", label: "Appearance", icon: Palette },
  { id: "ai", label: "AI Preferences", icon: Sparkles },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "security", label: "Security", icon: Lock },
  { id: "danger", label: "Danger Zone", icon: AlertTriangle, danger: true },
]

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile")
  const [userData, setUserData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const data = await getSettingsData()
        setUserData(data)
      } catch (e) {
        console.error(e)
      }
      setIsLoading(false)
    }
    load()
  }, [])

  if (isLoading) {
    return <div className="h-[calc(100vh-80px)] flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-zinc-600" /></div>
  }

  return (
    <div className="max-w-[1400px] mx-auto h-[calc(100vh-80px)] flex flex-col md:flex-row gap-8 pb-8">
      
      {/* Sidebar Navigation */}
      <div className="w-full md:w-64 shrink-0 flex flex-col gap-1 overflow-y-auto custom-scrollbar bg-zinc-950 p-4 border border-zinc-800 rounded-2xl shadow-xl">
        <h2 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-3 px-2">Settings</h2>
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all
              ${activeTab === tab.id 
                ? (tab.danger ? 'bg-red-500/10 text-red-500 border border-red-500/20 shadow-lg shadow-red-500/5' : 'bg-purple-500/10 text-purple-400 border border-purple-500/20 shadow-lg shadow-purple-500/5') 
                : (tab.danger ? 'text-zinc-400 hover:text-red-400 hover:bg-red-500/5' : 'text-zinc-400 hover:text-white hover:bg-zinc-900')}
            `}
          >
            <tab.icon className="w-4 h-4 shrink-0" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 bg-zinc-950 border border-zinc-800 rounded-2xl p-6 md:p-10 shadow-xl overflow-y-auto custom-scrollbar relative">
         <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
               {activeTab === "profile" && <ProfileSettings user={userData} />}
               {activeTab === "appearance" && <AppearanceSettings user={userData} />}
               {activeTab === "ai" && <AiPreferencesSettings user={userData} />}
               {activeTab === "notifications" && <NotificationSettings />}
               {activeTab === "security" && <SecuritySettings />}
               {activeTab === "danger" && <DangerZoneSettings />}
            </motion.div>
         </AnimatePresence>
      </div>

    </div>
  )
}

function SectionHeader({ title, description }: { title: string, description: string }) {
  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold text-white mb-1">{title}</h2>
      <p className="text-zinc-400 text-sm">{description}</p>
    </div>
  )
}

function ProfileSettings({ user }: { user: any }) {
  const [saving, setSaving] = useState(false)
  const [uploadingAvatar, setUploadingAvatar] = useState(false)
  const [name, setName] = useState(user?.name || "")
  const [bio, setBio] = useState(user?.bio || "")
  const [website, setWebsite] = useState(user?.website || "")
  const [location, setLocation] = useState(user?.location || "")
  
  const handleSave = async (e: any) => {
    e.preventDefault()
    setSaving(true)
    try {
      await updateProfile({ name, bio, website, location })
    } catch (err) {
      console.error(err)
    }
    setSaving(false)
  }

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadingAvatar(true)
    try {
      const formData = new FormData()
      formData.append("file", file)
      const res = await fetch("/api/upload", { method: "POST", body: formData })
      const data = await res.json()
      if (data.url) {
        await updateAvatar(data.url)
        // locally update the user object if needed, but since it's a server action, it should revalidate and refresh
        window.location.reload() // simple way to refresh the view immediately
      }
    } catch (err) {
      console.error(err)
    }
    setUploadingAvatar(false)
  }

  return (
    <div>
      <SectionHeader title="Profile Information" description="Update your personal information and public profile." />
      
      <div className="flex items-center gap-6 mb-8 p-6 bg-black rounded-2xl border border-zinc-800">
        {user?.avatar ? (
          <img src={user.avatar} alt="Avatar" className="w-20 h-20 rounded-full object-cover border border-zinc-700" />
        ) : (
          <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-purple-600 to-blue-600 flex items-center justify-center text-2xl font-bold text-white">
            {user?.name?.[0] || "U"}
          </div>
        )}
        <div>
          <label className="cursor-pointer bg-zinc-900 border border-zinc-700 hover:bg-zinc-800 text-white text-sm font-medium px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition w-40">
            {uploadingAvatar ? <Loader2 className="w-4 h-4 animate-spin" /> : <><UploadCloud className="w-4 h-4" /> Upload Avatar</>}
            <input type="file" className="hidden" accept="image/*" onChange={handleAvatarUpload} disabled={uploadingAvatar} />
          </label>
          <p className="text-xs text-zinc-500 mt-2">JPG, GIF or PNG. Max size of 800K</p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6 max-w-2xl">
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-zinc-400 uppercase">Full Name</label>
            <input value={name} onChange={e => setName(e.target.value)} className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:ring-1 focus:ring-purple-500 outline-none transition" />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold text-zinc-400 uppercase">Email Address</label>
            <input value={user?.email || ""} disabled className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-500 outline-none cursor-not-allowed" />
          </div>
        </div>
        
        <div className="space-y-2">
          <label className="text-xs font-semibold text-zinc-400 uppercase">Bio</label>
          <textarea value={bio} onChange={e => setBio(e.target.value)} className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:ring-1 focus:ring-purple-500 outline-none transition h-24 resize-none" placeholder="A short bio about you..." />
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-zinc-400 uppercase">Website</label>
            <input value={website} onChange={e => setWebsite(e.target.value)} className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:ring-1 focus:ring-purple-500 outline-none transition" placeholder="https://" />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold text-zinc-400 uppercase">Location</label>
            <input value={location} onChange={e => setLocation(e.target.value)} className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:ring-1 focus:ring-purple-500 outline-none transition" placeholder="City, Country" />
          </div>
        </div>

        <button type="submit" disabled={saving} className="bg-white text-black hover:bg-zinc-200 font-bold py-3 px-6 rounded-xl flex items-center gap-2 transition shadow-lg shadow-white/10">
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save Changes"}
        </button>
      </form>
    </div>
  )
}

function AccountSettings({ user }: { user: any }) {
  return (
    <div>
      <SectionHeader title="Account Settings" description="View your account details and export your data." />
      <div className="space-y-6 max-w-2xl">
        <div className="p-6 bg-black rounded-2xl border border-zinc-800 flex justify-between items-center">
           <div>
             <p className="text-xs text-zinc-500 font-semibold uppercase mb-1">Account ID</p>
             <p className="text-sm font-mono text-white">{user?.id}</p>
           </div>
           <button className="text-purple-400 hover:text-purple-300 text-sm font-medium">Copy</button>
        </div>
        <div className="p-6 bg-black rounded-2xl border border-zinc-800 flex justify-between items-center">
           <div>
             <p className="text-xs text-zinc-500 font-semibold uppercase mb-1">Registration Date</p>
             <p className="text-sm text-white">{new Date(user?.createdAt).toLocaleDateString()}</p>
           </div>
        </div>
        <div className="p-6 bg-black rounded-2xl border border-zinc-800 flex justify-between items-center">
           <div>
             <p className="text-sm text-white font-medium mb-1">Export Account Data</p>
             <p className="text-xs text-zinc-500">Download a JSON copy of all your generated assets and settings.</p>
           </div>
           <button className="bg-zinc-900 hover:bg-zinc-800 text-white px-4 py-2 rounded-lg text-sm font-medium border border-zinc-700 transition">Request Export</button>
        </div>
      </div>
    </div>
  )
}

function AppearanceSettings({ user }: { user: any }) {
  const { theme: activeTheme, setTheme: setActiveTheme } = useTheme()
  const [theme, setTheme] = useState(user?.preference?.theme || "dark")
  const [accent, setAccent] = useState(user?.preference?.accentColor || "purple")
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    setSaving(true)
    
    // Apply immediately to UI
    setActiveTheme(theme)
    document.documentElement.setAttribute("data-accent", accent)
    localStorage.setItem("ai_accent_color", accent)

    // Save to DB
    await updatePreferences({ theme, accentColor: accent })
    setSaving(false)
  }

  return (
    <div>
      <SectionHeader title="Appearance" description="Customize how AI Content Studio looks on your device." />
      
      <div className="space-y-8 max-w-2xl">
        <div>
          <label className="text-xs font-semibold text-zinc-400 uppercase block mb-4">Theme</label>
          <div className="grid grid-cols-3 gap-4">
             {['dark', 'light', 'system'].map(t => (
               <button key={t} onClick={() => { setTheme(t); setActiveTheme(t); }} className={`p-4 rounded-xl border flex flex-col items-center gap-3 transition ${theme === t ? 'bg-purple-500/10 border-purple-500 ring-2 ring-purple-500/20' : 'bg-black border-zinc-800 hover:border-zinc-700'}`}>
                 <div className={`w-12 h-12 rounded-full border-4 ${t === 'dark' ? 'bg-zinc-950 border-zinc-800' : t === 'light' ? 'bg-white border-zinc-200' : 'bg-gradient-to-tr from-zinc-900 to-white border-zinc-700'}`}></div>
                 <span className="text-sm font-medium capitalize text-white">{t}</span>
               </button>
             ))}
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-zinc-400 uppercase block mb-4">Accent Color</label>
          <div className="flex gap-4">
             {[
               { id: 'purple', class: 'bg-purple-500' },
               { id: 'blue', class: 'bg-blue-500' },
               { id: 'green', class: 'bg-emerald-500' },
               { id: 'orange', class: 'bg-orange-500' }
             ].map(color => (
               <button key={color.id} onClick={() => { setAccent(color.id); document.documentElement.setAttribute("data-accent", color.id); localStorage.setItem("ai_accent_color", color.id); }} className={`w-10 h-10 rounded-full flex items-center justify-center transition-transform ${color.class} ${accent === color.id ? 'ring-4 ring-zinc-800 scale-110' : 'hover:scale-110'}`}>
                 {accent === color.id && <CheckCircle2 className="w-5 h-5 text-white/80" />}
               </button>
             ))}
          </div>
        </div>

        <button onClick={handleSave} disabled={saving} className="bg-white text-black hover:bg-zinc-200 font-bold py-3 px-6 rounded-xl flex items-center gap-2 transition shadow-lg shadow-white/10">
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save Appearance"}
        </button>
      </div>
    </div>
  )
}

function AiPreferencesSettings({ user }: { user: any }) {
  const [saving, setSaving] = useState(false)
  
  const handleSave = async (e: any) => {
    e.preventDefault()
    setSaving(true)
    const formData = new FormData(e.target)
    await updatePreferences(Object.fromEntries(formData.entries()))
    setSaving(false)
  }

  return (
    <div>
      <SectionHeader title="AI Preferences" description="Configure default models, tone, and language for generation." />
      
      <form onSubmit={handleSave} className="space-y-6 max-w-2xl">
        <div className="p-6 bg-black rounded-2xl border border-zinc-800 space-y-6">
           <div className="grid grid-cols-2 gap-6">
             <div className="space-y-2">
               <label className="text-xs font-semibold text-zinc-400 uppercase">Default Text Model</label>
               <select name="defaultAiModel" defaultValue={user?.preference?.defaultAiModel} className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:ring-1 focus:ring-purple-500 outline-none transition appearance-none">
                 <option value="Naraya Chat">Naraya Chat (Recommended)</option>
                 <option value="GPT-4o">GPT-4o</option>
                 <option value="Claude 3.5">Claude 3.5 Sonnet</option>
                 <option value="Gemini 1.5">Gemini 1.5 Pro</option>
               </select>
             </div>
             <div className="space-y-2">
               <label className="text-xs font-semibold text-zinc-400 uppercase">Default Image Model</label>
               <select name="defaultImageModel" defaultValue={user?.preference?.defaultImageModel} className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:ring-1 focus:ring-purple-500 outline-none transition appearance-none">
                 <option value="FLUX Kontext">FLUX Kontext (Recommended)</option>
                 <option value="Grok Imagine">Grok Imagine</option>
                 <option value="Seedream 4">Seedream 4</option>
               </select>
             </div>
           </div>

           <div className="grid grid-cols-2 gap-6">
             <div className="space-y-2">
               <label className="text-xs font-semibold text-zinc-400 uppercase">Default Tone</label>
               <select name="defaultTone" defaultValue={user?.preference?.defaultTone} className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:ring-1 focus:ring-purple-500 outline-none transition appearance-none">
                 <option value="Professional">Professional</option>
                 <option value="Casual">Casual</option>
                 <option value="Marketing">Marketing / Persuasive</option>
                 <option value="Funny">Funny / Witty</option>
               </select>
             </div>
             <div className="space-y-2">
               <label className="text-xs font-semibold text-zinc-400 uppercase">Default Language</label>
               <select name="defaultLanguage" defaultValue={user?.preference?.defaultLanguage} className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:ring-1 focus:ring-purple-500 outline-none transition appearance-none">
                 <option value="English">English</option>
                 <option value="Spanish">Spanish</option>
                 <option value="Hindi">Hindi</option>
                 <option value="Tamil">Tamil</option>
               </select>
             </div>
           </div>
        </div>

        <button type="submit" disabled={saving} className="bg-white text-black hover:bg-zinc-200 font-bold py-3 px-6 rounded-xl flex items-center gap-2 transition shadow-lg shadow-white/10">
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save AI Preferences"}
        </button>
      </form>
    </div>
  )
}

function ApiKeysSettings({ user }: { user: any }) {
  const [name, setName] = useState("")
  const [generating, setGenerating] = useState(false)

  const handleGenerate = async (e: any) => {
    e.preventDefault()
    if (!name) return
    setGenerating(true)
    await generateApiKey(name)
    setName("")
    setGenerating(false)
  }

  const handleRevoke = async (id: string) => {
    if (confirm("Are you sure you want to revoke this key? Any apps using it will break.")) {
      await revokeApiKey(id)
    }
  }

  return (
    <div>
      <SectionHeader title="API Keys" description="Manage access keys for the AI Content Studio API. Never share these publicly." />
      
      <div className="max-w-3xl space-y-8">
         <form onSubmit={handleGenerate} className="flex gap-4 p-6 bg-black rounded-2xl border border-zinc-800">
            <div className="flex-1 space-y-2">
              <label className="text-xs font-semibold text-zinc-400 uppercase">Key Name</label>
              <input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Zapier Integration" className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white focus:ring-1 focus:ring-purple-500 outline-none transition" />
            </div>
            <div className="flex items-end">
              <button disabled={generating || !name} className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-semibold py-2.5 px-6 rounded-xl transition shadow-lg shadow-purple-500/20 disabled:opacity-50">
                 {generating ? <Loader2 className="w-4 h-4 animate-spin" /> : "Create Secret Key"}
              </button>
            </div>
         </form>

         <div>
           <h3 className="text-sm font-semibold text-white mb-4">Active Keys</h3>
           {user?.apiKeys?.length === 0 ? (
             <div className="p-8 border border-zinc-800 border-dashed rounded-2xl text-center text-zinc-500 text-sm">
                No API keys generated yet.
             </div>
           ) : (
             <div className="space-y-3">
                {user?.apiKeys?.map((key: any) => (
                  <div key={key.id} className="flex items-center justify-between p-4 bg-zinc-900/50 border border-zinc-800 rounded-xl">
                     <div>
                        <p className="text-sm font-bold text-white mb-1">{key.name}</p>
                        <p className="text-xs font-mono text-zinc-500">{key.key.substring(0, 12)}...{key.key.slice(-4)}</p>
                     </div>
                     <div className="flex items-center gap-4">
                        <span className="text-[10px] bg-green-500/10 text-green-400 px-2 py-0.5 rounded-full uppercase">Active</span>
                        <p className="text-xs text-zinc-500">Created {new Date(key.createdAt).toLocaleDateString()}</p>
                        <button onClick={() => handleRevoke(key.id)} className="text-xs font-bold text-red-500 hover:text-red-400 bg-red-500/10 hover:bg-red-500/20 px-3 py-1.5 rounded-lg transition">Revoke</button>
                     </div>
                  </div>
                ))}
             </div>
           )}
         </div>
      </div>
    </div>
  )
}

function DangerZoneSettings() {
  const [confirmText, setConfirmText] = useState("")
  const [deleting, setDeleting] = useState(false)

  const handleDelete = async () => {
    if (confirmText !== "DELETE") return
    setDeleting(true)
    const res = await deleteAccount()
    if (res.redirect) window.location.href = res.redirect
  }

  return (
    <div>
      <SectionHeader title="Danger Zone" description="Irreversible actions regarding your account and data." />
      
      <div className="max-w-2xl border border-red-500/30 bg-red-500/5 rounded-3xl p-8">
         <h3 className="text-xl font-bold text-red-500 mb-2">Delete Account</h3>
         <p className="text-zinc-400 text-sm mb-6">Once you delete your account, there is no going back. Please be certain. All your projects, generated media, API keys, and configurations will be permanently deleted.</p>
         
         <div className="space-y-4 bg-black p-6 rounded-2xl border border-red-900/30">
            <p className="text-sm font-medium text-white">To verify, type <span className="font-mono text-red-400 font-bold bg-red-500/10 px-1 py-0.5 rounded">DELETE</span> below:</p>
            <input 
               value={confirmText} 
               onChange={e => setConfirmText(e.target.value)}
               className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:ring-1 focus:ring-red-500 outline-none transition font-mono" 
            />
            <button 
               onClick={handleDelete}
               disabled={confirmText !== "DELETE" || deleting}
               className="w-full bg-red-600 hover:bg-red-500 text-white font-bold py-3 px-6 rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
               {deleting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Permanently Delete Account"}
            </button>
         </div>
      </div>
    </div>
  )
}

// Stubs for other sections to keep file clean
function NotificationSettings() {
  return <div><SectionHeader title="Notifications" description="Manage email and push notifications." /> <div className="p-10 border border-zinc-800 border-dashed rounded-2xl text-center text-zinc-500">Coming soon</div></div>
}
function BillingSettings({ user }: { user: any }) {
  return <div><SectionHeader title="Billing" description="Overview of your subscription." /> <div className="p-10 border border-zinc-800 border-dashed rounded-2xl text-center text-zinc-500">Check the dedicated Billing page in the sidebar for full details.</div></div>
}
function IntegrationSettings() {
  return <div><SectionHeader title="Integrations" description="Connect external apps." /> <div className="p-10 border border-zinc-800 border-dashed rounded-2xl text-center text-zinc-500">Cloudinary automatically connected. OAuth integrations coming soon.</div></div>
}
function TeamSettings({ user }: { user: any }) {
  return <div><SectionHeader title="Team Management" description="Manage agency team members." /> <div className="p-10 border border-zinc-800 border-dashed rounded-2xl text-center text-zinc-500">Upgrade to Agency plan to unlock team features.</div></div>
}
function SecuritySettings() {
  return <div><SectionHeader title="Security" description="Passwords and 2FA." /> <div className="p-10 border border-zinc-800 border-dashed rounded-2xl text-center text-zinc-500">Handled by NextAuth standard providers.</div></div>
}
function StorageSettings() {
  return <div><SectionHeader title="Storage" description="Cloudinary usage analytics." /> <div className="p-10 border border-zinc-800 border-dashed rounded-2xl text-center text-zinc-500">Usage limits apply based on subscription tier.</div></div>
}
