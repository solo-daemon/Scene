"use client";
import NavBar from "@/components/NavBar";
import { Button } from "@/components/ui/button";
import { CornerUpLeft } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import Link from "next/link";
import { apiGet } from "@/lib/api/base";
import { useEffect, useState } from "react";
import Avvvatars from "avvvatars-react";
import { getInitials } from "@/lib/utils";
export default function JoinInvitesScreen(){
    const [inviteData, setInviteData] = useState([])
    useEffect(()=>{
        apiGet.get('/user/join_requests/')
        .then((res:any)=>{
            setInviteData(res.data)
        })
        .catch((error:any)=>{
        })
    },[])
    return(
        <div className="m-4 mb-[100px]">
             {/* Join Requests */}
            <div className="flex  justify-center items-center relative mt-8">
                <div
                className="font-semibold text-lg flex items-center"
                style={{
                    fontFamily: "Spline Sans, sans-serif",
                }}
                >join requests</div>
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
                        <JoinInvites invite={invite} key={index}/>
                    )
                })}
            </div>
            <NavBar window="Activity"/>
        </div>
    );
}

function JoinInvites(props: {invite: any}){

    const handleAccept = () =>{
        const url = "/scenes/"+props.invite.scene_id+"/accept_invitation/"
        apiGet.get(url)
        .then((res:any)=>{

        })
        .catch((error:any)=>{
        })
    }
    const handleDeny = () =>{
        const url = "/scenes/"+props.invite.scene_id+"/deny_invitation/"
        apiGet.get(url)
        .then((res:any)=>{

        })
        .catch((error:any)=>{
        })
    }
    return(
            <div className=" rounded-xl p-2 bg-[#EAEBFF33] border-0 font-[Graphik Trial] my-4">
                {/* photo */}
                <Link href={'/scene/'+props.invite.scene_id}>
                <div className="flex">
                    <div className="rounded-xl justify-self-center self-center">
                        <Avatar  className="rounded-xl border-2 border-[#11D03B4D] w-12 h-12 ">
                        <Avvvatars value={props.invite.user_organizer.name+props.invite.user_organizer.id} size={48} displayValue={getInitials(props.invite.user_organizer.name)} style="character" radius={10}/>
                        </Avatar>
                    </div>
                    <div className="ml-2">
                        <div
                        className="font-semibold text-base"
                        >{props.invite.user_organizer.name.split(" ")[0].toLowerCase()}</div>
                        <div
                        className="text-sm text-[#777777]"
                        >“{props.invite.scene_name}”</div>
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