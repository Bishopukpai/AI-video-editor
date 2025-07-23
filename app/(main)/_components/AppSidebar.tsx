"use client"
import React from 'react'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { GemIcon, HomeIcon, LucideFileVideo, Search, WalletCards } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ModeToggle } from '@/components/theme/mode-toggle'
import ImageTools from '@/components/toolbar/image-toolbar'
import { useLayerStore } from '@/lib/layer-store'
import VideoTools from '@/components/toolbar/video-toolbar'


const AppSidebar = () => {
    const path = usePathname()
    const activeLayer = useLayerStore((state) => state.activeLayer)
  return (
    <div>
    <Sidebar>
      <SidebarHeader>
        <div>
        <div className='flex items-center gap-3 w-full justify-center mt-5'>
         <Image src={'/Visual.png'} alt='logo' width={40} height={40}/>
         <h2 className='font-bold text-2xl cursor-pointer'>Think Visuals</h2>
        </div>
        <h3 className='text-lg text-gray-500 text-center mt-3'>AI Video Creator & Editor</h3>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
            <SidebarGroupContent>
                <SidebarMenu>
                        <SidebarMenuItem className='mt-5'>
                            <div className="py-6 px-4 basis-[240px] shrink-0">
                                            <div className="pb-12 text-center">
                                                <ModeToggle />
                                            </div>
                                            <div className="flex flex-col gap-4">
                                                {activeLayer.resourceType === "image" ? <ImageTools/> : null}
                                                {activeLayer.resourceType === "video" ? <VideoTools/> : null}
                                            </div>
                                        </div>
                        </SidebarMenuItem>
                    
                </SidebarMenu>
            </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup />
      </SidebarContent>
      <SidebarFooter>
        
      </SidebarFooter>
    </Sidebar>
    </div>
  )
}

export default AppSidebar