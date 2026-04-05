"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { roadmapsData } from "@/data/roadmaps";

export default function RoadmapCatalog() {
    const [progress, setProgress] = useState({});

    useEffect(() => {
        const fetchProgress = async () => {
            const token = localStorage.getItem("token");
            const newProgress = {};

            if (token) {
                try {
                    const parsedToken = JSON.parse(token);
                    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/roadmap/progress`, {
                        headers: { "Authorization": `Bearer ${parsedToken.token || parsedToken}` }
                    });
                    
                    if (res.ok) {
                        const data = await res.json();
                        // Map progress from DB
                        const dbProgress = {};
                        data.data.forEach(p => { dbProgress[p.roadmapSlug] = p.completedTopics; });
                        
                        Object.keys(roadmapsData).forEach((slug) => {
                            const validTopicIds = roadmapsData[slug].topics.map(t => t.id);
                            let completedCount = 0;
                            if (dbProgress[slug]) {
                                completedCount = dbProgress[slug].filter(id => validTopicIds.includes(id)).length;
                            }
                            const totalItems = roadmapsData[slug].topics.length;
                            newProgress[slug] = totalItems === 0 ? 0 : Math.round((completedCount / totalItems) * 100);
                        });
                    } else {
                        if (res.status === 401 || res.status === 403) {
                            localStorage.removeItem("token");
                            window.location.href = '/login';
                            return;
                        }
                        fallbackToLocal(newProgress);
                    }
                } catch (error) {
                    console.error("Failed to fetch backend progress", error);
                    fallbackToLocal(newProgress);
                }
            } else {
                fallbackToLocal(newProgress);
            }
            
            setProgress(newProgress);
        };

        const fallbackToLocal = (newProgress) => {
            Object.keys(roadmapsData).forEach((slug) => {
                const stored = localStorage.getItem(`roadmap_progress_${slug}`);
                if (stored) {
                    const validTopicIds = roadmapsData[slug].topics.map(t => t.id);
                    const completedItems = JSON.parse(stored);
                    const completedCount = Object.keys(completedItems).filter(id => completedItems[id] && validTopicIds.includes(id)).length;
                    const totalItems = roadmapsData[slug].topics.length;
                    newProgress[slug] = totalItems === 0 ? 0 : Math.round((completedCount / totalItems) * 100);
                } else {
                    newProgress[slug] = 0;
                }
            });
        };

        fetchProgress();
    }, []);

    // Helper SVG Component for Circular Progress Ring
    const ProgressRing = ({ percentage }) => {
        const radius = 16;
        const circumference = 2 * Math.PI * radius;
        const strokeDashoffset = circumference - (percentage / 100) * circumference;

        return (
            <div className="relative flex items-center justify-center">
                <svg className="transform -rotate-90 w-12 h-12">
                    <circle
                        cx="24"
                        cy="24"
                        r={radius}
                        stroke="currentColor"
                        strokeWidth="3"
                        fill="transparent"
                        className="text-muted"
                    />
                    <circle
                        cx="24"
                        cy="24"
                        r={radius}
                        stroke="currentColor"
                        strokeWidth="3"
                        fill="transparent"
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        className="text-indigo-500 transition-all duration-1000 ease-out"
                    />
                </svg>
                <div className="absolute flex items-center justify-center text-[10px] font-bold text-foreground">
                    {percentage}%
                </div>
            </div>
        );
    };

    return (
        <div className="border-t border-border bg-background flex-1 min-h-[calc(100vh-80px)]">
            <div className="container relative flex flex-col gap-4 sm:flex-row mx-auto px-4 md:px-8">
                <div className="flex grow flex-col gap-6 pb-20 pt-8 sm:pt-12 w-full">
                    <div>
                        <h1 className="text-3xl font-bold text-foreground">Learning Roadmaps</h1>
                        <p className="text-muted-foreground mt-2 mb-6">Structured paths to guide your technical journey and interview preparation.</p>
                    </div>
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {Object.entries(roadmapsData).map(([slug, roadmap]) => (
                            <Link 
                                key={slug}
                                href={`/roadmap/${slug}`} 
                                className="flex flex-col relative rounded-2xl border border-border bg-card p-6 text-left transition-all hover:border-indigo-500/50 hover:shadow-md block group"
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div className="w-10 h-10 rounded-lg bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400 flex items-center justify-center text-lg font-bold">
                                        {roadmap.title.charAt(0)}
                                    </div>
                                    <ProgressRing percentage={progress[slug] || 0} />
                                </div>
                                <div className="mb-4 flex-1">
                                    <h3 className="font-bold text-xl text-foreground group-hover:text-indigo-500 transition-colors">
                                        {roadmap.title}
                                    </h3>
                                    <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                                        {roadmap.description}
                                    </p>
                                </div>
                                <div className="mt-auto pt-4 border-t border-border flex justify-between items-center text-sm font-medium">
                                    <span className="text-muted-foreground">{roadmap.topics.length} Topics</span>
                                    <span className="text-indigo-600 dark:text-indigo-400 group-hover:translate-x-1 transition-transform">
                                        View Details →
                                    </span>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
