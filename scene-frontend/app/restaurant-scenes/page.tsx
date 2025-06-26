"use client";
import { CornerUpLeft, ArrowDownUp, UsersRound, Plus, Search, UserRound, BadgeCheck, Camera } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState, useEffect } from "react";
import Link from "next/link";
import { apiGet } from "@/lib/api/base";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { userSceneImage } from "@/app/utils/userSceneImage";
import Avvvatars from "avvvatars-react";
import { SceneSkeleton } from "@/components/Skeleton";
const formatDate = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString("en-GB", { day: "2-digit", month: "long" }); // Example: "24 March"
  };

  function ScenesCard(props: {scene: any, index:number}){
    const [startTime, setStartTime] = useState(formatDate(props.scene.start_time))
    const [endTime, setEndTime] = useState(formatDate(props.scene.end_time))
    return(
        <Link href={`/scene/restaurants/${props.scene.id}`}>
        <div className="w-full shrink-0 overflow-hidden mt-4">
            <div className="self-center w-full h-70 overflow-hidden rounded-xl">
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
    const[sceneData, setSceneData] = useState([]);
    useEffect(()=>{
        apiGet.get(`/restaurant-scenes/`)
        .then((res: any)=>{
            setSceneData(res.data)
        }).catch((e:any)=>[
            toast.error("not able to fetch scenes")
        ])
            
    }, [])
    return(
        <div className="space-y-4 px-4">
         {sceneData.length === 0 && Array(3).fill(null).map((_, index) => (
            <SceneSkeleton key={index} />
        ))}
         {sceneData.map((scene: any, index:number) => (
                <ScenesCard key={scene.id} scene={scene} index={index}/>
            ))}
    </div>
    );
}

export default function Scenes(){
    const [searchText, setSearchText] = useState("")

    return(
        <div className="mb-[200px]">
            {/* Scene */}
            <div className="relative">
                <div className="flex justify-center relative mt-4 fixed top-0">
                    <div
                    className="font-semibold text-lg mt-4"
                    style={{
                        fontFamily: "Spline Sans, sans-serif",
                    }}
                    >restaurants</div>
                    <div className="absolute top-2 left-4">
                        <div className="p-2 rounded-full border-[#EDEDED] border-2"
                        onClick={()=> window.history.back()}
                        >
                            <CornerUpLeft color="#000000"
                            size={20}
                            />
                        </div>
                    </div>
                </div>
            </div>
            {/* search bar */}
            <div className="px-4 font-[Spline Sans] mt-8 mb-4">
                <div className="px-2 py-2 flex bg-[#FAFAFA] rounded-xl items-center">
                    <div className="mr-2 ml-2">
                    <Search color="#818181" size={20}/>
                    </div>
                    <Input 
                    value={searchText}
                    placeholder='search anything like "haridwar"'
                    className="text-sm bg-transparent border-none shadow-none focus:ring-0 focus:outline-none"
                    onChange={(e)=>{setSearchText(e.target.value)}}
                    />
                </div>
            </div>
            {/* Filters */}
            {/* <Tabs defaultValue="all" className="w-full">
            <TabsList className="mb-4 bg-[#ffffff] my-4 mx-2">
                <TabsTrigger value="all"
                    className="font-normal border-1 rounded-xl border-[#E2E2E2] py-1 px-4 m-1 data-[state=active]:bg-[#F1F1FD] data-[state=active]:text-[#4E55E1] data-[state=active]:border-[#B9BCF2]"
                >
                    all(20)
                </TabsTrigger>
                <TabsTrigger value="cognizance"
                    className="font-normal border-1 rounded-xl border-[#E2E2E2] py-1 px-4 m-1 data-[state=active]:bg-[#F1F1FD] data-[state=active]:text-[#4E55E1] data-[state=active]:border-[#B9BCF2]"
                >
                    cognizance
                </TabsTrigger>
                <TabsTrigger value="others"
                    className="font-normal border-1 rounded-xl border-[#E2E2E2] py-1 px-4 m-1 data-[state=active]:bg-[#F1F1FD] data-[state=active]:text-[#4E55E1] data-[state=active]:border-[#B9BCF2]"
                >
                    others
                </TabsTrigger>
            </TabsList>
            <TabsContent value="all"><SceneList filter="all"/></TabsContent>
            <TabsContent value="cognizance"><SceneList filter="cognizance"/></TabsContent>
            <TabsContent value="others"> <SceneList filter="others"/></TabsContent>
            </Tabs> */}
            <SceneList filter="all" />
        </div>
    );

}