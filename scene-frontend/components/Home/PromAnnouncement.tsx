import promCoupleIcon from "@/app/assets/prom-assets/promCoupleIcon.webp";
import {
    Avatar,
    AvatarImage
} from "@/components/ui/avatar";
import {
    Heart
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
export default function PromAnnouncement (){
    return(
        <div className="p-4">
            <div className="p-2 border-1 border-[#FF3A3A]/20 rounded-lg">
                <div className="bg-[linear-gradient(321deg,_#E30000_0%,_#4C0000_136.81%)] rounded-md relative h-40">
                    <div
                    className="text-white p-4 relative"
                    >
                        <span className="text-4xl font-semibold font-[Parisienne] bg-[linear-gradient(180deg,_#FFF_0%,_rgba(255,255,255,0.80)_100%)] bg-clip-text text-transparent">
                        The scene of us
                        </span>
                        <div className="absolute text-sm font-medium">
                        more than a prom night
                    </div>
                    </div>
                    <span className="absolute bottom-2 right-2">
                        <Avatar className="rounded-none w-23 h-23">
                            <AvatarImage src={promCoupleIcon.src} className="w-full h-full"/>
                        </Avatar>
                    </span>
                    <Link href={'/prom'}>
                    <span 
                    className="absolute bottom-3 left-4 px-2 bg-[#FFFFFF]/28 py-1 flex rounded-sm gap-2 items-center"
                    >
                        <Heart color="#ffffff" size={15}/>
                        <span className="text-white text-sm font-medium">tap to join</span>
                    </span>
                    </Link>
                </div>
            </div>
        </div>
    );
}