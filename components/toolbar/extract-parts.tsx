'use client'

import { useImageStore } from "@/lib/image-store"
import { useLayerStore } from "@/lib/layer-store"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { Button } from "../ui/button"
import { Eraser, Image, ImageOff, MagnetIcon, Scissors } from "lucide-react"
import { Label } from "../ui/label"
import { Input } from "../ui/input"
import { useState } from "react"
import { bgRemoval } from "@/server/bg-remove"
import { bgReplace } from "@/server/bg-replace"
import { Checkbox } from "../ui/checkbox"
import { RadioGroup, RadioGroupItem } from "../ui/radio-group"
import { extractPart } from "@/server/extract-parts"


export default function ExtractPart(){
    const setGenerating = useImageStore((state) => state.setGenerating)
    const generating = useImageStore((state) => state.generating)
    const activeLayer = useLayerStore((state) => state.activeLayer)
    const addLayer = useLayerStore((state) => state.addLayer)
    const setActiveLayer = useLayerStore((state) => state.setActiveLayer)

    const [prompts, setPrompts] = useState([""])
    const [multiple, setMultiple] = useState(false)
    const [mode, setMode] = useState("default")
    const [invert, setInvert] = useState(false)

    const addPrompt = () => {
        setPrompts([...prompts, ""])
    }

    const updatePrompt = (index: number, value: string) => {
        const newPrompts = [...prompts]
        newPrompts[index] = value
        setPrompts(newPrompts)
    }
    return (
        <Popover>
            <PopoverTrigger disabled={!activeLayer?.url} asChild>
                <Button variant="outline" className="p-8">
                    <span className="flex gap-1 items-center justify-center flex-col text-xs font-medium">
                        AI Image Extractor<Scissors size={20}/>
                    </span>
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full">
                <div>
                    <h3>Smart AI Image Extractor</h3>
                    <p className="text-sm text-muted-foreground">Instantly extract specific areas from images with one click</p>
                </div>
                <div className="grid gap-2 ">
                   {prompts.map((prompt, index) => (
                        <div key={index}>
                            <Label htmlFor={`prompt-${index}`}>Prompt {index + 1}</Label>
                            <Input id={`prompt-${index}`}value={prompt} onChange={(e) => updatePrompt(index, e.target.value)} placeholder="Ask for an extraction" className="col-span-2 h-8"/>
                        </div>
                   ))}
                   <Button onClick={addPrompt} size="sm">
                        Add Prompt
                    </Button>
                    <div className="flex items-center space-x-2">
                        <Checkbox id="multiple" checked={multiple} onCheckedChange={(checked) => setMultiple(checked as boolean)}/>
                        <Label htmlFor="multiple">Extract multiple objects</Label>
                    </div>
                    <RadioGroup value={mode} onValueChange={setMode}>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="default" id="mode-default"/>
                            <Label htmlFor="mode-default">Default (tramsparent background)</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="mask" id="mode-mask" />
                            <Label htmlFor="mode-mask">Mask</Label>
                        </div>
                    </RadioGroup>
                    <div className="flex items-center space-x-2"> 
                        <Checkbox id="invert" checked={invert} onCheckedChange={(checked) => setInvert(checked as boolean)}/>
                        <Label htmlFor="invert">Invert (Keep background)</Label>
                    </div>
                </div>
                <Button disabled={!activeLayer?.url || generating} onClick={async() => {
                    const newLayerId = crypto.randomUUID();

                    setGenerating(true)

                    const res = await extractPart({
                        prompts: prompts.filter((p) => p.trim() !== ""),
                        format: activeLayer.format!,
                        multiple,
                        mode: mode as 'default' | 'mask',
                        invert,
                        activeImage: activeLayer.url!
                    })

                    if(res?.data?.success) {
                        addLayer({
                            id: newLayerId,
                            url: res.data.url,
                            format: '.png',
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
                }} className="w-full mt-4">{generating ? "Extracting..." : "Extract"}</Button>
            </PopoverContent>
        </Popover>
    )
}