"use client";
import { useParams } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { CornerUpLeft, Share, Plus, BadgeCheck, UsersRound, Pencil, Menu, EllipsisVertical, Camera, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import Link from "next/link";
import { apiGet, apiPost } from "@/lib/api/base";
import { toast } from "sonner";
import copy from "copy-to-clipboard";
import * as React from "react"
import { useSearchParams, usePathname, useRouter } from 'next/navigation'; 
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { userSceneImage } from "@/app/utils/userSceneImage";
import Avvvatars from "avvvatars-react";
import { getInitials } from "@/lib/utils";
   // Function to format timestamp into "DD MMMM" format
const formatDate = (timestamp: number) => {
const date = new Date(timestamp * 1000);
return date.toLocaleDateString("en-GB", { day: "2-digit", month: "long" }); // Example: "24 March"
};

export default function Scene() {
    const { id } = useParams();
    const [sceneData, setSceneData] = useState({
        id: 0,
        name: "",
        location_text: "",
        priority: 0,
        start_time: 0,
        end_time: 0,
        capacity: 0,
        occupancy: 0,
        relative_occupancy: 0,
        about: "",
        type: 0,
        scene_image: "",
        user_organizer_detail: {
          id: 0,
          name: "...",
          gmail_pic: "",
        },
        visitor_list: [],
        admin:true,
        scene_type_display: "",

      });
      const router = useRouter();
      const searchParams = useSearchParams();
      const pathname = usePathname();
    const activeTab = searchParams.get("page") || "peoples"; // Default tab

    const handleTabChange = (date: string) => {
        // router.push(`${pathname}?page=${encodeURIComponent(date)}`, { scroll: false });
    };
      const [sceneChecklist, setSceneChecklist] = useState([])
      const [userStatus, setUserStatus] = useState(-1);
      const handleJoinClick = () =>{
        const userId = Number(localStorage.getItem("userId"))
      apiGet.get(`/scenes/${id}/request_join`)
      .then((res:any)=>{
            setUserStatus(3)
            // setSceneData((prev:any) => ({
            //     ...prev,
            //     visitor_list: [...prev.visitor_list, ]
            //   }));
            toast.success(res.data.message.toLowerCase())
      })
      .catch((e:any)=>{
        toast.error("server is not responding")
      })
      }
      const handleAccept = () =>{
        const userId = Number(localStorage.getItem("userId"))
        apiGet.get(`/scenes/${id}/accept_invitation/`)
        .then((res:any)=>{
            setUserStatus(1)
            setSceneData((prev:any) => ({
                ...prev,
                visitor_list: prev.visitor_list.map((v: any) =>
                  v.id === userId ? { ...v, status: 1 } : v
                ),
              }));
        })
        .catch((e:any)=>[
            toast.error("server is not responding")
        ])
      }

      const reduceOccupancy = () =>{
        setSceneData((prev:any)=>({
            ...prev,
            occupancy: prev.occupancy - 1,
        }))
      }

      const handleDeny = () =>{
        const userId = Number(localStorage.getItem("userId"))
        apiGet.get(`/scenes/${id}/accept_invitation/`)
        .then((res:any)=>{
            setUserStatus(4)
            setSceneData((prev:any) => ({
                ...prev,
                visitor_list: prev.visitor_list.map((v: any) =>
                  v.id === userId ? { ...v, status: 4 } : v
                ),
                occupancy: prev.occupancy -1
              }));
        })
        .catch((e:any)=>[
            toast.error("server is not responding")
        ])
      }
      const handleDeleteScene = () =>{

      }
    useEffect(()=>{
            apiGet.get(`/scenes/${id}`)
            .then((res: any)=>{
                const startTime:string = formatDate(res.data.start_time)
                const endTime:string = formatDate(res.data.end_time)

                setSceneData({...res.data, start_time:startTime, end_time:endTime})
            })
            .catch((e:any)=>{
                toast.error("server is not responding")
            })
            apiGet.get(`/scenes/${id}/checklistitem/`)
            .then((res:any)=>{
                setSceneChecklist(res.data)
            })
            .catch((e:any)=>{
                toast.error("server is not responding")
            })
            apiGet.get(`scenes/${id}/check_user_status`)
            .then((res:any)=>{
                setUserStatus(res.data.status)
            })
            .catch((e:any)=>{
                toast.error("server is not responding");
            })
    }, [])
    return(
        <div key={sceneData.id}>
            {/* poster */}
            <div className="relative w-full h-[250px] shrink-0 mb-4">
                <Avatar className="h-full w-full rounded-none">
                    <AvatarImage src={userSceneImage(sceneData.scene_type_display.toLowerCase()).src} className="object-cover"/>
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
                                url: window.location.href,
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
                        {userStatus===0 && <div className="rounded-full p-2 bg-[#ffffff] ml-2">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Menu color="#000000"
                                    size={20}
                                    />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-40">
                                <DropdownMenuItem 
                                className=""
                                onClick={handleDeleteScene}
                                >
                                    delete scene
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                            </DropdownMenu>
                        </div>}
                    </div>
            </div>
            {/* event information */}
            <div className="">
                <div className="flex justify-between mt-4 mx-4">
                    <div>
                        {/* creator */}
                        <div className="flex content-center items-center mb-1">
                            <Avatar className="w-4 h-4 ">
                            <Avvvatars value={sceneData.user_organizer_detail.name + sceneData.user_organizer_detail.id} displayValue={getInitials(sceneData.user_organizer_detail.name)} size={16} style="character" radius={10} />
                            </Avatar>
                            <div className="text-[#9C9C9C] ml-2 text-xs">by {sceneData.user_organizer_detail.name.split(" ")[0].toLowerCase()}@{sceneData.user_organizer_detail.id}</div>
                            {/* <div className="">
                                <BadgeCheck color="#4E55E1" size={15} className="ml-2"/>
                            </div> */}
                        </div>
                        {/* event name */}
                        <div
                        className="text-xl font-semibold mb-1"
                        >{sceneData.name}</div>
                        {/* event date */}
                        <div className="text-xs mb-1">
                            <span>{sceneData.start_time}</span>
                            <span>-</span>
                            <span>{sceneData.end_time}</span>
                            <span> | </span>
                            <span> {sceneData.location_text}</span>
                        </div>
                    </div>
                    {userStatus===0 &&
                        <div>
                            <Link href={pathname + "/edit-scene"}>
                                <Button
                                variant={"outline"}
                                className="border-1 border-[#7A7A7A] px-4 py-4"
                                ><Pencil/><span
                                className="text-xs font-semibold"
                                >edit scene</span></Button>
                            </Link>
                        </div>
                    }
                </div>
                {/* capacity info */}
                <div className="flex justify-between mx-4">
                    <Progress
                        value={sceneData.occupancy/sceneData.capacity*100}
                        className="w-[80%] h-3 self-center"
                        indicatorColor="bg-[#39F26D]
                        [background-image:linear-gradient(135deg,rgba(255,255,255,.35)_25%,transparent_25%,transparent_50%,rgba(255,255,255,.35)_50%,rgba(255,255,255,.35)_75%,transparent_75%,transparent)] bg-[length:20px_20px]
                        
                    " />
                    <div className="flex self-center">
                        <UsersRound color="#9C9C9C" size={15} className="self-center"/>
                        <span className="text-[#9C9C9C] text-sm">{sceneData.occupancy}/{sceneData.capacity}</span>
                    </div>
                </div>
            </div>
            {/* scene tabs */}
            <div className="mt-4">
                <div className="mx-4">
                    <Tabs defaultValue={activeTab} onValueChange={handleTabChange} className="w-full">
                        <TabsList className="bg-[#ffffff] border-0 w-full p-0">
                            <div className="w-full flex justify-center border-2 border-[#FAFAFA] rounded-xl py-1">
                            <TabsTrigger value="itinerary"
                                className="rounded-lg data-[state=active]:bg-[#000000] data-[state=active]:text-[#FFFFFF] mx-1 py-2"
                            >
                                itinerary
                            </TabsTrigger>
                            <TabsTrigger value="checklist"
                                className="rounded-lg data-[state=active]:bg-[#000000] data-[state=active]:text-[#FFFFFF] mx-1 py-2"
                            >
                                checklist
                            </TabsTrigger>
                            <TabsTrigger value="peoples"
                            className="rounded-lg data-[state=active]:bg-[#000000] data-[state=active]:text-[#FFFFFF] mx-1 py-2"
                            >
                                peoples
                            </TabsTrigger>
                            </div>
                        </TabsList>
                        <TabsContent value="itinerary"><ItineraryContent about={sceneData.about} userStatus={userStatus}/></TabsContent>
                        <TabsContent value="checklist"><CheckListContent  checklist={sceneChecklist} userStatus={userStatus}/></TabsContent>
                        <TabsContent value="peoples"><PeopleContent user_organizer={sceneData.user_organizer_detail} userStatus={userStatus} visitor_list={sceneData.visitor_list} admin={sceneData.admin} reduceOccupancy={reduceOccupancy}/></TabsContent>
                    </Tabs>
                </div>
            </div>
            {/* join scene button  or Nothing*/}
            {userStatus === -1 ? 
                <div className="relative">
                    <div className="fixed bottom-0 w-full bg-white shadow-[0px_4px_39.1px_0px_rgba(0,0,0,0.25)]">
                        <div className="p-8">
                            <Button className="w-full bg-[#4E55E1] py-6" onClick={handleJoinClick}>
                                <Plus />
                                <div>join scene</div>
                            </Button>
                        </div>
                    </div>
                </div>
                :<div></div> 
            }
            {userStatus === 3 ?
            <div className="relative">
            <div className="fixed bottom-0 w-full bg-white shadow-[0px_4px_39.1px_0px_rgba(0,0,0,0.25)]">
                <div className="p-8 text-center">
                        <div>request pending</div>
                </div>
            </div>
        </div>
        :<div></div> 
            }
            {userStatus === 2 ?
            <div className="relative">
            <div className="fixed bottom-0 w-full bg-white shadow-[0px_4px_39.1px_0px_rgba(0,0,0,0.25)]">
                <div className="p-8 text-center flex justify-center gap-2">
                    <Button className="bg-[#4E55E1] border-1 
                    border-[#E2E2E2] mr-1 items-center shadow-none w-1/3"
                    onClick={handleAccept}
                    >
                        <div className="flex items-center text-xs">accept</div>
                    </Button>
                    <Button className="bg-[#F2F2F2] border-1 
                    border-[#E2E2E2] text-[#000000] shadow-none w-1/3">
                        <div className="flex items-center text-xs"
                        onClick={handleDeny}
                        >cancel</div>
                    </Button>
                </div>
            </div>
        </div>
        :<div></div> 
            }
        { userStatus === 4 &&
        <div className="relative">
        <div className="fixed bottom-0 w-full bg-white shadow-[0px_4px_39.1px_0px_rgba(0,0,0,0.25)]">
            <div className="p-8 text-center flex justify-center gap-2">
                you will be missed
            </div>
        </div>
    </div>

        }
        </div>
    );
}
  
 function DateTabs(props: {itinerary: any, userStatus:number}) {
    const {id} = useParams()
    const handleDeleteItinerary = (itinerary_id:number) =>{
        apiPost.delete(`/scenes/${id}/deleteitinerary/?id=${itinerary_id}`)
        .then((res:any)=>{
            toast.success("deleted successfully")
        })
        .catch((e:any)=>{
            toast.error("server is not responding")
        })
    }
    const dates = Object.keys(props.itinerary);
    if (dates.length === 0) return  <div
    className="h-[100px] flex justify-center items-end"
    >admin is yet to add new</div>; // Show loading while fetching
  
    return (
      <Tabs defaultValue={dates[0]} className="w-full font-[Graphik Trial]">
         {/* Scrollable Wrapper */}
         <div className="relative w-full overflow-x-auto scrollbar-hide">
            <TabsList className="flex w-full min-w-max gap-2 bg-transparent rounded-lg">
            {dates.map((date) => (
                <TabsTrigger
                key={date}
                value={date}
                className="font-normal border-1 rounded-xl border-[#E2E2E2] py-2 px-4 mr-1 data-[state=active]:bg-[#F1F1FD] data-[state=active]:text-[#4E55E1] data-[state=active]:border-[#B9BCF2]"
                >
                {date}
                </TabsTrigger>
            ))}
            </TabsList>
        </div>
  
        {/* Tabs Content */}
        {dates.map((date) => (
          <TabsContent key={date} value={date} className="mt-2">
            {props.itinerary[date].map((event:any, index:number) => (
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
                                    delete spot
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                            </DropdownMenu>
                            </div>}
                    </div>
                    <div className="font-semibold text-sm mt-4">
                        notes:
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
          </TabsContent>
        ))}
      </Tabs>
    );
  }

function ItineraryContent(props:{about: string, userStatus: number}){
    const { id } = useParams()
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<{ [date: string]: any[] }>({});
    const pathname = usePathname();
    useEffect(()=>{
        apiGet.get(`/scenes/${id}/itinerary`)
        .then((res:any)=>{
            const groupedData: { [date: string]: any[] } = {};
            res.data.forEach((event: any) => {
            const formattedDate = formatDate(event.time);
            if (!groupedData[formattedDate]) {
              groupedData[formattedDate] = [];
            }
            groupedData[formattedDate].push(event);
  
          setData(groupedData);
        });
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
                        <div>add destination</div>
                    </Button>
                </Link>}
            </div>
            {loading? <div
            className="h-[100px] flex justify-center items-end"
            >getting you itinerary...</div> : <DateTabs itinerary={data} userStatus={props.userStatus}/>}
        </div>
    );
}

function CheckListContent(props: {checklist: any, userStatus:number}){
    const {id} = useParams()
    const pathname = usePathname()
    const [checkListFilter, setCheckListFitler] = useState([
        "clothing",
        "personal",
        "girlly",
        "document",
        "miscellaneous",
        "travel-essentials"
    ]);
    const handleDeleteChecklist =(checklist_id : number)=>{
        apiPost.delete(`/scenes/${id}/deletechecklistitem/?id=${checklist_id}`)
        .then((res:any)=>{
            toast.success("successfully deleted")
        })
        .catch((e:any)=>{
            toast.error("server is not responding")
        })
    }
    return(
        <div className="mt-4 mb-[100px]">
            {/* add checklist */}
            <div className="w-full mb-4 mt-2">
                {props.userStatus===0 && <Link href={`${pathname}/add-checklist-item`}>
                    <Button 
                    variant={"outline"}
                    className="w-full h-full rounded-r-full rounded-l-full py-3"
                    >   
                        <Plus className="mr-2"/>
                        <div>add item</div>
                    </Button>
                </Link>
                }
            </div>
            {/* filters */}
            <Tabs className="w-full " defaultValue="clothing">
            <div className="relative w-full overflow-x-auto scrollbar-hide">
                <TabsList
                className="mb-2 bg-transparent"
                >
                    {checkListFilter.map((item, index) => (
                        <TabsTrigger value={item} key={index}
                        className="border-1 rounded-xl border-[#E2E2E2] py-1 px-4 m-1 data-[state=active]:bg-[#F1F1FD] data-[state=active]:text-[#4E55E1] data-[state=active]:border-[#B9BCF2]"
                        >
                            {item}
                        </TabsTrigger>
                    ))}
                </TabsList>
            </div>
                {props.checklist.length === 0 && <div
    className="h-[100px] flex justify-center items-end"
    >admin is yet to add new</div>}
                {checkListFilter.map((item,index)=>{
                        const i = index
                        return(
                            <TabsContent value={item} key={index}>
                                {props.checklist.map((item:any, index:any)=>{
                                    if(item.checkfilter === i+1){
                                        return(
                                            <div key={index}
                                            className="flex justify-between items-center 
                                            bg-[#F5F5F5] p-4 rounded-xl my-4">
                                                <label className=" space-x-2 cursor-pointer flex items-center">
                                                    {/* <div className="flex items-center">
                                                        <Checkbox 
                                                        className="w-5 h-5 border-1 border-[#000000]"
                                                        />
                                                    </div> */}
                                                    <span
                                                    className="italic text-sm ml-4 flex items-center"
                                                    >{item.item}</span>
                                                </label>
                                                {props.userStatus === 0 && <div>
                                                    <DropdownMenu>
                                                            <DropdownMenuTrigger asChild>
                                                            <EllipsisVertical strokeWidth={2}/>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent className="w-40">
                                                            <DropdownMenuItem 
                                                            className=""
                                                            onClick={()=>{handleDeleteChecklist(item.id)}}
                                                            >
                                                                delete spot
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                        </DropdownMenu>
                                                        </div>}
                                            </div>
                                        );
                                    }
                                })}
                            </TabsContent>
                        );
                    })}
            </Tabs>
        </div>
    );
}

function PeopleContent(props: {
    user_organizer: any;
    visitor_list: any;
    admin: boolean;
    userStatus: number;
    reduceOccupancy: any;
}) {
    const [peopleFilter] = useState(["who's up?", "invited", "requests"]);
    const [visitorList, setVisitorList] = useState(props.visitor_list)
    const [accepted, setAccepted] = useState(0);
    const [invited, setInvited] = useState(0);
    const [requested, setRequested] = useState(0);
    const pathname = usePathname()

    const updateVisitorStatus = (id: number, newStatus: number) => {
        setRequested((prev:any)=>{
            return prev - 1
        })
        if(newStatus !== 4){
            setAccepted((prev:any)=>{
                return prev-1
            })
        }
        setVisitorList((prev:any) =>
            prev.map((v:any) =>
                v.id === id ? { ...v, status: newStatus } : v
            )
        );
    };
    useEffect(()=>{
        setVisitorList(props.visitor_list)
    },[props.visitor_list])
    // Calculate counts once when `visitor_list` changes
    useEffect(() => {
        let acc = 0, inv = 0, req = 0;

        props.visitor_list.forEach((item: any) => {
            if (item.status === 0 || item.status === 1) acc++;
            if (item.status === 2) inv++;
            if (item.status === 3) req++;
        });

        setAccepted(acc);
        setInvited(inv);
        setRequested(req);
    }, [props.visitor_list]);

    return (
        <div className="mt-4 mb-[100px] overflow-y-auto">
            {/* Add People */}
            <div className="w-full mb-4">
                {props.userStatus === 0 && (
                    <Link href={pathname + "/add-people"}>
                        <Button
                            variant={"outline"}
                            className="w-full h-full rounded-r-full rounded-l-full py-3"
                        >
                            <Plus className="mr-2" />
                            <div>add person</div>
                        </Button>
                    </Link>
                )}
            </div>

            {/* People Filters */}
            <div>
                {peopleFilter.map((item, index) => (
                    <div key={index}>
                        {index === 0 && (
                            <div className="rounded-xl text-base font-semibold mb-4">
                                {item} ({accepted})
                            </div>
                        )}
                        {index === 1 && (
                            <div className="rounded-xl text-base font-semibold mb-4">
                                {item} ({invited})
                            </div>
                        )}
                        {index === 2 && (
                            <div className="rounded-xl text-base font-semibold mb-4">
                                {item} ({requested})
                            </div>
                        )}
                        <div>
                            {visitorList
                                .filter((visitor: any) => 
                                    (index === 0 && (visitor.status === 0 || visitor.status === 1)) || 
                                    (index === 1 && visitor.status === 2) || 
                                    (index === 2 && visitor.status === 3)
                                )
                                .map((visitor: any, index: number) => (
                                    <RequestProfiles
                                        profile={visitor}
                                        key={index}
                                        userStatus={props.userStatus}
                                        updateVisitorStatus={updateVisitorStatus}
                                        reduceOccupancy={props.reduceOccupancy}
                                    />
                                ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function RequestProfiles(props: {
    profile: any,
    userStatus: number,
    updateVisitorStatus: (id: number, newStatus: number) => void,
    reduceOccupancy: any
}) {
    const { id } = useParams();

    const handleApprove = () => {
        apiPost.post(`/scenes/${id}/approve_join/`, {
            approved_user_id: props.profile.id,
        }).then(() => {
            props.updateVisitorStatus(props.profile.id, 1); // status = 1 for accepted
            toast.success('Approved');
        }).catch(() => {
            toast.error('Request failed');
        });
    };

    const handleDeny = () => {
        apiPost.post(`/scenes/${id}/deny_join/`, {
            denied_user_id: props.profile.id
        }).then(() => {
            props.reduceOccupancy()
            props.updateVisitorStatus(props.profile.id, 4); // status = 4 for denied (you can define your own logic)
            toast.success("Denied");
        }).catch(() => {
            toast.error('Server not responding');
        });
    };

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
                {(props.profile.status === 3 && props.userStatus === 0) && (
                    <div>
                        <Button
                            className="bg-[#4E55E1] border-1 border-[#E2E2E2] mr-1 items-center shadow-none"
                            onClick={handleApprove}
                        >
                            <div className="flex items-center text-xs">approve</div>
                        </Button>
                        <Button
                            className="bg-[#F2F2F2] border-1 border-[#E2E2E2] text-[#000000] shadow-none"
                            onClick={handleDeny}
                        >
                            <div className="flex items-center text-xs">deny</div>
                        </Button>
                    </div>
                )}

                {props.profile.status === 0 && (
                    <div className="self-center text-sm text-[#4E55E1] border-1 border-[#E2E2E2] bg-[#F1F1FD] rounded-lg py-1 px-2">
                        admin
                    </div>
                )}
            </div>
        </div>
    );
}