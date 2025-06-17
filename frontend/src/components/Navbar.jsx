"use client";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Menu, User, LogOut } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/components/ui/hover-card";
import { PanelLeftIcon, Bot, SquareChartGantt } from "lucide-react";
import toast from "react-hot-toast";

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [isLogin, setIsLogin] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("token");
        setIsLogin(!!token);
    }, []);

    const router = useRouter();
    const handleLogout = async () => {
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/logout`,
            {
                method: "POST",
                credentials: "include", // ✅ Send cookies
            }
        );
        if (res.status === 200) {
            localStorage.removeItem("token"); // ✅ Remove key from localStorage
            toast.success("User logged out successfully.");
            router.push("/login");
        }
    };

    return (
        <div className="bg-slate-900 border-b border-gray-800/55">
            <nav className="container mx-auto px-4 py-5 flex items-center justify-between">
                {/* Left Side - Logo */}
                <div className="flex items-center">
                    <Link
                        href="/dashboard"
                        className="text-xl font-bold text-slate-400 hover:text-white"
                    >
                        BreshUP
                    </Link>
                </div>

                {/* Mobile Menu Button */}
                <div className="md:hidden">
                    <Button
                        variant="outline"
                        className="text-slate-400"
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        <Menu className="w-6 h-6" />
                    </Button>
                </div>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center space-x-6">
                    <Link
                        href="/roadmap"
                        className="font-bold text-slate-400 hover:text-white"
                    >
                        Roadmaps
                    </Link>
                    <Link
                        href="/interview"
                        className="font-bold text-slate-400 hover:text-white"
                    >
                        AI Interviewer
                    </Link>
                    {isLogin ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline">
                                    <User className="w-5 h-5 mr-2" />
                                    Profile
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem asChild>
                                    <button
                                        className="flex items-center text-red-500"
                                        onClick={handleLogout}
                                    >
                                        <LogOut className="w-4 h-4 mr-2" />
                                        Logout
                                    </button>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <>
                            <Link
                                href="/login"
                                className="font-bold text-slate-400 hover:text-white"
                            >
                                Login
                            </Link>
                            <Link href="/register">
                                <Button className="bg-blue-500 text-white hover:bg-blue-600 font-medium px-4 py-2 rounded-md transition-colors">
                                    Signup
                                </Button>
                            </Link>
                        </>
                    )}
                </div>

                {/* Mobile Menu */}
                {isOpen && (
                    <div className="absolute top-16 left-0 w-full bg-slate-800 shadow-md flex flex-col items-center space-y-4 py-4 md:hidden z-50">
                        <Link
                            href="/roadmap"
                            className="text-slate-400 hover:text-white transition"
                        >
                            Roadmaps
                        </Link>
                        <Link
                            href="/interview"
                            className="text-slate-400 hover:text-white transition"
                        >
                            AI Interviewer
                        </Link>
                        {isLogin ? (
                            <button
                                className="text-red-500 hover:text-red-600 transition"
                                onClick={handleLogout}
                            >
                                Logout
                            </button>
                        ) : (
                            <>
                                <Link
                                    href="/login"
                                    className="text-slate-400 hover:text-white transition"
                                >
                                    Login
                                </Link>
                                <Link href="/signup">
                                    <Button className="bg-blue-500 text-white hover:bg-blue-600 font-medium px-4 py-2 rounded-md transition-colors">
                                        Signup
                                    </Button>
                                </Link>
                            </>
                        )}
                    </div>
                )}
            </nav>
        </div>
    );
}
