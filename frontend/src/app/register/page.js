"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

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

    const handleFileChange = (e) => {
        setForm({ ...form, resume: e.target.files[0] });
        setErrors({ ...errors, resume: "" }); // Clear error
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

            const res = await fetch("http://localhost:5000/api/auth/register", {
                method: "POST",
                body: formData,
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Login failed");
            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));

            // Redirect to Dashboard
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
        <div className="flex min-h-screen items-center justify-center bg-gray-100">
            <Card className="w-[400px] shadow-md p-3">
                <CardHeader>
                    <CardTitle className="text-center text-2xl">Register</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {errors.login_error && <p className="text-red-500 text-sm">{errors.login_error}</p>}
                    <div>
                        <Label htmlFor="name">Name</Label>
                        <Input
                            id="name"
                            name="name"
                            type="text"
                            placeholder="Enter your name"
                            value={form.name}
                            onChange={handleChange}
                        />
                        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                    </div>

                    {/* Email Field */}
                    <div>
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="Enter your email"
                            value={form.email}
                            onChange={handleChange}
                        />
                        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                    </div>

                    {/* Password Field */}
                    <div>
                        <Label htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            name="password"
                            type="password"
                            placeholder="Enter your password"
                            value={form.password}
                            onChange={handleChange}
                        />
                        {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                    </div>
                    <div>
                        <Label htmlFor="name">Resume</Label>
                        <Input
                            id="resume"
                            name="resume"
                            type="file"
                            placeholder="Please upload your resume"
                            value={form.resume}
                            onChange={handleChange}
                        />
                    </div>
                    {/* Register Button */}
                    <Button
                        className="w-full bg-blue-500 hover:bg-blue-600 text-white"
                        onClick={handleSubmit}
                    >
                        Register
                    </Button>

                    {/* Redirect to Login */}
                    <p className="text-sm text-gray-500 text-center">
                        Already have an account?{" "}
                        <Link href="/login" className="text-blue-500 hover:underline">
                            Login
                        </Link>
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
