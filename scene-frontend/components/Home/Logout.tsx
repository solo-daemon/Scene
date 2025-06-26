"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import Image from "next/image";
import logOutLogo from "@/app/assets/login-assets/logoutLogo.svg"; // Replace with correct path
import { LogOut as LogoutIcon, X } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
export default function Logout() {
    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter();
    // Function to handle logout
    const handleLogout = () => {
        // toast.error("server is not responding")
        localStorage.removeItem("token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("userId");
        router.replace("/login")
        setIsOpen(false); // Close dialog after logging out

    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
            <Button 
                className="border-0 p-0 bg-transparent shadow-none focus:ring-0 focus:outline-none active:bg-transparent hover:bg-transparent"
                onClick={() => setIsOpen(true)}
            >
                <LogoutIcon color="#000000" />
            </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[300px] rounded-2xl">
                <DialogTitle className="w-full flex flex-col items-center relative">
                <DialogClose
                    className="focus-visible:ring-0 focus-visible:outline-0 absolute -top-1 right-0 text-[#75561A] hover:text-[#75561A] z-10"
                    >
                            <X className="w-5 h-5 fill-[#000000]" color="#000000"/>
                    </DialogClose>
                    <Image src={logOutLogo} alt="logo" width={53} height={53} />
                    <div className="text-center font-semibold text-xl mt-1">are you sure?</div>
                    <div className="text-center font-normal text-sm text-[#AAAAAA]">we will miss you !</div>
                </DialogTitle> 
                <div className="grid grid-cols-2 justify-center gap-2 mt-4 font-semibold">
                    {/* <div className="col-span-1"></div> */}
                    <Button
                        className="bg-[#EC0C0C] active:bg-[#EC0C0C] hover:bg-[#EC0C0C]  text-[#ffffff] border-0 col-span-1 py-3"
                        onClick={handleLogout}
                    >
                        logout
                    </Button>
                    <Button
                        className="bg-[#F1F1FD] active:bg-[#F1F1FD] hover:bg-[#F1F1FD] text-[#4E55E1] border-0 col-span-1 py-3"
                        onClick={() => setIsOpen(false)} // Close on "No"
                    >
                        no
                    </Button>
                    {/* <div className="col-span-1"></div> */}
                </div>
            </DialogContent>
        </Dialog>
    );
}