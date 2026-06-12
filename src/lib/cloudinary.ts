import { v2 as cloudinary } from "cloudinary";

type AIImageResponse = {
  url?: string
  image_url?: string
  data?: {
    images?: Array<{ url?: string; image_url?: string }>
  }
  images?: Array<{ url?: string; image_url?: string }>
}

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export function extractImageUrl(imageInput: unknown): string | null {
  if (typeof imageInput === "string") return imageInput

  const image = imageInput as AIImageResponse | Record<string, any>

  return (
    image?.url ||
    image?.image_url ||
    image?.data?.image_url ||
    image?.data?.url ||
    image?.images?.[0]?.url ||
    image?.images?.[0]?.image_url ||
    image?.data?.images?.[0]?.url ||
    image?.data?.images?.[0]?.image_url ||
    null
  )
}

export async function uploadToCloudinary(imageUrl: unknown) {
  try {
    const url = extractImageUrl(imageUrl)

    if (!url || typeof url !== "string") {
      console.error("Cloudinary upload failed: invalid image input", imageUrl)
      throw new Error("Invalid image URL for Cloudinary upload")
    }

    const result = await cloudinary.uploader.upload(url, {
      folder: "ai-content-studio/media",
      resource_type: "image",
      overwrite: false,
      unique_filename: true,
    })

    return {
      secure_url: result.secure_url,
      public_id: result.public_id
    }
  } catch (error) {
    console.error("Cloudinary upload failed:", error)
    throw new Error("Failed to upload image to Cloudinary")
  }
}

export default cloudinary;
