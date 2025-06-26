"use client";
import NavBar from "@/components/NavBar";
import SceneHeader from "@/components/Home/Header";
import Logout from "@/components/Home/Logout";
import { 
    Tabs,
    TabsList,
    TabsTrigger,
    TabsContent,
} from "@/components/ui/tabs";
import { 
    Avatar,
    AvatarImage,
    AvatarFallback,
} from "@radix-ui/react-avatar";
import { 
    Handshake,
    UserRoundPen,
    BadgeCheck,
    UsersRound,
    Instagram,
    Linkedin,
    Share,
    CornerUpLeft,
    Menu,
    UserPlus2,
    Camera,
 } from "lucide-react";

import {
    useState,
    useEffect,
} from "react"

import { 
    apiGet,
    apiPost,
} from "@/lib/api/base";

import { toast } from "sonner";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Progress } from "@/components/ui/progress";
import copy from "copy-to-clipboard";
import { Skeleton } from "@/components/ui/skeleton";
export default function ProfilePage(){
    const { id } = useParams()
    const [profileData, setProfileData] = useState({
        "id": 0,
        "name": "",
        "gmail": "",
        "friend_status": -1,
        "gmail_pic": "",
        "profile_pic_url": "",
        "organized_scenes_count":0,
        "organized_scenes": [],
        "identity": {
            "id": 1,
            "identity_name": "he/him"
        },
        "travel_type": {
            "id": 1,
            "travel_type": "adventurer",
        },
        "about": "hey there ! I am using scene",
        "instagram_id": "",
        "linkedin_id": "",
        "college_slug": "",
        "branch_name": "",
        "profile_pic": "",
        "friend_no": 0,
        "nostalgias": [],
        "ten_on_ten": "friends",
        "yearOfGraduation": 2029,
      });
    useEffect(()=>{

            apiGet.get(`/user/${id}`)
            .then((res: any)=>{
                setProfileData((prev)=> {
                    return {...prev, ...res.data}
                })
            })
           .catch((e:any)=>{
            toast.error("sorry ! server is not responding")
           })
    },[])
    return (
        <div className="mb-[150px]">
            <div className="flex  justify-center items-center relative mx-4 mb-8 mt-8">
            <div
            className="font-normal text-lg flex items-center"
            style={{
                fontFamily: "Spline Sans, sans-serif",
            }}
            >{profileData.name.toLowerCase()}</div>
            <div className="absolute left-0">
                <div className="p-2 rounded-full border-[#EDEDED] border-2"
                onClick={()=> window.history.back()}
                >
                    <CornerUpLeft color="#000000"
                    size={20}
                    />
                </div>
            </div>
            <div className="absolute right-0">
                <div className=""
                >
                    <Menu color="#000000"
                    size={25}
                    />
                </div>
            </div>
            </div>
            <Profile 
            name={profileData.name || "..."}
            profile_pic={profileData.profile_pic_url}
            friend_no={profileData.friend_no}
            about={profileData.about || "hey there ! I am using scene"}
            identity= {profileData.identity?.identity_name || "scene/user"}
            friendStatus= {profileData.friend_status || 1}
            instagram_id={profileData.instagram_id}
            linkedin_id={profileData.linkedin_id}
            />
            {/* <ProfileTabs organized_scenes={profileData?.organized_scenes || []}
            about = {{
                "college": profileData.college_slug || "iit roorkee",
                "branch": profileData.branch_name || "does it matter ?",
                "nostalgia": profileData?.nostalgias || [],
                "travelType": profileData?.travel_type || {} ,
                "10/10": profileData.ten_on_ten || "not updated",
                "yearOfGraduation": profileData?.yearOfGraduation || 2026,
            }}
            /> */}
            <NavBar window="Profile" />
        </div>
    );
}

const formatDate = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString("en-GB", { day: "2-digit", month: "long" }); // Example: "24 March"
  };

function Profile(
    props: {
        name: string | null;
        profile_pic: string,
        friend_no: number,
        about: string,
        identity: string,
        friendStatus: number,
        instagram_id: string,
        linkedin_id: string,
    }
){
    const {id} = useParams()
    const userId = Number(localStorage.getItem("userId"))
    const [friendStatus, setFriendStatus] = useState(props.friendStatus)
    const handleAddFriend = () =>{
        apiPost.post(`/send-request/`,{
            friend: id
        })
        .then((res:any)=>{
            setFriendStatus(3)
        })
        .catch((e:any)=>{
            toast.error("sorry ! server is not responding")
        })

    }

    const handleAcceptAsFriend = () =>{
        apiPost.post('/accept-request/',{
            friend: id,
        })
        .then((res:any)=>{
            setFriendStatus(2)
        })
        .catch((e:any)=>{
            toast.error("sorry ! server is not responding")
        })
    }
    useEffect(()=>{
        apiGet.get(`/check-status/${id}`)
        .then((res:any)=>{
            setFriendStatus(res.data.status)
        })
        .catch((e:any)=>{
            toast.error("sorry ! our server is not responding")
        })
    },[])
    return(
        <div className="mt-2 px-4 font-[Graphik Trial]">
            {/* profile picture */}
            <div>
                <Avatar>
                    <AvatarImage src={props.profile_pic} alt="profile" className="object-cover w-full h-[250px] rounded-2xl"></AvatarImage>
                    <AvatarFallback >
                        <Skeleton className="w-full h-[250px] rounded-2xl relative">
                        <div className="absolute flex justify-center items-center w-full h-full">
                                <Camera className="w-[60px] h-[60px]" color="#9C9C9C" strokeWidth={1}/>
                            </div>
                        </Skeleton>
                    </AvatarFallback>
                </Avatar>
            </div>
            {/* name , identity and no of friends and edit-profile */}
            <div className="grid grid-cols-16 mt-4 items-center">
                <div className="col-span-10">
                        <div
                        className="text-xl font-semibold flex"
                        >
                            <div className=" overflow-hidden text-ellipsis">{props.name?.toLowerCase()}</div>
                        </div>
                    <div className="text-[#777777] text-sm mt-1"
                    >restaurant</div>
                </div>
                <div className="col-span-2"
                ></div>
            </div>
            {/* about */}
            <div className="font-light mt-4 p-4 bg-[#F7F7F7] italic rounded-xl text-sm">
                {props.about}
            </div>
            {/* instagram, linkedin, share */}
            <div className="mt-4 grid grid-cols-2 gap-4">
                <div 
                className="col-span-1 border-1 border-[#E6E6E6] rounded-xl py-4 flex justify-center"
                >
                    <a href={`https://instagram.com/${props.instagram_id}`} target="_blank" rel="noopener noreferrer">
                        <Instagram size={20} color="#AAAAAA"/>
                    </a>
                </div>
                <div 
                className="col-span-1 border-1 border-[#E6E6E6] rounded-xl py-4 flex justify-center"
                onClick={async ()=>{
                    try{
                    await navigator.share({
                        url: window.location.origin+"/scene/restaurants/"+id,
                        title: "scene",
                        text: "scene kya hain ?",
                    })
                }catch(e:any){
                    
                }
            }}
                >
                    <Share size={20} color="#AAAAAA"/>
                </div>
            </div>
        </div>
    );
}
