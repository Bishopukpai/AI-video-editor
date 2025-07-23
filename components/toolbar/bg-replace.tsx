'use client'

import { useImageStore } from "@/lib/image-store"
import { useLayerStore } from "@/lib/layer-store"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { Button } from "../ui/button"
import { Eraser, Image, ImageOff, MagnetIcon } from "lucide-react"
import { Label } from "../ui/label"
import { Input } from "../ui/input"
import { useState } from "react"
import { bgRemoval } from "@/server/bg-remove"
import { bgReplace } from "@/server/bg-replace"


export default function BackgroundReplace(){
    const setGenerating = useImageStore((state) => state.setGenerating)
    const generating = useImageStore((state) => state.generating)
    const activeLayer = useLayerStore((state) => state.activeLayer)
    const addLayer = useLayerStore((state) => state.addLayer)
    const setActiveLayer = useLayerStore((state) => state.setActiveLayer)

    const [prompt, setPrompt] = useState("")

    return (
        <Popover>
            <PopoverTrigger disabled={!activeLayer?.url} asChild>
                <Button variant="outline" className="p-8">
                    <span className="flex gap-1 items-center justify-center flex-col text-xs font-medium">
                        Background Replace<ImageOff size={20}/>
                    </span>
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full">
                <div>
                    <h3>Smart AI Background replacer</h3>
                    <p className="text-sm text-muted-foreground">Instantly remove image backrounds and replace them with anothoer one with one click</p>
                </div>
                <div className="grid gap-2 ">
                   <Label htmlFor="prompt">Prompts</Label>
                   <Input id="prompt" value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="Ask for a new backround"/>
                </div>
                <Button disabled={!activeLayer?.url || generating} onClick={async() => {
                    const newLayerId = crypto.randomUUID();

                    setGenerating(true)

                    const res = await bgReplace({
                        prompt: prompt,
                        activeImage: activeLayer.url!
                    })

                    if(res?.data?.success) {
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
                        setGenerating(false)
                    }
                    if(res?.serverError){
                        setGenerating(false)
                    }
                    console.log(res)
                }} className="w-full mt-4">{generating ? "Replacing background..." : "Replace Background"}</Button>
            </PopoverContent>
        </Popover>
    )
}