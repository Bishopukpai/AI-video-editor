'use client'

import { useImageStore } from "@/lib/image-store"
import { useLayerStore } from "@/lib/layer-store"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog"
//install this later at night, remember to get the lottie.json file from his github
// import Lottie from 'lottie-react'
// import loadingAnimation from '@/public/animations/loading.json'

export default function Loading() {
    const generating = useImageStore((state) => state.generating)
    const setGenerating = useImageStore((state) => state.setGenerating)
    const activeLayer = useLayerStore((state) => state.activeLayer)

    return (
        <Dialog open={generating} onOpenChange={setGenerating}>
            <DialogContent className="sm:max-w-[420px] flex flex-col items-center">
                <DialogHeader>
                    <DialogTitle>Editing {activeLayer.name}</DialogTitle>
                    <DialogDescription>Please wait will your editing is being processed</DialogDescription>
                </DialogHeader>
                {/* <Lottie className="w-36" animationData={loadingAnimation} /> */}
            </DialogContent>
        </Dialog>
    )
}