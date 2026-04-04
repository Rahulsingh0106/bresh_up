"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from 'react-hot-toast';

export default function LoginPage() {

    const router = useRouter();
    const [errors, setErrors] = useState({});
    const [form, setForm] = useState({ email: "", password: "" });
    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({}); // Clear previous errors
        if (!form.email || !form.password) {
            toast.error("Email and password fields are required.")
            return;
        }

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(form),
            });

            const data = await res.json();
            if (!res.ok) {
                toast.error(data.error || "Login failed.");
            }
            else {
                toast.success("User logged in successfully.")
                localStorage.setItem("token", JSON.stringify(data.data));

                // Redirect to Dashboard
                window.location.href = '/dashboard';
            }

        } catch (error) {
            toast.error("Something went wrong! Please try again later.")
        }
    };

    useEffect(() => {
        if (localStorage.getItem("token")) {
            router.push("/dashboard");
        }
    }, [router]);

    return (
        <div className="flex flex-1 items-center justify-center bg-slate-900 px-4 min-h-[calc(100vh-80px)]">
            <Card className="w-full max-w-[400px] shadow-md bg-slate-800 border-slate-700 text-slate-200">
                <CardHeader>
                    <CardTitle className="text-center text-2xl font-bold text-white">Login</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {errors.login_error && <p className="text-red-400 text-sm">{errors.login_error}</p>}
                    <div className="space-y-2">
                        <Label htmlFor="email" className="text-slate-300">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            name="email"
                            placeholder="Enter your email"
                            onChange={handleChange}
                            className="bg-slate-900 border-slate-700 text-slate-200 placeholder:text-slate-500"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="password" className="text-slate-300">Password</Label>
                        <Input
                            id="password"
                            type="password"
                            name="password"
                            placeholder="Enter your password"
                            onChange={handleChange}
                            className="bg-slate-900 border-slate-700 text-slate-200 placeholder:text-slate-500"
                        />
                    </div>

                    <Button
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium"
                        onClick={handleSubmit}
                    >
                        Login
                    </Button>

                    <p className="text-sm text-slate-400 text-center mt-4">
                        Don't have an account?{" "}
                        <Link href="/register" className="text-blue-400 hover:underline">
                            Sign up
                        </Link>
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
