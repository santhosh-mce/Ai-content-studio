"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { aiRouter } from "@/lib/ai/router"
import { uploadToCloudinary } from "@/lib/cloudinary"

const COST_TEXT = 1
const COST_IMAGE = 5

export async function generateThumbnail(title: string, style: string, emotion: string) {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Unauthorized")

  const userId = session.user.id
  
  // Enforce SaaS Credit Limits
  const user = await prisma.user.findUnique({ where: { id: userId }, select: { credits: true } })
  if (!user || user.credits < COST_TEXT + COST_IMAGE) {
    throw new Error("402: Insufficient credits. Please upgrade your plan to continue.")
  }

  // Generate Prompt
  const prompt = await aiRouter("text",
    `Create a viral YouTube thumbnail prompt for:
     Title: ${title}
     Style/Niche: ${style}
     Emotion/Vibe: ${emotion}
     Make it high CTR, cinematic, and visually striking.`
  )

  // Generate Image
  const rawImageUrl = await aiRouter("image", prompt)

  // Upload to Cloudinary
  const upload = await uploadToCloudinary(rawImageUrl)

  // Save to Media Library
  const media = await prisma.media.create({
    data: {
      userId,
      title,
      prompt,
      imageUrl: upload.secure_url,
      publicId: upload.public_id,
      type: "thumbnail",
    }
  })

  // Deduct credits and save generation
  await prisma.$transaction([
    prisma.user.update({
      where: { id: userId },
      data: { credits: { decrement: COST_TEXT + COST_IMAGE } }
    }),
    prisma.creditUsage.create({
      data: { userId, action: "generate_thumbnail", credits: COST_TEXT + COST_IMAGE }
    }),
    prisma.generation.create({
      data: {
        userId,
        type: "thumbnail",
        prompt,
        result: { imageUrl: upload.secure_url },
        imageUrl: upload.secure_url
      }
    })
  ])

  return { prompt, imageUrl: upload.secure_url }
}

export async function generateSocialPost(topic: string, platform: string, tone: string, audience: string, goal: string) {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Unauthorized")

  const userId = session.user.id
  
  // Enforce SaaS Credit Limits
  const user = await prisma.user.findUnique({ where: { id: userId }, select: { credits: true } })
  if (!user || user.credits < COST_TEXT + COST_IMAGE) {
    throw new Error("402: Insufficient credits. Please upgrade your plan to continue.")
  }

  // Generate Caption
  const caption = await aiRouter("text",
    `Write a viral ${platform} caption about: ${topic} in a ${tone} tone. 
     Target Audience: ${audience}
     Goal/Objective: ${goal}
     Include relevant hashtags at the end.`
  )

  // Generate Image
  const rawImageUrl = await aiRouter("image",
    `High quality social media post image for ${platform} about ${topic}. Modern aesthetic.`
  )

  // Upload to Cloudinary
  const upload = await uploadToCloudinary(rawImageUrl)

  // Save to Media Library
  const media = await prisma.media.create({
    data: {
      userId,
      title: topic,
      prompt: `High quality social media post image for ${platform} about ${topic}. Modern aesthetic.`,
      imageUrl: upload.secure_url,
      publicId: upload.public_id,
      type: "post",
    }
  })

  // Deduct credits and save generation
  await prisma.$transaction([
    prisma.user.update({
      where: { id: userId },
      data: { credits: { decrement: COST_TEXT + COST_IMAGE } }
    }),
    prisma.creditUsage.create({
      data: { userId, action: "generate_post", credits: COST_TEXT + COST_IMAGE }
    }),
    prisma.generation.create({
      data: {
        userId,
        type: "post",
        prompt: topic,
        result: { caption, imageUrl: upload.secure_url },
        imageUrl: upload.secure_url
      }
    })
  ])

  return { caption, imageUrl: upload.secure_url }
}

export async function generateReelScript(topic: string, platform: string, duration: string, audience: string, style: string) {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Unauthorized")

  const userId = session.user.id
  
  // Enforce SaaS Credit Limits
  const user = await prisma.user.findUnique({ where: { id: userId }, select: { credits: true } })
  if (!user || user.credits < COST_TEXT) {
    throw new Error("402: Insufficient credits. Please upgrade your plan to continue.")
  }

  // Generate Script JSON
  const prompt = `Create a viral ${platform} Reel/Short script for a ${duration} seconds video.
Topic: ${topic}
Target Audience: ${audience}
Style/Tone: ${style}
Respond ONLY with a valid JSON object matching this structure:
{
  "hook": "The opening 3-second hook to grab attention",
  "storyline": "Brief outline of the narrative",
  "sceneBreakdown": [
    {"time": "0-5s", "visual": "Description of visual", "audio": "Voiceover line for this scene"}
  ],
  "voiceover": "The complete voiceover text paragraph",
  "cta": "The call to action at the end"
}`

  const rawJson = await aiRouter("text", prompt)
  
  // Parse JSON
  let scriptData;
  try {
    // Basic extraction if Naraya adds markdown blocks
    const jsonStr = rawJson.replace(/```json\n?|\n?```/g, '').trim()
    scriptData = JSON.parse(jsonStr)
  } catch (e) {
    console.error("Failed to parse Reel JSON", e)
    throw new Error("AI returned invalid script format. Please try again.")
  }

  // Save to DB
  const reelProject = await prisma.reelProject.create({
    data: {
      userId,
      topic,
      platform,
      duration,
      hook: scriptData.hook,
      storyline: scriptData.storyline,
      cta: scriptData.cta,
      voiceover: scriptData.voiceover,
      script: JSON.stringify(scriptData.sceneBreakdown)
    }
  })

  // Deduct credits and save generation
  await prisma.$transaction([
    prisma.user.update({
      where: { id: userId },
      data: { credits: { decrement: COST_TEXT } }
    }),
    prisma.creditUsage.create({
      data: { userId, action: "generate_reel", credits: COST_TEXT }
    }),
    prisma.generation.create({
      data: {
        userId,
        projectId: reelProject.id,
        type: "reel",
        prompt: topic,
        result: scriptData as any
      }
    })
  ])

  return { projectId: reelProject.id, ...scriptData }
}

export async function generateReelVideo(projectId: string) {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Unauthorized")

  const userId = session.user.id
  
  const user = await prisma.user.findUnique({ where: { id: userId }, select: { credits: true } })
  if (!user || user.credits < COST_IMAGE) {
    throw new Error("402: Insufficient credits. Please upgrade your plan to continue.")
  }

  const project = await prisma.reelProject.findUnique({ where: { id: projectId } })
  if (!project || project.userId !== userId) throw new Error("Project not found")

  // Use the voiceover and topic as the video generation prompt
  const videoPrompt = `High quality cinematic vertical video for social media. Topic: ${project.topic}. Voiceover context: ${project.voiceover}`
  
  // Generate Video
  const videoUrl = await aiRouter("video", videoPrompt)

  // Update Project
  await prisma.reelProject.update({
    where: { id: projectId },
    data: { videoUrl }
  })

  // Save to Media Library
  await prisma.media.create({
    data: {
      userId,
      title: project.topic,
      prompt: videoPrompt,
      imageUrl: videoUrl, // We store video URLs in the same field for now
      type: "reel_video"
    }
  })

  // Deduct credits
  await prisma.user.update({
    where: { id: userId },
    data: { credits: { decrement: COST_IMAGE } }
  })

  return { videoUrl }
}
