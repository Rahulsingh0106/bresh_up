"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {

    const router = useRouter();
    const [errors, setErrors] = useState({});
    const [form, setForm] = useState({ email: "", password: "" });
    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(form)
        try {
            const res = await fetch("http://localhost:5000/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });

            const data = await res.json();
            console.log(data)
            if (!res.ok) throw new Error(data.message || "Login failed");
            localStorage.setItem("token", JSON.stringify(data));
            // localStorage.setItem("user", JSON.stringify(data.user));

            // Redirect to Dashboard
            // router.push("/dashboard");
            router.push("/profile");
        } catch (error) {
            setErrors({ "login_error": error.message });
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
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            name="email"
                            placeholder="Enter your email"
                            onChange={handleChange}
                        />
                    </div>

                    <div>
                        <Label htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            type="password"
                            name="password"
                            placeholder="Enter your password"
                            onChange={handleChange}
                        />
                    </div>

                    <Button
                        className="w-full bg-blue-500 hover:bg-blue-600 text-white"
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
