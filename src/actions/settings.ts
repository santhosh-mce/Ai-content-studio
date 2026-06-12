"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import crypto from "crypto"

export async function getSettingsData() {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Unauthorized")
  
  const userId = session.user.id

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      preference: true,
      apiKeys: true,
      integrations: true,
      teamMembers: {
        include: { team: { include: { members: { include: { user: true } } } } }
      }
    }
  })

  return user
}

export async function updateProfile(data: any) {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Unauthorized")

  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      name: data.name,
      bio: data.bio,
      website: data.website,
      location: data.location,
    }
  })
  
  revalidatePath("/settings")
  return { success: true }
}

export async function updateAvatar(url: string) {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Unauthorized")

  await prisma.user.update({
    where: { id: session.user.id },
    data: { avatar: url }
  })
  
  revalidatePath("/settings")
  return { success: true }
}

export async function updatePreferences(data: any) {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Unauthorized")

  await prisma.userPreference.upsert({
    where: { userId: session.user.id },
    update: data,
    create: { userId: session.user.id, ...data }
  })

  revalidatePath("/settings")
  return { success: true }
}

export async function generateApiKey(name: string) {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Unauthorized")

  const key = "sk_live_" + crypto.randomBytes(24).toString("hex")

  await prisma.apiKey.create({
    data: {
      userId: session.user.id,
      name,
      key
    }
  })

  revalidatePath("/settings")
  return { success: true }
}

export async function revokeApiKey(id: string) {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Unauthorized")

  await prisma.apiKey.delete({
    where: { id, userId: session.user.id }
  })

  revalidatePath("/settings")
  return { success: true }
}

export async function deleteAccount() {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Unauthorized")

  // Due to Cascade deletes in schema, this deletes almost everything
  await prisma.user.delete({
    where: { id: session.user.id }
  })

  return { success: true, redirect: "/" }
}
