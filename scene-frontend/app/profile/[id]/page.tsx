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
    Check,
    Heart,
    HeartCrack,
 } from "lucide-react";
import Avvvatars from "avvvatars-react";
import {
    useState,
    useEffect,
} from "react"

import { 
    apiGet,
    apiPost,
} from "@/lib/api/base";

import { userSceneImage } from "@/app/utils/userSceneImage";
import { toast } from "sonner";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Progress } from "@/components/ui/progress";
import copy from "copy-to-clipboard";
import { Skeleton } from "@/components/ui/skeleton";
import quillIcon from "@/app/assets/icons/quill_write_icon.png"
import clipIcon from "@/app/assets/icons/paper_clip_icon.png"
import highFiveIcon from "@/app/assets/icons/high_five_icon.png"
import calendarIcon from "@/app/assets/icons/calendar_icon.png";
import graduationHatIcon from "@/app/assets/icons/graduation_hat_icon.png";
import degreeScrollIcon from "@/app/assets/icons/degree_scroll_icon.png";
import friendsIcon from "@/app/assets/icons/green_high_five_icon.png"
import { Button } from "@/components/ui/button";
import promCoupleIcon from "@/app/assets/prom-assets/promCoupleIcon.webp";
import { getInitials } from "@/lib/utils";

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
            "travel_type": "...",
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
        "yearOfGraduation": null,
        "who_is_around": {
            "id": 1,
            "who_is_around_name": "..."
        },
        "scene_frequency": {
            "id": 1,
            "scene_frequency_name": "..."
        },
        "status_text": ""
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
            >{profileData.name.split(" ")[0].toLowerCase()}</div>
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
            scene_no={profileData.organized_scenes_count}
            linkedin_id={profileData.linkedin_id}
            status_text={profileData.status_text}
            />
            <YourLastWords />
            <ProfileTabs organized_scenes={profileData?.organized_scenes || []}
            about = {{
                "college": profileData.college_slug || "...",
                "branch": profileData.branch_name || "...",
                "nostalgia": profileData?.nostalgias || [],
                "travelType": profileData?.travel_type || {} ,
                "10/10": profileData.about || "not updated",
                "yearOfGraduation": profileData?.yearOfGraduation || null,
                "scene_frequency": profileData?.scene_frequency || {
                    "id": 1,
                    "scene_frequency_name": "..."
                },
                "who_is_around": profileData?.who_is_around || {
                    "id": 1,
                    "who_is_around_name": "..."
                },
            }}
            />
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
        scene_no: number,
        status_text:any,
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
            toast.success("you guys are friends!")
        })
        .catch((e:any)=>{
            toast.error("sorry ! server is not responding")
        })
    }
    const handleDenyRequest = () =>{
        apiPost.post('/deny-request/',{
            friend: id,
        })
        .then((res:any)=>{
            setFriendStatus(0)
            toast.success("ouch... rejected")
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
            {(friendStatus === 1 && userId !== Number(id)) &&
            <div className="mt-2">
                <div
                className="text-sm p-4 w-full text-sm text-[#ffffff] rounded-lg space-y-2"
               style={{
                backgroundColor: "rgba(234, 235, 255, 0.30)"
               }}
               >
                    <div className="font-normal text-sm text-black">
                        <span className="font-semibold">{props.name?.split(" ")[0]?.toLowerCase()}</span> sent you a friend request
                    </div>
                    <div className="grid grid-cols-2 gap-2 mt-4">
                        <Button className="col-span-1 bg-[#F2F2F2] border-1 border-[#E2E2E2] text-[#000000]" onClick={handleDenyRequest}>deny</Button>
                        <Button className="col-span-1 bg-[#4E55E1] border-1 border-[#E2E2E2] mr-1" onClick={handleAcceptAsFriend}>accept</Button>
                    </div>
            </div>
            </div>
            }
            {/* name , identity and no of friends and edit-profile */}
            <div className="grid grid-cols-16 mt-4">
                <div className="col-span-10 flex flex-col gap-1">
                        <div
                        className="text-xl font-semibold flex"
                        >
                            <div className=" overflow-hidden text-ellipsis">{props.name?.toLowerCase()}</div>
                        </div>
                    <div className="text-[#777777] text-sm"
                    >{props.identity}</div>
                    <div className="flex gap-2 items-center">
                        <div><span className="font-semibold text-[#000000] text-sm">{props.friend_no}</span> <span className="text-[#777777] font-medium text-xs">friends</span></div>
                        <div><span className="font-semibold text-[#000000] text-sm">{props.scene_no}</span> <span className="text-[#777777] font-medium text-xs">scenes</span></div>
                    </div>
                <div className="mt-2 flex justify-start gap-2">
                    <div 
                    className="border-1 border-[#E6E6E6] rounded-xl py-2 px-4 flex justify-center items-center"
                    >
                        <a href={`https://instagram.com/${props.instagram_id}`} target="_blank" rel="noopener noreferrer">
                            <Instagram size={12} color="#000000"/>
                        </a>
                    </div>
                    <div 
                    className="border-1 border-[#E6E6E6] rounded-xl py-2 px-4 flex justify-center items-center">
                        <a href={`https://linkedin.com/${props.instagram_id}`} target="_blank" rel="noopener noreferrer">
                        <Linkedin size={12} color="#000000"/>
                        </a>
                    </div>
                    <div 
                    className=" border-1 border-[#E6E6E6] rounded-xl py-2 px-4 flex justify-center items-center gap-2"
                    onClick={async ()=>{
                        try{
                        await navigator.share({
                            url: window.location.href,
                            title: "scene",
                            text: "scene kya hain ?",
                        })
                    }catch(e:any){
                        
                    }
                }}
                    >
                        <Share size={12} color="#000000"/>
                        <span
                        className="text-xs"
                        >share</span>
                    </div>
                 </div>
                </div>
                <div className="col-span-6 flex justify-center">
                <span className="relative">
                <div className="w-27 h-27 rounded-xl border-2 border-[#ABE2B5] overflow-hidden">
                <Avatar className="w-full h-full">
                    <AvatarImage src={props.profile_pic} alt="profile" className="w-full h-full object-cover object-center rounded-none"></AvatarImage>
                    <AvatarFallback 
                    className="w-full"
                    >
                        <Skeleton className="w-full rounded-none relative h-full">
                        <div className="absolute flex justify-center items-center h-full w-full">
                                <Camera className="w-[20px] h-[20px]" color="#9C9C9C" strokeWidth={1}/>
                            </div>
                        </Skeleton>
                    </AvatarFallback>
                </Avatar>
            </div>
            <span className="absolute bottom-0 w-27 bg-white rounded-xl border-1 px-1 py-2 min-h-8"
            style={{
                borderColor: "rgba(226, 226, 226, 0.88)",
            }}
            > 
            <p className="line-clamp-2 text-center font-light text-xs leading-none">{!props.status_text ? "up for?": props.status_text}</p>
                </span>
            </span>
                </div>
                
            </div>
            {/* friends or not? */}
                {/* if data not fetched */}
            {(friendStatus === -1 && userId !== Number(id)) &&
            <div className="my-6">
                <Skeleton className="h-12 w-full"/>
            </div>
            }
                {/* if friends */}
            {((friendStatus === 2 || friendStatus === 4) && userId !== Number(id)) && 
            <div className="mt-6 mb-2 col-span-1">
                <div
                className=" border-1 border-[#CEFFD7] p-3 w-full bg-[#E1FFE7] text-sm text-[#ffffff] font-light gap-2 flex items-center justify-center rounded-lg"
                >
                        <img src={friendsIcon.src} className="w-4 h-4"></img>
                        <div className="text-[#4BC761] text-xs font-medium whitespace-nowrap truncate">
                            you guys are friends!
                        </div>

                </div>
            </div>
            }
            {/* if not friends */}
            {(friendStatus === 0 && userId !== Number(id)) && 
            <div className="mt-6 mb-2 col-span-1">
                <div
                className="border-1 text-sm p-3 w-full bg-[#4E55E1] font-light gap-2 flex items-center justify-center rounded-lg text-white"
                onClick={handleAddFriend}
                style={{
                    borderColor: "rgba(226, 226, 226, 0.88)"
                }}
                >
                        <UserPlus2 strokeWidth={2} size={15} color="#ffffff"/>
                        <div className="text-xs font-medium whitespace-nowrap truncate">
                            add friend
                        </div>

                </div>
            </div>
            }
                {/* request pending */}
            { (friendStatus === 3 && userId !== Number(id)) &&
            <div className="my-6 col-span-1">
                <div
                className="text-sm border-1 p-3 w-full bg-[#F4F4F4] border-[#E2E2E2]/88 text-sm font-light gap-2 flex items-center justify-center rounded-lg"
                >
                        <Check color="#000000" size={15}/>
                        <div className="text-xs font-medium whitespace-nowrap truncate">
                            request sent
                        </div>

                </div>
            </div>
            }
            {/* <PromRequests/> */}
            </div>
    );
}

function PromRequests(){
    const { id } = useParams()
    const [promStatus, setPromStatus] = useState("FETCHING")
    useEffect(()=>{
        apiPost.post("/prom-couples/check_prom_status/", {
            profile_id : id,
        })
        .then((res:any)=>{
            setPromStatus(res.data.can_send)
        })
        .catch((e:any)=>{
            toast.error("please refresh , to fetch prom data")
        })
    },[])
    const [profileCompleteDialog, setProfileCompleteDialog] = useState(false);
    const [openDialog, setOpenDialog] = useState(false)
    // useEffect(()=>{
    //     apiGet.get("/user/is_social_completed/")
    //     .then((res:any)=>{
    //         setProfileCompleteDialog(!res.data.social_completed)
    //     })
    //     .catch((e:any)=>{
    //         toast.error("please refresh")
    //     })
    // },[])
    const [inviteData, setInviteData] = useState([])
    useEffect(()=>{
        apiGet.get('/prom-couples/get_requests/')
        .then((res:any)=>{
            setInviteData(res.data)
        })
        .catch((error:any)=>{
        })
    },[])

    const handleSendPromRequest = () => {
        // if(profileCompleteDialog){
        //     setOpenDialog(true)
        //     return;
        // }
        apiPost.post("/prom-couples/send_prom_request/",{
            to_user_id: id,
        })
        .then((res:any)=>{
            setPromStatus("WAITING")
        })
        .catch((e:any)=>{
            toast.error("request failed, please try again")
        })
    }

    const handleAcceptPromRequest = () =>{
        // if(profileCompleteDialog){
        //     setOpenDialog(true)
        //     return;
        // }
        apiPost.post("/prom-couples/prom_accept_auto/",{
            user_id: id,
        })
        .then((res:any)=>{
            setPromStatus("ACCEPTED")
        })
        .catch((e:any)=>{
            console.log(e)
        })
    }
    
    if(promStatus === "FETCHING"){
        return (
            <div className="col-span-1 my-6">
                <Skeleton className="w-full h-12"/>
            </div>
        )
    }
    if(promStatus === "WAITING"){
        return (
            <div className="col-span-1  my-6">
            <div
            className="text-black border-1 p-3 w-full bg-[#F4F4F4] border-1 border-[#E2E2E2]/88 text-sm font-medium gap-2 flex items-center justify-center rounded-lg"
            >
                <Check color="#000000" size={15}/>
                <div className="text-xs font-medium whitespace-nowrap truncate text-ellipsis">
                prom request sent
                </div>
            </div>
        </div>
        )
    }
    if(promStatus === "REJECTED"){
        return (
            <div className="col-span-1  my-6">
            <div
            className="text-black border-1 p-3 w-full bg-[#F4F4F4] border-1 border-[#E2E2E2]/88 text-sm font-medium gap-2 flex items-center justify-center rounded-lg"
            >
                <HeartCrack color="#ffffff" size={15} fill="#000000"/>
                <div className="text-xs font-medium whitespace-nowrap truncate text-ellipsis">
                rejected
                </div>
            </div>
        </div>
        )
    }
    if(promStatus === "TOO_LATE"){
        return (
            <div className="col-span-1  my-6">
            <div
            className="text-black border-1 p-3 w-full bg-[#F4F4F4] border-1 border-[#E2E2E2]/88 text-sm font-medium gap-2 flex items-center justify-center rounded-lg"
            >
                <HeartCrack color="#ffffff" size={15} fill="#000000"/>
                <div className="text-xs font-medium whitespace-nowrap truncate text-ellipsis">
                too late !
                </div>
            </div>
        </div>
        )
    }
    if(promStatus === "ACCEPTED"){
        return(
        <div className="col-span-1  my-6">
            <div
            className="bg-[linear-gradient(321deg,_#E30000_0%,_#4C0000_136.81%)] text-black border-1 p-3 w-full border-1 border-[#E2E2E2]/88 text-sm font-medium gap-2 flex items-center justify-center rounded-lg"
            >
                <Avatar className="rounded-none w-4 h-4">
                    <AvatarImage src={promCoupleIcon.src} className="w-full h-full"/>
                </Avatar>
                <div className="text-xs font-medium whitespace-nowrap truncate text-ellipsis text-white">
                perfect match
                </div>
            </div>
        </div>
        );
    }
    if(promStatus === "ACCEPT"){
        return(
        <div className="col-span-1  my-6">
            {/* <CompleteProfileDialog openDialog={openDialog}/> */}
            <div
            className="text-black px-3 py-3 w-full bg-[#FF2424] border-1 border-[#E2E2E2]/88 font-medium gap-2 flex items-center justify-center rounded-lg"
            onClick={handleAcceptPromRequest}
            >
                <Heart color="#ffffff" size={15} fill="#ffffff"/>
                <div className="text-xs font-medium whitespace-nowrap truncate text-ellipsis text-white">
                    accept request
                </div>
            </div>
        </div>
        );
    }
    return(
        <div className="col-span-1  my-6">
            {/* <CompleteProfileDialog openDialog={openDialog}/> */}
            <div
            className="text-white border-1 p-3 w-full bg-[#FF2424] border-1 border-[#FFF0F0]/12 text-xs font-medium gap-2 flex items-center justify-center rounded-lg"
            onClick={handleSendPromRequest}
            >
                <Heart color="#ffffff" size={15}/>
                <div className="text-xs font-medium">
                ask for prom
                </div>
            </div>
        </div>
    );
}

function YourLastWords(){
    const router = useRouter();
    const { id } = useParams();
    return(
        <div className="p-4 mb-4 mt-0 relative font-[Graphik Trial]">
            <div className="p-2 border-1 rounded-md"
            style={{ borderColor: "rgba(96, 102, 228, 0.20)" }}
            >
                <div className="bg-[#4E55E1] rounded-md relative h-40">
                    <div className="font-bold text-lg text-white pt-4 px-4">
                        Your Last Words For Me!
                    </div>
                    <p className="text-white text-xs px-4">
                    Write one final note before we go— for the ones who made college unforgettable.
                    </p>
                    <Button style={{ backgroundColor: "rgba(255, 255, 255, 0.12)" }}
                    className="ml-4 mt-4 font-semibold absolute bottom-4 p-2 text-xs"
                    onClick={()=>{router.push("/profile/"+id+"/write-slam")}}
                    >
                        <Avatar>
                            <AvatarImage src={quillIcon.src} className="w-4 h-4"></AvatarImage>
                        </Avatar>
                        Write now
                    </Button>
                    <Avatar className="absolute bottom-0 right-8">
                        <AvatarImage src={highFiveIcon.src} className="w-12 h-12"/>
                    </Avatar>
                </div>
            </div>
            <Avatar className="absolute top-3 right-16" >
                <AvatarImage src={clipIcon.src} className="w-5 h-12"/>
            </Avatar>
        </div>
    );
}

function ProfileTabs({ organized_scenes, about }: { organized_scenes: {}[]; about: {
    college: string,
    branch: string,
    yearOfGraduation: number | null,
    nostalgia: {}[],
    "10/10": string,
    travelType: {},
    "scene_frequency": any,
    "who_is_around": any,
} }
    ){
    return(
    <div className="px-4 mt-6">
        <Tabs defaultValue={"about"} className="w-full">
            <TabsList className="bg-transparent border-0 w-full p-0">
                <div className="w-full flex justify-center border-2 border-[#FAFAFA] rounded-xl py-1">
                <TabsTrigger value="about"
                    className="rounded-lg data-[state=active]:bg-[#000000] data-[state=active]:text-[#FFFFFF] mx-1 py-2"
                >
                    about
                </TabsTrigger>
                <TabsTrigger value="scenes"
                className="rounded-lg data-[state=active]:bg-[#000000] data-[state=active]:text-[#FFFFFF] mx-1 py-2"
                >
                    scenes({organized_scenes.length})
                </TabsTrigger>
                </div>
            </TabsList>
            <TabsContent value="about"><About about={about}/></TabsContent>
            <TabsContent value="scenes"><Scenes organized_scenes={organized_scenes}/></TabsContent>
        </Tabs>
    </div>
    );
}

function About({about}: {about:any}){
    return(
        <div>
            {/* college, branch and year of graduation */}
            <div className="text-sm mt-4 flex flex-col gap-2 border-1 rounded-xl p-4 space-y-3"
            style={{
                borderColor: "rgba(226, 226, 226, 0.88)"
            }}
            >
            <div className="grid grid-cols-5">
                <div className="col-span-2 flex items-center gap-3">
                   <span>
                    <img src={graduationHatIcon.src} className="w-5 h-5"/>
                   </span>
                   <span>college</span>
                </div>
                <div className="col-span-1"></div>
                <p
                    className="text-[#4E55E1] col-span-2 flex flex-row-reverse text-end"
                    >{about.college.toLowerCase() || "..."}</p>
            </div>
            <div className="grid grid-cols-5">
                <div className="col-span-2 flex items-center gap-2">
                   <span>
                    <img src={degreeScrollIcon.src} className="w-5 h-5"/>
                   </span>
                   <span>branch</span>
                </div>
                <div className="col-span-1"></div>
                <p
                    className="text-[#4E55E1] col-span-2 flex flex-row-reverse text-end"
                    >{about.branch.toLowerCase() || "..."}</p>
            </div>
            <div className="flex justify-between rounded-lg">
                    <div className="flex item-center gap-2">
                        <span>
                            <img src={calendarIcon.src} className="w-5 h-5"/>
                        </span>
                        <span>
                        year of graduation
                        </span>
                    </div>
                    <div
                    className="text-[#4E55E1]"
                    >{about.yearOfGraduation || "..."}</div>
                </div>
            </div>
            {/* my nostalgia */}
            <div className="text-sm mt-6 flex flex-col gap-4">
                <div
                className="text-lg font-semibold"
                >my nostalgia</div>
                <div className="flex flex-wrap gap-2">
                    {about.nostalgia.length === 0 && 
                    Array(5).fill(null).map((_, index) => (
                        <Skeleton key={index} className="w-25 h-10"/>
                    ))
                    }
                    {about.nostalgia.map((item:any,index:any)=>{
                        return(
                    <div key={index}
                        className="py-2 px-4 border-1 border-[#E2E2E2] 
                        bg-[#F5F5F5] rounded-lg"
                        >
                        {item}
                    </div>
                        )
                    })}
                </div>
            </div>
            {/* 10/10 trip explanation */}
            <div className="text-sm mt-6 flex flex-col gap-4">
                <div
                className="text-lg font-semibold"
                >my idea of a good night out</div>
                    <div
                    className="p-4 italic font-normal
                    bg-[#F7F7F7] rounded-lg text-sm"
                    >
                        {about["10/10"] || "..."}
                    </div>
            </div>
            {/* travel type */}
            <div className="text-sm mt-6 flex flex-col gap-4">
                <div
                className="text-lg font-semibold"
                >when plans are happening, i am
                </div>
                {/* {about.travelType.length === 0 &&
                    <Skeleton className="h-15"/>
                } */}
                {/* {about.travelType.map((item,index)=>(
                <div className="flex flex-col gap-2" key={index}>
                    <div className="p-4 bg-[#F7F7F7] rounded-xl">
                        <div className="text-base font-semibold">
                            {item.travle_name.toLowerCase()}
                        </div>
                        <div className="text-sm text-[#AAAAAA]">
                            {item.travel_detail.toLowerCase()}
                        </div>
                    </div>
                </div>))} */}
                 <div className="flex flex-col gap-2">
                    <div className="p-4 bg-[#F7F7F7] rounded-xl">
                        <div className="text-base font-semibold">
                            {/* {item.travle_name.toLowerCase()} */}
                            {about?.travelType?.travel_type?.toLowerCase() || "..."}
                        </div>
                        <div className="text-sm text-[#AAAAAA]">
                            {about?.travelType?.description?.toLowerCase() || "..."}
                        </div>
                    </div>
            </div>
            </div>
            {/* scene frequency */}
            <div className="text-sm mt-6 flex flex-col gap-4">
                <div
                className="text-lg font-semibold"
                >my scene frequency</div>
                    <div
                    className="p-4 italic font-normal
                    bg-[#F7F7F7] rounded-lg text-sm"
                    >
                        {about.scene_frequency.scene_frequency_name || "can't fetch"}
                    </div>
            </div>
            {/* i am usually out with */}
            <div className="text-sm mt-6 flex flex-col gap-4">
                <div
                className="text-lg font-semibold"
                >i am usually out with</div>
                    <div
                    className="p-4 italic font-normal
                    bg-[#F7F7F7] rounded-lg text-sm"
                    >
                        {about.who_is_around.who_is_around_name || "can't fetch"}
                    </div>
            </div>
        </div>
    );
}

function Scenes(props: {organized_scenes: any}){
    return(
        <div className="mt-4">
            {props.organized_scenes.length === 0 && 
            <div className="h-80 flex justify-center items-center">
                <div>
                    yet to create scenes
                </div>
            </div>
            } 
            {props.organized_scenes.map((scene: any)=>(
                      <ScenesCard key={scene.id} scene={scene} /> // ✅ Render SceneCard for each scene
                ))}
        </div>
    );
}

function ScenesCard(props: {scene: any}){
    const [startTime, setStartTime] = useState(formatDate(props.scene.start_time))
    const [endTime, setEndTime] = useState(formatDate(props.scene.end_time))
    return(
        <Link href={`/scene/${props.scene.id}`}>
        <div className="grid grid-cols-5 gap-1 items-center shrink-0 overflow-hidden my-1">
            <div className="self-center overflow-hidden rounded-xl col-span-2 h-25">
            <Avatar className="w-full h-full rounded-none">
                    <AvatarImage src={userSceneImage(props.scene?.scene_type_display.toLowerCase()).src}/>
                    <AvatarFallback className="rounded-none">
                    <div className="relative w-full h-full">
                            <Skeleton className="w-full h-full rounded-none">
                            <div className="absolute flex justify-center items-center w-full h-full">
                                <Camera className="w-[40px] h-[40px]" color="#9C9C9C" strokeWidth={1}/>
                            </div>
                            </Skeleton>
                        </div>
                    </AvatarFallback>
                </Avatar>
            </div>
            {/* scene details */}
            <div className="w-full col-span-3 my-2">
                <div className="pl-2 mt-1 text-xs min-w-0 flex" style={{
                    fontFamily: "Graphik Trial, sans-serif",
                }}>
                    <span>{startTime}</span>
                    <span className="ml-1 mr-1"> | </span>
                    <span>{props.scene.location_text} </span>
                </div>
            <div 
                style={{
                    fontFamily: "Graphink Trial, sans-serif",
                }}
                className="font-[600] text-lg pl-2"
                >
                <p className="truncate overflow-hidden w-full">
                {props.scene.name.toLowerCase()}
                </p>
            </div>
                {/* Creator details */}
                <div className="flex content-center items-center mb-1 pl-2 text-xs">
                    <Avatar className="rounded-full h-4 w-4 flex items-center">
                    <Avvvatars value={props.scene.user_organizer_detail.name + props.scene.user_organizer_detail.id} size={16} displayValue={getInitials(props.scene.user_organizer_detail.name)} style="character"/>
                    </Avatar>
                    <div className="text-[#9C9C9C] ml-2 text-xs">by {props.scene.user_organizer_detail.name.split(" ")[0].toLowerCase()}</div>
                    {/* <div>
                        <BadgeCheck color="#4E55E1" size={15} className="ml-2"/>
                    </div> */}
                </div>
                {/* Capacity details */}
                <div className="p-1 flex justify-between content-center">
                    <Progress
                    value={props.scene.occupancy/props.scene.capacity*100}
                    className="w-[70%] h-2 self-center"
                    indicatorColor="bg-[#39F26D]
                    [background-image:linear-gradient(135deg,rgba(255,255,255,.35)_25%,transparent_25%,transparent_50%,rgba(255,255,255,.35)_50%,rgba(255,255,255,.35)_75%,transparent_75%,transparent)] bg-[length:20px_20px]
                    
                    " />
                    <div className="flex self-center">
                        <UsersRound color="#9C9C9C" size={10} className="self-center"/>
                        <span className="text-[#9C9C9C] text-xs">{props.scene.occupancy}/{props.scene.capacity}</span>
                    </div>
                </div>
            </div>
        </div>
        </Link>
    );

}   