"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { PlayCircle, Map, Target, TrendingUp, Trophy, Clock, SearchX, Settings, Zap } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

export default function DashboardPage() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const token = JSON.parse(localStorage.getItem("token"));
                if (!token) {
                    window.location.href = '/login';
                    return;
                }

                // Temporary parse user from token string or profile API if token isn't JWT
                fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/profile`, {
                    headers: { "Authorization": `Bearer ${token.token || token}` }
                })
                .then(res => res.json())
                .then(data => setUser(data.data));

                const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/dashboard`, {
                    headers: { "Authorization": `Bearer ${token.token || token}` }
                });
                
                if (!res.ok) {
                    if (res.status === 401 || res.status === 403) {
                        localStorage.removeItem("token");
                        window.location.href = '/login';
                        return;
                    }
                    throw new Error("Failed to fetch dashboard data");
                }
                const data = await res.json();
                setStats(data);
            } catch (error) {
                console.error(error);
                toast.error("Failed to load dashboard data");
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    if (loading) {
        return (
            <div className="flex bg-background min-h-[calc(100vh-80px)] items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    const { stats: userStats, recentSessions, weakTopics } = stats || {};

    return (
        <div className="bg-background min-h-[calc(100vh-80px)] pb-12">
            {/* Header Area */}
            <div className="bg-zinc-950 px-6 py-12 md:py-16 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-900/20 to-violet-800/20" />
                <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-indigo-600/10 blur-3xl" />
                
                <div className="max-w-7xl mx-auto relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                            Welcome back, {user?.name?.split(' ')[0] || 'Developer'}! 👋
                        </h1>
                        <p className="text-zinc-400 text-lg">Ready to level up your interview skills today?</p>
                    </div>
                    <div className="flex gap-4 w-full md:w-auto">
                        <Link href="/interview" className="flex-1 md:flex-none">
                            <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white gap-2" size="lg">
                                <PlayCircle size={20} /> Start New Interview
                            </Button>
                        </Link>
                        <Link href="/roadmap" className="flex-1 md:flex-none">
                            <Button variant="secondary" className="w-full gap-2" size="lg">
                                <Map size={20} /> Continue Roadmap
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 -mt-8 relative z-20 space-y-8">
                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Card className="border-border shadow-sm">
                        <CardContent className="p-6">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Total Interviews</p>
                                    <p className="text-3xl font-bold text-foreground mt-1">{userStats?.totalInterviews || 0}</p>
                                </div>
                                <div className="p-2 bg-indigo-100 text-indigo-600 dark:bg-indigo-900/40 dark:text-indigo-400 rounded-lg">
                                    <Target size={20} />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="border-border shadow-sm">
                        <CardContent className="p-6">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Average Score</p>
                                    <p className="text-3xl font-bold text-foreground mt-1">{userStats?.averageScore || 0}</p>
                                </div>
                                <div className="p-2 bg-green-100 text-green-600 dark:bg-green-900/40 dark:text-green-400 rounded-lg">
                                    <TrendingUp size={20} />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="border-border shadow-sm">
                        <CardContent className="p-6">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Current Streak</p>
                                    <div className="flex items-baseline gap-1 mt-1">
                                        <p className="text-3xl font-bold text-foreground">{userStats?.currentStreak || 0}</p>
                                        <span className="text-sm text-orange-500 font-semibold">days</span>
                                    </div>
                                </div>
                                <div className="p-2 bg-orange-100 text-orange-600 dark:bg-orange-900/40 dark:text-orange-400 rounded-lg">
                                    <Zap size={20} />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="border-border shadow-sm">
                        <CardContent className="p-6">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Topics Mastered</p>
                                    <p className="text-3xl font-bold text-foreground mt-1">{userStats?.topicsMastered || 0}</p>
                                </div>
                                <div className="p-2 bg-violet-100 text-violet-600 dark:bg-violet-900/40 dark:text-violet-400 rounded-lg">
                                    <Trophy size={20} />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {/* Recent Interviews */}
                    <Card className="md:col-span-2 border-border shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <div>
                                <CardTitle className="text-xl">Recent Interviews</CardTitle>
                                <CardDescription>Your last 5 mock interview sessions.</CardDescription>
                            </div>
                            <Link href="/interview/history" className="text-sm text-indigo-600 hover:text-indigo-500 font-medium">
                                View all
                            </Link>
                        </CardHeader>
                        <CardContent>
                            {!recentSessions || recentSessions.length === 0 ? (
                                <div className="text-center py-10">
                                    <SearchX className="mx-auto h-10 w-10 text-muted-foreground opacity-20 mb-3" />
                                    <p className="text-muted-foreground">No interview sessions found.</p>
                                    <Link href="/interview">
                                        <Button variant="link" className="text-indigo-600">Take your first interview</Button>
                                    </Link>
                                </div>
                            ) : (
                                <div className="space-y-4 mt-4">
                                    {recentSessions.map((session) => (
                                        <div key={session.id} className="flex items-center justify-between p-4 rounded-xl border border-border bg-card hover:bg-muted/50 transition-colors">
                                            <div className="flex items-center gap-4">
                                                <div className="p-2.5 bg-indigo-50 dark:bg-zinc-800 rounded-full text-indigo-600 dark:text-indigo-400">
                                                    <Clock size={18} />
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-foreground">{session.role}</p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {new Date(session.date).toLocaleDateString()} • {session.level} Level
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <span className={`inline-block px-3 py-1 rounded-full text-sm font-bold border
                                                    ${Number(session.score) >= 8 ? 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:border-green-800' :
                                                      Number(session.score) >= 5 ? 'bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:border-yellow-800' :
                                                      session.score === '-' ? 'bg-zinc-100 text-zinc-600 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:border-zinc-700' :
                                                      'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:border-red-800'}
                                                `}>
                                                    {session.score !== '-' ? `${session.score}/10` : 'No Score'}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Weak Topics */}
                    <Card className="border-border shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-xl">Areas to Improve</CardTitle>
                            <CardDescription>Based on your recent scores.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {!weakTopics || weakTopics.length === 0 ? (
                                <div className="text-center py-10 bg-muted/30 rounded-xl border border-dashed border-border px-4">
                                    <p className="text-sm text-muted-foreground">Complete more interviews to identify weak areas.</p>
                                </div>
                            ) : (
                                <ul className="space-y-3">
                                    {weakTopics.map((topic, i) => (
                                        <li key={i} className="flex items-center gap-3">
                                            <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400 text-xs font-bold">
                                                {i + 1}
                                            </span>
                                            <span className="text-sm font-medium text-foreground">{topic}</span>
                                        </li>
                                    ))}
                                </ul>
                            )}
                            
                            <div className="mt-8 pt-6 border-t border-border">
                                <h3 className="text-sm font-medium text-muted-foreground mb-3">Quick Settings</h3>
                                <Link href="/profile">
                                    <Button variant="outline" className="w-full justify-start text-muted-foreground hover:text-foreground">
                                        <Settings size={16} className="mr-2" /> Update Target Role
                                    </Button>
                                </Link>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
