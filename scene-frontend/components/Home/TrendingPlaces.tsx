// "use client";
import Image from "next/image";
import SeeAll from "@/components/Home/SeeAll"
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

function TrendingPlacesCard(props: {place: any}){
    return(
        // <Link href={`/trending-places/${props.place.name}`}>
            <div className="flex-col justify-center p-2 items-center">
                <div className="w-[80px] h-[80px]">
                    <Image src={props.place.image} 
                    alt="scenery" width={80} height={80}
                    className="rounded-xl w-full h-full"
                    />
                </div>
                <div className="text-center font-semibold text-base">{props.place.name.toLowerCase()}</div>
                <div className="text-center text-[#818181] text-sm">{props.place.distance.toLowerCase()}</div>
            </div>
        // </Link>
    );
}


export default function TrendingPlaces(){
    return(
        <div className="mb-[100px]">
             <div className="flex justify-between content-center mt-4 mb-2 px-4">
                <div className="text-xl font-semibold"
                    style={{
                        fontFamily: "Spline Sans, sans-serif",
                    }}
                >trending places nearby</div>
                <div 
                    style={{
                        fontFamily: "Graphik Trial, sans-serif",
                    }}
                className="text-[#4E55E1] self-center font-medium text-sm flex items-center"> 
                <SeeAll />
                </div>
                
            </div>
            <div className="flex justify-start overflow-x-auto mt-2 ml-4">
                {trendingPlace.map((place) => (
                    <TrendingPlacesCard key={place.name} place={place} />
                ))}
            </div>
        </div>
    );
}