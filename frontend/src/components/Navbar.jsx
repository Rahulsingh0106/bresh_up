"use client";

import { NavigationMenu, NavigationMenuItem, NavigationMenuList } from "@/components/ui/navigation-menu";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Menu, User, LogOut } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import Sidebar from "@/components/sidebar";
import { useRouter } from "next/navigation";
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/components/ui/hover-card"
import { PanelLeftIcon, Bot, SquareChartGantt } from "lucide-react"

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter();
    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        router.push("/login");
    };
    return (
        <nav className="shadow-md px-3 py-5 flex justify-between h-[4rem] bg-(--color-slate-900)">
            {/* Left Side - Logo */}
            <div className="flex flex-start">
                <div className="flex-col-1 ">
                    <HoverCard>
                        <HoverCardTrigger>
                            <Button className="size-7 text-(--color-slate-400)">
                                <PanelLeftIcon />
                                {/* <span className="sr-only">Toggle Sidebar</span> */}
                            </Button></HoverCardTrigger>
                        <HoverCardContent>
                            <div className="absolute left-0 top-full z-90 mt-2 w-48 min-w-[320px] rounded-lg bg-slate-800 py-2 shadow-xl transition-all duration-100 pointer-events-auto visible translate-y-2.5 opacity-100" role="menu">
                                <a href="/interview" className="group flex items-center gap-3 px-4 py-2.5 text-gray-400 transition-colors hover:bg-slate-700" role="menuitem">

                                    <span className="flex h-[40px] w-[40px] items-center justify-center rounded-full bg-slate-600 transition-colors group-hover:bg-slate-500 group-hover:text-slate-100">
                                        <Bot />
                                    </span>
                                    <span className="flex flex-col">
                                        <span className="font-medium text-slate-300 transition-colors group-hover:text-slate-100">
                                            AI Interviewer
                                            {/* <span className="text-[10px] font-bold text-black py-0.5 uppercase tracking-wider bg-yellow-400 rounded-full px-1.5 relative -top-0.5">
                                                New
                                            </span> */}
                                        </span>
                                        <span className="text-sm">
                                            Practice Mock Interview with AI
                                        </span>
                                    </span>
                                </a>
                                <a href="/roadmap" className="group flex items-center gap-3 px-4 py-2.5 text-gray-400 transition-colors hover:bg-slate-700" role="menuitem">

                                    <span className="flex h-[40px] w-[40px] items-center justify-center rounded-full bg-slate-600 transition-colors group-hover:bg-slate-500 group-hover:text-slate-100">
                                        <SquareChartGantt />
                                    </span>
                                    <span className="flex flex-col">
                                        <span className="font-medium text-slate-300 transition-colors group-hover:text-slate-100">
                                            Roadmap
                                        </span>
                                        <span className="text-sm">
                                            Create your own roadmap
                                        </span>
                                    </span>
                                </a>
                            </div>
                        </HoverCardContent>
                    </HoverCard>

                </div>
                <div className="flex-col-1">
                    <Link href="/dashboard" className="text-xl font-bold text-(--color-slate-400) hover:text-white">
                        RoadMap
                    </Link>
                </div>
            </div>
            {/* Middle - Navigation Links */}
            <div className="flex-col-1">
                {/* <NavigationMenu className="hidden md:flex">
                    <NavigationMenuList className="flex space-x-6 ">
                        <NavItem className="text-(--color-slate-400) hover:text-white" href="/" label="Home" />
                        <NavItem href="/about" label="About" />
                        <NavItem href="/services" label="Services" />
                        <NavItem href="/contact" label="Contact" />
                    </NavigationMenuList>
                </NavigationMenu> */}
            </div>
            <div className="flex-col-1">
                {/* Right Side - User Dropdown */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline">
                            <User className="w-5 h-5 mr-2" />
                            Profile
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        {/* <DropdownMenuItem asChild>
                            <Link href="/profile">My Profile</Link>
                        </DropdownMenuItem> */}
                        <DropdownMenuItem asChild>
                            <button className="flex items-center text-red-500" onClick={handleLogout}>
                                <LogOut className="w-4 h-4 mr-2" />
                                Logout
                            </button>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

                {/* Mobile Menu Button */}
                <Button variant="outline" className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
                    <Menu className="w-6 h-6" />
                </Button>

                {/* Mobile Menu */}
                {isOpen && (
                    <div className="absolute top-16 left-0 w-full bg-white shadow-md flex flex-col items-center space-y-4 py-4 md:hidden">
                        <NavItem href="/" label="Home" />
                        <NavItem href="/about" label="About" />
                        <NavItem href="/services" label="Services" />
                        <NavItem href="/contact" label="Contact" />
                    </div>
                )}
            </div>

            {/* </div> */}
        </nav >
    );
}

// Navigation Item Component
function NavItem({ href, label }) {
    return (
        <Link href={href} className="text-(--color-slate-400) hover:text-white transition">
            {label}
        </Link>
    );
}
