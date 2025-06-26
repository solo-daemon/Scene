"use client";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { DialogTitle } from "@radix-ui/react-dialog";
import { useState, useEffect } from "react";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"
import Image from "next/image";
import googleIcon from "@/app/assets/login-assets/googleIcon.svg"
import {Button} from "@/components/ui/button"
import { baseURL } from "@/lib/api/base";
import Link from "next/link";
import { isInAppBrowser } from "@/app/utils/isInAppBrowser";
import instagramScreen from "@/app/assets/login-assets/instagramScreen.webp";
export default function FullscreenDialogWrapper({ children }: { children: React.ReactNode }) {
    const [open, setOpen] = useState(true);
    const handleLoginStatus=()=>{
        window.location.href = `${window.location.origin}/login`;
    }
    // useEffect(()=>{
    //     if(isInAppBrowser()){
    //         window.open('https://scene.net.in/', '_blank'); 
    //     }
    // },[])
    return (
        <>
        <Dialog open={open} onOpenChange={setOpen}>
            {/* Just render the page normally */}
            <div className="relative">
            {children}
            <div className="fixed inset-0 z-50 bg-transparent bg-opacity-20 pointer-events-auto cursor-not-allowed" onClick={()=>{setOpen(true)}}/>
            </div>
            {/* Dialog content that shows after first touch */}
            {isInAppBrowser() ?
                    <DialogContent className="p-0 bg-transparent border-0 w-full h-screen flex pt-16">
                        <VisuallyHidden>
                            <DialogTitle>Download story template</DialogTitle>
                        </VisuallyHidden>
                        <div className="w-full overflow-hidden pb-">
                            <img className="w-full object-fit" src={instagramScreen.src}/>
                        </div>
                    </DialogContent>
:
            <DialogContent>

                <DialogTitle>
                <div className="w-full flex justify-center">
                        <h2 className="font-semibold">{isInAppBrowser() ? "please open scene in a browser" : "login to continue"}</h2>      
                </div>
                </DialogTitle>
                <Button 
                className="bg-[#ffffff] w-full z-10 text-[#000000] p-6 font-semibold border-2 border-[#E7E7E7]
                shadow-none focus:ring-0 focus:outline-none active:bg-[#ffffff] hover:bg-[#ffffff]
                " 
                
                onClick={handleLoginStatus}>
                        <>
                        <div className="w-6 h-6 items-center">
                        <Image src={googleIcon}
                        alt="google-logo" 
                        objectFit="cover"
                        />
                        </div>
                        <div>continue with iitr email</div>
                         </>
                    </Button>
                    <div className="text-[#AAAAAA] mb-2 text-xs">
                    <Link href="/terms">
                        <div className="text-center">by getting started you agree with</div>
                        <div className="text-center"><span className="underline decoration-[#AAAAAA]">privacy</span> and <span className="underline decoration-[#AAAAAA]">terms</span></div>
                    </Link>
                </div>
            </DialogContent>}
        </Dialog>
        </>
    );
}