"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from 'react-hot-toast';
import AuthSplitLayout from "@/components/auth/AuthSplitLayout";
import LoadingButton from "@/components/auth/LoadingButton";

export default function LoginPage() {
    const router = useRouter();
    const [errors, setErrors] = useState({});
    const [form, setForm] = useState({ email: "", password: "" });
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        if (errors[e.target.name]) {
            setErrors({ ...errors, [e.target.name]: "" });
        }
    };

    const validate = () => {
        const newErrors = {};
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
        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const formErrors = validate();
        if (Object.keys(formErrors).length > 0) {
            setErrors(formErrors);
            return;
        }

        setIsLoading(true);
        setErrors({});

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
                setErrors({ login_error: data.error || "Invalid credentials" });
            } else {
                toast.success("User logged in successfully.");
                localStorage.setItem("token", JSON.stringify(data.data));

                // Redirect to Dashboard
                window.location.href = '/dashboard';
            }
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
        <AuthSplitLayout title="Login">
            <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-foreground">Sign in to your account</h2>
                <p className="text-sm text-muted-foreground mt-2">
                    Don't have an account?{" "}
                    <Link href="/register" className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 font-medium">
                        Register now
                    </Link>
                </p>
            </div>

            {errors.login_error && (
                <div className="bg-destructive/15 text-destructive p-3 rounded-md text-sm text-center mb-6 border border-destructive/20">
                    {errors.login_error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                    <Label htmlFor="email">Email address</Label>
                    <Input
                        id="email"
                        type="email"
                        name="email"
                        placeholder="john@example.com"
                        value={form.email}
                        onChange={handleChange}
                        className={errors.email ? "border-destructive focus-visible:ring-destructive" : ""}
                    />
                    {errors.email && <p className="text-xs text-destructive animate-in slide-in-from-top-1">{errors.email}</p>}
                </div>

                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <Label htmlFor="password">Password</Label>
                        <Link href="#" className="text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 font-medium">
                            Forgot password?
                        </Link>
                    </div>
                    <Input
                        id="password"
                        type="password"
                        name="password"
                        placeholder="••••••••"
                        value={form.password}
                        onChange={handleChange}
                        className={errors.password ? "border-destructive focus-visible:ring-destructive" : ""}
                    />
                    {errors.password && <p className="text-xs text-destructive animate-in slide-in-from-top-1">{errors.password}</p>}
                </div>

                <LoadingButton
                    type="submit"
                    loading={isLoading}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
                >
                    Sign in
                </LoadingButton>
            </form>
        </AuthSplitLayout>
    );
}
