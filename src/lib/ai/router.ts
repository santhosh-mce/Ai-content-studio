import { generateText } from "./naraya"
import { generateImage, generateVideo } from "./grok"

export async function aiRouter(type: "text" | "image" | "video", prompt: string) {
  if (type === "text") {
    return await generateText(prompt)
  }

  if (type === "image") {
    return await generateImage(prompt)
  }

  if (type === "video") {
    return await generateVideo(prompt)
  }

  throw new Error("Invalid AI type")
}
