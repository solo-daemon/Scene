"use client";
import { PeopleNearBy} from "@/components/Home/PeopleNearby";
import ScenesCooking from "@/components/Home/ScenesCooking";
import NavBar from "@/components/NavBar";
import RestaurantsNearby from "@/components/Home/RestaurantsNearby";
import Logout from "@/components/Home/Logout";

import PromHeader from "@/components/Home/PromHeader";
export default function Home() {
  return (
    <div className="flex flex-col mb-[100px]">
      <div className="flex justify-between items-center px-4 pt-4">
            {/* <SceneHeader /> */}
            <PromHeader />
            {/* <div className="self-center">
                <Menu />
            </div> */}
            <div className="flex items-center gap-2">
            {/* <SendNotification /> */}
            <Logout />
            </div>
        </div>
    {/* THIS WAS CREATED SPECIFICALLY FORM PROM NIGHT */}
      {/* <PromAnnouncement /> */}
      {/* <YourLastWords setOpen={setOpen}/> */}
      {/* <RequestSlamDialog isOpen={open} setOpen={setOpen}/> */}
      {/* {!loading ? <div>
      {isProm ? <UpForProm /> : <PeopleNearBy />}
      </div>:<div>
      <div className="flex justify-between content-center mt-2 mb-2 px-4">
                <div className="text-xl font-semibold"
                    style={{
                        fontFamily: "Spline Sans, sans-serif",
                    }}
                >people nearby?</div>
                <div 
                    style={{
                        fontFamily: "Graphik Trial, sans-serif",
                    }}
                className="text-[#4E55E1] self-center font-medium text-sm flex items-center"><Link href="/explore">see all</Link></div>
            </div>
        <div className="flex pl-4">
      {Array(10).fill(null).map((_, index) => (
            <ProfileSkeleton key={index} />
        ))}
      </div>
      </div>
      
    } */}
    <PeopleNearBy />
      <ScenesCooking />
      <RestaurantsNearby />
      {/* <WebPush /> */}
      <NavBar window="Home"/>
    </div>
  );
}
// WAS ADDED FOR SLAM FEATURE
// function RequestSlamDialog(props:{isOpen:boolean, setOpen:any}){
//   const userId = localStorage.getItem('userId')

//   return(
//       <Dialog open={props.isOpen} onOpenChange={()=>{props.setOpen(false)}}
//       >
//       <DialogContent className={"p-0 bg-transparent border-0 text-white font-[Caveat]"}
//       >
//       <VisuallyHidden>
//       <DialogTitle>Download story template</DialogTitle>
//     </VisuallyHidden>
//       <div className="relative bg-transparent">
//           <div className="p-2 border-1 bg-white rounded-md"
//           style={{
//               borderColor: "rgba(234, 181, 78, 0.20)"
//           }}
//           >
//             <DialogClose asChild>
//             <button className="absolute top-4 right-4 text-[#75561A] hover:text-[#75561A]">
//               <X className="w-5 h-5 fill-[#75561A]" color="#75561A"/>
//             </button>
//       </DialogClose>
//               <div className="bg-[#F6C863] border-1 px-4 py-6 border-[#EAB54E] space-y-4">
//                   <div className="text-[#75561A] text-xl">
//                   you can download the story template, add the link and share on your socials:
//                   </div>
//                   <div className="border-1 border-[#E3E5FF] p-2 bg-white rounded-md relative">
//                       <Button className="rounded-none w-full border-1 border-[#7A7FED] py-6 bg-[#6066E4] text-xl
//                        shadow-none focus:ring-0 focus:outline-none active:bg-[#6066E4] hover:bg-[#6066E4]
//                       "
//                       onClick={handleSlamTemplateDownload}
//                       >
//                           <Download className="w-4 h-4" color="#ffffff"/>
//                           download story template
//                       </Button>
//                       <span className="absolute -top-3 left-6">
//                           <img src={tapeIcon.src} className="w-6 h-8"/>
//                       </span>
//                       <span className="absolute -top-3 right-6">
//                           <img src={tapeIcon.src} className="w-6 h-8"/>
//                       </span>
//                   </div>
//                   <div className="border-1 border-[#E3E5FF] p-2 bg-white rounded-md relative">
//                       <Button className="rounded-none w-full border-1 border-[#7A7FED] py-6 bg-[#6066E4] text-xl
//                       shadow-none focus:ring-0 focus:outline-none active:bg-[#6066E4] hover:bg-[#6066E4]
//                       "
//                       onClick={()=>{
//                           copy(`https://scene.net.in/profile/${userId}/write-slam/`)
//                           toast.success("copied to clipboard")
//                       }}
//                       >
//                       <Copy className="w-4 h-4" color="#ffffff"/>
//                           copy link to your slam
//                       </Button>
//                       <span className="absolute -top-3 left-6">
//                           <img src={tapeIcon.src} className="w-6 h-8"/>
//                       </span>
//                       <span className="absolute -top-3 right-6">
//                           <img src={tapeIcon.src} className="w-6 h-8"/>
//                       </span>
//                   </div>
//               </div>
//           </div>
//           <span className="absolute right-16 -top-1">
//                   <img src={yellowClipIcon.src} alt="clip" className="w-5 h-10"></img>
//           </span>
//       </div>
//       </DialogContent>
//       </Dialog>
//   );
//   }
//   function YourLastWords(props: {setOpen:any}){
//       return(
//           <div className="p-4 relative font-[Graphik Trial]">
//               <div className="p-2 border-1 rounded-md"
//               style={{ borderColor: "rgba(96, 102, 228, 0.20)" }}
//               >
//                   <div className="bg-[#4E55E1] rounded-md relative h-40">
//                       <div className="font-bold text-lg text-white pt-4 px-4">
//                           introducing slamscene
//                       </div>
//                       <p className="text-white text-xs px-4">
//                       Ask your friends to write one final note before we graduate
//                       </p>
//                       <div className="absolute bottom-4 ml-4 flex gap-2">
//                       <Button style={{ backgroundColor: "rgba(255, 255, 255, 0.12)" }}
//                       className="font-semibold px-2 py-0 text-xs/3"
//                       onClick={()=>{props.setOpen(true)}}
//                       >
//                           <span>
//                               <img src={quillIcon.src} className="w-4 h-4" alt="quill"></img>
//                           </span>
//                           ask now
//                       </Button>
//                       <Link href={'/explore'}>
//                       <Button style={{ backgroundColor: "rgba(255, 255, 255, 0.12)" }}
//                       className="font-semibold px-2 py-0 text-xs/3"
//                       >
//                           <Search color="#ffffff" size={2} className="w-2 h-2"/>
//                           fill a friend's
//                       </Button>
//                       </Link>
//                       </div>
//                       <span className="absolute bottom-0 right-8">
//                           <img src={highFiveIcon.src} className="w-12 h-12" alt="high five"/>
//                       </span>
//                   </div>
//               </div>
//               <span className="absolute top-2 right-16" >
//                   <img src={clipIcon.src} className="w-5 h-12" alt="clip"/>
//               </span>
//           </div>
//       );
//   }
