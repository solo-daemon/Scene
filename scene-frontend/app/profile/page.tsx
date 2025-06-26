"use client";
import NavBar from "@/components/NavBar";
import SceneHeader from "@/components/Home/Header";
import PromHeader from "@/components/Home/PromHeader";
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
} from "@/components/ui/avatar";

import {
    Avatar as RadixAvatar,
    Avatar as RadixAvatarImage

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
    UserRound,
    Camera,
    EllipsisVertical,
    X,
    Download,
    Copy,
    Search,
 } from "lucide-react";

import {
    useState,
    useEffect,
    useRef,
} from "react"

import { 
    apiGet,
    apiPost,
} from "@/lib/api/base";
import { userSceneImage } from "../utils/userSceneImage";
import Avvvatars from "avvvatars-react";
import { toast } from "sonner";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Progress } from "@/components/ui/progress";
import copy from "copy-to-clipboard";
import { Skeleton } from "@/components/ui/skeleton";
import quillIcon from "@/app/assets/icons/quill_write_icon.png"
import clipIcon from "@/app/assets/icons/paper_clip_icon.png"
import yellowClipIcon from "@/app/assets/icons/yellow_paper_clip.png"
import highFiveIcon from "@/app/assets/icons/high_five_icon.png"
import tapeIcon from "@/app/assets/icons/tape_icon.png"
import { Button } from "@/components/ui/button";
import articleShareIcon from "@/app/assets/icons/article_share_icon.png";
import calendarIcon from "@/app/assets/icons/calendar_icon.png";
import graduationHatIcon from "@/app/assets/icons/graduation_hat_icon.png";
import degreeScrollIcon from "@/app/assets/icons/degree_scroll_icon.png"
import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogClose,
} from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"
// import { Caveat } from 'next/font/google';
import {getInitials, handleSlamTemplateDownload }from "@/lib/utils"
// const caveat = Caveat({ subsets: ['cyrillic'], weight: '400' });
export default function ProfilePage(){
    const [sceneDialogOpen, setSceneDialogOpen] = useState(false)
    const [profileData, setProfileData] = useState({
        "id": 0,
        "name": "",
        "gmail": "",
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
            "description": "..."
        },
        "about": "hey there ! I am using scene",
        "instagram_id": "",
        "linkedin_id": "",
        "college_slug": "...",
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
      })
      const [slam, setSlam] = useState({
        for_user: [],
        from_user: [],
      })
    const [open, setOpen] = useState(false);
    useEffect(()=>{
        if('caches' in window){
            caches.open(process.env.NEXT_PUBLIC_SERWIST_API_CACHE || "apis").then(cache => {
                cache.keys().then(requests => {
                  const match = requests.find((req) => {
                    const pathname = new URL(req.url).pathname;
                    return pathname === '/api/user/' || pathname === '/user/';
                });
                  if (match) {
                    cache.match(match).then(response => {
                      if (response) {
                        response.clone().json().then(data => {
                            setProfileData((prev)=>({...prev, data}))
                        });
                      }
                    });
                  }
                });
              });
            }
            apiGet.get(`/user/`)
            .then((res: any)=>{
                setProfileData((prev)=>({...prev, ...res.data}))
            })
            .catch((e:any)=>{
                toast.error("sorry ! server is not responding")
            })
    },[])
    useEffect(()=>{
        apiGet.get('/slam/')
            .then((res:any)=>{
                setSlam(res.data)
            })
            .catch((e:any)=>{
                toast.error("failed to fetch slams")
            })
    },[])
    return (
        <div className="mb-[150px]">
            <div className="mx-4 mt-4 flex justify-between items-center">
                {/* <SceneHeader dialogOpen={sceneDialogOpen} setDialogOpen={setSceneDialogOpen}/> */}
                <PromHeader dialogProfileOpen={sceneDialogOpen} setDialogProfileOpen={setSceneDialogOpen}/>
                <Logout />
            </div>
            <Profile 
            name={profileData.name || "..."}
            profile_pic={profileData.profile_pic_url}
            friend_no={profileData.friend_no}
            about={profileData.about || "hey there ! I am using scene"}
            identity= {profileData.identity?.identity_name || "scene/user"}
            instagram_id = {profileData.instagram_id}
            linkedin_id = {profileData.linkedin_id}
            scene_no={profileData.organized_scenes_count}
            status_text={profileData.status_text}
            setSceneDialogOpen={setSceneDialogOpen}
            id={profileData.id}
            />
            <YourLastWords setOpen={setOpen}/>
            <ProfileTabs organized_scenes={profileData?.organized_scenes || []}
            about = {{
                "college": profileData?.college_slug || "...",
                "branch": profileData.branch_name || "...",
                "nostalgias": profileData?.nostalgias || [],
                "travelType": profileData?.travel_type || null ,
                "ten_on_ten": profileData?.about?.toLocaleLowerCase() || "...",
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
            setOpen={setOpen}
            slam={slam}
            />
            <RequestSlamDialog isOpen={open} setOpen={setOpen}/>
            <NavBar window="Profile" />
        </div>
    );
}

function RequestSlamDialog(props:{isOpen:boolean, setOpen:any}){
const userId = localStorage.getItem('userId')
return(
    <>
    <Dialog open={props.isOpen} onOpenChange={()=>{props.setOpen(false)}}
    >
    <DialogContent className={"p-0 bg-transparent border-0 text-white font-[Caveat]" }
    >
    <VisuallyHidden>
    <DialogTitle>Download story template</DialogTitle>
  </VisuallyHidden>

    <div className="relative bg-transparent">
        <div className="p-2 border-1 bg-white rounded-md"
        style={{
            borderColor: "rgba(234, 181, 78, 0.20)"
        }}
        >
            <DialogClose asChild>
          <button className="absolute top-4 right-4 text-[#75561A] hover:text-[#75561A]">
            <X className="w-5 h-5 fill-[#75561A]" color="#75561A"/>
          </button>
    </DialogClose>
            <div className="bg-[#F6C863] border-1 px-4 py-6 border-[#EAB54E] space-y-4">
                <div className="text-[#75561A] text-xl">
                you can download the story template, add the link and share on your socials:
                </div>
                <div className="border-1 border-[#E3E5FF] p-2 bg-white rounded-md relative">
                    <Button className="rounded-none w-full border-1 border-[#7A7FED] py-6 bg-[#6066E4] text-xl
                     shadow-none focus:ring-0 focus:outline-none active:bg-[#6066E4] hover:bg-[#6066E4]
                    "
                    onClick={handleSlamTemplateDownload}
                    >
                        <Download className="w-4 h-4" color="#ffffff"/>
                        download story template
                    </Button>
                    <span className="absolute -top-3 left-6">
                        <img src={tapeIcon.src} className="w-6 h-8"/>
                    </span>
                    <span className="absolute -top-3 right-6">
                        <img src={tapeIcon.src} className="w-6 h-8"/>
                    </span>
                </div>
                <div className="border-1 border-[#E3E5FF] p-2 bg-white rounded-md relative">
                    <Button className="rounded-none w-full border-1 border-[#7A7FED] py-6 bg-[#6066E4] text-xl
                    shadow-none focus:ring-0 focus:outline-none active:bg-[#6066E4] hover:bg-[#6066E4]
                    "
                    onClick={()=>{
                        copy(`https://scene.net.in/profile/${userId}/write-slam/`)
                        toast.success("copied to clipboard")
                    }}
                    >
                    <Copy className="w-4 h-4" color="#ffffff"/>
                        copy link to your slam
                    </Button>
                    <span className="absolute -top-3 left-6">
                        <img src={tapeIcon.src} className="w-6 h-8"/>
                    </span>
                    <span className="absolute -top-3 right-6">
                        <img src={tapeIcon.src} className="w-6 h-8"/>
                    </span>
                </div>
            </div>
        </div>
        <span className="absolute right-16 -top-1">
                <img src={yellowClipIcon.src} alt="clip" className="w-5 h-10"></img>
        </span>
    </div>
    </DialogContent>
    </Dialog>
    </>
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
        linkedin_id: string,
        instagram_id: string,
        scene_no: number,
        status_text: any,
        setSceneDialogOpen: any,
        id: number,
    }
){
    const userId = localStorage.getItem("userId")
    return(
        <div className="mt-2 px-4 font-[Graphik Trial]">
            <div className="grid grid-cols-16 mt-4">
                <div className="col-span-10 flex flex-col gap-1">
                <div className="text-xl font-semibold flex items-center overflow-hidden">
                    <span className="truncate whitespace-nowrap overflow-hidden text-ellipsis block max-w-full">
                        {props.name?.toLowerCase()}
                    </span>
                    <span className="ml-2 shrink-0">
                        <Link href="/profile/edit-page">
                        <UserRoundPen size={15} color="#AAAAAA" />
                        </Link>
                    </span>
                </div>

                    <div className="text-[#777777] text-sm"
                    >{props.identity}</div>
                    <div className="flex gap-2 items-center">
                        <Link href={"/profile/friends/"}>
                        <div><span className="font-semibold text-[#000000] text-sm">{props.friend_no}</span> <span className="text-[#777777] font-medium text-xs">friends</span></div>
                        </Link>
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
                            url: window.location.href+"/"+props.id,
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
                <Avatar className="rounded-none w-full h-full">
                    <AvatarImage src={props.profile_pic} alt="profile" className="object-cover object-center rounded-none w-full h-full"></AvatarImage>
                    <AvatarFallback 
                    className="w-full"
                    >
                        <Skeleton className="w-full rounded-none relative h-full">
                        <div className="absolute flex justify-center items-center w-full h-full">
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
            onClick={()=>{props.setSceneDialogOpen(true)}}
            > 
            <p className="line-clamp-2 text-center font-light text-xs leading-none">{!props.status_text ? "up for?": props.status_text}</p>
                </span>
            </span>
                </div>
                
            </div>
        </div>
    );
}

function YourLastWords(props: {setOpen:any}){
    return(
        <div className="p-4 my-4 relative font-[Graphik Trial]">
            <div className="p-2 border-1 rounded-md"
            style={{ borderColor: "rgba(96, 102, 228, 0.20)" }}
            >
                <div className="bg-[#4E55E1] rounded-md relative h-40">
                    <div className="font-bold text-lg text-white pt-4 px-4">
                        introducing slamscene
                    </div>
                    <p className="text-white text-xs px-4">
                    Ask your friends to write one final note before we graduate
                    </p>
                    <div className="absolute bottom-4 ml-4 flex gap-2">
                      <Button style={{ backgroundColor: "rgba(255, 255, 255, 0.12)" }}
                      className="font-semibold px-2 py-0 text-xs/3"
                      onClick={()=>{props.setOpen(true)}}
                      >
                          <span>
                              <img src={quillIcon.src} className="w-4 h-4" alt="quill"></img>
                          </span>
                          ask now
                      </Button>
                      <Link href={'/explore'}>
                      <Button style={{ backgroundColor: "rgba(255, 255, 255, 0.12)" }}
                      className="font-semibold px-2 py-0 text-xs/3"
                      >
                          <Search color="#ffffff" size={2} className="w-2 h-2"/>
                          fill a friend's
                      </Button>
                      </Link>
                      </div>
                    <span className="absolute bottom-0 right-8">
                        <img src={highFiveIcon.src} className="w-12 h-12" alt="high five"/>
                    </span>
                </div>
            </div>
            <span className="absolute top-2 right-16" >
                <img src={clipIcon.src} className="w-5 h-12" alt="clip"/>
            </span>
        </div>
    );
}

function ProfileTabs({ organized_scenes, about, setOpen, slam }: { organized_scenes: {}[]; about: {
    college: string,
    branch: string,
    yearOfGraduation: number | null,
    nostalgias: {}[],
    ten_on_ten: string,
    travelType: {} | null,
    "scene_frequency": any,
    "who_is_around": any,
} ,
    setOpen:any,
    slam: any,
}
    ){
    return(
    <div className="px-4 mt-6">
        <Tabs defaultValue={"about"} className="w-full">
            <TabsList className="bg-transparent border-0 w-full p-0">
                <div className="w-full flex justify-center border-2 border-[#FAFAFA] rounded-xl py-1">
                <TabsTrigger value="about"
                    className="rounded-lg data-[state=active]:bg-[#000000] data-[state=active]:text-[#FFFFFF] data-[state=active]:font-semibold mx-1 py-2"
                >
                    about
                </TabsTrigger>
                <TabsTrigger value="scenes"
                className="rounded-lg data-[state=active]:bg-[#000000] data-[state=active]:text-[#FFFFFF] data-[state=active]:font-semibold mx-1 py-2"
                >
                    scenes({organized_scenes.length})
                </TabsTrigger>
                <TabsTrigger value="slams"
                className="rounded-lg data-[state=active]:bg-[#000000] data-[state=active]:text-[#FFFFFF] data-[state=active]:font-semibold mx-1 py-2"
                >
                    slams({slam.for_user.length + slam.from_user.length})
                </TabsTrigger>
                </div>
            </TabsList>
            <TabsContent value="about"><About about={about}/></TabsContent>
            <TabsContent value="scenes"><Scenes organized_scenes={organized_scenes}/></TabsContent>
            <TabsContent value="slams"><Slams setOpen={setOpen} slam={slam}/></TabsContent>
        </Tabs>
    </div>
    );
}

interface Slam{
    id: number,
    from: {
        id:number,
        name: string,
    },
}

function Slams(props:{ setOpen:any, slam:any }){

    const [slams, setSlams] = useState([props.slam])
    useEffect(()=>{
        // fetch slams function goes here
    }, [])
    return(
        <div className="mt-4 mb-[200px]">
            <Tabs defaultValue="fromYou" className="mb-4">
                <div className="grid grid-cols-5 gap-8">
                <div className="col-span-3">
                <TabsList className="rounded-full p-0 border-1 m-0 w-full"
                style={{
                    borderColor: "rgba(78, 85, 225, 0.19)"
                }}
                >
                    <TabsTrigger value="forYou" 
                    className="border-0 m-0 rounded-l-full bg-[#ffffff] text-[#000000] data-[state=active]:bg-[#4E55E1] 
                    data-[state=active]:text-[#FFFFFF]"
                    >for you
                    </TabsTrigger>
                    <TabsTrigger value="fromYou" className="border-0 m-0 rounded-r-full bg-[#ffffff] text-[#000000] 
                    data-[state=active]:bg-[#4E55E1] data-[state=active]:text-[#FFFFFF]">
                        from you
                    </TabsTrigger>
                </TabsList>
                </div>
                <div className="col-span-2">
                        <Button className="w-full border-1 font-normal text-xs/2"
                        variant={"outline"}
                        style={{
                            borderColor: "rgba(226, 226, 226, 0.88)"
                        }}
                        onClick={()=>{props.setOpen(true)}}
                        >
                            <Avatar className="h-4 w-4 z-6">
                                <AvatarImage src={articleShareIcon.src} className="w-4 h-4 z-2"/>
                                
                            </Avatar>
                            request slams
                        </Button>
                </div>
                </div>
                <TabsContent value="forYou">
                {props.slam.for_user.length === 0 && 
                    <div className="h-40 flex justify-center items-center">
                        <div>
                            no slams here , request now !
                        </div>
                    </div>
                    } 
                    <div className={"space-y-2 font-[Caveat]"}
                    >
                    {props.slam.for_user.map((slam: any, index:number)=>(
                            <SlamsCard key={index} slam={slam} 
                            name={slam.from_user.name}
                            /> // ✅ Render SceneCard for each scene
                        ))}
                    </div>
                </TabsContent>
                <TabsContent value="fromYou">
                {props.slam.from_user.length === 0 && 
                    <div className="h-40 flex justify-center items-center">
                        <div>
                            no slams yet , be the first : )
                        </div>
                    </div>
                    } 
                    <div className={"space-y-2 font-[Caveat]"}
                    >
                    {props.slam.from_user.map((slam: any, index:number)=>(
                            <SlamsCard key={index} slam={slam} 
                            name={slam.to_user.name}
                            /> // ✅ Render SceneCard for each scene
                        ))}
                    </div>
                </TabsContent>
            </Tabs>
    </div>
    );
}

function SlamsCard(props: {slam: any, name:string}){
    const [link, setLink] = useState("")
    const handleLink = ()=>{
        if(props.slam?.status===0){
            if(props.slam.status ===1){
                return `/profile/slam/${props.slam.id}`
            }else{
                return `/profile/${props.slam.to_user.id}/write-slam`;
            }
        }
        else{
            return `/profile/slam/${props.slam.id}`
        }
    }

    useEffect(()=>{
        setLink(handleLink())
    },[props.slam?.status])
    
    return(
        <Link href={link}>
            <div className='py-2 relative'>
                <div className='rounded-lg p-2 border-1 font-[Caveat]'
                style={{
                    borderColor: "rgba(234, 181, 78, 0.20)"
                }}
                >
                    <div className='border-1 border-[#EAB54E] px-4 py-4 text-[#664300] bg-[#F6C863] flex justify-between items-center'>
                        <span className="text-xl">
                    {props.name.split(" ")[0].toLowerCase().replace(/^./, (c:any) => c.toUpperCase())}
                        </span>
                        <span>
                        <EllipsisVertical className='w-4 h-4'color="#664300"/>
                        </span>
                    </div>
                </div>
                <span className='absolute top-1 right-16 z-2'>
                    <img src={yellowClipIcon.src} className="w-5 h-10n z-2" alt="clip"/>
                </span>
            </div>
        </Link>
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
                    {about.nostalgias.length === 0 && 
                    Array(5).fill(null).map((_, index) => (
                        <Skeleton key={index} className="w-25 h-10"/>
                    ))
                    }
                    {about.nostalgias.map((item:any,index:any)=>{
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
                        {about["ten_on_ten"] || "..."}
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
                    <AvatarImage src={userSceneImage(props.scene.scene_type_display.toLowerCase()).src}/>
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