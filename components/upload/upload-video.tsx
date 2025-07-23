"use client"

import { uploadImage } from '@/server/upload-image'
import React from 'react'
import {useDropzone} from 'react-dropzone'
import { Card, CardContent } from '../ui/card'
import { cn } from '@/lib/utils'
import { Button } from '../ui/button'
import { Image, Video } from 'lucide-react'
import { useImageStore } from '@/lib/image-store'
import { useLayerStore } from '@/lib/layer-store'
import { uploadVideo } from '@/server/upload-video'

//install this later at night, remember to get the lottie.json file from his github
// import Lottie from 'lottie-react'
// import loadingAnimation from '@/public/animations/video-upload.json'

const UploadVideo = () => {
    const setGenerating = useImageStore((state) => state.setGenerating)
    const activeLayer = useLayerStore((state) => state.activeLayer)
    const updateLayer = useLayerStore((state) => state.updateLayer)
    const setActiveLayer = useLayerStore((state) => state.setActiveLayer)


    const {getRootProps, getInputProps, isDragActive} = useDropzone({
        maxFiles: 1,
        accept: {
            'video/mp4': ['.mp4', '.MP4']  
        },
        onDrop: async (acceptFiles, fileRejections) =>{
            if(acceptFiles.length) {
                const formData = new FormData()

                formData.append('video', acceptFiles[0])
                setGenerating(true)

               

                setActiveLayer(activeLayer.id)
                //STATE MANAGEMENT STUFF

                //Upload the Image to Cloudinary
                const res = await uploadVideo({video: formData})
               if(res?.data?.success){
                    const videoUrl = res.data.success.url
                    const thumbnail = videoUrl.replace(/\.[^/.]+$/, ".jpg")
                    updateLayer({
                        id:activeLayer.id,
                        url: res.data.success.url,
                        width: res.data.success.width,
                        height: res.data.success.height,
                        name: res.data.success.original_filename,
                        publicId: res.data.success.public_id,
                        format: res.data.success.format,
                        poster: thumbnail,
                        resourceType: res.data.success.resource_type
                    })
                    setActiveLayer(activeLayer.id)
                    setGenerating(false)
               }
               if(res?.data?.error){
                    setGenerating(false)
               }
            }
        }
    })

    if(!activeLayer.url)
  return (
    <Card className={cn('hover:cursor-pointer hover:bg-secondary transition-all ease-in-out', `${isDragActive ? "animate-pulse border-primary bg-secondary": ""}`)} {...getRootProps()}>
        <CardContent className='flex flex-col h-full items-center justify-center px-2 py-24 text-xs'>
            <input {...getInputProps()} type='text' />
            <div className='flex items-center flex-col justify-center gap-2'>
                {/* <Lottie className="h-48" animationData={loadingAnimation}/> */}
                <p className='text-muted-foreground text-2xl'>{isDragActive ? "Drop Your Video here": "Start by uploading a video"}</p>
                <p className='text-muted-foreground'>Supported format. MP4, </p>
            <Button><Video/>Video</Button>
            </div>
        </CardContent>
    </Card>
  )
}

export default UploadVideo