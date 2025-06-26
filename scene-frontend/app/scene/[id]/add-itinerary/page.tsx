"use client";
import { Button } from "@/components/ui/button";
import { CornerUpLeft, MapPin, Plus, Minus } from "lucide-react";
import { Calendar as CalendarIcon } from "lucide-react";
import { useParams } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input"
import { apiGet, apiPost } from "@/lib/api/base";
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import * as React from "react"
import { toast } from "sonner";
export default function AddItinerary(){
    return(
    <div className="font-[Graphik Trial]">
        <div className="flex  justify-center items-center relative m-4 mt-8">
            <div
            className="font-semibold text-lg flex items-center"
            style={{
                fontFamily: "Spline Sans, sans-serif",
            }}
            >add item</div>
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
        <div>
            <ItineraryForm />
        </div>
    </div>
    )
}

function ItineraryForm(){
    const { id } = useParams()
    const [sceneName, setSceneName] = useState("");
    const [notes, setNotes] = useState([""]);
    const [date, setDate] = React.useState<Date>()
    const [dateRange, setDateRange] = useState<{ start: Date; end: Date } | null>(null);
    const handleSubmit = () =>{
        const unixTimestamp = date ? Math.floor(date.getTime() / 1000) : null;
        if(sceneName !== ""){
            apiPost.post(`/scenes/${id}/itinerary/`,{
                spot_name: sceneName,
                notes: notes,
                time: unixTimestamp,
            })
            .then((res:any)=>{
                toast.success("added to itinerary")
                window.history.back()
            })
            .catch((e:any)=>{
                console.error(e)
            })
        }else{
            toast.warning("all fields are necessary")
        }
    }
    useEffect(()=>{
        apiGet.get(`/scenes/${id}/get_time`)
        .then((res:any)=>{
            setDateRange({
                start: new Date(res.data.start_time * 1000), // Convert Unix timestamp to Date
                end: new Date(res.data.end_time * 1000),
            });
        })
        .catch((e:any)=>{
            toast.error("server is not responding")
        })
    },[])
    return(
        <div>
            <div className="m-4">
                <div className="mt-4">
                    <div className="text-base font-bold">name of the spot</div>
                    <div className="flex items-center bg-[#F5F5F5] px-2 py-2 rounded-lg mt-2">
                        <MapPin size={20} color="#AAAAAA"/>
                        <Input 
                            value={sceneName}
                            placeholder="name of the spot"
                            className="ml-2 bg-transparent border-none shadow-none"
                            type="text"
                            onChange={(e)=>{setSceneName((prev)=>{
                                return(e.target.value)
                            })}}
                        />
                    </div>
                </div>
                <div className="mt-4">
                    <div className="text-base font-bold">which date?</div>
                    <div className="flex items-center bg-[#F5F5F5] px-2 py-2 rounded-lg mt-2">
                        <div className="mr-2">
                            <CalendarIcon size={20} color="#AAAAAA"/>
                        </div>
                        <Popover>
                        <PopoverTrigger asChild>
                            <div className="w-full">
                            <Button
                            variant={"outline"}
                            className={cn(
                                "w-full justify-start font-normal bg-transparent ",
                                !date && "text-muted-foreground"
                            )}
                            >
                            {date ? format(date, "PPP") : <span>Pick a date</span>}
                            </Button>
                            </div>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                        {dateRange ? (
                            <Calendar
                                mode="single"
                                selected={date}
                                onSelect={setDate}
                                initialFocus
                                disabled={(day) =>
                                    day < dateRange.start || day > dateRange.end // Disable dates outside range
                                }
                            />
                        ) : (
                            <div className="p-4 text-center">Loading...</div> // Show a loading state while fetching data
                        )}
                        </PopoverContent>
                        </Popover>
                    </div>
                </div>
                <div className="mt-4">
                    <div className="text-base font-bold">any notes?</div>
                    <div>
                        {notes.map((item, index)=>{
                            return(
                                <div className="bg-[#F5F5F5] px-2 py-2 rounded-lg mt-2 flex justify-between items-center"
                                key={index}
                                >
                                    <Input
                                        value={notes[index]}
                                        placeholder="must eats?"
                                        className="bg-transparent border-none shadow-none focus:ring-0 focus:outline-none"
                                        type="text"
                                        onChange={(e) => {
                                            setNotes((prev) => {
                                                let value = [...prev];
                                                value[index] = e.target.value;
                                                return value;
                                            });
                                        }}
                                    />
                                    <div className="bg-[#ffffff] border-2 border-red-300 rounded-sm ml-2"
                                    onClick={()=>{
                                        if(notes.length > 1){
                                            let value = [...notes]
                                            value.splice(index, 1)
                                            setNotes(value)
                                        }
                                    }}
                                    >
                                        <Minus color="#FD0000" size={20}/>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                    <div className="mt-4">
                        <Button 
                        variant={"outline"}
                        className="w-full h-full rounded-r-full rounded-l-full py-3"
                        onClick={(e)=>{
                            const updatedNotes = [...notes, ""]
                            setNotes(updatedNotes)
                        }}
                        >   
                            <Plus className="mr-2"/>
                            <div>add more notes</div>
                        </Button>
                    </div>
                </div>
            </div>
            <div className="relative">
                <div className="p-8 fixed bottom-0 w-full">
                    <Button className="w-full bg-[#4E55E1] py-6"
                    onClick={handleSubmit}
                    >
                        <div>add item</div>
                    </Button>
                </div>
            </div>
        </div>
    )
}