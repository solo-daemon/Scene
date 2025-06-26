"use client";
import { useParams, usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { CornerUpLeft, Share, Plus, BadgeCheck, Camera, UserRound, EllipsisVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import Link from "next/link";
import { apiGet, apiPost } from "@/lib/api/base";
import { toast } from "sonner";
import * as React from "react"
import { Skeleton } from "@/components/ui/skeleton";
import Avvvatars from "avvvatars-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { getInitials } from "@/lib/utils";
   // Function to format timestamp into "DD MMMM" format
   const formatDate = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString("en-GB", { day: "2-digit", month: "long" }); // Example: "24 March"
  };

export default function Scene() {
    const { id } = useParams();
    const userId = Number(localStorage.getItem("userId"))
    const [sceneData, setSceneData] = useState({
        id: 0,
        name: "",
        location_text: "",
        start_time: 0,
        end_time: 0,
        description: "",
        scene_image: "",
        user_organizer_detail: {
          id: 0,
          name: "...",
          gmail_pic: "",
          profile_pic_url: "",
        },
        invite_list: [],
        status: false,
      });
      const [userStatus, setUserStatus] = useState(1);
    const handleJoinClick = () =>{
        apiGet.get(`restaurant-scenes/${id}/join_scene/`)
        .then(((res:any)=>{
            setSceneData((prev:any) => ({
                ...prev,
                status: true
            }))
            window.location.reload();
        }))
        .catch((e:any)=>{
            toast.error("server is not responding")
        })
    }
    const userType = localStorage.getItem('user_type');
    useEffect(()=>{
            apiGet.get(`/restaurant-scenes/${id}`)
            .then((res: any)=>{
                const startTime:string = formatDate(res.data.start_time)
                const endTime:string = formatDate(res.data.end_time)
                if(res.data.user_organizer_detail.id === userId){
                    setUserStatus(0)
                }
                setSceneData((prev)=>({
                    ...prev,
                    ...res.data,
                    start_time: startTime,
                    end_time: endTime
                }))
            })
            .catch((e:any)=>{
                toast.error("server is not responding")
            })
    }, [])
    return(
        <div key={sceneData.id} className="mb-[400px]">
            {/* poster */}
            <div className="relative w-full h-[500px] shrink-0 mb-4">
                <Avatar className="h-full w-full rounded-none">
                    <AvatarImage src={sceneData.scene_image} className="object-cover"/>
                    <AvatarFallback>
                        <div className="relative w-full h-full">
                            <Skeleton className="w-full h-full rounded-none">
                            <div className="absolute flex justify-center items-center w-full h-full">
                                <Camera className="w-[60px] h-[60px]" color="#9C9C9C" strokeWidth={1}/>
                            </div>
                            </Skeleton>
                        </div>
                    </AvatarFallback>
                </Avatar>
                    <div className="absolute top-4 left-4 rounded-full p-2 bg-[#ffffff]" 
                    onClick={()=> window.history.back()}>
                    <CornerUpLeft color="#000000"
                    size={20}
                    />
                    </div>
                    <div className="absolute top-4 right-4 flex">
                        <div className="rounded-full p-2 bg-[#ffffff]"
                        onClick={async ()=>{
                            try{
                            await navigator.share({
                                url: window.location.origin,
                                title: "scene",
                                text: "scene kya hain ?",
                            })
                        }catch(e:any){
                            
                        }
                    }}
                        >
                            <Share color="#000000"
                            size={20}
                            />
                        </div>
                    </div>
            </div>
            {/* event information */}
            <div className="">
                <div className="flex justify-between mt-4 mx-4">
                    <div>
                        {/* creator */}
                        <div className="flex content-center items-center mb-1">
                            <Avatar className="w-4 h-4 ">
                                <AvatarImage src={sceneData.user_organizer_detail.profile_pic_url} />
                                <AvatarFallback className="w-4 h-4">
                                <Skeleton className="h-full w-full object-cover relative">
                                    <div className="absolute flex justify-center items-center w-full h-full">
                                        <UserRound className="w-3 h-3" color="#9C9C9C"/>
                                    </div>
                                </Skeleton>
                                </AvatarFallback>
                            </Avatar>
                            <Link href={`/profile/restaurant/${sceneData.user_organizer_detail.id}`}>
                            <div className="text-[#9C9C9C] ml-2 text-xs">by {sceneData.user_organizer_detail.name.split(" ")[0].toLowerCase()}</div>
                            </Link>
                            <div className="">
                                <BadgeCheck color="#4E55E1" size={15} className="ml-2"/>
                            </div>
                        </div>
                        {/* event name */}
                        <div
                        className="text-xl font-semibold mb-1"
                        >{sceneData.name.toLowerCase()}</div>
                        {/* event date */}
                        <div className="text-xs mb-1">
                            <span>{sceneData.start_time}</span>
                            <span> | </span>
                            <span> {sceneData.location_text}</span>
                        </div>
                    </div>
                </div>
            </div>
            {/* scene tabs */}
            
            {/* join scene button  or Nothing*/}
                {userType !== "RESTAURANT" && <div>
                {!sceneData.status ? 
                <div className="relative z-10">
                <div className="fixed bottom-4 w-full">
                    <div className="py-4 px-8">
                        <Button className="w-full bg-[#4E55E1] py-6" onClick={handleJoinClick}>
                            <Plus />
                            <div>join scene</div>
                        </Button>
                    </div>
                </div>
            </div>
            :
                <div className="relative z-10">
                    <div className="fixed bottom-4 w-full">
                        <div className="py-4 px-8">
                            <Link href={`/scene/restaurants/${id}/add-people`}>
                            <Button className="w-full bg-[#4E55E1] py-6">
                                <Plus />
                                <div>invite your friends</div>
                            </Button>
                            </Link>
                        </div>
                    </div>
                </div>}
                </div>
                }
            {/* people */}
            <div className="p-4">
            <Tabs defaultValue="itinerary" className="w-full">
            <TabsList className="bg-[#ffffff] border-0 w-full p-0">
                <div className="w-full flex justify-center border-2 border-[#FAFAFA] rounded-xl py-1">
                <TabsTrigger value="itinerary"
                    className="rounded-lg data-[state=active]:bg-[#000000] data-[state=active]:text-[#FFFFFF] mx-1 py-2"
                >
                    itinerary
                </TabsTrigger>
             {userStatus !==0 &&   <TabsTrigger value="people"
                className="rounded-lg data-[state=active]:bg-[#000000] data-[state=active]:text-[#FFFFFF] mx-1 py-2"
                >
                    peoples
                </TabsTrigger>}
                </div>
            </TabsList>
            <TabsContent value="itinerary"><ItineraryContent userStatus={userStatus}/></TabsContent>
            {userStatus !==0 && <TabsContent value="people"><PeopleContent /></TabsContent>}
            </Tabs>
            </div>
        </div>
    );
}

type ItineraryItem = {
id: number;
spot_name: string;
notes: string[];
};

function ItineraryContent(props:{userStatus: number}){
    const { id } = useParams()
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<ItineraryItem[]>([]);
    const pathname = usePathname();
    const handleDeleteItinerary = (itinerary_id:number) =>{
        apiPost.delete(`/restaurant-scenes/${id}/deleteitinerary/?id=${itinerary_id}`)
        .then((res:any)=>{
            toast.success("deleted successfully")
        })
        .catch((e:any)=>{
            toast.error("server is not responding")
        })
    }
    useEffect(()=>{
        apiGet.get(`/restaurant-scenes/${id}/itinerary`)
        .then((res:any)=>{
  
          setData(res.data);
          setLoading(false)
        })
        .catch((e:any)=>{
            toast.error("server is not responding")
        })
    },[])
    return(
        <div className="mt-4 mb-[100px]">
            {/* add destination */}
            <div className="w-full mb-4 mt-2">
                {props.userStatus===0 && <Link href={pathname+"/add-itinerary"}>
                    <Button 
                    variant={"outline"}
                    className="w-full h-full rounded-r-full rounded-l-full py-3"
                    >   
                        <Plus className="mr-2"/>
                        <div>add events</div>
                    </Button>
                </Link>}
            </div>
            {data.map((event: any, index:number) => (
                <div className="flex items-stretch ml-2" key={index}>
                <div className="flex-1 relative">
                    <div className="shrink-0 w-0 h-full border-1 border-[#9C9C9C] ml-2">
                    </div>
                    <div className="absolute top-0 left-0 p-2 bg-[#4E55E1] rounded-full" />
                </div>
                <div key={event.id} className="mt-4 ml-4 w-full py-6 px-6 bg-[#F5F5F5] rounded-xl">
                    <div className="flex justify-between items-center">
                        <h3 className="text-xl font-bold">{event.spot_name.toLowerCase()}</h3>
                       {props.userStatus === 0 && <div>
                        <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                <EllipsisVertical size={20}/>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-40">
                                <DropdownMenuItem 
                                className=""
                                onClick={()=>{handleDeleteItinerary(event.id)}}
                                >
                                    delete event
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                            </DropdownMenu>
                            </div>}
                    </div>
                    <div className="font-semibold text-sm mt-4">
                        specials:
                    </div>
                    <ul className="mt-4 list-disc list-inside">
                    {event.notes.map((note: string, index: number) => (
                        <li key={index}
                        className="italic text-sm mb-2"
                        >{note.toLowerCase()}</li>
                    ))}
                    </ul>
                </div>
            </div>
            ))}
        </div>
    );
}

function PeopleContent() {
    const userId = Number(localStorage.getItem("userId"))
    const { id } = useParams();
    const [invitedProfiles, setInvitedProfiles] = useState([]);

    useEffect(() => {
        apiGet.get(`/restaurant-scenes/${id}/fetch_invites/`)
            .then((res: any)=>{
                setInvitedProfiles(res.data)
            })
            .catch((e:any)=>{
                toast.info("no one's there plan now!")
            })
    },[])

    return (
        <div className="mt-4 mb-[100px] overflow-y-auto">
            {/* People Filters */}
            <div>
            <div className="rounded-xl text-base font-semibold mb-4">
                your guests({invitedProfiles.length})
            </div>
            {/* guest profiles */}
            <div className="mt-4">
                {invitedProfiles.map((profile: any) => (
                    <RequestProfiles key={profile.id} profile={profile} userId={userId}/>
                ))}
            </div>
            </div>
        </div>
    );
}

function RequestProfiles(props: {
    profile: any,
    userId: number,
}) {
    const { id } = useParams();

    return (
        <div>
            <div className="flex items-center mb-4 justify-between">
                <Link href={`/profile/${props.profile.id}`}>
                    <div className="flex items-center">
                        <Avatar className="rounded-xl w-[36px] h-[36px]">
                        <Avvvatars value={props.profile.name + props.profile.id} displayValue={getInitials(props.profile.name)} size={36} style="character" radius={10} />
                        </Avatar>
                        <div className="font-semibold ml-4 truncate">
                            {props.profile.name.split(" ")[0].toLowerCase()}@{props.profile.id}
                        </div>
                    </div>
                </Link>
                <div className="flex gap-2">
                {props.profile.id === props.userId && (
                    <div className="self-center text-sm text-[#4E55E1] border-1 border-[#E2E2E2] bg-[#F1F1FD] rounded-lg py-1 px-4">
                        you!
                    </div>
                )}
                {(props.profile.status === "PENDING") && (
                    <div className="self-center text-sm text-[#B28500] border-1 border-[#FFECB3] bg-[#FFF8E1] rounded-lg py-1 px-4">
                        waiting...
                  </div>
                )}
                {(props.profile.status === "ACCEPTED") && (
                    <div className="self-center text-sm text-[#2E7D32] border-1 border-[#C8E6C9] bg-[#E8F5E9] rounded-lg py-1 px-4">
                    coming!
                  </div>
                )}
                </div>
            </div>
        </div>
    );
}