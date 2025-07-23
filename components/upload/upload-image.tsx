"use client"

import { uploadImage } from '@/server/upload-image'
import React from 'react'
import {useDropzone} from 'react-dropzone'
import { Card, CardContent } from '../ui/card'
import { cn } from '@/lib/utils'
import { Button } from '../ui/button'
import { Image } from 'lucide-react'
import { useImageStore } from '@/lib/image-store'
import { useLayerStore } from '@/lib/layer-store'

//install this later at night, remember to get the lottie.json file from his github
// import Lottie from 'lottie-react'
// import loadingAnimation from '@/public/animations/image-upload.json'

const UploadImage = () => {
    const setGenerating = useImageStore((state) => state.setGenerating)
    const activeLayer = useLayerStore((state) => state.activeLayer)
    const updateLayer = useLayerStore((state) => state.updateLayer)
    const setActiveLayer = useLayerStore((state) => state.setActiveLayer)


    const {getRootProps, getInputProps, isDragActive} = useDropzone({
        maxFiles: 1,
        accept: {
            'image/png': ['.png'],
            'image/jpg': ['.jpg'],
            'image/webp': ['.webp'],
            'image/jpeg': ['.jpeg'],
        },
        onDrop: async (acceptFiles, fileRejections) =>{
            if(acceptFiles.length) {
                const formData = new FormData()

                formData.append('image', acceptFiles[0])

                const objectUrl = URL.createObjectURL(acceptFiles[0]);
                setGenerating(true)

                updateLayer({
                    id: activeLayer.id,
                    url: objectUrl,
                    width: 0,
                    height: 0,
                    name: 'uploading',
                    publicId: "",
                    format: "",
                    resourceType: "image",
                })

                setActiveLayer(activeLayer.id)
                //STATE MANAGEMENT STUFF

                //Upload the Image to Cloudinary
                const res = await uploadImage({image: formData})
               if(res?.data?.success){
                    updateLayer({
                        id:activeLayer.id,
                        url: res.data.success.url,
                        width: res.data.success.width,
                        height: res.data.success.height,
                        name: res.data.success.original_filename,
                        publicId: res.data.success.public_id,
                        format: res.data.success.format,
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
                <p className='text-muted-foreground text-2xl'>{isDragActive ? "Drag and drop Your Image here": "Start by uploading an image (less than or equal to 1MB)"}</p>
                <p className='text-muted-foreground'>Supported format. jpeg, jpg, png, webp</p>
            <Button><Image/> Image</Button>
            </div>
        </CardContent>
    </Card>
  )
}

export default UploadImage