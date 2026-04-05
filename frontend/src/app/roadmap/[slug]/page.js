"use client";
import { useEffect, useState, use } from "react";
import { roadmapsData } from "@/data/roadmaps";
import { CheckCircle, Circle, ExternalLink, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import toast from "react-hot-toast";

export default function RoadmapDetail({ params }) {
    const { slug } = use(params);
    const roadmap = roadmapsData[slug];

    if (!roadmap) {
        notFound();
    }

    const [completedItems, setCompletedItems] = useState({});
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("token");
        setIsLoggedIn(!!token);

        if (token) {
            const parsedToken = JSON.parse(token);
            fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/roadmap/progress/${slug}`, {
                headers: { "Authorization": `Bearer ${parsedToken.token || parsedToken}` }
            })
            .then(res => res.json())
            .then(data => {
                if (data.data && Array.isArray(data.data.completedTopics)) {
                    const completedObj = {};
                    data.data.completedTopics.forEach(id => {
                        completedObj[id] = true;
                    });
                    setCompletedItems(completedObj);
                }
            })
            .catch(err => console.error(err));
        } else {
            const stored = localStorage.getItem(`roadmap_progress_${slug}`);
            if (stored) {
                setCompletedItems(JSON.parse(stored));
            }
        }
    }, [slug]);

    const toggleItem = async (id) => {
        const newCompleted = { ...completedItems, [id]: !completedItems[id] };
        setCompletedItems(newCompleted);

        const token = localStorage.getItem("token");
        if (token) {
            try {
                const parsedToken = JSON.parse(token);
                await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/roadmap/progress/toggle`, {
                    method: "POST",
                    headers: { 
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${parsedToken.token || parsedToken}` 
                    },
                    body: JSON.stringify({ roadmapSlug: slug, topicId: id })
                });
            } catch (error) {
                toast.error("Failed to sync progress with server.");
            }
        } else {
            localStorage.setItem(`roadmap_progress_${slug}`, JSON.stringify(newCompleted));
        }
    };

    const totalItems = roadmap.topics.length;
    const validTopicIds = roadmap.topics.map(t => t.id);
    const completedCount = Object.keys(completedItems).filter(id => completedItems[id] && validTopicIds.includes(id)).length;
    const progressPercentage = totalItems === 0 ? 0 : Math.round((completedCount / totalItems) * 100);

    return (
        <div className="flex-1 bg-background border-t border-border min-h-[calc(100vh-80px)]">
            <div className="container mx-auto px-4 py-8 max-w-4xl">
                <div className="mb-6">
                    <Link href="/roadmap" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors mb-4">
                        <ArrowLeft className="w-4 h-4 mr-1" />
                        Back to Roadmaps
                    </Link>
                    <h1 className="text-3xl font-bold text-foreground mb-2">{roadmap.title}</h1>
                    <p className="text-muted-foreground">{roadmap.description}</p>
                </div>

                {/* Progress Bar */}
                <div className="bg-card rounded-xl p-4 mb-8 border border-border shadow-sm">
                    <div className="flex justify-between text-sm mb-2">
                        <span className="text-foreground font-medium">Progress</span>
                        <span className="text-indigo-600 font-bold">{progressPercentage}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2.5">
                        <div className="bg-indigo-600 h-2.5 rounded-full transition-all duration-500" style={{ width: `${progressPercentage}%` }}></div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2 text-right">{completedCount} of {totalItems} completed</p>
                </div>

                {/* Checklist */}
                <div className="space-y-4">
                    {roadmap.topics.map((topic, idx) => {
                        const isDone = !!completedItems[topic.id];
                        return (
                            <div 
                                key={topic.id} 
                                className={`flex items-start p-4 rounded-xl border transition-all ${
                                    isDone ? 'bg-muted/50 border-border' : 'bg-card border-border hover:border-indigo-600/50 hover:shadow-sm'
                                }`}
                            >
                                <button 
                                    onClick={() => toggleItem(topic.id)}
                                    className="mt-1 flex-shrink-0 focus:outline-none"
                                >
                                    {isDone ? (
                                        <CheckCircle className="w-6 h-6 text-green-500" />
                                    ) : (
                                        <Circle className="w-6 h-6 text-muted-foreground hover:text-indigo-500" />
                                    )}
                                </button>

                                <div className="ml-4 flex-1">
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-1 gap-2">
                                        <h3 className={`font-semibold text-lg ${isDone ? 'text-muted-foreground line-through' : 'text-foreground'}`}>
                                            {topic.title}
                                        </h3>
                                        <span className={`text-xs px-2 py-1 rounded-md font-medium w-max border ${
                                            topic.difficulty === 'Beginner' ? 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800' :
                                            topic.difficulty === 'Intermediate' ? 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800' :
                                            'bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-800'
                                        }`}>
                                            {topic.difficulty}
                                        </span>
                                    </div>
                                    <p className={`text-sm mb-3 ${isDone ? 'text-muted-foreground/70' : 'text-muted-foreground'}`}>
                                        {topic.description}
                                    </p>
                                    <a 
                                        href={topic.resourceLink} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className={`inline-flex items-center text-sm font-medium transition-colors ${
                                            isDone ? 'text-muted-foreground hover:text-foreground' : 'text-indigo-600 hover:text-indigo-500'
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
