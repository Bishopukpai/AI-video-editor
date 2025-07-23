"use client"
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import React, { useEffect } from 'react'


import { useRouter } from 'next/navigation'
import AppSidebar from './_components/AppSidebar'

const DashboardProvider: React.FC<{ children: React.ReactNode }> =({ children }) =>{
  return (
    <SidebarProvider>
        <AppSidebar />
        <div className='w-full'>
             <SidebarTrigger />
            <div className='p-10'>
                {children}
            </div>
        </div>
    </SidebarProvider>
  )
}

export default DashboardProvider