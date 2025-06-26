"use client";
import Image from "next/image";
import { Switch } from "@/components/ui/switch";
import sceneLogo from "@/app/assets/login-assets/sceneLogo.svg"
import { useEffect, useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter
  } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import sceneMainLogo from "@/app/assets/login-assets/sceneMainLogo.svg"
import { apiPost } from "@/lib/api/base";
import { toast } from "sonner";
export default function SceneHeader ({dialogOpen, setDialogOpen}: {dialogOpen? :any, setDialogOpen? :any}) {
    const [value, setValue] = useState("");
    const [error, setError] = useState(false)
    const [open, setOpen] = useState(false)
    useEffect(()=>{
        if(dialogOpen !== open){
            setOpen(dialogOpen)
        }
    },[dialogOpen])
    useEffect(()=>{
        if(setDialogOpen){
            if(open){
                setDialogOpen(true)
            }else{
                setDialogOpen(false)
            }
        }
    },[open])
    const handleShare = () =>{
        if(value.length <= 30){
            apiPost.post('/user/status_text/', {
                status_text: value
            })
            .then((res:any)=>{
                toast.success("status updated")
                setOpen(false)
            })
            .catch((e:any)=>{
                toast.error("failed to update, please try again.")
            })
        }
    };
    useEffect(()=>{
        if(value.length >30){
            setError(true)
        }else{
            setError(false)
        }
    },[value])
    const [isReady, setIsReady] = useState(true)
    return (
        <Dialog open={open} onOpenChange={()=>{setOpen((prev)=>(!prev))}}>
            <DialogTrigger asChild>
                <div className="flex content-center justify-start my-4">
                    {/* <Link href={'/'}> */}
                        <Image src={sceneLogo} alt="logo" width={53} height={53} />
                    {/* </Link> */}
                    <Switch className="data-[state=checked]:bg-[#4BC761] ml-2 "
                    checked={isReady}
                    />
                </div>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[300px] rounded-2xl">
                <DialogHeader className="w-full">
                    <DialogTitle>
                        <div className="w-full flex justify-center">
                            <Image src={sceneMainLogo} 
                            alt="sceneLogo"
                            />
                        </div>
                    </DialogTitle>
                    <DialogDescription className="text-[#000000] text-xl font-semibold">
                        up for a scene now?
                    </DialogDescription>
                </DialogHeader>
                <div className="flex items-center justify-center gap-4 w-full rounded-md px-3">
            <span className="font-medium">nah</span>
            <Button
                onClick={() => setIsReady(!isReady)}
                className={`focus:ring-0 focus:outline-none 
                relative flex items-center w-[60px] h-[32px] 
                rounded-full p-1 transition-all duration-300 
                ${isReady ? "active:bg-[#4BC761] bg-[#4BC761] hover:bg-[#4BC761]" : "active:bg-gray-400 bg-gray-400 hover:bg-gray-400"}`}
                >
                <span
                    className={`absolute left-1 bg-white h-6 w-6 rounded-full shadow-md 
                    transition-all duration-300 transform 
                    ${isReady ? "translate-x-[28px]" : "translate-x-0"}`}
                />
                </Button>
            <span className="font-medium">let's go</span>
          </div>
          <div>
            <Input
            value={value}
            onChange={(e)=>{
                setValue(e.target.value)
            }}
            className="bg-[#F5F5F5] py-6 px-4 border-0 focus:outline-none focus:ring-0"
            placeholder="up for any specific scene?"
            ></Input>
            {error && 
            <div className="text-red-500 text-xs mt-1">max. 30 characters</div>
            }
          </div>
          <div>
            <Button
            disabled={error}
            className="w-full py-6 px-4 bg-[#4E55E1] rounded-xl border-0 mt-1 text-base font-medium
            shadow-none focus:ring-0 focus:outline-none active:bg-[#4E55E1] hover:bg-[#4E55E1]
            "
            onClick={handleShare}
            >
                share
            </Button>
          </div>
            </DialogContent>
        </Dialog>
    );
}