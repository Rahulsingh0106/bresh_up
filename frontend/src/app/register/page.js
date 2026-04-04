"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from 'react-hot-toast';

export default function RegisterPage() {
    const router = useRouter();
    const [form, setForm] = useState({ email: "", password: "", name: "" });
    const [resume, setResume] = useState(null)
    const [errors, setErrors] = useState({});

    // Validate Form Function
    const validateForm = () => {
        const newErrors = {};
        if (!form.name) newErrors.name = "Name is required";
        if (!form.email) newErrors.email = "Email is required";
        if (!form.password) newErrors.password = "Password is required";
        if (!resume) newErrors.resume = "Resume is required";
        return newErrors;
    };

    // Handle Input Change
    const handleChange = (e) => {
        if (e.target.name === "resume") {
            setResume(e.target.files[0]); // Store file separately
        } else {
            setForm({ ...form, [e.target.name]: e.target.value });
        }
        setErrors({ ...errors, [e.target.name]: "" });
    };

    // Handle Form Submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }
        try {
            const formData = new FormData();
            formData.append("name", form.name);
            formData.append("email", form.email);
            formData.append("password", form.password);
            formData.append("resume", resume);

            const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/register`, {
                method: "POST",
                body: formData,
            });

            const data = await res.json();
            if (!res.ok) {
                toast.error(data.error || "Registration failed");
                return;
            }
            
            toast.success("User registered successfully");
            localStorage.setItem("token", JSON.stringify(data.data));

            // Redirect to Dashboard
            window.location.href = '/dashboard';
        } catch (error) {
            toast.error("Something went wrong! Please try again later.");
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
                    <CardTitle className="text-center text-2xl font-bold text-white">Register</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {errors.login_error && <p className="text-red-400 text-sm">{errors.login_error}</p>}
                    <div className="space-y-2">
                        <Label htmlFor="name" className="text-slate-300">Name</Label>
                        <Input
                            id="name"
                            name="name"
                            type="text"
                            placeholder="Enter your name"
                            value={form.name}
                            onChange={handleChange}
                            className="bg-slate-900 border-slate-700 text-slate-200 placeholder:text-slate-500"
                        />
                        {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name}</p>}
                    </div>

                    {/* Email Field */}
                    <div className="space-y-2">
                        <Label htmlFor="email" className="text-slate-300">Email</Label>
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="Enter your email"
                            value={form.email}
                            onChange={handleChange}
                            className="bg-slate-900 border-slate-700 text-slate-200 placeholder:text-slate-500"
                        />
                        {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email}</p>}
                    </div>

                    {/* Password Field */}
                    <div className="space-y-2">
                        <Label htmlFor="password" className="text-slate-300">Password</Label>
                        <Input
                            id="password"
                            name="password"
                            type="password"
                            placeholder="Enter your password"
                            value={form.password}
                            onChange={handleChange}
                            className="bg-slate-900 border-slate-700 text-slate-200 placeholder:text-slate-500"
                        />
                        {errors.password && <p className="text-red-400 text-sm mt-1">{errors.password}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="resume" className="text-slate-300">Resume</Label>
                        <Input
                            id="resume"
                            name="resume"
                            type="file"
                            onChange={handleChange}
                            className="bg-slate-900 border-slate-700 text-slate-400 file:text-slate-200 file:bg-slate-800 file:border-none file:mr-4 file:px-4 file:py-1 hover:file:bg-slate-700 cursor-pointer"
                        />
                        {errors.resume && <p className="text-red-400 text-sm mt-1">{errors.resume}</p>}
                    </div>
                    
                    {/* Register Button */}
                    <Button
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium"
                        onClick={handleSubmit}
                    >
                        Register
                    </Button>

                    {/* Redirect to Login */}
                    <p className="text-sm text-slate-400 text-center mt-4">
                        Already have an account?{" "}
                        <Link href="/login" className="text-blue-400 hover:underline">
                            Login
                        </Link>
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
