"use client";
import { Button } from "@/components/ui/button";
import { Bot, SquareChartGantt } from "lucide-react";
import Link from "next/link";
import RoleBasedRoadmap from './components/role-based-roadmap'
import MyRoadmap from './components/my-roadmap'
import { useEffect, useState } from "react";
export default function Dashboard() {
    const [isLogin, setIsLogin] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("token");
        setIsLogin(!!token);
    }, []);
    return (
        <>
            <div className="bg-slate-900 min-h-auto relative min-h-[192px] border-b border-b-[#1e293c] transition-all sm:min-h-[281px]">
                <div className="container px-5 py-6 pb-14 text-left transition-opacity duration-300 sm:px-0 sm:py-20 sm:text-center" id="hero-text">
                    <p className="-mt-4 mb-7 sm:-mt-10 sm:mb-4">
                        {/* <astro-island uid="1JnwwC" prefix="r10" component-url="/_astro/FeatureAnnouncement.CDTW98J0.js" component-export="FeatureAnnouncement" renderer-url="/_astro/client.DNdMcqFj.js" props="{}" client="load" opts="{&quot;name&quot;:&quot;FeatureAnnouncement&quot;,&quot;value&quot;:true}"></astro-island> */}
                    </p>
                    <h1 className="mb-2 bg-linear-to-b from-amber-50 to-purple-500 bg-clip-text text-2xl font-bold text-transparent sm:mb-4 sm:text-5xl sm:leading-tight">
                        Developer Roadmaps
                    </h1>
                    <p className="hidden px-4 text-lg text-gray-400 sm:block"> <span className="font-medium text-gray-400">BreshUP</span> is a community effort
                        to create roadmaps, guides and other educational content to help guide developers
                        in picking up a path and guide their learnings.
                    </p>
                    <p className="text-md block px-0 text-gray-400 sm:hidden">
                        Community created roadmaps, guides and articles to help developers grow in
                        their career.
                    </p>
                </div>
            </div>
            {isLogin ? (<MyRoadmap />) : ''}
            <RoleBasedRoadmap />
        </>
    );
}
