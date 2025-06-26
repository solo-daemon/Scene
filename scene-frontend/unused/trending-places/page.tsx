"use client";

import { StaticImageData } from 'next/image';

import { CornerUpLeft } from "lucide-react";

import Image from "next/image";
import React from "react";
import haridwar from "@/app/assets/places-nearby/haridwar.webp";
import chakrata from "@/app/assets/places-nearby/chakrata.webp";
import dehradun from "@/app/assets/places-nearby/dehradun.webp";
import dhanaulti from "@/app/assets/places-nearby/dhanaulti.webp";
import kanatal from "@/app/assets/places-nearby/kanatal.webp";
import landour from "@/app/assets/places-nearby/landour.webp";
import lansdowne from "@/app/assets/places-nearby/lansdowne.webp";
import mussoorie from "@/app/assets/places-nearby/mussoorie.webp";
import rishikesh from "@/app/assets/places-nearby/rishikesh.webp";
import tehri from "@/app/assets/places-nearby/tehri.webp";

const trendingPlace = [
    {
        "name": "Haridwar",
        "image": haridwar,
        "distance": "30km",
    },
    {
        "name": "Chakrata",
        "image": chakrata,
        "distance": "150km",
    },
    {
        "name": "Dehradun",
        "image": dehradun,
        "distance": "70km",
    },
    {
        "name": "Dhanaulti",
        "image": dhanaulti,
        "distance": "140km",
    },
    {
        "name": "Kanatal",
        "image": kanatal,
        "distance": "130km",
    },
    {
        "name": "Landour",
        "image": landour,
        "distance": "115km",
    },
    {
        "name": "Lansdowne",
        "image": lansdowne,
        "distance": "130km",
    },
    {
        "name": "Mussoorie",
        "image": mussoorie,
        "distance": "110km",
    },
    {
        "name": "Rishikesh",
        "image": rishikesh,
        "distance": "50km",
    },
    {
        "name": "Tehri",
        "image": tehri,
        "distance": "150km",
    }
];

function TrendingPlacesCard(props: {place: {name: string, image: StaticImageData, distance: string}}){
    return(
        // <Link href={`/trending-places/${props.place.name}`}>
            <div className="flex-col justify-center p-2 items-center">
                <div className="flex justify-center">
                    <div className="w-[80px] h-[80px] flex items-center justify-center">
                        <Image src={props.place.image} 
                        alt="scenery" objectFit="cover"
                        className="rounded-xl w-full h-full"
                        />
                    </div>
                </div>
                <div className="text-center font-semibold text-base">{props.place.name.toLowerCase()}</div>
                <div className="text-center text-[#818181] text-sm">{props.place.distance.toLowerCase()}</div>
            </div>
        // </Link>
    );
}

export default function TrendingPlacesScreen(){
    return(
        <div className="m-4">
            <div className="flex  justify-center items-center relative mt-8">
                <div
                className="font-semibold text-lg flex items-center"
                style={{
                    fontFamily: "Spline Sans, sans-serif",
                }}
                >trending places</div>
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
            <div className="grid grid-cols-3 gap-2 mt-8">
            {trendingPlace.map((place) => (
                    <TrendingPlacesCard key={place.name} place={place} />
                ))}
            </div>
        </div>
    ); 
}