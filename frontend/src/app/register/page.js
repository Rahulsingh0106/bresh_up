"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from 'react-hot-toast';
import AuthSplitLayout from "@/components/auth/AuthSplitLayout";
import LoadingButton from "@/components/auth/LoadingButton";

export default function RegisterPage() {
    const router = useRouter();
    const [form, setForm] = useState({ email: "", password: "", confirmPassword: "", name: "" });
    const [resume, setResume] = useState(null);
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    const validateForm = () => {
        const newErrors = {};
        if (!form.name) newErrors.name = "Name is required";
        
        if (!form.email) {
            newErrors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(form.email)) {
            newErrors.email = "Invalid email format";
        }

        if (!form.password) {
            newErrors.password = "Password is required";
        } else if (form.password.length < 8) {
            newErrors.password = "Password must be at least 8 characters";
        }

        if (form.password !== form.confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match";
        }

        if (!resume) newErrors.resume = "Resume is required";
        
        return newErrors;
    };

    const handleChange = (e) => {
        if (e.target.name === "resume") {
            setResume(e.target.files[0]);
        } else {
            setForm({ ...form, [e.target.name]: e.target.value });
        }
        if (errors[e.target.name]) {
            setErrors({ ...errors, [e.target.name]: "" });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setIsLoading(true);
        setErrors({});

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
                setErrors({ register_error: data.error || "Registration failed" });
                return;
            }
            
            toast.success("User registered successfully");
            localStorage.setItem("token", JSON.stringify(data.data));

            // Redirect to Dashboard
            window.location.href = '/dashboard';
        } catch (error) {
            toast.error("Something went wrong! Please try again later.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (localStorage.getItem("token")) {
            router.push("/dashboard");
        }
    }, [router]);

    return (
        <AuthSplitLayout title="Register">
            <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-foreground">Create an account</h2>
                <p className="text-sm text-muted-foreground mt-2">
                    Already have an account?{" "}
                    <Link href="/login" className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 font-medium">
                        Log in instead
                    </Link>
                </p>
            </div>

            {errors.register_error && (
                <div className="bg-destructive/15 text-destructive p-3 rounded-md text-sm text-center mb-6 border border-destructive/20">
                    {errors.register_error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                        id="name"
                        name="name"
                        type="text"
                        placeholder="John Doe"
                        value={form.name}
                        onChange={handleChange}
                        className={errors.name ? "border-destructive focus-visible:ring-destructive" : ""}
                    />
                    {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="john@example.com"
                        value={form.email}
                        onChange={handleChange}
                        className={errors.email ? "border-destructive focus-visible:ring-destructive" : ""}
                    />
                    {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            name="password"
                            type="password"
                            placeholder="••••••••"
                            value={form.password}
                            onChange={handleChange}
                            className={errors.password ? "border-destructive focus-visible:ring-destructive" : ""}
                        />
                        {errors.password && <p className="text-xs text-destructive">{errors.password}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirm</Label>
                        <Input
                            id="confirmPassword"
                            name="confirmPassword"
                            type="password"
                            placeholder="••••••••"
                            value={form.confirmPassword}
                            onChange={handleChange}
                            className={errors.confirmPassword ? "border-destructive focus-visible:ring-destructive" : ""}
                        />
                        {errors.confirmPassword && <p className="text-xs text-destructive">{errors.confirmPassword}</p>}
                    </div>
                </div>

                <div className="space-y-2 pt-2">
                    <Label htmlFor="resume">Resume (PDF)</Label>
                    <Input
                        id="resume"
                        name="resume"
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={handleChange}
                        className={`file:text-foreground file:bg-muted file:border-none file:mr-4 file:px-4 file:py-1 hover:file:bg-muted/80 cursor-pointer ${errors.resume ? "border-destructive focus-visible:ring-destructive" : ""}`}
                    />
                    {errors.resume && <p className="text-xs text-destructive">{errors.resume}</p>}
                </div>
                
                <div className="pt-4">
                    <LoadingButton
                        type="submit"
                        loading={isLoading}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
                    >
                        Create account
                    </LoadingButton>
                </div>
            </form>
        </AuthSplitLayout>
    );
}
