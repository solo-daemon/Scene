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
import { userSceneImage } from "../utils/userSceneImage";
import Avvvatars from "avvvatars-react";
import { getInitials } from "@/lib/utils";
import { Pagination, PaginationContent, PaginationItem, PaginationLink } from "@/components/ui/pagination"; // adjust this if using shadcn

const formatDate = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString("en-GB", { day: "2-digit", month: "long" }); // Example: "24 March"
  };

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
                <img 
                src={props.scene.scene_image}
                // src={haridwar}
                alt="scenery "
                className="object-cover w-full h-full"
                // width={200}
                // height={100}
                // objectFit="cover"
                />
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
                    <Avvvatars value={props.scene.user_organizer_detail.name + props.scene.user_organizer_detail.id} displayValue={getInitials(props.scene.user_organizer_detail.name)} size={16} style="character"/>
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

function SceneList() {
    const [sceneData, setSceneData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
  
    useEffect(() => {
      apiGet.get(`/scenes?page=${currentPage}`)
        .then((res: any) => {
          setSceneData(res.data.results);
          setTotalPages(res.data.total_pages);
        })
        .catch((e: any) => {
          toast.error("Server is not responding");
        });
    }, [currentPage]);
  
    // Generate pagination numbers with wraparound logic
    const getPaginationPages = () => {
      const pagesToShow = 5;
      const half = Math.floor(pagesToShow / 2);
      let pages: number[] = [];
  
      for (let i = -half; i <= half; i++) {
        let page = currentPage + i;
  
        if (page < 1) page += totalPages;
        if (page > totalPages) page -= totalPages;
  
        pages.push(page);
      }
  
      // Ensure uniqueness and sort them
      return Array.from(new Set(pages)).sort((a, b) => a - b);
    };
  
    return (
      <div className="w-full px-4">
  
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-4 overflow-x-auto">
            <Pagination>
              <PaginationContent>
                {/* Prev Arrow */}
                <PaginationItem>
                  <PaginationLink
                    onClick={() => setCurrentPage(prev => (prev > 1 ? prev - 1 : totalPages))}
                  >
                    ←
                  </PaginationLink>
                </PaginationItem>
  
                {/* Dynamic page links */}
                {getPaginationPages().map(page => (
                  <PaginationItem key={page}>
                    <PaginationLink
                      isActive={page === currentPage}
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                ))}
  
                {/* Next Arrow */}
                <PaginationItem>
                  <PaginationLink
                    onClick={() => setCurrentPage(prev => (prev < totalPages ? prev + 1 : 1))}
                  >
                    →
                  </PaginationLink>
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
        {/* Scene cards */}
        {sceneData.map((scene: any) => (
          <ScenesCard key={scene.id} scene={scene} />
        ))}
      </div>
    );
  }
export default function Scenes(){
    const [searchText, setSearchText] = useState("")

    return(
        <div className="">
            {/* Scene */}
            <div className="relative">
                <div className="flex justify-center relative mt-4 fixed top-0">
                    <div
                    className="font-semibold text-lg mt-4"
                    style={{
                        fontFamily: "Spline Sans, sans-serif",
                    }}
                    >scenes</div>
                    <div className="absolute top-2 left-4">
                        <div className="p-2 rounded-full border-[#EDEDED] border-2"
                        onClick={()=> window.history.back()}
                        >
                            <CornerUpLeft color="#000000"
                            size={20}
                            />
                        </div>
                    </div>
                    <Link href={"/create-new-scene"}>
                    <div className="absolute top-2 right-4">
                        <div className="py-2 pl-2">
                            <Plus color="#000000"
                            size={25}
                            />
                        </div>
                    </div>
                    </Link>
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
            <SceneList />
        </div>
    );

}