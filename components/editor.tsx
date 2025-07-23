'use client'


import SidebarLayout from "@/app/(main)/layout"
import ActiveImage from "./Active-image"
import Layers from "./layers/layers"

import Loading from "./loading-screen"

import UploadForm from "./upload/upload-form"
import Toolbar from "./toolbar"



export default function Editor(){
    return(
        <div className="flex"> 
            {/* <Loading /> */}
            <SidebarLayout children/>
            {/* <Toolbar /> */}
            <UploadForm />
            <ActiveImage />
            <Layers />
        </div>
    )
}
