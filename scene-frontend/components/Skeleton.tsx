import { Skeleton } from "@/components/ui/skeleton";

function SceneSkeleton(){
    return(
        <div className="w-[180px]">
            <Skeleton className="h-[150px] w-[180px] rounded-2xl"/>
            <div className="mt-2">
                <Skeleton className="w-[180px] h-2"/>
                <Skeleton className="w-[180px] h-4"/>
                <Skeleton className="w-[180px] h-2"/>
                <Skeleton className="w-[180px] h-2"/>
            </div>
        </div>
    );
}

function HorizontalSkeleton(){
    return(
        <div>hello</div>
    );
}

function ProfileSkeleton(){
    return(
        <div className="w-[60px] ml-2">
            <Skeleton className="h-[65px] w-[60px] rounded-2xl"/>
            <Skeleton className="w-[60px] mt-2"/>
        </div>
    );
}

function NearByProfileSkeleton(){
    return(
        <div className="px-2 my-2 w-full h-[40px] flex gap-2">
        <Skeleton className="w-[36px] h-[36px]"/>
        <Skeleton className="w-full h-[36px]"/>
        </div>
    );
}

export {
    SceneSkeleton,
    HorizontalSkeleton,
    ProfileSkeleton,
    NearByProfileSkeleton
}