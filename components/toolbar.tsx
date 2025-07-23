import { useLayerStore } from '@/lib/layer-store'
import React from 'react'
import ImageTools from './toolbar/image-toolbar'
import VideoTools from './toolbar/video-toolbar'

const Toolbar = () => {
    const activeLayer = useLayerStore((state) => state.activeLayer)
  return (
    <div>
         <div className="flex flex-col gap-4">
            {activeLayer.resourceType === "image" ? <ImageTools/> : null}
            {activeLayer.resourceType === "video" ? <VideoTools/> : null}
        </div>
    </div>
  )
}

export default Toolbar