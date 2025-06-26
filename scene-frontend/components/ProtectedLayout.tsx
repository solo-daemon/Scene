"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import largeScreenSplash from "@/app/assets/login-assets/largeScreenSplash.webp";
import FullscreenDialogWrapper from "./ProtectedLayouPage";

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [screenWidth, setScreenWidth] = useState<number>(600); // ✅ Prevent hydration mismatch
    const [hasMounted, setHasMounted] = useState(false); // ✅ Prevents UI flickers
    useEffect(() => {
        setScreenWidth(window.innerWidth);
        setHasMounted(true);
        const handleResize = () => setScreenWidth(window.innerWidth);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    useEffect(() => {
        if (typeof window === "undefined") return; // ✅ Prevent SSR issues
        // 🚫 Don't run if offline
        if (!navigator.onLine) return;
    
        const token = localStorage.getItem("token");
        if (!token) {
            if(pathname==="/"){
                return;
            }
            setIsAuthenticated(false);
            if (pathname !== "/login" && pathname !== "/terms") {
                router.replace("/login");
            }
        } else {
            setIsAuthenticated(true);
            setLoading(false);
        }
    }, [pathname]);

    // ✅ Prevents hydration mismatch by delaying rendering until mounted
    if (!hasMounted) return null;

    if(!navigator.onLine){
        return <>{children}</>
    }
    

    if (pathname === "/terms" || pathname === "/login" || pathname === "/magic-login") {
        if (screenWidth > 600) {
            return (
                <div className="w-screen h-screen relative">
                    <Image 
                        src={largeScreenSplash} 
                        alt="Laptop app coming soon" 
                        fill 
                        className="object-cover" 
                        priority 
                    />
                </div>
            );
        }else{
            return <>{children}</>;
        }
    }

    if (screenWidth > 600) {
        return (
            <div className="w-screen h-screen relative">
                <Image 
                    src={largeScreenSplash} 
                    alt="Laptop app coming soon" 
                    fill 
                    className="object-cover" 
                    priority 
                />
            </div>
        );
    }

    if (loading) {
        return (
            <FullscreenDialogWrapper>
                {children}
            </FullscreenDialogWrapper>
        );
    }

    return <>{children}</>;
}