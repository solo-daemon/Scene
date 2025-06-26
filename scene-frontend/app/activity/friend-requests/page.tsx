"use client";
import NavBar from "@/components/NavBar";
import { Button } from "@/components/ui/button";
import { CornerUpLeft } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import Link from "next/link";
import { apiGet, apiPost } from "@/lib/api/base";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import Avvvatars from "avvvatars-react";
import { getInitials } from "@/lib/utils";
import { AxiosError, AxiosResponse } from "axios";
export default function FriendRequestsScreen(){
    const [inviteData, setInviteData] = useState([])
    useEffect(()=>{
        apiGet.get('/user/friend_requests/')
        .then((res:AxiosResponse<any>)=>{
            setInviteData(res.data)
        })
        .catch((error:AxiosError)=>{
        })
    },[])
    return(
        <div className="m-4">
             {/* Join Requests */}
            <div className="flex  justify-center items-center relative mt-8">
                <div
                className="font-semibold text-lg flex items-center"
                style={{
                    fontFamily: "Spline Sans, sans-serif",
                }}
                >friend requests</div>
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
                        no friend requests
                    </div>
                }
                {inviteData.map((invite, index)=>{
                    return(
                        <FriendRequests invite={invite} key={index}
                        setInviteData={setInviteData}
                        />
                    )
                })}
            </div>
            <NavBar window="Activity"/>
        </div>
    );
}

function FriendRequests(props: {invite: any, setInviteData:any}){

    const handleAcceptAsFriend = () =>{
        apiPost.post('/accept-request/',{
            friend: props.invite.id,
        })
        .then((res:any)=>{
            props.setInviteData((prev:any)=>(prev.filter((item:any) => item.id !== props.invite.id)))
            toast.success("you guys are friends!")
        })
        .catch((e:any)=>{
            toast.error("sorry ! server is not responding")
        })
    }
    const handleDenyRequest = () =>{
        apiPost.post('/deny-request/',{
            friend: props.invite.id,
        })
        .then((res:any)=>{
            props.setInviteData((prev:any)=>(prev.filter((item:any) => item.id !== props.invite.id)))
            toast.warning("ouch... rejected")
        })
        .catch((e:any)=>{
            toast.error("sorry! server is not responding")
        })
    }
    return(
            <div className="flex justify-between font-[Graphik Trial] my-4">
                {/* photo */}
                <Link href={'/profile/'+props.invite.id}>
                <div className="flex">
                    <div className="rounded-xl justify-self-center self-center">
                        <Avatar  className="rounded-xl border-2 border-[#11D03B4D] w-12 h-12 ">
                        <Avvvatars value={props.invite.name + props.invite.id} size={48} displayValue={getInitials(props.invite.name)} style="character" radius={10}/>
                        </Avatar>
                    </div>
                    <div className="ml-2">
                        <div
                        className="font-semibold text-base"
                        >{props.invite.name.split(" ")[0].toLowerCase()}@{props.invite.id}</div>
                        <div
                        className="text-sm text-[#777777]"
                        >“{props.invite.name.toLowerCase()}”</div>
                    </div>
                </div>
                </Link>
                <div className="flex items-center">
                    <Button className="bg-[#4E55E1] border-1 border-[#E2E2E2] mr-1" onClick={handleAcceptAsFriend}>accept</Button>
                    <Button className="bg-[#F2F2F2] border-1 border-[#E2E2E2] text-[#000000]" onClick={handleDenyRequest}>deny</Button>
                </div>
                </div>
    );
}