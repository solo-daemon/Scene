"use client";
import NavBar from "@/components/NavBar";
import { Button } from "@/components/ui/button";
import { CornerUpLeft } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import Link from "next/link";
import { apiGet } from "@/lib/api/base";
import { useEffect, useState } from "react";
import Avvvatars from "avvvatars-react";
import { toast } from "sonner";
import { CompleteProfileDialog } from "@/components/PromProfileDialogs";
import { getInitials } from "@/lib/utils";
export default function PromInvitesScreen(){
    const [profileCompleteDialog, setProfileCompleteDialog] = useState(false);
    const [inviteData, setInviteData] = useState([])
    useEffect(()=>{
        apiGet.get('/prom-couples/get_requests/')
        .then((res:any)=>{
            setInviteData(res.data)
        })
        .catch((error:any)=>{
        })
    },[])
    return(
        <div className="m-4 mb-[100px]">
            {/* <CompleteProfileDialog openDialog={profileCompleteDialog}/> */}
             {/* Join Requests */}
            <div className="flex  justify-center items-center relative mt-8">
                <div
                className="font-semibold text-lg flex items-center"
                style={{
                    fontFamily: "Spline Sans, sans-serif",
                }}
                >prom requests</div>
                <div className="absolute left-0">
                    <div className="p-2 rounded-full border-[#EDEDED] border-2"
                    onClick={()=> window.history.back()}
                    >
                        <CornerUpLeft color="#000000"
                        size={20}
                        />
                    </div>
                </div>
            </div>
            <div className="mt-8">
                {inviteData.length === 0 && 
                    <div className="h-[200px] flex justify-center items-end">
                        no active invitations
                    </div>
                }
                {inviteData.map((invite, index)=>{
                    return(
                        <PromRequests invite={invite} key={index} setInviteData={setInviteData}/>
                    )
                })}
            </div>
            <NavBar window="Activity"/>
        </div>
    );
}

function PromRequests(props: {invite: any, setInviteData: any}){

    const handleAccept = () =>{
        const url = "/prom-couples/"+props.invite.id+"/prom_accept/"
        apiGet.get(url)
        .then((res: any) => {
            props.setInviteData((prev: any[]) => 
                prev.filter(invite => invite.id !== props.invite.id)
            );
            toast.info(res.data.message.toLowerCase())
        })
        .catch((error:any)=>{
        })
    }
    const handleDeny = () =>{
        const url = "/prom-couples/"+props.invite.id+"/prom_deny/"
        apiGet.get(url)
        .then((res: any) => {
            props.setInviteData((prev: any[]) => 
                prev.filter(invite => invite.id !== props.invite.id)
            );
            toast.info(res.data.message.toLowerCase())
        })
        .catch((error:any)=>{
        })
    }
    return(
            <div className=" rounded-xl p-2 bg-[#EAEBFF33] border-0 font-[Graphik Trial] my-4">
                {/* photo */}
                <Link href={'/profile/'+props.invite.user.id}>
                <div className="flex">
                    <div className="rounded-xl justify-self-center self-center">
                        <Avatar  className="rounded-xl border-2 border-[#11D03B4D] w-12 h-12 ">
                        <Avvvatars value={props.invite.user.name+props.invite.user.id} displayValue={getInitials(props.invite.user.name)} size={48} style="character" radius={10}/>
                        </Avatar>
                    </div>
                    <div className="ml-2">
                        <div
                        className="font-semibold text-base"
                        >{props.invite.user.name.split(" ")[0].toLowerCase()}</div>
                        <div
                        className="text-sm text-[#777777]"
                        >“The scene of us”</div>
                    </div>
                </div>
                </Link>
                <div className="grid grid-cols-2 gap-2 mt-4">
                    <Button className="col-span-1 bg-[#4E55E1] border-1 border-[#E2E2E2] mr-1" onClick={handleAccept}>accept</Button>
                    <Button className="col-span-1 bg-[#F2F2F2] border-1 border-[#E2E2E2] text-[#000000]" onClick={handleDeny}>deny</Button>
                </div>
                </div>
    );
}