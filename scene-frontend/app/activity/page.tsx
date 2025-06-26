"use client";
import NavBar from "@/components/NavBar";
import SceneHeader from "@/components/Home/Header";
import Link from "next/link";
import { Menu } from "lucide-react";
import { useEffect, useState } from "react";
import { Briefcase, Plus, Minus, UserPlus, ChevronRight, SquarePlus } from "lucide-react";
import { format, isToday, isYesterday, differenceInDays } from "date-fns";
import { apiGet } from "@/lib/api/base";
import { toast } from "sonner";
function categorizeActivities(activities:any) {
  const today:any = [];
  const yesterday:any = [];
  const last7Days:any = [];
  const rest:any = [];

  activities.forEach((item: any) => {
    if (!item.scene) return; // Skip item if scene is null or undefined
  
    const activityDate = new Date(item.timestamp);
  
    if (isToday(activityDate)) {
      today.push(item);
    } else if (isYesterday(activityDate)) {
      yesterday.push(item);
    } else if (differenceInDays(new Date(), activityDate) <= 7) {
      last7Days.push(item);
    } else {
      rest.push(item);
    }
  });
  
  return { today, yesterday, last7Days, rest };

}

export default function ActivityScreen(){
  const [inviteNo, setInviteNo] = useState(0)
  const [requestNo, setRequestNo] = useState(0)
  const [notifications, setNotifications] = useState([])
  const [today, setToday] = useState([]);
  const [yesterday, setYesterday] = useState([]);
  const [last7Days, setLast7Days] = useState([]);
  const [rest, setRest] = useState([])
  useEffect(()=>{
    apiGet.get("/user/activity")
    .then((res:any)=>{
      setInviteNo(res.data.invited_count)
      setRequestNo(res.data.friend_no)
      setNotifications(res.data.notifications)
      if(res.data.notifications.length !== 0)
      {const { today, yesterday, last7Days, rest } = categorizeActivities(res.data.notifications);
      setToday(today);
      setYesterday(yesterday);
      setLast7Days(last7Days);
      setRest(rest);}
    })
    .catch((e:any)=>{
      toast.error("server is not responding")
    })
  },[])

    return(
        <div>
            <div className="m-4">
                {/* header */}
                <div className="flex justify-between items-center">
                    <div className="my-2">
                        <p
                        className="font-semibold text-2xl font-[Spline Sans]"
                        >activity</p>
                    </div>
                    <div>
                        <Menu />
                    </div>
                </div>
                {/* Join Request Redirect */}
                {/* <PromRequest inviteNo={promNo} /> */}
                <JoinRequest inviteNo={inviteNo}/>
                <FriendRequest requestNo={requestNo} />
                {/* List of Activities or Notifications */}
                <div className="mb-[100px]">

                    {
                      (today.length ===0 && yesterday.length===0 && last7Days.length===0
                        && rest.length ===0 
                        ) &&
                        <div className="h-[200px] flex items-center justify-center">
                          <div className="h-[200px] flex items-center text-[#AAAAAA]">
                          no activities found
                          </div>
                        </div>
                    }

                {today.length > 0 && (
        <section>
           <div className="font-semibold text-lg">today</div>
          {today.map((activity:any, index:any) => (
            <Activity key={index} data={activity} />
          ))}
        </section>
      )}

      {yesterday.length > 0 && (
        <section>
          <div className="font-semibold text-lg">yesterday</div>
          {yesterday.map((activity:any, index:any) => (
            <Activity key={index} data={activity} />
          ))}
        </section>
      )}

      {last7Days.length > 0 && (
        <section>
          <div className="font-semibold text-lg">last 7 days</div>
          {last7Days.map((activity:any, index:any) => (
            <Activity key={index} data={activity} />
          ))}
        </section>
      )}

      {rest.length > 0 && (
        <section>
           <div className="font-semibold text-lg">older</div>
          {rest.map((activity:any, index:any) => (
            <Activity key={index} data={activity} />
          ))}
        </section>
      )}
                </div>
            </div>
            <NavBar window="Activity"/>
        </div>
    );
}

function JoinRequest(props:{inviteNo:number}){
    return(
        <Link href={'/activity/join-invites'}>
            <div className="bg-[#F1F1FD] rounded-xl py-2 px-4 my-4 flex justify-between items-center">
                <div className="flex items-center">
                    <SquarePlus />
                    <div className="ml-4">
                        <p className="font-medium">join requests</p>
                        <p className="text-sm">you have <span className="font-medium">{props.inviteNo}</span> active invites</p>
                    </div>
                </div>
                <div className="flex items-center">
                    <div className="py-1 px-3 bg-[#FFFFFF] rounded-lg border-[#E2E2E2] border-1 mr-2 text-[#4E55E1]">
                            {props.inviteNo}
                    </div>
                    <ChevronRight />
                </div>
            </div>
        </Link>
    );
}

function PromRequest(props:{inviteNo:number}){
  return(
      <Link href={'/activity/prom-requests'}>
          <div className="bg-[#FFDDDD] rounded-xl py-2 px-4 my-4 flex justify-between items-center">
              <div className="flex items-center">
                  <SquarePlus />
                  <div className="ml-4">
                      <p className="font-medium">prom requests</p>
                      <p className="text-sm">you have <span className="font-medium">{props.inviteNo}</span> prom requests</p>
                  </div>
              </div>
              <div className="flex items-center">
                  <div className="py-1 px-3 bg-[#FFFFFF] rounded-lg border-[#E2E2E2] border-1 mr-2 text-[#FF2424]">
                          {props.inviteNo}
                  </div>
                  <ChevronRight />
              </div>
          </div>
      </Link>
  );
}

function FriendRequest(props:{requestNo:number}){
  return(
      <Link href={'/activity/friend-requests'}>
          <div className="bg-[#F1F1FD] rounded-xl py-2 px-4 my-4 flex justify-between items-center">
              <div className="flex items-center">
                  <UserPlus />
                  <div className="ml-4">
                      <p className="font-medium">friend requests</p>
                      {props.requestNo === 0 ? <p className="text-sm">no friend requests</p>
                      :  
                      <p className="text-sm">you have <span className="font-medium">{props.requestNo}</span> active invites</p>
                    }
                  </div>
              </div>
              <div className="flex items-center">
                  <div className="py-1 px-3 bg-[#FFFFFF] rounded-lg border-[#E2E2E2] border-1 mr-2 text-[#4E55E1]">
                          {props.requestNo}
                  </div>
                  <ChevronRight />
              </div>
          </div>
      </Link>
  );
}

function Activity(props:{data: any}){
    return(
      <>
        <Link href={`/scene/${props.data.scene.id}`}>
            <div className="flex my-4 items-center font-[Graphik Trial]">
                {props.data.type_text==="ADDITION" && <BriefCaseLogo />}
                {props.data.type_text==="REQUESTED_INVITATION" && <PlusLogo />}
                {props.data.type_text==="REMOVAL" && <MinusLogo />}
               { props.data.type_text==="ADDITION" && <div className="ml-4 text-sm">
                    <span>your scene</span>
                    <span className="font-semibold"> '{props.data.scene.name.toLowerCase()}' </span>
                    <span>is starting in 2 hours!</span>  <span>🎒</span>
                </div>}
                { props.data.type_text==="REQUESTED_INVITATION" && <div className="ml-4 text-sm">
                    <span className="font-semibold">{props.data.scene.user_organizer_detail.name.split(" ")[0].toLowerCase()}</span>
                    <span> invited you to join the scene </span>
                    <span className="font-semibold">'{props.data.scene.name.toLowerCase()}'</span>
                </div>}
                { props.data.type_text==="REMOVAL" && <div className="ml-4 text-sm">
                    <span>you have been removed from </span>
                    <span className="font-semibold">'{props.data.scene.name.toLowerCase()}'</span>
                    <span>by</span>
                    <span className="font-semibold">rohit</span>
                </div>}
            </div>
        </Link>
      </>
    );
}

function BriefCaseLogo(){
    return(
        <div className="p-3 bg-[#4E55E1] rounded-lg ">
            <Briefcase color="#FFFFFF" size={20} strokeWidth={1}/>
        </div>
    );
}

function PlusLogo(){
    return(
        <div className="p-3 bg-[#4BC761] rounded-lg ">
            <Plus color="#FFFFFF" size={20} strokeWidth={2}/>
        </div>
    );
}

function MinusLogo(){
    return(
        <div className="p-3 bg-[#DD5959] rounded-lg ">
            <Minus color="#FFFFFF" size={20} strokeWidth={2}/>
        </div>
    );
}