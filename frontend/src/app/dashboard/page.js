"use client";
import { Button } from "@/components/ui/button";
import { Bot, SquareChartGantt } from "lucide-react";
import Link from "next/link";

export default function Dashboard() {
    return (
        <>
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
                <h1 className="text-5xl font-bold mb-3">Welcome to Dashboard</h1>
                <div className="flex-row">
                    <Link href="/roadmap">
                        <Button className="mt-4 mx-2 text-white">
                            <SquareChartGantt /> Build Your Roadmap
                        </Button>
                    </Link>
                    <Link href="/interview">
                        <Button className="mt-2 text-white">
                            <Bot /> AI Mock Interviewer
                        </Button>
                    </Link>
                </div>
            </div >
        </>
    );
}
