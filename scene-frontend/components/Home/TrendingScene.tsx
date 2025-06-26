import promImage from "@/app/assets/prom-assets/promImage.png"
import {
    Avatar,
    AvatarImage,
} from "@/components/ui/avatar";
export default function TrendingScene () {

    return(
        <div className="px-4">
            <Avatar className="rounded-none w-full">
                <AvatarImage src={promImage.src}/>
            </Avatar>
        </div>
    );
}