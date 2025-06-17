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
            // setErrors({ login_error: "Email and password are required" });
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
                toast.error(JSON.stringify(data.error))
            }
            else {
                toast.success("User login successfully.")
                localStorage.setItem("token", JSON.stringify(data.data));

                // Redirect to Dashboard
                router.push("/dashboard");
            }

        } catch (error) {
            toast.error("Something went wrong! Please try later again.")
        }
    };

    useEffect(() => {
        if (localStorage.getItem("token")) {
            router.push("/dashboard");
        }
    }, [router]);

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100 ">
            <Card className="w-[400px] shadow-md p-3">
                <CardHeader>
                    <CardTitle className="text-center text-2xl">Login</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {errors.login_error && <p className="text-red-500 text-sm">{errors.login_error}</p>}
                    <div>
                        <Label htmlFor="email" className="mb-2">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            name="email"
                            placeholder="Enter your email"
                            onChange={handleChange}
                        />
                    </div>

                    <div>
                        <Label htmlFor="password" className="mb-2">Password</Label>
                        <Input
                            id="password"
                            type="password"
                            name="password"
                            placeholder="Enter your password"
                            onChange={handleChange}
                        />
                    </div>

                    <Button
                        className="w-full text-white"
                        onClick={handleSubmit}
                    >
                        Login
                    </Button>

                    <p className="text-sm text-gray-500 text-center">
                        Don't have an account?{" "}
                        <Link href="/register" className="text-blue-500 hover:underline">
                            Sign up
                        </Link>
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
