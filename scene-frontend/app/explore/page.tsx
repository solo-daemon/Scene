"use client";
import { Input } from "@/components/ui/input";
import { CornerUpLeft, Search, UserRoundPlus, Share2, Copy, UserRound } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Avatar } from "@radix-ui/react-avatar";
import { apiGet, apiPost } from "@/lib/api/base";
import Link from "next/link";
import { toast } from "sonner";
import copy from "copy-to-clipboard";
import { NearByProfileSkeleton } from "@/components/Skeleton";
import Avvvatars from "avvvatars-react";
import PromHeader from "@/components/Home/PromHeader";
import Logout from "@/components/Home/Logout";
import NavBar from "@/components/NavBar";
import { getInitials } from "@/lib/utils";
import { Pagination, PaginationContent, PaginationItem, PaginationLink } from "@/components/ui/pagination";

export default function ExplorePage() {
    const [searchText, setSearchText] = useState("");
    const [debouncedQuery, setDebouncedQuery] = useState("");
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    // Debounce search
    useEffect(() => {
        const handler = setTimeout(() => setDebouncedQuery(searchText), 600);
        return () => clearTimeout(handler);
    }, [searchText]);

    // Initial fetch and updates
    useEffect(() => {
        if (debouncedQuery.trim()) {
            handleSearch(debouncedQuery);
        } else {
            fetchExploreUsers(currentPage);
        }
    }, [debouncedQuery, currentPage]);

    const fetchExploreUsers = (page: number) => {
        setLoading(true);
        apiGet
            .get(`/user/explore-users/?page=${page}`)
            .then((res: any) => {
                setSearchResults(res.data.results);
                setTotalPages(Math.ceil(res.data.count / 10)); // Assuming 10 per page
                setLoading(false);
            })
            .catch(() => toast.error("Server is not responding"));
    };

    const handleSearch = (query: string) => {
        setLoading(true);
        apiPost
            .post("/user/search/", { text: query })
            .then((res: any) => {
                setSearchResults(res.data);
                setLoading(false);
            })
            .catch(() => toast.error("Search failed"));
    };

    return (
        <div>
            <div className="flex justify-between items-center p-4">
                <PromHeader />
                <Logout />
            </div>

            <div className="px-4 font-[Spline Sans] mb-4">
                <div className="px-2 py-2 flex bg-[#FAFAFA] rounded-xl items-center">
                    <div className="mr-2 ml-2">
                        <Search color="#818181" size={20} />
                    </div>
                    <Input
                        value={searchText}
                        placeholder="search members"
                        className="bg-transparent border-none shadow-none focus:ring-0 focus:outline-none"
                        onChange={(e) => {
                            setSearchText(e.target.value);
                            setCurrentPage(1); // reset to first page on new search
                        }}
                    />
                </div>
            </div>
             {/* Only show pagination when not searching */}
             {!loading && totalPages > 1 && (
                <div className="flex justify-center mt-4 overflow-x-auto">
                    <Pagination>
                    <PaginationContent>
                        {/* Prev Arrow */}
                        <PaginationItem>
                        <PaginationLink
                            onClick={() => setCurrentPage(prev => (prev > 1 ? prev - 1 : totalPages))}
                        >
                            ←
                        </PaginationLink>
                        </PaginationItem>

                        {/* Dynamic Pages */}
                        {(() => {
                        const pagesToShow = 5;
                        const half = Math.floor(pagesToShow / 2);
                        let pages = [];

                        for (let i = -half; i <= half; i++) {
                            let page = currentPage + i;

                            // Wrap around logic
                            if (page < 1) page += totalPages;
                            if (page > totalPages) page -= totalPages;

                            pages.push(page);
                        }

                        // Remove duplicates and sort in display order
                        const uniquePages = Array.from(new Set(pages)).sort((a, b) => a - b);

                        return uniquePages.map(page => (
                            <PaginationItem key={page}>
                            <PaginationLink
                                isActive={currentPage === page}
                                onClick={() => setCurrentPage(page)}
                            >
                                {page}
                            </PaginationLink>
                            </PaginationItem>
                        ));
                        })()}

                        {/* Next Arrow */}
                        <PaginationItem>
                        <PaginationLink
                            onClick={() => setCurrentPage(prev => (prev < totalPages ? prev + 1 : 1))}
                        >
                            →
                        </PaginationLink>
                        </PaginationItem>
                    </PaginationContent>
                    </Pagination>
                </div>
                )}
            <div className="font-[Graphik Trial] mt-2 max-h-120 overflow-y-auto">
                {loading
                    ? Array(3)
                          .fill(null)
                          .map((_, index) => <NearByProfileSkeleton key={index} />)
                    : searchResults.map((item, index) => (
                          <div className="border-1 border-[#ffffff]" key={index}>
                              <ProfileCard profile={item} />
                          </div>
                      ))}
            </div>

            {/* Invite Section */}
            <div className="mx-4 grid grid-cols-16 gap-2 items-center mb-2">
                <div className="border-1 border-[#EBEBEB] col-span-7 h-0"></div>
                <div className="text-[#818181] col-span-2 text-center text-lg">or</div>
                <div className="border-1 border-[#EBEBEB] col-span-7 h-0"></div>
            </div>

            <div className="mx-4 mt-4 mb-[100px]">
                <div className="rounded-2xl bg-[#F1F1FD] px-4 py-4">
                    <div className="flex items-center">
                        <UserRoundPlus size={30} />
                        <div className="ml-2">
                            <div className="text-sm font-medium">can't find your friends?</div>
                            <div className="text-xs font-normal">invite them here</div>
                        </div>
                    </div>
                    <div className="grid grid-cols-16 mt-6">
                        <div className="text-sm rounded-2xl col-span-10 px-6 py-2 bg-[#ffffff] border border-dashed border-[#D9DBF8] border-[1.5px]">
                            <p className="truncate font-[Graphik Trial]">{window.location.href}</p>
                        </div>
                        <div className="col-span-3 flex justify-center items-center px-2">
                            <Button
                                className="w-full bg-[#4E55E1] rounded-lg px-4 py-5"
                                onClick={() => {
                                    copy(window.location.origin);
                                    toast.success("copied to clipboard");
                                }}
                            >
                                <Copy color="#ffffff" size={40} />
                            </Button>
                        </div>
                        <div className="col-span-3 flex justify-center items-center px-2">
                            <Button
                                onClick={async () => {
                                    try {
                                        await navigator.share({
                                            url: window.location.origin,
                                            title: "scene",
                                            text: "scene kya hain?",
                                        });
                                    } catch {}
                                }}
                                className="w-full bg-[#ffffff] border-1 border-[#4E55E1] rounded-lg px-4 py-5"
                                variant={"outline"}
                            >
                                <Share2 color="#4E55E1" size={40} />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            <NavBar window="Explore" />
        </div>
    );
}

function ProfileCard({ profile }: { profile: any }) {
    return (
        <Link href={`/profile/${profile.id}`}>
            <div className="py-3 px-4 font-[Graphik Trial]">
                <div className="flex justify-between ">
                    <div className="flex items-center">
                        <Avatar className="rounded-xl w-[36px] h-[36px]">
                            <Avvvatars
                                value={profile.name + profile.id}
                                size={36}
                                displayValue={getInitials(profile.name)}
                                style="character"
                                radius={10}
                            />
                        </Avatar>
                        <div className="font-semibold text-base ml-4 max-w-35 truncate">
                            {profile?.name?.toLowerCase() || "john doe"}
                        </div>
                    </div>
                    <div className="flex gap-2 items-center">
                        <div className="text-center w-16 truncate px-2 py-1 border-1 border-[#E2E2E2] bg-[#F1F1FD] text-[#4E55E1] rounded-md text-xs">
                            {profile?.branch_slug?.toLowerCase() || "mech"}'{profile?.year % 2000 || "25"}
                        </div>
                        <div className="text-center w-16 truncate px-2 py-1 border-1 border-[#E2E2E2] bg-[#F1F1FD] text-[#4E55E1] rounded-md text-xs">
                            {profile?.college_slug || "iit roorkee"}
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
}