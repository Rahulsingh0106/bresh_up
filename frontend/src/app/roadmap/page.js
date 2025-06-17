"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

export default function RoadmapDetail() {
    return (
        <div class="border-t bg-gray-100">
            <div class="container relative flex flex-col gap-4 sm:flex-row">

                <div class="flex grow flex-col gap-6 pb-20 pt-2 sm:pt-8">
                    <h2 class="mb-2 text-xs uppercase tracking-wide text-gray-400">All Roadmaps</h2>
                    <div class="grid grid-cols-1 gap-1.5 sm:grid-cols-2 md:grid-cols-3">
                        <a class="relative rounded-md border bg-white px-3 py-2 text-left text-sm shadow-xs transition-all hover:border-gray-300 hover:bg-gray-50" href="/frontend?r=frontend-beginner">
                            Frontend Beginner
                        </a>

                    </div>
                </div>
            </div>
        </div>
    );
}
