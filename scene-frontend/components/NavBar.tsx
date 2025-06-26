import { apiGet } from "@/lib/api/base";
import { House, SquareActivity, Compass, IdCard, Plus, Search } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function NavBar(props: {window: string}) {
  const [usertype, setUsertype] = useState("");
  const [userid, setUserid] = useState(0)
  const [activityCount, setActivityCount] = useState(0)
  useEffect(()=>{
    const userType = localStorage.getItem('user_type');
    const userId = Number(localStorage.getItem('userId'));
    setUserid(userId ?? "")
    setUsertype(userType ?? "")
  },[])
  useEffect(()=>{
    const token = localStorage.getItem("token")
    if(token){
      apiGet.get("/user/activity_count/")
    .then((res)=>{
      setActivityCount(res.data.activity_count)
    })
    .catch((e:any)=>{
      toast.error("please refresh")
    })
    }
  },[])
  useEffect(()=>{
    const token = localStorage.getItem("token")
  },[])
  return (
    <div className="realtive flex justify-center">
        <div className="fixed bottom-4 w-full flex justify-center p-2 z-10">
            <div className="bg-[#101828] p-4 w-full rounded-xl flex items-center justify-between " >
                <Link href={`/`}>
                    {props.window=="Home"?
                        <House  color="#FFFFFF" size={24}  />:
                        <House color="#70747E" size={20}/>
                    }
                </Link>
                <Link href={`/explore`}>
                {props.window=="Explore"?
                        <Search  color="#FFFFFF" size={24} />:
                        <Search color="#70747E" size={20}/>
                    }
                </Link>
      {/* Floating Action Button (FAB) */}
      <Link href={usertype === "RESTAURANT" ? '/create-new-scene/restaurant' : '/create-new-scene'}>
      <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-indigo-500 p-3 rounded-full shadow-md border-4 border-white">
        <Plus color="#FFFFFF"/>
      </div>
      </Link>
    <Link href={`/activity`} className="relative">
              {props.window === "Activity" ? (
              <SquareActivity color="#FFFFFF" size={24} />
            ) : (
              <SquareActivity color="#70747E" size={20} />
            )}

            {activityCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[16px] text-center">
                {activityCount > 9 ? '9+' : activityCount}
              </span>
            )}
        </Link>
  <Link href={usertype === "RESTAURANT" ? `/profile/restaurant/${userid}`: `/profile`}>
      {props.window=="Profile"?
                <IdCard  color="#FFFFFF" size={24}/>:
                <IdCard color="#70747E" size={20} />
            }
    </Link>
    </div>
            </div>
        </div>

  );
}