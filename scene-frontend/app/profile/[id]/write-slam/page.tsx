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
import { act, useState, useRef, useEffect } from 'react';
import { Textarea } from '@/components/ui/textarea';
// import { Caveat } from 'next/font/google';
import { useParams } from 'next/navigation';
import { apiGet, apiPost } from '@/lib/api/base';
import { toast } from 'sonner';
import { Check } from 'lucide-react';
import Link from 'next/link';
// const caveat = Caveat({ subsets: ['cyrillic'], weight: '400' });
export default function WriteSlam(){
    const [isSlamSent, setIsSlamSent] = useState(false)
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
            {!isSlamSent && <div className='text-center text-lg pt-4 text-[#664300]'>*slams are one time,uneditable and will stay forever</div>}
            </div>
            {!isSlamSent ?<><div>
                <SlamTag />
            </div>
            <div>
                <SlamQuestions setIsSlamSent={setIsSlamSent}/>
            </div></>
        : <QuestionsCompleted />    
        }
        </div>
    );
}


function QuestionsCompleted(props:{}){

    return(
        <div className="relative">
          <div>
            <div className="flex flex-col items-center text-center p-6 bg-white rounded-lg max-w-full mt-[100px]">
              {/* Green checkmark with ripple effect */}
              <div className="relative flex items-center justify-center w-[200px] h-[200px]">
                <div className="absolute w-full h-full bg-green-100 rounded-full animate-ping"></div>
                <div className="absolute w-2/3 h-2/3 bg-green-200 rounded-full animate-ping"></div>
                <div className="absolute w-1/3 h-1/3 bg-green-300 rounded-full"></div>
                <div className="p-4 z-10 bg-[#4BC761] rounded-full">
                <Check className="w-20 h-20" color="#ffffff"/>
                </div>
              </div>

              {/* Text Section */}
            </div>
            <div className="flex flex-col item-center justify-center">
            <h1 className="mt-6 text-3xl font-bold text-black text-center">slam has been sent</h1>
            </div>
          </div>
          <div className='fixed bottom-4 p-4 w-full'>
          <div className='p-2 w-full border-[#E3E5FF] border-1 rounded-lg'>
            <Link href={'/'}>
            <Button className='text-xl w-full py-6 border-[#6B71EB] bg-[#4E55E1] active:bg-[#4E55E1] hover:bg-[#4E55E1] border-1 py-5 rounded-none shadow-none focus:ring-0 focus:outline-none'>
                back to home
            </Button>
            </Link>
            </div>
            </div>
        </div>
    );
}

type BasicUserType = {
    name: string
}

function SlamTag(){
    const { id } = useParams()
    const [user, setUser] = useState<BasicUserType | null>(null)
    useEffect(()=>{
        apiGet.get(`/user/${id}/basic-info`)
        .then((res:any)=>{
            setUser(res.data)
        })
        .catch((e:any)=>{
            toast.error("server is not responding, please refresh")
        })
    },[])
    return(
        <div className='pt-4 px-4 relative'>
        <div className='rounded-lg p-2 border-1 font-[Patrick Hand]'
        style={{
            borderColor: "rgba(234, 181, 78, 0.20)"
        }}
        >
            <div className='border-1 border-[#EAB54E] px-4 py-5 text-[#664300] bg-[#F6C863] flex justify-between'>
                <span className='text-2xl'>for: {user && user?.name.split(" ")[0].toLowerCase()}</span>
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

function SlamQuestions({setIsSlamSent}:{setIsSlamSent:any}){
    const { id } = useParams()
    const [activeTab, setActiveTab] = useState<string>("page1")
    const [activeTabNumber , setActiveTabNumber] = useState<number>(1)
    const handleNext = () => {
        switch (activeTab){
        case "page1":
            handleSend()
            setActiveTabNumber(2)
            setActiveTab("page2")
            return;
        case "page2":
            handleSend()
            setActiveTabNumber(3)
            setActiveTab("page3")
            return;
        case "page3":
            handleSend()
            setActiveTabNumber(4)
            setActiveTab("page4")
            return;
        case "page4":
            handleSend()
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
    
    const [slamData, setSlamData] = useState({
        firstImpression: "",
        describeToSomeone: "",
        ourCampusSpot: "",
        reliveMemory: "",
        reliveDay: "",
        neverChange: "",
        lastDayPlan: "",
        bestAdvice: "",
        neverForget: "",
        reunionPlan: "",
        myLifeInTen: "",
        finalFarewell: ""
    });

    useEffect(() => {
        if (!id) return;
    
        const fetchSlamData = async () => {
            try {
                const res = await apiGet.get(`/slam/get-slam/?user_id=${id}`);
                const data = res.data;
                if(data.status===1){
                    setIsSlamSent(true)
                }
                // Convert snake_case keys from the API to camelCase
                const transformedData = {
                    firstImpression: data.first_impression,
                    describeToSomeone: data.describe_to_someone,
                    ourCampusSpot: data.our_campus_spot,
                    reliveMemory: data.relive_memory,
                    reliveDay: data.relive_day,
                    neverChange: data.never_change,
                    lastDayPlan: data.last_day_plan,
                    bestAdvice: data.best_advice,
                    neverForget: data.never_forget,
                    reunionPlan: data.reunion_plan,
                    myLifeInTen: data.my_life_in_ten,
                    finalFarewell: data.final_farewell
                };
            
                setSlamData(transformedData);
            } catch (error) {

            }
        };
    
        fetchSlamData();
    }, [id]); 
    const handleSend = ()=>{
        let status = 0;
        if(activeTab==="page4"){
            status=1
        }
        const requestBody = {
            "status": status,
            "user_id": id,
            "first_impression": slamData.firstImpression,
            "describe_to_someone": slamData.describeToSomeone,
            "our_campus_spot": slamData.ourCampusSpot,
            "relive_memory": slamData.reliveMemory,
            "relive_day": slamData.reliveDay,
            "never_change": slamData.neverChange,
            "last_day_plan": slamData.lastDayPlan,
            "best_advice": slamData.bestAdvice,
            "never_forget": slamData.neverForget,
            "reunion_plan": slamData.reunionPlan,
            "my_life_in_ten": slamData.myLifeInTen,
            "final_farewell": slamData.finalFarewell,
          }
        apiPost.post('/slam/',requestBody)
        .then((res:any)=>{
            if(activeTab==="page4"){
                setIsSlamSent(true)
            }
        })
        .catch((e:any)=>{
            toast.error(e?.response.data.detail)
        })
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
    const placeholders = [
        "Be honest — did I look like trouble or topper?",
        "Use three words. Or a short roast. Or both.",
        "The place with bad chai and great conversations?",
        "That random Tuesday night. You know the one.",
        "Be specific. And don’t skip the drama.",
        "Besides your playlist taste or your horrible puns.",
        "Sunset point, bunked classes, and…?",
        "Words we laughed at then but needed later.",
        "Your vibe? Your chaos? Your 3AM calls?",
        "Go back to that café. Or crash a fresher’s party?",
        "Still late to class. But in a cooler city.",
        "No emojis. No edits. Just what you mean.",
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
                        value={slamData.firstImpression}
                        setSlamData={setSlamData} 
                        placeholder={placeholders[0]}
                    />
                    <SlamQuestion 
                        question={slamQuestion[1]} 
                        name='describeToSomeone' 
                        value={slamData.describeToSomeone}
                        setSlamData={setSlamData} 
                        placeholder={placeholders[1]}
                    />
                    <SlamQuestion 
                        question={slamQuestion[2]} 
                        name='ourCampusSpot' 
                        value={slamData.ourCampusSpot}
                        setSlamData={setSlamData} 
                        placeholder={placeholders[2]}
                    />
                </TabsContent>

                <TabsContent value="page2" className='space-y-4'>
                    <SlamQuestion 
                        question={slamQuestion[3]} 
                        name='reliveMemory' 
                        value={slamData.reliveMemory}
                        setSlamData={setSlamData} 
                        placeholder={placeholders[3]}
                    />
                    <SlamQuestion 
                        question={slamQuestion[4]} 
                        name='reliveDay' 
                        value={slamData.reliveDay}
                        setSlamData={setSlamData} 
                        placeholder={placeholders[4]}
                    />
                    <SlamQuestion 
                        question={slamQuestion[5]} 
                        name='neverChange' 
                        value={slamData.neverChange}
                        setSlamData={setSlamData} 
                        placeholder={placeholders[5]}
                    />
                </TabsContent>

                <TabsContent value="page3" className='space-y-4'>
                    <SlamQuestion 
                        question={slamQuestion[6]} 
                        name='lastDayPlan' 
                        value={slamData.lastDayPlan}
                        setSlamData={setSlamData} 
                        placeholder={placeholders[6]}
                    />
                    <SlamQuestion 
                        question={slamQuestion[7]} 
                        name='bestAdvice' 
                        value={slamData.bestAdvice}
                        setSlamData={setSlamData} 
                        placeholder={placeholders[7]}
                    />
                    <SlamQuestion 
                        question={slamQuestion[8]} 
                        name='neverForget' 
                        value={slamData.neverForget}
                        setSlamData={setSlamData} 
                        placeholder={placeholders[8]}
                    />
                </TabsContent>

                <TabsContent value="page4" className='space-y-4'>
                    <SlamQuestion 
                        question={slamQuestion[9]} 
                        name='reunionPlan' 
                        value={slamData.reunionPlan}
                        setSlamData={setSlamData} 
                        placeholder={placeholders[9]}
                    />
                    <SlamQuestion 
                        question={slamQuestion[10]} 
                        name='myLifeInTen' 
                        value={slamData.myLifeInTen}
                        setSlamData={setSlamData} 
                        placeholder={placeholders[10]}
                    />
                    <SlamQuestion 
                        question={slamQuestion[11]} 
                        name='finalFarewell' 
                        value={slamData.finalFarewell}
                        setSlamData={setSlamData} 
                        placeholder={placeholders[11]}
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
                    className={'w-full p-2 border-1 rounded-md bg-white shadow-none focus:ring-0 focus:outline-none' + (activeTab==="page4" ? "border-[#B2FFC0]" : "border-[#E3E5FF]")}>
                        <Button 
                        onClick={handleNext}
                        className={'w-full border-1 py-5 rounded-none shadow-none focus:ring-0 focus:outline-none ' + (activeTab!=="page4" ? "border-[#6B71EB] bg-[#4E55E1] active:bg-[#4E55E1] hover:bg-[#4E55E1]" : "border-[#2BC246] bg-[#5DCD71] active:bg-[#5DCD71] hover:bg-[#5DCD71]")}>
                            {activeTab==="page4" ? "send" : "save and next"}
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
    setSlamData: React.Dispatch<React.SetStateAction<SlamDataType>>;
    placeholder: string
  };
  
function SlamQuestion({ question, name, value, setSlamData, placeholder }: SlamQuestionProps) {
    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setSlamData(prev => ({
        ...prev,
        [name]: e.target.value
      }));
    };
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
        textareaRef.current.style.height = textareaRef.current.scrollHeight + "px";
      }
    }, [value]);
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
            <div className='mt-4 text-black'>
              <Textarea
                placeholder={placeholder}
                ref={textareaRef}
                name={name}
                className='text-lg bg-white rounded-none min-h-20 focus-visible:ring-0 focus-visible:ring-offset-0'
                value={value}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }


