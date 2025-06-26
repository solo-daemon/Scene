"use client";
import { Input } from "@/components/ui/input";
import sceneMainLogo from "@/app/assets/login-assets/sceneMainLogo.svg"
import {
    Avatar,
    AvatarImage
} from "@/components/ui/avatar"
import sceneBlackTextLogo from "@/app/assets/login-assets/sceneBlackTextLogo.svg"
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"
import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogClose,
    DialogHeader
} from "@/components/ui/dialog"
import { DialogTrigger } from "@radix-ui/react-dialog";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
    Heart,
    X,
} from "lucide-react";
import { Textarea } from "../ui/textarea";
import promCoupleHeading from "@/app/assets/prom-assets/promCoupleHeading.webp";
import promCoupleIcon from "@/app/assets/prom-assets/promCoupleIcon.webp";
import { toast } from "sonner";
import { apiGet, apiPost } from "@/lib/api/base";

export default function PromHeader({dialogProfileOpen, setDialogProfileOpen}: {dialogProfileOpen? :any, setDialogProfileOpen? :any}){
    const [isOpen, setIsOpen] = useState<boolean>(true)
    const [statusText, setStatusText] = useState<string>("")
    const [dialogOpen, setDialogOpen] = useState(false);
    const [identity, setSelectedIdentity] = useState("MEN")
    const handleDialogClose = () => {
        setDialogOpen(false);
    };
    const handleToggleChange=()=>{
        setIsOpen((prev:boolean)=>!prev)
    }
    useEffect(()=>{
        if(dialogProfileOpen !== dialogOpen){
            setDialogOpen(dialogProfileOpen)
        }
    },[dialogProfileOpen])
    useEffect(()=>{
        if(setDialogProfileOpen){
            if(dialogOpen){
                setDialogProfileOpen(true)
            }else{
                setDialogProfileOpen(false)
            }
        }
    },[dialogOpen])
    useEffect(()=>{
        const token = localStorage.getItem('token')
        if (token){
            if('caches' in window){
            caches.open(process.env.NEXT_PUBLIC_SERWIST_API_CACHE || "apis").then(cache => {
                cache.keys().then(requests => {
                  const match = requests.find(req => req.url.includes('/api/user/user_status/'));
                  if (match) {
                    cache.match(match).then(response => {
                      if (response) {
                        response.clone().json().then(data => {
                          setIsOpen(data.status);
                          setStatusText(data.status_text);
                          setSelectedIdentity(data.gender_preference);
                        });
                      }
                    });
                  }
                });
              });
            }
            apiGet.get("/user/user_status/")
            .then((res:any)=>{
                setIsOpen(res.data.status)
                setStatusText(res.data.status_text)
                setSelectedIdentity(res.data.gender_preference)
            })
            .catch((e:any)=>{
                toast.error("please refresh!")
            })
        }
    },[])

    const handleIdentityChange = (identityType: string) =>{
        setSelectedIdentity(identityType)
    }
    const handleShare = () =>{
            apiPost.post('/user/status_text/', {
                status_text: statusText,
                status_user: isOpen,
                gender_preference: identity,
            })
            .then((res:any)=>{
                setDialogOpen(false)
                toast.success("status updated")
            })
            .catch((e:any)=>{
                toast.error("failed to update, please try again.")
            })
    };
    return (
        <div className="w-full h-full flex items-center gap-1">
            <ScenePromToggleDialog isOpen={isOpen} handleToggleChange={handleToggleChange} 
            statusText={statusText} setStatusText={setStatusText} handleShare={handleShare}
            dialogOpen={dialogOpen} handleDialogClose={handleDialogClose}
            identity={identity} handleIdentityChange={handleIdentityChange}
            >
            <div className="flex items-center gap-1"
            onClick={()=>{
                setDialogOpen(true)
            }}
            >
            <Avatar className="rounded-none w-16 h-4">
                <AvatarImage src={sceneBlackTextLogo.src} className="rounded-none w-full h-full object-fit"/>
            </Avatar>
            <ScenePromToggle isOpen={isOpen} />
            </div>
            </ScenePromToggleDialog>
            {/* <ScenePromFirstDialog isOpen={isOpen} handleToggleChange={handleToggleChange} handleShare={handleShare}/> */}
        </div>
    )
}

function ScenePromToggle({isOpen}: {isOpen: boolean}){
    return(
        <Button className={"rounded-full w-9 h-5 flex-none justify-start px-1 py-1 transition-all duration-300 transform " 
        + (isOpen ? "active:bg-[#4BC761] bg-[#4BC761] hover:bg-[#4BC761]": "active:bg-gray-400 bg-gray-400 hover:bg-gray-400")}
        >
            <span>
                <div className={"w-3 h-3 rounded-full min-h-0 min-w-0 duration-300 transform transition-all "
            + (isOpen ? "translate-x-4 bg-[#ffffff]": "translate-x-0 bg-[#ffffff]")
            } 
            ></div>
            </span>
        </Button>
    );
}

type ScenePromToggleDialogProps = {
    children: React.ReactNode;
    isOpen: boolean;
    handleToggleChange: () => void;
    statusText: any;
    setStatusText: (text: any) => void;
    handleShare: ()=>void,
    dialogOpen: boolean,
    handleDialogClose: ()=> void,
    identity: string,
    handleIdentityChange: (identityType: string) => void,
};

function ScenePromToggleDialog(props: ScenePromToggleDialogProps) {
    const { children, isOpen, handleToggleChange, statusText, setStatusText, handleShare, dialogOpen, handleDialogClose, identity, handleIdentityChange } = props;
    const [error, setError] = useState(false)
    return (
        <Dialog open={dialogOpen} onOpenChange={(open)=>{
            if (!open) {
                // when user clicks outside or close button
                handleDialogClose();
            }
        }}>
            <DialogTrigger asChild>
                <div className="relative">
                    {children}
                </div>
            </DialogTrigger>
            <DialogContent className="bg-transparent border-0 px-4 [&_[data-dialog-close]]:hidden font-[Graphik Trial]">
                <VisuallyHidden>
                    <DialogTitle>Scene Prom Toggle Dialog</DialogTitle>
                </VisuallyHidden>
                <div className="bg-white flex flex-col gap-4 rounded-xl py-8 relative">
                    <DialogClose asChild className="focus-visible:ring-0 focus-visible:outline-0">
                        <button className="absolute top-4 right-4 text-[#75561A] hover:text-[#75561A]">
                            <X className="w-5 h-5 fill-[#000000]" color="#000000" />
                        </button>
                    </DialogClose>

                    <div className="flex justify-center">
                        <Avatar className="rounded-none w-20 h-20">
                            <AvatarImage src={sceneMainLogo.src} className="w-20 h-20" />
                        </Avatar>
                    </div>

                    <div className="text-xl font-semibold text-center">
                        <div>up for a scene now?</div>
                    </div>

                    <div className="flex gap-3 justify-center items-center">
                        <div>nah</div>
                        <Button 
                            className={"rounded-full focus-visible:ring-0 w-13 h-7 flex-none justify-start px-1 transition-all duration-300 transform " 
                                + (isOpen ? "active:bg-[#4BC761] bg-[#4BC761] hover:bg-[#4BC761]": "active:bg-gray-400 bg-gray-400 hover:bg-gray-400")}
                            onClick={handleToggleChange}
                        >
                            <span className={"duration-300 transform transition-all " + (isOpen ? "translate-x-6" : "translate-x-1")}>
                                <div
                                    className={(isOpen ? "bg-[#ffffff]" : "bg-[#ffffff]") + " w-4 h-4 rounded-full"}
                                    
                                />
                            </span>
                        </Button>
                        <div>let's go</div>
                    </div>
                    {/* <div className="px-4 grid grid-cols-3 gap-2">
                        <div className={"pb-2 pt-3 col-span1 flex flex-col justify-center items-center rounded-xl "
                     + (identity === "MEN" ? "border-1 border-[#4E55E1] bg-[#F1F1FD] text-[#4E55E1]":"border-1 border-[#E2E2E2] bg-[#F5F5F5] text-black")   
                    }
                    onClick={()=>handleIdentityChange("MEN")}
                        >
                            <Mars />
                            <span className="text-sm">men</span>
                        </div>
                        <div className={"pb-2 pt-3 col-span1 flex flex-col justify-center items-center rounded-xl "
                     + (identity === "WOMEN" ? "border-1 border-[#4E55E1] bg-[#F1F1FD] text-[#4E55E1]":"border-1 border-[#E2E2E2] bg-[#F5F5F5] text-black")   
                    }
                    onClick={()=>handleIdentityChange("WOMEN")}
                        >
                            <Venus />
                            <span className="text-sm">women</span>
                        </div>
                        <div className={"pb-2 pt-3 col-span1 flex flex-col justify-center items-center rounded-xl "
                     + (identity === "BOTH" ? "border-1 border-[#4E55E1] bg-[#F1F1FD] text-[#4E55E1]":"border-1 border-[#E2E2E2] bg-[#F5F5F5] text-black")   
                    }
                    onClick={()=>handleIdentityChange("BOTH")}
                        >
                            <NonBinary />
                            <span className="text-sm">both</span>
                        </div>
                    </div> */}
                    <div className="px-4">
                        <Textarea
                            className="border-0 bg-[#F5F5F5] focus-visible:ring-0 placeholder-[#AAAAAA] text-sm py-2 h-2"
                            placeholder="up for any specific scene?"
                            value={statusText}
                            onChange={(e)=>{
                                    if(e.target.value.length >30){
                                        setError(true)
                                    }
                                    else{
                                        setError(false)
                                        setStatusText(e.target.value)
                                    }
                            }}
                        />
                        {error && 
            <div className="text-red-500 text-xs mt-1">max. 30 characters</div>
            }
                    </div>

                    <div className="px-4">
                        <Button className="rounded-lg bg-[#4E55E1] hover:bg-[#4E55E1] active:bg-[#4E55E1] border-0 w-full py-6 font-medium text-base"
                        onClick={()=>{
                            handleShare()
                        }}
                        disabled={error}
                        >
                            share
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}


function ScenePromFirstDialog({isOpen, handleToggleChange, handleShare}: {isOpen: boolean, handleToggleChange: ()=> void , handleShare: ()=> void}){
    const [openDialog, setOpenDialog] = useState<boolean>(false)
    useEffect(()=>{
        const firstDialog = localStorage.getItem("firstDialog")
        const token = localStorage.getItem("token")
        if(token){
            if(!firstDialog){
                setOpenDialog(true)
            }
            localStorage.setItem("firstDialog","true")
        }
    }, [])

    return(
        <Dialog open={openDialog} onOpenChange={()=>{handleShare(); setOpenDialog(false)}}>
            <DialogContent className="p-0 bg-transparent border-0 [&_[data-dialog-close]]:hidden font-[Graphik Trial] focus-visible:outline-0 font-[Gothic A1]">
                <VisuallyHidden>
                    <DialogTitle>Scene Prom Toggle Dialog</DialogTitle>
                </VisuallyHidden>
                <div className="bg-white py-3 px-2 rounded-lg border-1 border-[#FF3A3A]/20">
                    <div className="bg-[linear-gradient(321deg,_#E30000_0%,_#4C0000_136.81%)] px-4 py-4 relative rounded-md">
                    <DialogClose
                    className="focus-visible:ring-0 focus-visible:outline-0 absolute top-4 right-4 text-[#75561A] hover:text-[#75561A] z-10"
                    >
                            <X className="w-5 h-5 fill-[#ffffff]" color="#ffffff"/>
                    </DialogClose>
                    <div className="relative">
                        <Avatar className="rounded-none w-50 h-40">
                            <AvatarImage src={promCoupleHeading.src} className="w-full h-full"/>
                        </Avatar>
                        <span className="absolute bottom-0 right-4 text-white text-sm">more than a prom night</span>
                    </div>
                    <div className="h-40 flex flex-col justify-end gap-4">
                        <div className="bg-white py-1 px-2 mt-4 rounded-lg flex items-center gap-2 w-46 justify-between">
                            <span className="text-xs">don't have a partner?</span>
                            <Button className={"rounded-full w-9 h-5 flex-none justify-start px-1 py-1 transition-all duration-300 transform " 
                            + (isOpen ? "bg-[#FF2424] hover:bg-[#FF2424]": "bg-[#000000] hover:bg-[#000000]")}
                            onClick={handleToggleChange}
                            >
                                <span>
                                    <Heart className={"w-1 h-1 min-h-0 min-w-0 duration-300 transform transition-all "
                                + (isOpen ? "translate-x-3 fill-[#ffffff]": "translate-x-0 fill-[#FF2424]")
                                } 
                                color={isOpen ? "#ffffff":"#FF2424"}
                                strokeWidth={1}
                                width={1}
                                height={1}
                                size={1}/>
                                </span>
                            </Button>
                        </div>
                        <div className="h-[0.5px] bg-white w-30 rounded-full"></div>
                        <span className="text-white text-sm">01/05/2025 | kuhoo restro</span>
                    </div>
                    <span className="absolute bottom-2 right-0">
                        <Avatar className="rounded-none w-30 h-30">
                            <AvatarImage src={promCoupleIcon.src} className="w-full h-full"/>
                        </Avatar>
                    </span>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

