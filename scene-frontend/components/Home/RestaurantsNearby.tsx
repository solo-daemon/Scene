"use client";

import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { BadgeCheck, Camera } from "lucide-react";
import { UserRound } from "lucide-react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { apiGet } from "@/lib/api/base";
import { toast } from "sonner";
import { SceneSkeleton } from "@/components/Skeleton";
import { Skeleton } from "../ui/skeleton";

const formatDate = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString("en-GB", { day: "2-digit", month: "long" }); // Example: "24 March"
  };

function ScenesCard(props: {scene: any, index:number}){
    const [startTime, setStartTime] = useState(formatDate(props.scene.start_time))
    const [endTime, setEndTime] = useState(formatDate(props.scene.end_time))
    return(
        <Link href={`/scene/restaurants/${props.scene.id}`}>
        <div className="w-[180px] shrink-0 overflow-hidden mr-2">
            <div className="self-center w-[180px] h-[150px] overflow-hidden rounded-xl">
                <Avatar className="w-full h-full rounded-xl">
                    <AvatarImage src={props.scene.scene_image} className="object-cover"/>
                    <AvatarFallback className="rounded-xl">
                    <div className="relative w-full h-full">
                            <Skeleton className="w-full h-full rounded-none">
                            <div className="absolute flex justify-center items-center w-full h-full">
                                <Camera className="w-[25px] h-[25px]" color="#9C9C9C" strokeWidth={1}/>
                            </div>
                            </Skeleton>
                        </div>
                    </AvatarFallback>
                </Avatar>
            </div>
            {/* scene details */}
            <div
            className="pl-2 mt-1 text-xs font-[Graphik Trial]"
            >
                <p className="overflow-hidden truncate">
                <span>{startTime}</span>
                <span> | </span>
                <span>{props.scene.location_text?.toLowerCase() || "can't fetch"}</span>
                </p>
            </div>
            <div 
                style={{
                    fontFamily: "Graphink Trial, sans-serif",
                }}
                className="font-[600] text-lg pl-2 font-semibold"
                >
                <p className="truncate">
                    {props.scene.name.toLowerCase()}
                </p>
            </div>
                {/* Creator details */}
                <div className="flex content-center items-center mb-1 pl-2">
                    <Avatar className="w-4 h-4 ">
                        <AvatarImage src={props.scene.user_organizer_detail.gmail_pic} 
                        />
                        <AvatarFallback className="w-4 h-4">
                        <Skeleton className="h-full w-full object-cover relative">
                            <div className="absolute flex justify-center items-center w-full h-full">
                                <UserRound className="w-3 h-3" color="#9C9C9C"/>
                            </div>
                        </Skeleton>
                        </AvatarFallback>
                    </Avatar>
                    <div className="text-[#9C9C9C] ml-2 text-xs truncate">by {props.scene.user_organizer_detail.name.split(" ")[0].toLowerCase()}@{props.scene.user_organizer_detail.id}</div>
                    <div className="flex items-center">
                        <BadgeCheck color="#4E55E1" size={15} className="ml-2"/>
                    </div>
                </div>
            {/* Capacity details */}
            {/* <div className="p-1 flex justify-between content-center">
            <Progress
            value={props.scene.occupancy/props.scene.capacity*100}
            className="w-[65%] h-2 self-center"
            indicatorColor="bg-[#39F26D]
            [background-image:linear-gradient(135deg,rgba(255,255,255,.35)_25%,transparent_25%,transparent_50%,rgba(255,255,255,.35)_50%,rgba(255,255,255,.35)_75%,transparent_75%,transparent)] bg-[length:20px_20px]
            
            " />
                <div className="flex self-center">
                    <UsersRound color="#9C9C9C" size={12} className="self-center"/>
                    <span className="text-[#9C9C9C] text-xs">{props.scene.occupancy}/{props.scene.capacity}</span>
                </div>
            </div> */}
        </div>
        </Link>
    );

}   

function SceneList(props: {filter: string}){
    const[sceneData, setSceneData] = useState<any []>([]);
    useEffect(()=>{

        if('caches' in window){
            caches.open(process.env.NEXT_PUBLIC_SERWIST_API_CACHE || "apis").then(cache => {
                cache.keys().then(requests => {
                  const match = requests.find((req) => {
                    const pathname = new URL(req.url).pathname;
                    return pathname === '/api/restaurant-scenes/' || pathname === '/restaurant-scenes/';
                });
                  if (match) {
                    cache.match(match).then(response => {
                      if (response) {
                        response.clone().json().then(data => {
                            setSceneData(data)
                        });
                      }
                    });
                  }
                });
              });
            }

        apiGet.get(`/restaurant-scenes/`)
        .then((res: any)=>{
            setSceneData(res.data)
        }).catch((e:any)=>[
            toast.error("not able to fetch scenes")
        ])
            
    }, [])
    return(
        <div className="flex overflow-x-auto gap-2">
         {sceneData.length === 0 && Array(3).fill(null).map((_, index) => (
            <SceneSkeleton key={index} />
        ))}
         {sceneData.map((scene: any, index:number) => (
                <ScenesCard key={scene.id} scene={scene} index={index}/>
            ))}
    </div>
    );
}

export default function RestaurantsNearby(){
    return(
        <div className="mb-2 mt-2">
            <div className="flex justify-between content-center mb-4 px-4 mt-2">
                <div className="text-xl font-semibold"
                    style={{
                        fontFamily: "Spline Sans, sans-serif",
                    }}
                >restaurants nearby</div>
                <div 
                    style={{
                        fontFamily: "Graphik Trial, sans-serif",
                    }}
                className="text-[#4E55E1] self-center font-medium text-sm flex items-center">
                    <Link href="/restaurant-scenes">see all</Link></div>
            </div>
           
            <div className="ml-4"><SceneList filter="all" /></div>

        </div>
    );
}