"use client";
import {
    CornerUpLeft,
    EllipsisVertical
} from 'lucide-react';

import {
    Tabs,
    TabsList,
    TabsTrigger,
    TabsContent,
} from "@/components/ui/tabs"
import yellowClipIcon from "@/app/assets/icons/yellow_paper_clip.png"
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { act, useEffect, useState } from 'react';
// import { Caveat } from 'next/font/google';
import { useParams } from 'next/navigation';
import { apiGet, apiPost } from '@/lib/api/base';
import { toast } from 'sonner';
import Link from 'next/link';
type SlamEntry = {
    id: number;
    from_user: {
      id: number;
      name: string;
    };
    to_user: {
      id: number;
      name: string;
    };
    first_impression: string;
    describe_to_someone: string;
    our_campus_spot: string;
    relive_memory: string;
    relive_day: string;
    never_change: string;
    last_day_plan: string;
    best_advice: string;
    never_forget: string;
    reunion_plan: string;
    my_life_in_ten: string;
    final_farewell: string;
  };

// const caveat = Caveat({ subsets: ['cyrillic'], weight: '400' });
export default function ReadSlam(){
    const [slamData, setSlamData] = useState<SlamEntry | null>(null)
    const { id } = useParams()
    useEffect(()=>{
        apiGet.get(`/slam/${id}`)
        .then((res:any)=>{
            setSlamData(res.data)
        })
        .catch((e:any)=>{
            toast.error("failed to fetch , please reload")
        })
    },[])
    return(
        <div className={"mb-[300px] relative font-[Caveat]"}
        >
            <div className='p-4'>
            <div className="flex  justify-center items-center relative mb-8 mt-8">
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
            </div>
            <div>
                {slamData !== null &&
                    <SlamTag name={slamData.from_user.name} id={slamData.from_user.id}
                />}
            </div>
            <div>
                {slamData !==null &&
                    <SlamQuestions slamData={slamData}/>
                }
            </div>
        </div>
    );
}

function SlamTag({name, id}: {name: string, id:number}){
    return(
        <div className='pt-4 px-4 relative'>
        <div className='rounded-lg p-2 border-1 font-[Patrick Hand]'
        style={{
            borderColor: "rgba(234, 181, 78, 0.20)"
        }}
        >
            <div className='border-1 border-[#EAB54E] px-4 py-5 text-[#664300] bg-[#F6C863] flex justify-between'>
            <Link href={`/profile/${id}`}>
                <span className='text-2xl'>from: {name.split(" ")[0].toLowerCase()}</span></Link>
                <span>
                <EllipsisVertical className='w-4 h-4'color="#664300"/>
                </span>
            </div>
        </div>
        <Avatar className='absolute top-3 right-16 z-10 rounded-none overflow-visible'>
            <AvatarImage src={yellowClipIcon.src} className='w-5 h-10 rounded-none'/>
        </Avatar>
        </div>
    );
}

function SlamQuestions({slamData}: {slamData: SlamEntry}){
    const { id } = useParams()
    const [activeTab, setActiveTab] = useState<string>("page1")
    const [activeTabNumber , setActiveTabNumber] = useState<number>(1)
    const handleNext = () => {
        switch (activeTab){
        case "page1":
            setActiveTabNumber(2)
            setActiveTab("page2")
            return;
        case "page2":
            setActiveTabNumber(3)
            setActiveTab("page3")
            return;
        case "page3":
            setActiveTabNumber(4)
            setActiveTab("page4")
            return;
        case "page4":
            return;
        }
    }
    const handlePrevious = () => {
        switch (activeTab){
        case "page4":
            setActiveTabNumber(3)
            setActiveTab("page3")
            return;
        case "page2":
            setActiveTabNumber(1)
            setActiveTab("page1")
            return;
        case "page3":
            setActiveTabNumber(2)
            setActiveTab("page2")
            return;
        }
    }

    const slamQuestion = [
        "What was your first impression of me?",
        "How would you describe me to someone who’s never met me?",
        "Which campus hangout spot was ‘ours,’ and what made it special?",
        "What’s a memory with me you’d relive right now if you could?",
        "If you could relive one day we spent together, which would it be?",
        "What part of me do you hope will never change?",
        "If we only had one more day on campus, how would we spend it?",
        "What’s the best advice you’ve ever given me—or I’ve given you?",
        "What’s one thing about me you’re sure you’ll never forget?",
        "If we plan a reunion in 10 years, what should we definitely do?",
        "What do you predict my life will look like in 10 years—be creative!",
        "Your final farewell message to me—leave it all on the page!"
    ]
    return(
        <div className='mt-4 relative'>
            <Tabs value={activeTab} className='w-full flex-none'>
            <TabsList className='w-full bg-transparent my-4'>
                    <div className='w-full flex gap-2 justify-stretch p-4'>
                    <div 
                     onClick={()=>{setActiveTab("page1"); setActiveTabNumber(1)}}
                    className={'text-lg w-full p-2 border-1 rounded-md ' + (activeTabNumber>=1 ? "border-[#B2FFC0]" : "border-[#E8E8E8)")}>
                        <TabsTrigger value="page1"
                        className={'p-1 w-full rounded-none border-1 text-xs data-[state=active]:border-[#13BB31] data-[state=active]:text-[#ffffff] data-[state=active]:bg-[#4BC761] '
                    +(activeTabNumber>=1 ? "border-[#13BB31] bg-[#4BC761] text-[#ffffff]": "border-[#C8C8C8] bg-[#DADADA] text-[#70747E]" )
                    }
                        >
                            page-1
                        </TabsTrigger> 
                    </div> 
                    <div 
                    onClick={()=>{setActiveTab("page2"); setActiveTabNumber(2)}}
                    className={'w-full p-2 border-1 rounded-md ' + (activeTabNumber>=2 ? "border-[#B2FFC0]" : "border-[#E8E8E8)")}>
                        <TabsTrigger value="page2"
                        className={'p-1 w-full rounded-none border-1 text-xs data-[state=active]:border-[#13BB31] data-[state=active]:text-[#ffffff] data-[state=active]:bg-[#4BC761] '
                        +(activeTabNumber>=2 ? "border-[#13BB31] bg-[#4BC761] text-[#ffffff]": "border-[#C8C8C8] bg-[#DADADA] text-[#70747E]" )
                        }
                        >
                            page-2
                        </TabsTrigger> 
                    </div> 
                    <div 
                    onClick={()=>{setActiveTab("page3"); setActiveTabNumber(3)}}
                    className={'w-full p-2 border-1 rounded-md ' + (activeTabNumber>=3 ? "border-[#B2FFC0]" : "border-[#E8E8E8)")}>
                        <TabsTrigger value="page3"
                        className={'p-1 w-full rounded-none border-1 text-xs data-[state=active]:border-[#13BB31] data-[state=active]:text-[#ffffff] data-[state=active]:bg-[#4BC761] '
                        +(activeTabNumber>=3 ? "border-[#13BB31] bg-[#4BC761] text-[#ffffff]": "border-[#C8C8C8] bg-[#DADADA] text-[#70747E]" )
                        }
                        >
                            page-3
                        </TabsTrigger> 
                    </div> 
                    <div 
                    onClick={()=>{setActiveTab("page4"); setActiveTabNumber(4)}}
                    className={'w-full p-2 border-1 rounded-md ' + (activeTabNumber>=4 ? "border-[#B2FFC0]" : "border-[#E8E8E8)")}>
                        <TabsTrigger value="page4"
                        className={'p-1 w-full rounded-none border-1 text-xs data-[state=active]:border-[#13BB31] data-[state=active]:text-[#ffffff] data-[state=active]:bg-[#4BC761] '
                        +(activeTabNumber>=4 ? "border-[#13BB31] bg-[#4BC761] text-[#ffffff]": "border-[#C8C8C8] bg-[#DADADA] text-[#70747E]" )
                        }
                        >
                            page-4
                        </TabsTrigger> 
                    </div> 
                    </div>
                </TabsList>
                <TabsContent value="page1" className='space-y-4'>
                    <SlamQuestion 
                        question={slamQuestion[0]} 
                        name='firstImpression' 
                        value={slamData.first_impression}
                    />
                    <SlamQuestion 
                        question={slamQuestion[1]} 
                        name='describeToSomeone' 
                        value={slamData.describe_to_someone}
                    />
                    <SlamQuestion 
                        question={slamQuestion[2]} 
                        name='ourCampusSpot' 
                        value={slamData.our_campus_spot}
                    />
                </TabsContent>

                <TabsContent value="page2" className='space-y-4'>
                    <SlamQuestion 
                        question={slamQuestion[3]} 
                        name='reliveMemory' 
                        value={slamData.relive_memory}
                    />
                    <SlamQuestion 
                        question={slamQuestion[4]} 
                        name='reliveDay' 
                        value={slamData.relive_day}
                    />
                    <SlamQuestion 
                        question={slamQuestion[5]} 
                        name='neverChange' 
                        value={slamData.never_change}
                    />
                </TabsContent>

                <TabsContent value="page3" className='space-y-4'>
                    <SlamQuestion 
                        question={slamQuestion[6]} 
                        name='lastDayPlan' 
                        value={slamData.last_day_plan}
                    />
                    <SlamQuestion 
                        question={slamQuestion[7]} 
                        name='bestAdvice' 
                        value={slamData.best_advice}
                    />
                    <SlamQuestion 
                        question={slamQuestion[8]} 
                        name='neverForget' 
                        value={slamData.never_forget}
                    />
                </TabsContent>

                <TabsContent value="page4" className='space-y-4'>
                    <SlamQuestion 
                        question={slamQuestion[9]} 
                        name='reunionPlan' 
                        value={slamData.reunion_plan}
                    />
                    <SlamQuestion 
                        question={slamQuestion[10]} 
                        name='myLifeInTen' 
                        value={slamData.my_life_in_ten}
                    />
                    <SlamQuestion 
                        question={slamQuestion[11]} 
                        name='finalFarewell' 
                        value={slamData.final_farewell}
                    />
                </TabsContent>
            </Tabs>
            <div className='fixed bottom-2 w-full z-6'>
                <div className='flex gap-4 w-full p-4 z-5'>
                    <div className='w-full p-2 border-1 border-[#E8E8E8] rounded-md bg-white'>
                    <Button 
                    onClick={handlePrevious}
                    className={'w-full border-1 border-[#C8C8C8] text-[#7E828B] py-5 rounded-none shadow-none focus:ring-0 focus:outline-none ' + (activeTab==="page1"? "bg-[#DEDEDE] active:bg-[#DEDEDE] hover:bg-[#DEDEDE] text-[#7E828B]" : "bg-[#4E55E1] active:bg-[#4E55E1] hover:bg-[#4E55E1] text-[#ffffff]")}>
                        previous
                    </Button>
                    </div>
                    <div 
                    className={'w-full p-2 border-1 rounded-md bg-white ' + (activeTab==="page4" ? "border-[#B2FFC0]" : "border-[#E3E5FF]")}>
                        <Button 
                        onClick={handleNext}
                        disabled={activeTab==="page4"}
                        className={'w-full border-1 py-5 rounded-none ' + (activeTab!=="page4" ? "border-[#6B71EB] bg-[#4E55E1] active:bg-[#4E55E1] hover:bg-[#4E55E1]" : "border-[#2BC246] bg-[#5DCD71] active:bg-[#5DCD71] hover:bg-[#5DCD71]")}>
                            {activeTab==="page4" ? "the end" : "next"}
                        </Button>
                    </div>
                </div>
            </div>
            <div className="fixed z-1 bottom-0 w-full">
                <div className="h-14 z-1 bg-[#FAF9F6]"></div>
            </div>
        </div>
    );
}

type SlamDataType = {
    firstImpression: string;
    describeToSomeone: string;
    ourCampusSpot: string;
    reliveMemory: string;
    reliveDay: string;
    neverChange: string;
    lastDayPlan: string;
    bestAdvice: string;
    neverForget: string;
    reunionPlan: string;
    myLifeInTen: string;
    finalFarewell: string;
  };

type SlamQuestionProps = {
    question: string;
    name: string;
    value: string;
  };
  
function SlamQuestion({ question, name, value }: SlamQuestionProps) {
  
    return (
      <div className='px-4'>
        <div
          className='border-1 rounded-md p-2'
          style={{
            borderColor: "rgba(141, 104, 26, 0.20)"
          }}
        >
          <div className='bg-[#805700] text-white p-6'>
            <div className='text-sm text-white text-xl'>
              {question}
            </div>
            <div className='mt-4 text-black min-h-20 p-4 bg-white rounded-none overflow-y-auto'>
                {value}
            </div>
          </div>
        </div>
      </div>
    );
  }


