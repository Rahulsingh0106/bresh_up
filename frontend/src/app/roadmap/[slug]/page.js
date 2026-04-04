"use client";
import { useEffect, useState, use } from "react";
import { roadmapsData } from "@/data/roadmaps";
import { CheckCircle, Circle, ExternalLink, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export default function RoadmapDetail({ params }) {
    // next 15 requirement: params is a promise
    const { slug } = use(params);
    const roadmap = roadmapsData[slug];

    if (!roadmap) {
        notFound();
    }

    const [completedItems, setCompletedItems] = useState({});

    // Load from localStorage on mount
    useEffect(() => {
        const stored = localStorage.getItem(`roadmap_progress_${slug}`);
        if (stored) {
            setCompletedItems(JSON.parse(stored));
        }
    }, [slug]);

    const toggleItem = (id) => {
        const newCompleted = { ...completedItems, [id]: !completedItems[id] };
        setCompletedItems(newCompleted);
        localStorage.setItem(`roadmap_progress_${slug}`, JSON.stringify(newCompleted));
    };

    const totalItems = roadmap.topics.length;
    const completedCount = Object.values(completedItems).filter(Boolean).length;
    const progressPercentage = totalItems === 0 ? 0 : Math.round((completedCount / totalItems) * 100);

    return (
        <div className="flex-1 bg-slate-900 border-t border-slate-800">
            <div className="container mx-auto px-4 py-8 max-w-4xl">
                <div className="mb-6">
                    <Link href="/roadmap" className="inline-flex items-center text-sm text-slate-400 hover:text-white transition-colors mb-4">
                        <ArrowLeft className="w-4 h-4 mr-1" />
                        Back to Roadmaps
                    </Link>
                    <h1 className="text-3xl font-bold text-white mb-2">{roadmap.title}</h1>
                    <p className="text-slate-400">{roadmap.description}</p>
                </div>

                {/* Progress Bar */}
                <div className="bg-slate-800 rounded-xl p-4 mb-8 border border-slate-700">
                    <div className="flex justify-between text-sm mb-2">
                        <span className="text-slate-300 font-medium">Progress</span>
                        <span className="text-blue-400 font-bold">{progressPercentage}%</span>
                    </div>
                    <div className="w-full bg-slate-900 rounded-full h-2.5">
                        <div className="bg-blue-500 h-2.5 rounded-full transition-all duration-500" style={{ width: `${progressPercentage}%` }}></div>
                    </div>
                    <p className="text-xs text-slate-500 mt-2 text-right">{completedCount} of {totalItems} completed</p>
                </div>

                {/* Checklist */}
                <div className="space-y-4">
                    {roadmap.topics.map((topic, idx) => {
                        const isDone = !!completedItems[topic.id];
                        return (
                            <div 
                                key={topic.id} 
                                className={`flex items-start p-4 rounded-xl border transition-all ${
                                    isDone ? 'bg-slate-800/50 border-slate-700/50' : 'bg-slate-800 border-slate-700 hover:border-slate-600'
                                }`}
                            >
                                <button 
                                    onClick={() => toggleItem(topic.id)}
                                    className="mt-1 flex-shrink-0 focus:outline-none"
                                >
                                    {isDone ? (
                                        <CheckCircle className="w-6 h-6 text-emerald-500" />
                                    ) : (
                                        <Circle className="w-6 h-6 text-slate-500 hover:text-slate-400" />
                                    )}
                                </button>

                                <div className="ml-4 flex-1">
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-1 gap-2">
                                        <h3 className={`font-semibold text-lg ${isDone ? 'text-slate-400 line-through' : 'text-slate-200'}`}>
                                            {topic.title}
                                        </h3>
                                        <span className={`text-xs px-2 py-1 rounded-md font-medium w-max ${
                                            topic.difficulty === 'Beginner' ? 'bg-emerald-500/10 text-emerald-400' :
                                            topic.difficulty === 'Intermediate' ? 'bg-blue-500/10 text-blue-400' :
                                            'bg-purple-500/10 text-purple-400'
                                        }`}>
                                            {topic.difficulty}
                                        </span>
                                    </div>
                                    <p className={`text-sm mb-3 ${isDone ? 'text-slate-500' : 'text-slate-400'}`}>
                                        {topic.description}
                                    </p>
                                    <a 
                                        href={topic.resourceLink} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className={`inline-flex items-center text-sm font-medium transition-colors ${
                                            isDone ? 'text-slate-500 hover:text-slate-300' : 'text-blue-400 hover:text-blue-300'
                                        }`}
                                    >
                                        <ExternalLink className="w-4 h-4 mr-1.5" />
                                        Study Resource
                                    </a>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
