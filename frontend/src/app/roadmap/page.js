"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { roadmapsData } from "@/data/roadmaps";

export default function RoadmapCatalog() {
    const [progress, setProgress] = useState({});

    useEffect(() => {
        const newProgress = {};
        Object.keys(roadmapsData).forEach((slug) => {
            const stored = localStorage.getItem(`roadmap_progress_${slug}`);
            if (stored) {
                const completedItems = JSON.parse(stored);
                const completedCount = Object.values(completedItems).filter(Boolean).length;
                const totalItems = roadmapsData[slug].topics.length;
                newProgress[slug] = totalItems === 0 ? 0 : Math.round((completedCount / totalItems) * 100);
            } else {
                newProgress[slug] = 0;
            }
        });
        setProgress(newProgress);
    }, []);

    return (
        <div className="border-t border-slate-800 bg-slate-900 flex-1">
            <div className="container relative flex flex-col gap-4 sm:flex-row mx-auto px-4 md:px-8">
                <div className="flex grow flex-col gap-6 pb-20 pt-2 sm:pt-8 w-full">
                    <h2 className="mb-2 text-xs uppercase tracking-wide text-gray-400">All Roadmaps</h2>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                        {Object.entries(roadmapsData).map(([slug, roadmap]) => (
                            <Link 
                                key={slug}
                                href={`/roadmap/${slug}`} 
                                className="relative rounded-xl border border-slate-700 bg-slate-800 p-5 text-left transition-all hover:border-slate-500 hover:bg-slate-700 block group shadow-md"
                            >
                                <div className="mb-4">
                                    <h3 className="font-bold text-lg text-slate-200 group-hover:text-blue-400 transition-colors">
                                        {roadmap.title}
                                    </h3>
                                    <p className="text-sm text-slate-400 mt-1 line-clamp-2">
                                        {roadmap.description}
                                    </p>
                                </div>
                                <div className="mt-auto">
                                    <div className="flex justify-between items-center text-xs font-medium text-slate-400 mb-1.5">
                                        <span>Progress</span>
                                        <span className="text-blue-400">{progress[slug] || 0}%</span>
                                    </div>
                                    <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
                                        <div 
                                            className="bg-blue-500 h-1.5 rounded-full transition-all duration-500" 
                                            style={{ width: `${progress[slug] || 0}%` }}
                                        ></div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
