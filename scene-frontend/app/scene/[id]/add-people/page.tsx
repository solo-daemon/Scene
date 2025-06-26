"use client";
import { Input } from "@/components/ui/input";
import { CornerUpLeft, Search, UserRoundPlus, Share2, Copy, User, UserRound } from "lucide-react"
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";
import { apiGet, apiPost } from "@/lib/api/base";
import { toast } from "sonner";
import { useParams } from "next/navigation";
import copy from "copy-to-clipboard";
import { Skeleton } from "@/components/ui/skeleton";
import Avvvatars from "avvvatars-react";
import { getInitials } from "@/lib/utils";

export default function AddPeoplePage(){
    const { id } = useParams()
    const [searchText, setSearchText] = useState("")
    const [searchData, setSearchData]= useState([]);
    const [initialData, setInitialData] = useState([]);
    const [userId, setUserId] = useState<number[]>([]);
    const [debouncedQuery, setDebouncedQuery] = useState(""); // Debounced state

    useEffect(() => {
        const handler = setTimeout(() => {
        setDebouncedQuery(searchText);
        }, 1000); 
        return () => clearTimeout(handler);
    }, [searchText]);

    useEffect(() => {
        if (debouncedQuery) {
        handleSearch()
        }
    }, [debouncedQuery]);
    useEffect(()=>{
        if(searchData.length === 0){
            setSearchData(initialData)
        }
    },[searchData])
    const handleSearch =()=>{
        if (searchText === ""){
            apiGet.get("/user/nearby_home")
            .then((res:any)=>{
                setSearchData(res.data)
            })
            .catch((e:any)=>{
                toast.error('server is not responding')
            })
        }else{
        apiPost.post(`/user/search/`,{
            text: searchText,
        })
        .then((res:any)=>{
            setSearchData(res.data)
        })
        .catch((e:any)=>{
            toast.error('server is not responding')
        })
    }
    }
    const handleSendInvitation=()=>{
        apiPost.post(`/scenes/${id}/send_invitation/`,{
            user_ids: userId,
        })
        .then((res:any)=>{
            toast.success("invitations has been sent")
            window.history.back()
        })
        .catch((e:any)=>{
            toast.error("server is not responding")
        })
    }
    const handleSelect = (id: any) => {
        setUserId(prevUserIds => 
            prevUserIds.includes(id) 
                ? prevUserIds.filter(user => user !== id)  // Remove if exists
                : [...prevUserIds, id]  // Add if not exists
        );
    };
    useEffect(()=>{
        apiGet.get('/user/nearby_home/')
        .then((res:any)=>{
            setSearchData(res.data)
            setInitialData(res.data)
        })
        .catch((error:any)=>{
            toast.error("server is not responding")
        })
    },[])
    return(
        <div>
            <div className="flex  justify-center items-center relative m-4 mt-8">
            <div
            className="font-semibold text-lg flex items-center"
            style={{
                fontFamily: "Spline Sans, sans-serif",
            }}
            >add member</div>
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
            {/* search bar */}
            <div className="px-4 font-[Spline Sans] mt-8 mb-4">
                <div className="px-2 py-2 flex bg-[#FAFAFA] rounded-xl items-center">
                    <div className="mr-2 ml-2">
                    <Search color="#818181" size={20}/>
                    </div>
                    <Input 
                    value={searchText}
                    placeholder="search members"
                    className="bg-transparent border-none shadow-none focus:ring-0 focus:outline-none"
                    onChange={(e)=>{setSearchText(e.target.value)}}
                    />
                </div>
            </div>
            <div className="font-[Graphik Trial] mt-2 max-h-120 overflow-y-auto">
                {searchData.map((item:any, index:number)=>{
                    if(userId.includes(item.id)){
                        return(
                            <div className="bg-[#F1F1FD] border-1 border-[#E2E2E2]"
                            onClick={()=>handleSelect(item.id)}
                            key={index}
                            >
                                <ProfileCard profile={item}/>
                            </div>
                        )
                    }
                    return(
                        <div
                        onClick={()=>handleSelect(item.id)}
                        className="border-1 border-[#ffffff]"
                        key={index}
                        >
                            <ProfileCard profile={item}/>
                        </div>
                    );
                })}
            </div>
            <div className="mx-4 grid grid-cols-16 gap-2 items-center mb-2">
                <div className="border-1 border-[#EBEBEB] col-span-7 h-0"></div>
                <div className="text-[#818181] col-span-2 text-center text-lg">or</div>
                <div className="border-1 border-[#EBEBEB] col-span-7 h-0"></div>
            </div>
            {/* invite friends card */}
            <div className="mx-4 mt-4 mb-[100px]">
                <div className="rounded-2xl bg-[#F1F1FD] px-4 py-4">
                    <div className="flex items-center">
                        <div>
                            <UserRoundPlus size={30}/>
                        </div>
                        <div className="ml-2">
                            <div
                            className="text-sm font-medium"
                            >invite friends</div>
                            <div
                            className="text-xs font-normal"
                            >share the link to add in the scene</div>
                        </div>
                    </div>
                    <div className="grid grid-cols-16 mt-6">
                        <div 
                        className="text-sm rounded-2xl col-span-10 px-6 py-2 bg-[#ffffff] border border-dashed border-[#D9DBF8] border-[1.5px]">
                            <p className="truncate font-[Graphik Trial]">{window.location.href}</p>
                        </div>
                        <div className="col-span-3 flex justify-center items-center px-2">
                            <Button className="w-full bg-[#4E55E1] rounded-lg px-4 py-5"
                            onClick={()=>{
                                copy(window.location.origin, {
                                    "message": "copied to clipboard"
                                })
                                toast.success("copied to clipboard")
                            }}
                            >
                                <Copy color="#ffffff" size={40}/>
                            </Button>
                        </div>
                        <div className="col-span-3 flex justify-center items-center px-2">
                        <Button 
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
                        className="w-full bg-[#ffffff] border-1 border-[#4E55E1] rounded-lg px-4 py-5" variant={"outline"}>
                                <Share2 color="#4E55E1" size={40}/>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
            {/* send invitation button */}
            <div className="relative">
                <div className="fixed w-full px-4 bottom-8">
                    <Button 
                    onClick={handleSendInvitation}
                    className="w-full bg-[#4E55E1] font-semibold text-base py-6 rounded-r-full rounded-l-full">send invitations</Button>
                </div>
            </div>
        </div>
    )
}

function ProfileCard(props: {profile:any}){
    return(
        <div className="py-3 px-4 font-[Graphik Trial]">
            <div className="flex justify-between ">
                <div className="flex items-center">
                    <Avatar  className="rounded-xl w-[36px] h-[36px]">
                        <Avvvatars value={props.profile.name + props.profile.id} displayValue={getInitials(props.profile.name)} size={36} style="character" radius={10} />
                    </Avatar>
                    <div className="font-semibold text-base ml-4 max-w-35 truncate">
                    {props.profile?.name?.toLowerCase() || "john doe"}
                    </div>
                </div>
                <div className="flex gap-2 items-center">
                    {/* year and branch */}
                    <div
                    className="text-center w-16 truncate px-2 py-1 border-1 border-[#E2E2E2] bg-[#F1F1FD] text-[#4E55E1] rounded-md text-xs"
                    >{props.profile?.branch_slug?.toLowerCase() || "mech"}'{props.profile?.year%2000 || "25"}</div>
                    <div
                    className="text-center w-16 truncate px-2 py-1 border-1 border-[#E2E2E2] bg-[#F1F1FD] text-[#4E55E1] rounded-md text-xs"
                    >{props.profile?.college_slug || "iit roorkee"}</div>
                </div>
            </div>
        </div>
    );
}