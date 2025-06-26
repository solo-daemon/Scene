"use client";
import { Button } from "@/components/ui/button";
import { CornerUpLeft, Shirt } from "lucide-react";
import { useParams } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label";
import { apiPost } from "@/lib/api/base";
import { toast } from "sonner";
export default function AddChecklistItem(){
    return(
        <div>
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
                <CheckListForm />
            </div>
        </div>
    );
}

function CheckListForm(){
    const {id} = useParams()
    const [tags, setTags] = useState([
        "clothing",
        "personal",
        "girlly",
        "document",
        "miscellaneous",
        "travel-essentials"
    ]);
    const [checkfilter, setCheckFilter] = useState(0);
    // form schema
    const formSchema = z.object({
        item: z.string().min(2, {
          message: "Username must be at least 2 characters.",
        }),
    })
      // 1. Define your form.
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
        item: "",
        },
    })
    
    // 2. Define a submit handler.
    function onSubmit(values: z.infer<typeof formSchema>) {
        apiPost.post(`/scenes/${id}/checklistitem/`,{
            item: values.item,
            checkfilter: checkfilter + 1
        })
        .then((res:any)=>{
            window.history.back()
        })
        .catch((err:any)=>{
            toast.error("serer is not responding")
        })
    }
    return(
        <div>
            <div>
                <div>
        <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
            control={form.control}
            name="item"
            render={({ field }) => (
                <FormItem className="m-4 mt-8">
                    <FormLabel className="text-lg font-bold">name of the item</FormLabel>
                    <FormControl>
                    <div className="flex items-center bg-[#F5F5F5] px-2 py-2 rounded-lg mx-2">
                        <Shirt size={20} color="#AAAAAA" />
                        <Input
                            {...field}
                            placeholder="what are you packing?"
                            type="text"
                            className="p-1 bg-transparent border-none shadow-none placeholder-[#AAAAAA] text-base focus:outline-none focus:ring-0 ml-2"
                        />
                    </div>
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
            <div className="m-4"> 
                <div className="text-lg font-bold">choose tag</div>
                <div className="flex flex-wrap gap-2 mt-2">
                    {tags.map((tag, index)=>{
                        if(index === checkfilter){
                            return(
                            <div className="cursor-pointer rounded-full px-4 py-2 text-[#4E55E1] bg-[#EAEBFB] text-sm flex items-center"
                            onClick={()=>{setCheckFilter(index)}}
                            key={index}
                            >
                                {tag}
                            </div>
                            )
                        }
                        return(
                            <div className="cursor-pointer rounded-full px-4 py-2 border border-[#E2E2E2] text-sm flex items-center 
                            hover:bg-gray-200"
                            onClick={()=>{setCheckFilter(index)}}
                            key={index}
                            >
                                {tag}
                            </div>
                        )
                    })}
                </div>
            </div>
            <div className="relative">
                <div className="p-8 fixed bottom-0 w-full">
                    <Button  type="submit" className="w-full bg-[#4E55E1] py-6">
                        <div>add item</div>
                    </Button>
                </div>
            </div>
        </form>
    </Form>
    </div>
    {/* add item button */}
        </div>
    </div>
    )
}