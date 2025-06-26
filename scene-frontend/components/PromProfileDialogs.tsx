"use client";
import {
    Dialog,
    DialogContent,
    DialogTrigger,
    DialogTitle,
    DialogClose
} from "@/components/ui/dialog"

import {
    VisuallyHidden,
} from "@radix-ui/react-visually-hidden"
import {
    X,
    ChevronDown,
} from 'lucide-react';
import {
    Button
} from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import Link from "next/link";
export function CompleteProfileDialog({openDialog} : {openDialog: boolean}){
    return(
        <Dialog open={openDialog}>
            <DialogContent className="bg-transparent border-0 px-6 font-[Gothic A1]">
            <VisuallyHidden>
                <DialogTitle>complete your profile please!</DialogTitle>
            </VisuallyHidden>
            <div className="bg-[#FF2424] border-2 border-[#FFFFFF]/50 rounded-xl overflow-hidden relative p-4 flex flex-col gap-4">
                <DialogClose className="absolute top-4 right-4 focus-visible:outline-0">
                    <X color="#ffffff"/>
                </DialogClose>
                <div className="font-bold text-4xl text-white">56 %</div>
                <div>
                <Progress
                        value={56}
                        className="w-full h-4 self-center"
                        indicatorColor="bg-[#39F26D]
                        [background-image:linear-gradient(135deg,rgba(255,255,255,.35)_25%,transparent_25%,transparent_50%,rgba(255,255,255,.35)_50%,rgba(255,255,255,.35)_75%,transparent_75%,transparent)] bg-[length:20px_20px]
                        
                    " />
                </div>
                <div className="font-[Parisienne] text-white text-3xl font-semibold">
                    complete your profile
                </div>
                <div className="p-3 bg-[#ffffff]/24 flex text-white rounded-lg text-sm border-1 border-[#ffffff]/10">
                    add your socials so that potential prom partners can contact you
                </div>
                <div className="pt-12 w-full">
                    <Link href={'/profile/edit-page/'}>
                    <Button className="w-full py-7 rounded-2xl bg-white active:bg-white hover:bg-white text-black">
                        complete profile now
                    </Button>
                    </Link>
                </div>
            </div>
            </DialogContent>
        </Dialog>
    );
}

export function AddPhoneNumber(){
    return(
        <Dialog open={false} >
            <DialogContent className="bg-transparent border-0 px-6 font-[Gothic A1] ">
            <VisuallyHidden>
                <DialogTitle>complete your profile please!</DialogTitle>
            </VisuallyHidden>
            <div className="bg-[#FF2424] border-2 border-[#FFFFFF]/50 rounded-xl overflow-hidden relative p-4 flex flex-col gap-4">
                <DialogClose className="absolute top-4 right-4 focus-visible:outline-0">
                    <X color="#ffffff"/>
                </DialogClose>
                <div className="font-[Parisienne] text-white text-3xl font-semibold">
                    add your number
                </div>
                <div className="p-3 bg-[#ffffff]/24 flex text-white rounded-xl text-sm border-1 border-[#ffffff]/10">
                    so they can get in touch with you
                </div>
                <div className="flex w-full gap-2">
                    <div className="flex gap-0 bg-white px-2 py-3 rounded-lg items-center">
                        <span className="text-sm">+91</span>
                        <span><ChevronDown size={12}/></span>
                    </div>
                    <Input className="text-sm flex gap-0 bg-white px-2 py-6 rounded-lg items-center focus-visible:outline-0 focus-visible:ring-0 border-0"
                    type="number"
                    placeholder="xxxx xxxx "
                    />
                </div>
                <div className="pt-12 w-full">
                    <Button className="w-full py-7 rounded-2xl bg-white active:bg-white hover:bg-white text-black">
                        add number
                    </Button>
                </div>
            </div>
            </DialogContent>
        </Dialog>
    );
}