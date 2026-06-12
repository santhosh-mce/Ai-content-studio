"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import cloudinary from "@/lib/cloudinary"
import { revalidatePath } from "next/cache"

export async function getMedia(type?: string, search?: string, limit: number = 20, cursor?: string) {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Unauthorized")

  const whereClause: any = { userId: session.user.id }
  
  if (type && type !== "All") {
    whereClause.type = type.toLowerCase()
  }
  
  if (search) {
    whereClause.title = { contains: search, mode: "insensitive" }
  }

  const items = await prisma.media.findMany({
    where: whereClause,
    take: limit + 1, // take an extra item to check if there's a next page
    cursor: cursor ? { id: cursor } : undefined,
    orderBy: { createdAt: "desc" }
  })

  let nextCursor: typeof cursor | undefined = undefined;
  if (items.length > limit) {
    const nextItem = items.pop()
    nextCursor = nextItem?.id
  }

  return { items, nextCursor }
}

export async function uploadAsset(title: string, imageUrl: string, type: string, size?: number, width?: number, height?: number) {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Unauthorized")

  const media = await prisma.media.create({
    data: {
      userId: session.user.id,
      title,
      imageUrl,
      type: type.toLowerCase(),
      size,
      width,
      height
    }
  })
  
  revalidatePath("/media")
  return media
}

export async function incrementDownload(id: string) {
  await prisma.media.update({
    where: { id },
    data: { downloads: { increment: 1 } }
  })
}

export async function getRecentThumbnails(limit: number = 6) {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Unauthorized")

  return await prisma.media.findMany({
    where: { 
      userId: session.user.id,
      type: "thumbnail"
    },
    orderBy: { createdAt: "desc" },
    take: limit
  })
}

export async function getRecentPosts(limit: number = 6) {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Unauthorized")

  return await prisma.media.findMany({
    where: { 
      userId: session.user.id,
      type: "post"
    },
    orderBy: { createdAt: "desc" },
    take: limit
  })
}

export async function deleteMedia(id: string) {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Unauthorized")

  const media = await prisma.media.findUnique({
    where: { id, userId: session.user.id }
  })

  if (!media) throw new Error("Media not found")

  // Delete from Cloudinary if publicId exists
  if (media.publicId) {
    try {
      await cloudinary.uploader.destroy(media.publicId)
    } catch (e) {
      console.error("Failed to delete from Cloudinary:", e)
    }
  }

  // Delete from DB
  await prisma.media.delete({
    where: { id }
  })

  revalidatePath("/media")
  
  return { success: true }
}
