"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

export default function RoadmapDetail() {
    const router = useRouter();
    const { slug } = useParams();

    const [roadmap, setRoadmap] = useState(null);

    // useEffect(() => {
    //     if (!slug) return;
    //     fetch(`/api/roadmap/getRoadmapBySlug/${slug}`)
    //         .then((res) => res.json())
    //         .then((data) => setRoadmap(data.data))
    //         .catch((err) => console.error("Error fetching roadmap:", err));
    // }, [slug]);

    // if (!roadmap) return <div>Loading...</div>;

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">Testing</h1>
                <div className="flex gap-4">
                    <button>Edit Roadmap</button>
                    <button
                        onClick={() => {
                            navigator.clipboard.writeText(window.location.href);
                            alert("Link copied!");
                        }}
                    >
                        Share
                    </button>
                </div>
            </div>
            {/* Render the roadmap editor/viewer here */}
        </div>
    );
}
