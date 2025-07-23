'use client'

import { useImageStore } from "@/lib/image-store"
import { useLayerStore } from "@/lib/layer-store"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { Button } from "../ui/button"
import { Eraser, MagnetIcon } from "lucide-react"
import { Label } from "../ui/label"
import { Input } from "../ui/input"
import { useState } from "react"
import { genRemove } from "@/server/gen-remove"

export default function GenRemove(){
    const setGenerating = useImageStore((state) => state.setGenerating)
    const activeLayer = useLayerStore((state) => state.activeLayer)
    const addLayer = useLayerStore((state) => state.addLayer)
    const setActiveLayer = useLayerStore((state) => state.setActiveLayer)

    const [activeTag, setActiveTag] = useState("")
    return (
        <Popover>
            <PopoverTrigger disabled={!activeLayer?.url} asChild>
                <Button variant="outline" className="p-8">
                     <span className="flex gap-1 items-center justify-center flex-col text-xs font-medium">
                    Remove items <Eraser size={20}/>
                </span>
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full">
                <div>
                    <h3>Smart AI remover</h3>
                    <p className="text-sm text-muted-foreground">Neatly remove any item from the image in seconds</p>
                </div>
                <div className="grid grid-cols-3 items-center gap-4">
                    <Label htmlFor="selection">Select an item</Label>
                    <Input className="col-span-2 h-8" value={activeTag} onChange={(e) => setActiveTag(e.target.value)}/>
                </div>
                <Button onClick={async() => {
                    const newLayerId = crypto.randomUUID();

                    setGenerating(true)

                    const res = await genRemove({
                        prompt: activeTag,
                        activeImage: activeLayer.url!
                    })

                    if(res?.data?.success) {
                        setGenerating(false)
                        addLayer({
                            id: newLayerId,
                            url: res.data.url,
                            format: activeLayer.format,
                            height: activeLayer.height,
                            width: activeLayer.width,
                            name: "modified_" + activeLayer.name,
                            publicId: activeLayer.publicId,
                            resourceType: "image"
                        })
                        setActiveLayer(newLayerId)
                    }
                    console.log(res)
                }} className="w-full mt-4">Remove<MagnetIcon size={8} /></Button>
            </PopoverContent>
        </Popover>
    )
}