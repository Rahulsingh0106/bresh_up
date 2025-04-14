"use client"; // This makes it a Client Component
import { usePathname } from "next/navigation";
import Navbar from "./Navbar";

export default function ClientNavbar() {
    const pathname = usePathname();
    const hideNavbar = pathname === "/login" || pathname === "/register" || pathname === "/profile";

    return !hideNavbar ? <Navbar /> : null;
}
