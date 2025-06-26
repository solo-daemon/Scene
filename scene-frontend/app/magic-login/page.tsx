"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import googleIcon from "@/app/assets/login-assets/googleIcon.svg"
import { apiGet, apiPost } from "@/lib/api/base";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import loginSplash2 from "@/app/assets/login-assets/largeScreenSplash2.webp"
import fristScreenView from "@/app/assets/login-assets/firstScreenView.webp"
import SecondScreenView from "@/app/assets/login-assets/SecondScreenView.webp"
import { getGoogleOAuthUrl } from "@/app/utils/googleOauth";

export default function LoginPreviewOne(){
        const handleLogin = () => {
            window.location.href = getGoogleOAuthUrl();
        };
        const [loading, setLoading] = useState(false);
        const handleProfileVerification = () => {
            const userId = localStorage.getItem("userId");
                apiGet.get(`/user/${userId}/isProfileDone/`).then((res: any) => {
                if (res.data.isProfileDone) {
                    window.location.href = "/";
                }else{
                    window.location.href = "/questions";
                }
            })
            .catch((e:any)=>{
                toast.error("sorry! please try reloading or logging in again")
            })
        }
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const urlCode = params.get("code");
        if (urlCode) {
            setLoading(true)
            apiPost.post('/magic-login/',{
                code: urlCode
            }).then((res:any)=>{
                if(res.data.access){
                    localStorage.setItem("token", res.data.access);
                    localStorage.setItem("refresh_token", res.data.refresh);
                    localStorage.setItem("userId", res.data.user_id);
                    localStorage.setItem("user_type", res.data.user_type);
                    handleProfileVerification()
                }
            })
            .catch((err:any) => {
                setLoading(false)
                if (err.response?.status === 401) {
                    toast.error("Unauthorized: Use your IITR email address.");
                } else {
                    toast.error("Something went wrong. Please try again.");
                }
            });
        }
    }, []);
    const [loginStatus, setLoginStatus] = useState(1)
    const handleLoginStatus = () =>{
        if(loginStatus !==3){
            setLoginStatus((prev)=>prev+1)
        }else{
            handleLogin()
        }
    }
    return(
        <div className="relative flex flex-col justify-center items-center h-screen w-screen">
                <div className="fixed top-0 w-screen h-screen">
                <Image src={loginSplash2} alt="login-splash" fill/>
                </div>
                {
                loginStatus===1 && 
                    <div className="z-10 flex flex-col justify-center items-center w-full ">
                        <div >
                            <Image src={fristScreenView} alt="first-screen-view" height={370}/>
                        </div>
                        <div className="font-semibold z-10 p-8">
                            <p className="text-center text-[#ffffff] ">
                                never miss a scene of your circle know what your firends are up to
                            </p>
                        </div>
                    </div>
                }
                {
                loginStatus===2 && 
                    <div className="z-10 flex flex-col justify-center items-center w-full">
                        <div >
                            <Image src={SecondScreenView} alt="second-screen-view" height={370}/>
                        </div>
                        <div className="font-semibold z-10 p-8">
                            <p className="text-center text-[#ffffff] ">
                                never miss a scene of your circle know what your firends are up to
                            </p>
                        </div>
                    </div>
                }
                {
                loginStatus===3 && 
                    <div className="z-10 flex flex-col justify-center items-center w-full">
                        <div >
                            <Image src={SecondScreenView} alt="first-screen-view" height={370}/>
                        </div>
                    </div>
                }
                <div className="z-10 flex justify-between gap-2">
                {Array.from({ length: loginStatus }, (_, i) => (
                        <div
                        key={i}
                        className={
                            "h-2 w-2 rounded-full transition-all duration-300 bg-[#ffffff]"
                        
                        }
                        />
                    ))}
                {Array.from({length: 3-loginStatus}, (_,i)=>(
                    <div className="h-2 w-2 rounded-full transition-all duration-300 bg-[#AAAAAA]" key={i}>
                    </div>
                ))}
                </div>
                {/* Next Button */}
                {loginStatus!==3 ? <div className="fixed bottom-8 w-full">
                <div className="w-full px-4">
                    <Button 
                    className="bg-[#ffffff] w-full z-10 text-[#000000] p-6 font-semibold
                    shadow-none focus:ring-0 focus:outline-none active:bg-[#ffffff] hover:bg-[#ffffff]
                    " 
                    disabled={loading}
                    onClick={handleLoginStatus}>
                         <span>{loading ? "authenticating..." : "next"}</span>
                    </Button>
                </div>
            </div>:
            <div 
            className="fixed bottom-0 w-full bg-white shadow-[0px_4px_39.1px_0px_rgba(0,0,0,0.25)] rounded-t-xl animate-rise-up">
                <div className="py-4 px-8">
                    <div className="w-full mt-2">
                        <Button className="w-full py-6"
                        variant="outline"
                        onClick={handleLogin}
                        >   
                        <div className="w-6 h-6 items-center">
                            <Image src={googleIcon}
                            alt="google-logo" 
                            objectFit="cover"
                            />
                        </div>
                            <div>continue with iitr email</div>
                        </Button>
                    </div>
                </div>
                <div className="flex justify-center mb-4">
                    <div 
                    className="border-1 w-1/8"
                    ></div>
                </div>
                {/* Terms */}
                <div className="text-[#AAAAAA] mb-2 text-xs mt-4">
                    <Link href="/terms">
                        <div className="text-center">by getting started you agree with</div>
                        <div className="text-center"><span className="underline decoration-[#AAAAAA]">privacy</span> and <span className="underline decoration-[#AAAAAA]">terms</span></div>
                    </Link>
                </div>
        </div>
}
        </div>
    );
}
