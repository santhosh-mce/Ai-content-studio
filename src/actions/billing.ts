"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

export async function getBillingDetails() {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Unauthorized")
  
  const userId = session.user.id

  // Get user for credits
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { credits: true }
  })

  // Get subscription
  const subscription = await prisma.subscription.findUnique({
    where: { userId }
  })

  // Get current month usage grouped by action
  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  
  const usageStats = await prisma.creditUsage.groupBy({
    by: ['action'],
    where: {
      userId,
      createdAt: { gte: startOfMonth }
    },
    _sum: {
      credits: true
    },
    _count: {
      _all: true
    }
  })

  return {
    credits: user?.credits || 0,
    plan: subscription?.plan || "Free",
    status: subscription?.status || "Active",
    nextBillingDate: "July 12, 2026", // Mocked date for now without Stripe integration
    usage: usageStats
  }
}
