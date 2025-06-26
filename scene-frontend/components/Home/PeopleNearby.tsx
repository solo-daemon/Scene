"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { apiGet } from "@/lib/api/base";
import { toast } from "sonner";
import { ProfileSkeleton } from "@/components/Skeleton";
import { UserRound } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import Avvvatars from 'avvvatars-react'
import { getInitials } from "@/lib/utils";

function PeopleNearByPics(props: {user: any}){
    const initials = getInitials(props.user.name);
    return(
        <Link href={`/profile/${props.user.id}`}>
            <div className="p-2 flex-col justify-center items-center">
                <div className="w-full flex justify-center">
                    <Avatar  className="rounded-2xl border-2 border-[#11D03B4D] h-[65px] w-[60px]">
                        <Avvvatars value={props.user.name + props.user.id} displayValue={initials} size={65} style="character" radius={10}/>
                    </Avatar>
                </div>
                <div
                    style={{
                        fontFamily: "Graphik Trial, sans-serif",
                    }}
                    className="font-medium text-center text-xs mt-2 flex justify-center"
                >
                    <p className="truncate w-[70px] whitespace-nowrap overflow-hidden">
                    {props.user.name.split(" ")[0].toLowerCase()}@{props.user.id}
                    </p>
                </div>
            </div>
        </Link>
    );
}

export function UpForProm(){
    const [nearbyData, setNearbyData] = useState([])

    useEffect(()=>{
        if('caches' in window){
            caches.open(process.env.NEXT_PUBLIC_SERWIST_API_CACHE || "apis").then(cache => {
                cache.keys().then(requests => {
                  const match = requests.find(req => req.url.includes('/api/user/nearby_home/'));
                  if (match) {
                    cache.match(match).then(response => {
                      if (response) {
                        response.clone().json().then(data => {
                            setNearbyData(data)
                        });
                      }
                    });
                  }
                });
              });
            }
            apiGet.get(`/user/nearby_home/`)
            .then((res: any)=>{
                setNearbyData(res.data)
            })
            .catch((e:any)=>{
                toast.error("sorry ! server is not responding")
            })
    }, [])
    return(
        <div className="mb-4">
            <div className="flex justify-between content-center mt-2 mb-2 px-4">
                <div className="text-xl font-semibold"
                    style={{
                        fontFamily: "Spline Sans, sans-serif",
                    }}
                >up for prom?</div>
                <div 
                    style={{
                        fontFamily: "Graphik Trial, sans-serif",
                    }}
                className="text-[#4E55E1] self-center font-medium text-sm flex items-center"><Link href="/nearby">see all</Link></div>
            </div>
            <div className="flex justify-start overflow-x-auto ml-4">
            {/* {nearbyData.length === 0 && Array(10).fill(null).map((_, index) => (
            <ProfileSkeleton key={index} />
        ))} */}
        {nearbyData.length ===0  && 
        <div className="text-center text-sm text-[#818181] w-full h-[70px] flex items-center justify-center"> no matches found : ) </div>
        }
            {nearbyData.map((user: any)=>{
                return(
                <PeopleNearByPics key={user.id} user={user}/>
                )
})}
            </div>
        </div>
    );
}
export function PeopleNearBy(){
    const [nearbyData, setNearbyData] = useState([])

    useEffect(()=>{
        if('caches' in window){
            caches.open(process.env.NEXT_PUBLIC_SERWIST_API_CACHE || "apis").then(cache => {
                cache.keys().then(requests => {
                  const match = requests.find(req => req.url.includes('/api/user/nearby/'));
                  if (match) {
                    cache.match(match).then(response => {
                      if (response) {
                        response.clone().json().then(data => {
                            setNearbyData(data)
                        });
                      }
                    });
                  }
                });
              });
            }
            apiGet.get(`/user/nearby/`)
            .then((res: any)=>{
                setNearbyData(res.data)
            })
            .catch((e:any)=>{
                toast.error("sorry ! server is not responding")
            })
    }, [])
    return(
        <div className="mb-4 mt-4">
            <div className="flex justify-between content-center mt-2 mb-2 px-4">
                <div className="text-xl font-semibold"
                    style={{
                        fontFamily: "Spline Sans, sans-serif",
                    }}
                >people nearby?</div>
                <div 
                    style={{
                        fontFamily: "Graphik Trial, sans-serif",
                    }}
                className="text-[#4E55E1] self-center font-medium text-sm flex items-center"><Link href="/explore">see all</Link></div>
            </div>
            <div className="flex justify-start overflow-x-auto ml-4">
            {nearbyData.length === 0 && Array(10).fill(null).map((_, index) => (
            <ProfileSkeleton key={index} />
        ))}
        {/* {nearbyData.length ===0  && 
        <div className="text-center text-sm text-[#818181] w-full h-[70px] flex items-center justify-center"> no matches found : ) </div>
        } */}
            {nearbyData.map((user: any)=>{
                return(
                <PeopleNearByPics key={user.id} user={user}/>
                )
})}
            </div>
        </div>
    );
}