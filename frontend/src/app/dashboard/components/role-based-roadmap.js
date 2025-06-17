"use client";
import { Chip } from "@/components/ui/chip";
import { CreateYourRoadmapBtn } from "@/components/ui/create-your-roadmap";
export default function RoleBasedRoadmap() {
    return (
        <div className="bg-slate-900 relative border-b border-b-[#1e293c] py-10 sm:py-14">
            <div className="container">
                <h2 className="text-md font-regular absolute -top-[17px] flex rounded-lg border border-[#1e293c] bg-slate-900 px-3 py-1 text-slate-400 sm:left-1/2 sm:-translate-x-1/2">
                    Role-based Roadmaps
                </h2>
                <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3">
                    <li> <Chip title="Frontend" href="/frontend" /></li>
                    <li> <CreateYourRoadmapBtn /></li>
                </ul>
            </div>
        </div>
    )
}