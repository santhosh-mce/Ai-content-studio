import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"

export default async function DashboardHome() {
  const session = await auth()
  if (!session?.user) return null

  // Fetch metrics
  const [imagesCount, postsCount, reelsCount] = await Promise.all([
    prisma.generation.count({ where: { userId: session.user.id, type: "thumbnail" } }),
    prisma.generation.count({ where: { userId: session.user.id, type: "post" } }),
    prisma.generation.count({ where: { userId: session.user.id, type: "reel" } })
  ])

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Welcome back, {session.user.name || "Creator"}!</h1>
        <p className="text-zinc-400 mt-2">Here is an overview of your AI Content Studio.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricCard title="Generated Thumbnails" value={imagesCount} />
        <MetricCard title="Generated Posts" value={postsCount} />
        <MetricCard title="Generated Reels" value={reelsCount} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Placeholder for Quick Actions */}
        <div className="p-6 border border-zinc-800 rounded-xl bg-zinc-950">
          <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <ActionLink href="/thumbnails" title="Create a Thumbnail" desc="Generate AI YouTube thumbnails" />
            <ActionLink href="/posts" title="Draft a Social Post" desc="Write captions and generate images" />
            <ActionLink href="/reels" title="Write a Reel Script" desc="Generate engaging short-form scripts" />
          </div>
        </div>

        {/* Placeholder for Recent Activity */}
        <div className="p-6 border border-zinc-800 rounded-xl bg-zinc-950">
          <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
          <p className="text-sm text-zinc-500">You have no recent generations yet. Get started by creating your first piece of content!</p>
        </div>
      </div>
    </div>
  )
}

function MetricCard({ title, value }: { title: string; value: number }) {
  return (
    <div className="p-6 border border-zinc-800 rounded-xl bg-zinc-950 flex flex-col justify-between">
      <h3 className="text-sm font-medium text-zinc-400">{title}</h3>
      <p className="text-4xl font-bold mt-2">{value}</p>
    </div>
  )
}

function ActionLink({ href, title, desc }: { href: string; title: string; desc: string }) {
  return (
    <a href={href} className="block p-4 border border-zinc-800 rounded-lg hover:border-zinc-700 hover:bg-zinc-900 transition-colors">
      <div className="font-medium text-white">{title}</div>
      <div className="text-sm text-zinc-400 mt-1">{desc}</div>
    </a>
  )
}
