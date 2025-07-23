"use client"
import React from 'react'
import DashboardProvider from './provider'

const SidebarLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div>
         <DashboardProvider>
            {children}
         </DashboardProvider>
    </div>
  )
}

export default SidebarLayout