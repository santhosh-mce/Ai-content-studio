import Link from "next/link"
import { LayoutDashboard, Image as ImageIcon, FileText, Video, Calendar, Settings, CreditCard, LogOut, Search, Bell, User } from "lucide-react"
import { auth, signOut } from "@/auth"
import { redirect } from "next/navigation"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  if (!session?.user) {
    redirect("/api/auth/signin")
  }

  return (
    <div className="flex h-screen w-full bg-black text-white overflow-hidden">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-screen w-64 border-r border-zinc-800 bg-zinc-950 p-6 flex flex-col hidden md:flex z-50">
        <div className="flex items-center gap-2 mb-8">
          <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold">
            AI
          </div>
          <span className="text-xl font-bold tracking-tight">Content Studio</span>
        </div>

        <nav className="flex-1 space-y-2">
          <NavItem href="/dashboard" icon={<LayoutDashboard className="w-5 h-5" />} label="Dashboard" />
          <NavItem href="/thumbnails" icon={<ImageIcon className="w-5 h-5" />} label="Thumbnails" />
          <NavItem href="/posts" icon={<FileText className="w-5 h-5" />} label="Social Posts" />
          <NavItem href="/reels" icon={<Video className="w-5 h-5" />} label="Reels Script" />
          <NavItem href="/calendar" icon={<Calendar className="w-5 h-5" />} label="Calendar" />
          <NavItem href="/media" icon={<ImageIcon className="w-5 h-5" />} label="Media Library" />
        </nav>

        <div className="mt-auto space-y-4">
          <div className="p-4 bg-zinc-900 rounded-xl border border-zinc-800">
            <div className="text-sm text-zinc-400 mb-1">Credits Remaining</div>
            {/* @ts-ignore */}
            <div className="text-2xl font-bold">{session.user.credits || 0}</div>
            <Link href="/billing" className="text-xs text-blue-500 hover:text-blue-400 mt-2 inline-block">
              Upgrade Plan
            </Link>
          </div>

          <nav className="space-y-2">
            <NavItem href="/billing" icon={<CreditCard className="w-5 h-5" />} label="Billing" />
            <NavItem href="/settings" icon={<Settings className="w-5 h-5" />} label="Settings" />
            <form action={async () => {
              "use server"
              await signOut()
            }}>
              <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-zinc-400 hover:bg-zinc-900 hover:text-white transition-colors">
                <LogOut className="w-5 h-5" />
                Sign Out
              </button>
            </form>
          </nav>
        </div>
      </aside>

      {/* Navbar */}
      <header className="fixed left-0 md:left-64 right-0 top-0 h-16 border-b border-zinc-800 bg-black/80 backdrop-blur-md z-40 flex items-center justify-between px-6 md:px-10">
        <div className="flex items-center gap-4 flex-1">
          <div className="relative hidden md:block max-w-md w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input 
              type="text" 
              placeholder="Search..." 
              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-zinc-700"
            />
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button className="text-zinc-400 hover:text-white transition-colors relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-0 right-0 w-2 h-2 bg-blue-500 rounded-full border border-black"></span>
          </button>
          <div className="h-8 w-8 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center cursor-pointer">
            <User className="w-4 h-4 text-zinc-400" />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="md:ml-64 pt-16 flex-1 overflow-y-auto h-screen w-full">
        <div className="p-6 md:p-10 min-h-full">
          {children}
        </div>
      </main>
    </div>
  )
}

function NavItem({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-zinc-400 hover:bg-zinc-900 hover:text-white transition-colors"
    >
      {icon}
      {label}
    </Link>
  )
}
