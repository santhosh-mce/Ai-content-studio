"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { aiRouter } from "@/lib/ai/router"
import { revalidatePath } from "next/cache"

export async function getCalendarPosts() {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Unauthorized")

  return await prisma.contentCalendar.findMany({
    where: { userId: session.user.id },
    orderBy: { publishDate: "asc" }
  })
}

export async function updatePostDate(id: string, newDate: Date) {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Unauthorized")

  await prisma.contentCalendar.update({
    where: { id, userId: session.user.id },
    data: { publishDate: newDate }
  })

  revalidatePath("/calendar")
  return { success: true }
}

export async function updatePostStatus(id: string, status: string) {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Unauthorized")

  await prisma.contentCalendar.update({
    where: { id, userId: session.user.id },
    data: { status }
  })

  revalidatePath("/calendar")
  return { success: true }
}

export async function generate30DayPlan(niche: string) {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Unauthorized")

  const userId = session.user.id

  const prompt = `You are an expert social media manager. Create a 30-day content calendar plan for the niche: "${niche}".
Return ONLY a JSON array of objects. Do not wrap in markdown.
Format:
[
  { "dayOffset": 0, "title": "...", "description": "...", "platform": "Instagram", "contentType": "Reel" },
  { "dayOffset": 1, "title": "...", "description": "...", "platform": "LinkedIn", "contentType": "Post" }
]
Generate exactly 30 items. dayOffset goes from 0 to 29.`

  const rawJson = await aiRouter("text", prompt)
  
  let planItems: any[] = [];
  try {
    const jsonStr = rawJson.replace(/```json\n?|\n?```/g, '').trim()
    planItems = JSON.parse(jsonStr)
  } catch (e) {
    console.error("Failed to parse calendar JSON", e)
    throw new Error("Failed to generate plan.")
  }

  // Create entries
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const entries = planItems.map(item => {
    const publishDate = new Date(today)
    publishDate.setDate(today.getDate() + item.dayOffset)
    return {
      userId,
      title: item.title,
      description: item.description,
      platform: item.platform,
      contentType: item.contentType,
      publishDate,
      status: "Draft",
      campaign: `${niche} Launch`
    }
  })

  await prisma.contentCalendar.createMany({
    data: entries
  })

  revalidatePath("/calendar")
  return { success: true }
}
