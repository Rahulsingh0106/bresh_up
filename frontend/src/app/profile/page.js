"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { User, Mail, Briefcase, Award, Loader2, Save } from "lucide-react";
import toast from "react-hot-toast";

export default function ProfilePage() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    
    // Form state
    const [formData, setFormData] = useState({
        name: "",
        targetRole: "",
        level: ""
    });

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = JSON.parse(localStorage.getItem("token"));
                if (!token) {
                    window.location.href = '/login';
                    return;
                }

                const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/profile`, {
                    headers: { "Authorization": `Bearer ${token.token || token}` }
                });
                
                if (!res.ok) throw new Error("Failed to fetch profile");
                
                const data = await res.json();
                setUser(data.data);
                
                setFormData({
                    name: data.data.name || "",
                    targetRole: data.data.targetRole || "",
                    level: data.data.level || ""
                });
                
            } catch (error) {
                console.error(error);
                toast.error("Failed to load profile");
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const token = JSON.parse(localStorage.getItem("token"));
            const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/profile`, {
                method: "PUT",
                headers: { 
                    "Authorization": `Bearer ${token.token || token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData)
            });

            if (!res.ok) throw new Error("Failed to update profile");
            
            const data = await res.json();
            setUser(data.data);
            toast.success("Profile saved successfully!");
        } catch (error) {
            toast.error("Could not save profile details");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex bg-background min-h-[calc(100vh-80px)] items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    // Initials Avatar
    const initials = formData.name ? formData.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2) : "U";

    return (
        <div className="bg-background min-h-[calc(100vh-80px)] py-12 px-4 md:px-8">
            <div className="max-w-4xl mx-auto space-y-8">
                <div>
                    <h1 className="text-3xl font-bold text-foreground">Your Profile</h1>
                    <p className="text-muted-foreground mt-2">Manage your account settings and target preferences.</p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {/* Left Column: Avatar & Summary */}
                    <div className="space-y-6">
                        <Card className="border-border shadow-sm text-center">
                            <CardContent className="pt-6 pb-6">
                                <div className="mx-auto w-32 h-32 rounded-full bg-gradient-to-tr from-indigo-500 to-violet-500 p-1 mb-4 shadow-lg">
                                    <div className="w-full h-full rounded-full bg-card flex items-center justify-center border-4 border-background">
                                        <span className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600">
                                            {initials}
                                        </span>
                                    </div>
                                </div>
                                <h2 className="text-xl font-bold text-foreground">{user?.name}</h2>
                                <p className="text-sm text-muted-foreground mt-1">{user?.targetRole || "No role specified"} • {user?.level || "No level"}</p>
                                
                                <div className="mt-6 pt-6 border-t border-border flex justify-around">
                                    <div>
                                        <p className="text-2xl font-bold text-foreground">{user?.streak || 0}</p>
                                        <p className="text-xs font-medium text-orange-500 uppercase">Day Streak</p>
                                    </div>
                                    <div className="w-px bg-border"></div>
                                    <div>
                                        <p className="text-2xl font-bold text-foreground">
                                            {new Date(user?.createdAt).toLocaleDateString(undefined, { month: 'short', year: 'numeric'}) || "New"}
                                        </p>
                                        <p className="text-xs font-medium text-indigo-500 uppercase">Joined</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column: Settings Form */}
                    <div className="md:col-span-2">
                        <Card className="border-border shadow-sm">
                            <CardHeader>
                                <CardTitle>Personal Information</CardTitle>
                                <CardDescription>Update your basic profile details here.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleSave} className="space-y-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="name" className="flex items-center gap-2">
                                            <User size={16} className="text-muted-foreground" /> Full Name
                                        </Label>
                                        <Input 
                                            id="name" 
                                            name="name" 
                                            value={formData.name} 
                                            onChange={handleChange} 
                                            required 
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="email" className="flex items-center gap-2">
                                            <Mail size={16} className="text-muted-foreground" /> Email Address
                                        </Label>
                                        <Input 
                                            id="email" 
                                            type="email" 
                                            value={user?.email || ""} 
                                            disabled 
                                            className="bg-muted cursor-not-allowed opacity-70"
                                        />
                                        <p className="text-xs text-muted-foreground">Email address cannot be changed.</p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="targetRole" className="flex items-center gap-2">
                                                <Briefcase size={16} className="text-muted-foreground" /> Target Role
                                            </Label>
                                            <Input 
                                                id="targetRole" 
                                                name="targetRole" 
                                                placeholder="e.g. Frontend Engineer" 
                                                value={formData.targetRole} 
                                                onChange={handleChange} 
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="level" className="flex items-center gap-2">
                                                <Award size={16} className="text-muted-foreground" /> Experience Level
                                            </Label>
                                            <select 
                                                id="level" 
                                                name="level" 
                                                value={formData.level} 
                                                onChange={handleChange}
                                                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                                            >
                                                <option value="" disabled>Select Level...</option>
                                                <option value="Junior">Junior</option>
                                                <option value="Mid">Mid</option>
                                                <option value="Senior">Senior</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="pt-4 flex justify-end">
                                        <Button type="submit" disabled={saving} className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2">
                                            {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />} 
                                            Save Changes
                                        </Button>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}