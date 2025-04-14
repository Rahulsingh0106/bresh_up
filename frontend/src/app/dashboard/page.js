"use client";
import { useAuthRedirect } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

import Navbar from "@/components/Navbar";

export default function Dashboard() {
    // const { loading } = useAuthRedirect();
    // const router = useRouter();

    // if (loading) return <p className="text-center mt-10">Loading...</p>;

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        router.push("/login");
    };

    return (
        // <div className="grid">
        <>
            {/* <Navbar /> */}
            <div className="mt-5 grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Sidebar component */}
                <div className="lg:col-span-2">
                    {/* <img src="/Screenshot.png" className="intem-center justify-center object-cover" /> */}
                    {/* 
                    <div className="flex flex-col sitems-center justify-center min-h-screen bg-gray-50">
                        <h1 className="text-3xl font-bold">Welcome to Dashboard</h1>
                        <Button onClick={handleLogout} classq Name="mt-4 bg-red-500 hover:bg-red-600 text-white">
                            Logout
                        </Button>
                    </div> */}
                </div>
            </div >
            {/* </div > */}
        </>
    );
}
