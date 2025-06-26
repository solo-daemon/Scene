"use client";
import { Button } from "@/components/ui/button";
import {
    Share,
    CornerUpLeft,
    Menu,
    Heart,
    Plus,
    UserRound,
} from "lucide-react";
import {
    Avatar,
    AvatarImage,
    AvatarFallback,
} from "@/components/ui/avatar"
import promCoupleHeading from "@/app/assets/prom-assets/promCoupleHeading.webp";
import promCoupleIcon from "@/app/assets/prom-assets/promCoupleIcon.webp";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs";
import{
    useState,
    useEffect,
} from "react";

import {
    Skeleton
} from "@/components/ui/skeleton";
import {
    apiGet,
    apiPost,
} from "@/lib/api/base";
import { toast } from "sonner";
import Link from "next/link";
import Avvvatars from "avvvatars-react";
import { CompleteProfileDialog } from "@/components/PromProfileDialogs";

type CoupleDataType = {
    id: number,
    to_user: {
        id:number,
        name: string,
    }
    user : {
        id: number,
        name: string,
    }
}

type Couple ={
    accepted_couples: CoupleDataType [],
    pending_couples: CoupleDataType[],
    invited_couples: CoupleDataType[],
}

export default function PromScene(){
    const [fetchData, setFetchData] = useState<Couple | null>(null);
    const [coupleData, setCoupleData] = useState<CoupleDataType []>([]);
    const [isCouple, setIsCouple] = useState(false);
    const [self, setSelf] = useState({
        "id": -1,
        "name": "...",
    })
    useEffect(()=>{
        const token = localStorage.getItem("token")
        if(token){
            apiGet.get("/prom-couples/get_couple")
            .then((res:any)=>{
                setFetchData(res.data)
            })
            .catch((e:any)=>{
                toast.error("request.failed , please refresh")
            })
        }
    }, []) 
    useEffect(()=>{
        const userId = Number(localStorage.getItem("userId"))
        function SetCoupleData(){
            if(fetchData === null)
                return;
            if (fetchData.accepted_couples.length === 2){
                setIsCouple(true)
                if(fetchData.accepted_couples[0].to_user.id === userId && fetchData.accepted_couples[0].user.id === userId){
                    setCoupleData([fetchData.accepted_couples[1]])
                    return;
                }else{
                    setCoupleData([fetchData.accepted_couples[0]])
                }
                if(fetchData.accepted_couples[0].user.id !== userId){
                    setCoupleData([fetchData.accepted_couples[0]])
                    setIsCouple(true)
                    return;
                }
                return;
            }
            if(fetchData.accepted_couples.length === 1){
                if(fetchData.accepted_couples[0].to_user.id !== userId){
                    setCoupleData([fetchData.accepted_couples[0]])
                    setIsCouple(true)
                    return;
                }
                if(fetchData.accepted_couples[0].user.id !== userId){
                    setCoupleData([fetchData.accepted_couples[0]])
                    setIsCouple(true)
                    return;
                }
                setCoupleData(fetchData.accepted_couples)
            }
        }
        SetCoupleData()
},[fetchData])

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

    const handleJoinScene = () =>{
        // if(profileCompleteDialog){
        //     setOpenDialog(true)
        //     return;
        // }
        const userId = localStorage.getItem("userId");
        apiPost.post("/prom-couples/send_prom_request/",{
            to_user_id: userId
        })
        .then((res:any)=>{
            setCoupleData([res.data])
        })
        .catch((res:any)=>{
            toast.error(res.message)
        })
    }
    return(
        <div className="relative font-[Graphik Trial]">
            {/* <CompleteProfileDialog openDialog={openDialog}/> */}
        <div className="px-4 mb-[150px]">
            <div
            className="flex justify-between mt-6"
            >
                <div>
                    <div className="rounded-full p-2 bg-transparent border-1 border-[#EDEDED]"
                    onClick={()=>{window.history.back()}}
                    >
                        <CornerUpLeft color="#000000" size={20}/>
                    </div>
                </div>
                <div className="flex gap-3 ">
                    <div className="rounded-full p-2 bg-transparent border-1 border-[#EDEDED]">
                        <Share color="#000000" size={20}/>
                    </div>
                    <div className="rounded-full p-2 bg-transparent border-1 border-[#EDEDED]">
                        <Menu color="#000000" size={20}/>
                    </div>
                </div>
            </div>
            {/* prom poster */}
            <div className="pt-6 pb-8 font-[Gothic A1]">
                <div className="bg-white p-3 rounded-lg border-1 border-[#FF3A3A]/20 ">
                    <div className="bg-[linear-gradient(321deg,_#E30000_0%,_#4C0000_136.81%)] px-4 py-4 relative rounded-md">
                        <div className="relative">
                            <Avatar className="rounded-none w-50 h-40">
                                <AvatarImage src={promCoupleHeading.src} className="w-full h-full"/>
                            </Avatar>
                        </div>
                        <div className="h-20 flex flex-col justify-end gap-6 mt-6">
                            <div className="text-white text-sm">more than a prom night</div>
                            <div className="h-[0.5px] bg-white w-40 rounded-full text-transparent">h</div>
                            <span className="text-white text-xs">30/04/2025 | kuhoo restro</span>
                        </div>
                        <span className="absolute bottom-2 right-0">
                            <Avatar className="rounded-none w-35 h-35">
                                <AvatarImage src={promCoupleIcon.src} className="w-full h-full"/>
                            </Avatar>
                        </span>
                        </div>
                </div>
            </div>
            {/* venue info */}
            <div className="flex flex-col">
                <div className="flex gap-2 items-center">
                    <Avatar className="rounded-none w-4 h-4">
                        <AvatarImage src=""/>
                        <AvatarFallback className="w-4 h-4">
                            <Skeleton className="h-full w-full object-cover relative">
                                <div className="absolute flex justify-center items-center w-full h-full">
                                    <UserRound className="w-3 h-3" color="#9C9C9C"/>
                                </div>
                            </Skeleton>
                        </AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-normal text-[#9C9C9C]">by kuhoo restro</span>
                </div>
                <div className="flex text-2xl font-bold">
                    the scene of us
                </div>
                <div className="flex gap-1 text-base">
                    <span>30 April 2025</span>
                    <span>|</span>
                    <span>7:30-11 pm</span>
                </div>
            </div>
            <PromTabs coupleData={coupleData} isCouple={isCouple} pending_couples={fetchData?.pending_couples || []} invited_couples={fetchData?.invited_couples || []}/>
        </div>
        {(coupleData.length===0) && <div className="fixed bottom-0 w-full p-4 bg-white shadow-[0px_4px_30px_0px_rgba(0,0,0,0.25)]">
            <Button className="w-full py-5 bg-[#FF3A3A] active:bg-[#FF3A3A] hover:bg-[#FF3A3A] border-1 border-[#FF3A3A]/60"
            onClick={handleJoinScene}
            >
               <Plus color="#ffffff" strokeWidth={2} size={10}/> join scene
            </Button>
        </div>
        }
        {
            (coupleData.length>0) &&
            <div className="grid grid-cols-2 justfiy-between gap-2 fixed bottom-0 p-4 w-full bg-white shadow-[0px_4px_30px_0px_rgba(0,0,0,0.25)]">
            { (!isCouple) && <div className="w-full col-span-1">
            <Link href={'/explore/'}>
                <Button className="w-full py-5 bg-[#FF3A3A] active:bg-[#FF3A3A] hover:bg-[#FF3A3A] border-1 border-[#FF3A3A]/60"
                >
                <Plus color="#ffffff" strokeWidth={2} size={10}/> invite your partner
                </Button>
            </Link>
            </div>
            }
            <div className={"w-full " + (isCouple ? "col-span-2": "col-span-1")}
            onClick={()=>{
                if(!isCouple){
                    toast.info("ask your partner to accept request first")
                }
            }}
            >
            
                <Button className="w-full py-5 bg-[#FF3A3A] active:bg-[#FF3A3A] hover:bg-[#FF3A3A] border-1 border-[#FF3A3A]/60"
                disabled={!isCouple}
                onClick={()=>{window.location.href="https://docs.google.com/forms/d/e/1FAIpQLSfqFjgXULWmbJgugfC1ZI-tw2yUfvAua_Bku84-JU4az6u12A/viewform?usp=sharing"}}
                >
                <Plus color="#ffffff" strokeWidth={2} size={10}/> buy tickets
                </Button>
        </div>
        </div>
        }
        </div>
    );
}
  
  function PromTabs({ coupleData, isCouple, pending_couples, invited_couples }: { coupleData: any[], isCouple: boolean, pending_couples: CoupleDataType[], invited_couples: CoupleDataType [] }) {
    const [activeTab, setActiveTab] = useState("us");
    const userId = Number(localStorage.getItem("userId"));
    return(
        <Tabs defaultValue="pass">
            <TabsList className="mt-4 w-full border-2 border-[#FAFAFA] bg-transparent px-2 py-1 h-full">
            <TabsTrigger
                value="pass"
                className="bg-[#ffffff] text-black data-[state=active]:bg-[#000000] data-[state=active]:text-white py-2 w-full transition-all duration-300 ease-in-out"
            >
                pass
            </TabsTrigger>
            <TabsTrigger
                value="us"
                className="bg-[#ffffff] text-black data-[state=active]:bg-[#000000] data-[state=active]:text-white py-2 w-full transition-all duration-300 ease-in-out"
            >
                us
            </TabsTrigger>
            </TabsList>
            <TabsContent
                value="pass"
                className="transition-all duration-300 ease-in-out opacity-0 translate-y-3 data-[state=active]:opacity-100 data-[state=active]:translate-y-0"
                >
               <Pass />
            </TabsContent>
            <TabsContent
            value="us"
            className="transition-all duration-300 ease-in-out opacity-0 translate-y-3 data-[state=active]:opacity-100 data-[state=active]:translate-y-0"
            >
                <div className="mt-6 flex flex-col gap-4 font-[Graphik Trial]">
                    
                    {
                        (coupleData.length >0 && isCouple) &&
                        <div className="space-y-4">
                            <div className="font-semibold text-base">your pair</div>
                            <RequestProfiles userId={userId} profile={coupleData[0].user}/>
                            <RequestProfiles userId={userId} profile={coupleData[0].to_user}/>
                        </div>
                    }
                    {
                        (coupleData.length >0 && !isCouple) &&
                        <div>
                            <div className="flex justify-between items-center pr-2">
                            <RequestProfiles userId={userId} profile={coupleData[0].user}/>
                            <div className="self-center text-sm text-[#4E55E1] border-1 border-[#E2E2E2] bg-[#F1F1FD] rounded-lg py-1 px-4">
                                you!
                            </div>
                            </div>
                           {invited_couples.length > 0 && <div className="my-4 font-semibold text-base">invited by</div>}
                            {invited_couples.map((couple, index) => (
                            <div className="flex justify-between items-center pr-2" key={index}>
                            <RequestProfiles userId={userId} profile={couple.user} />
                            <span className="py-1 px-2 text-sm text-white border-1 border-[#FF3A3A]/20 bg-[#FF3A3A] rounded-xl">for you</span>
                            </div>
                            ))}
                            {pending_couples.length >0 && <div className="my-4 font-semibold text-base">pending requests</div>}
                            {pending_couples.map((couple, index) => (
                            <div className="flex justify-between items-center pr-2" key={index}>
                            <RequestProfiles userId={userId} profile={couple.to_user} />
                            <span className="py-1 px-2 text-sm text-[#B28500] border-1 border-[#FFECB3] bg-[#FFF8E1] rounded-xl">waiting</span>
                            </div>
                            ))}

                        </div>
                    }
                    {
                        coupleData.length === 0 &&
                        <div className="h-40 flex items-center justify-center text-center">
                            join the prom scene and find your prom partner !
                        </div>
                    }
                </div>
            </TabsContent>
        </Tabs>
    );
}

function RequestProfiles(props: {
    profile: any,
    userId: number,
}) {

    const userId = Number(localStorage.getItem("userId"))

    return (
        <div>
            <div className="flex items-center justify-between">
                <Link href={`/profile/${props.profile.id}`}>
                    <div className="flex items-center">
                        <Avatar className="rounded-xl w-[36px] h-[36px]">
                        <Avvvatars value={props.profile.name + props.profile.id} size={36} style="shape" radius={10} />
                        </Avatar>
                        <div className="font-semibold ml-4 truncate">
                            {props.profile.name.split(" ")[0].toLowerCase()}@{props.profile.id}
                        </div>
                    </div>
                </Link>
            </div>
        </div>
    );
}

function Pass(){
    return(
        <div className="flex h-40 mt-6 font-[Gothic A1]">
            <div className="rounded-l-xl bg-[#000000] w-full h-full flex items-center justify-center">
                <Avatar className="rounded-none className w-36 h-30">
                    <AvatarImage src={promCoupleHeading.src} className="h-full w-full"/>
                </Avatar>
            </div>
            <div className="rounded-r-xl w-full relative bg-gradient-to-b from-[#FF3A3A] to-[#992323]">
                <div className="absolute top-4 right-4 text-white">
                    <div className="text-xs text-end">30/04/2025</div>
                    <div className="text-sm text-end">kuhoo restro</div>
                </div>
                <a href="https://docs.google.com/document/d/1TMW6ql08bVgnAeUqkxp9O3cvxy6_Wnmey-mnlK6KArI/edit?usp=sharing">
                    <div className="absolute bottom-4 right-4 bg-[#FFFFFF]/28 rounded-md py-1 px-2 flex items-center gap-1 w-30">
                        <span className="text-white font-medium whitespace-nowrap truncate">terms & conditions</span>
                    </div>
                </a>
            </div>
        </div>
    );
}