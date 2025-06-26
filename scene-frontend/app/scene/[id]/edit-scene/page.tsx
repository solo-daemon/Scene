"use client";

import { CornerUpLeft, ImagePlus, Share, CalendarDays, Tag, MapPin } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { format } from "date-fns";
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { apiPost } from "@/lib/api/base";
import { toast } from "sonner";

const formSchema = z.object({
    scene: z.string().min(2, { message: "Scene name must be at least 2 characters." }),
    location: z.string().min(1, { message: "Scene must have a destination"}),
    // picture: z.string().min(2, { message: "Picture URL is required." }),
    dates: z.object({
        startDate: z.number(),
        endDate: z.number(),
    }),
    capacity: z.number().min(1, { message: "Capacity is required." }),
});

export default function EditScene() {
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            scene: "",
            location: "",
            capacity: 2,
          },
    });
    const [range, setRange] = useState([
        {
            startDate: new Date(),
            endDate: new Date(),
            key: "selection",
        },
    ]);

    const handleDateChange = (ranges: any) => {
        const { startDate, endDate } = ranges.selection;
        setRange([ranges.selection]);

        if (startDate && endDate) {
            form.setValue("dates", {
                startDate: Math.floor(startDate.getTime() / 1000), // Convert to Unix Timestamp
                endDate: Math.floor(endDate.getTime() / 1000),
            });
        }
    };
    const onSubmit = async (data: any) => {
            apiPost.post(`/scenes/`,{
                name: data.scene,
                location_text: data.location,
                capacity: data.capacity,
                start_time: data.dates.startDate,
                end_time: data.dates.endDate,
            })
            .then((res:any)=>{
                toast.success('scene has been created')
                window.location.href = window.location.origin + "/scene/" +res.data
            })
            .catch((e:any)=>{
                toast.error('server is not responding')
            })
    };

    return (
        <div style={{ fontFamily: "Graphik Trial, sans-serif" }}>
            {/* Header */}
            <div className="flex justify-center relative mt-4">
                <div className="font-semibold text-xl mt-4" style={{ fontFamily: "Spline Sans, sans-serif" }}>
                    create new scene
                </div>
                <div className="absolute top-2 left-4">
                    <div className="p-2 rounded-full border-[#EDEDED] border-2"
                    onClick={()=> window.history.back()}
                    >
                        <CornerUpLeft color="#000000" 
                        size={20}
                        />
                    </div>
                </div>
            </div>

            {/* Form */}
            <div className="mt-8 mx-4">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        {/* Scene Name */}
                        <FormField
                            control={form.control}
                            name="scene"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-base">what's the scene</FormLabel>
                                    <FormControl>
                                        <div className="flex items-center bg-[#F5F5F5] px-2 py-2 rounded-lg mx-2">
                                            <Tag size={20} color="#AAAAAA" />
                                            <Input
                                                {...field}
                                                placeholder="name of the scene"
                                                type="text"
                                                className="p-1 border-none shadow-[0] placeholder-[#AAAAAA] text-sm focus:outline-none focus:ring-0 ml-2"
                                            />
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        {/* Scene Location */}
                        <FormField
                            control={form.control}
                            name="location"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-base">where are we going to?</FormLabel>
                                    <FormControl>
                                        <div className="flex items-center bg-[#F5F5F5] px-2 py-2 rounded-lg mx-2">
                                            <MapPin size={20} color="#AAAAAA" />
                                            <Input
                                                {...field}
                                                placeholder="rishikesh..."
                                                type="text"
                                                className="p-1 border-none shadow-[0] placeholder-[#AAAAAA] text-sm focus:outline-none focus:ring-0 ml-2"
                                            />
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        {/* Picture Upload */}
                        {/* <FormField
                            control={form.control}
                            name="picture"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-base">any picture for cover?</FormLabel>
                                    <FormControl>
                                        <div className="flex items-center bg-[#F5F5F5] px-2 py-2 rounded-lg mx-2">
                                            <ImagePlus size={20} color="#AAAAAA" />
                                            <Input
                                                {...field}
                                                placeholder="upload image URL"
                                                type="file"
                                                className="p-1 border-none shadow-[0] placeholder-[#AAAAAA] text-sm focus:outline-none focus:ring-0 ml-2"
                                            />
                                            <Share size={20} color="#000000" />
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        /> */}

                        {/* Date Range Picker */}
                        <FormField
                            control={form.control}
                            name="dates"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-base">when will it be</FormLabel>
                                    <FormControl>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button variant="outline" className="text-sm">
                                                    {field.value?.startDate && field.value?.endDate
                                                        ? `${format(new Date(field.value.startDate * 1000), "PPP")} - ${format(new Date(field.value.endDate * 1000), "PPP")}`
                                                        : "Select Date Range"}
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent align="start">
                                            <DateRange
                                                ranges={range}
                                                onChange={handleDateChange}
                                                moveRangeOnFirstSelection={false}
                                                minDate={new Date()} // ✅ Disables dates before today
                                            />
                                            </PopoverContent>
                                        </Popover>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Capacity */}
                        <FormField
                            control={form.control}
                            name="capacity"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-base">capacity</FormLabel>
                                    <FormControl>
                                        <div className="flex items-center bg-[#F5F5F5] px-2 py-2 rounded-lg mx-2">
                                            <Input
                                                {...field}
                                                type="number"
                                                onChange={(e) => field.onChange(Number(e.target.value))}
                                                className="p-1 border-none shadow-[0] placeholder-[#AAAAAA] text-sm focus:outline-none focus:ring-0 ml-2"
                                            />
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Submit Button */}
                        <div className="relative">
                            <div className="fixed bottom-4 w-full">
                                <div className="w-full pl-0 pr-8">
                                    <Button
                                        type="submit"
                                        className="w-full rounded-xl bg-[#4E55E1] py-8 text-lg"
                                    >
                                        create scene
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </form>
                </Form>
            </div>
        </div>
    );
}