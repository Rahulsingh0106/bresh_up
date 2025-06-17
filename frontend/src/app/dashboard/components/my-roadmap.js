"use client";
import { Chip } from "@/components/ui/chip";
import { CreateYourRoadmapBtn } from "@/components/ui/create-your-roadmap";
import { Map, ChevronsDownUp } from 'lucide-react';
import { useEffect, useState } from "react";
import toast from 'react-hot-toast';
import { useRouter } from "next/navigation";

export default function MyRoadmap() {
    const router = useRouter();
    const [roadmaps, setRoadmaps] = useState([])
    const [token, setToken] = useState({})
    useEffect(() => {
        const storedToken = localStorage.getItem("token");
        if (storedToken) {
            const parsedToken = JSON.parse(storedToken);
            setToken(parsedToken);
        }
    }, []);

    useEffect(() => {
        if (token && token.user_details) {
            fetchRoadmaps();
        }
    }, [token]);

    const fetchRoadmaps = async () => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/roadmap/getRoadmaps`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                Authorization: `Bearer ${token}`,
                body: JSON.stringify({ user_id: token.user_details._id })
            });

            const data = await res.json();
            if (!res.ok) {
                toast.error(JSON.stringify(data.error))
            }
            else {
                setRoadmaps(data.data)
                // toast.success("Roadmaps fetched successfully.")
                // Redirect to Dashboard
                router.push("/dashboard");
            }

        } catch (error) {
            console.log(error)
            toast.error("Something went wrong! Please try later again.")
        }
    }
    return (
        <div className="bg-slate-900 border-b border-gray-800/50 p-4">
            <div className="container">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <p className="flex items-center cursor-default gap-0.5 text-sm text-gray-400">
                            <Map />
                            Your custom roadmaps</p>
                    </div>
                </div>
                <div className="mt-4 grid grid-cols-1 gap-2.5 sm:grid-cols-2 md:grid-cols-3 m-4">
                    {roadmaps.map((roadmap, index) => (
                        <Chip key={roadmap._id || index} title={roadmap.title} href={`/roadmap/${roadmap.slug}`} />
                    ))}

                    <CreateYourRoadmapBtn />
                </div>
            </div>
        </div>
    )
}