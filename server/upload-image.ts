'use server'

import { actionClient } from '@/lib/safe-action'
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary'
import z from 'zod'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET
})

const formData = z.object({
  image: z.instanceof(FormData)
})

type UploadResult = 
| {success: UploadApiResponse; error?: never}
| {error: string; success?: never};


export const uploadImage = actionClient.schema(formData).action(async ({ parsedInput: { image } }): Promise<UploadResult> => {
  const formImage = image.get('image')

  if (!formImage) return { error: 'Failed to send' }

  const file = formImage as File

  try {
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    return await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          upload_preset: process.env.CLOUDINARY_UPLOAD_PRESET
        },
        (error, result) => {
          if (error || !result) {
            console.error("Upload error:", error)
            reject({ error: 'Cloudinary upload failed' })
          } else {
            resolve({ success: result })
          }
        }
      )

      uploadStream.end(buffer)
    })
  } catch (error: any) {
    console.error("Cloudinary Upload Error:", error)
    return { error: error.message || 'Unknown error' }
  }
})
