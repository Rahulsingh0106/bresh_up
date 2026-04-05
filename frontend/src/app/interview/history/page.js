"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ExternalLink, Calendar, SearchX, ArrowLeft } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

// A smaller static version of FeedbackScreen that doesn't trigger API calls,
// it just renders the passed report.
const ReadOnlyReport = ({ report }) => {
    if (!report) return null;

    const ScoreBadge = ({ score, label }) => {
        let colorClass = "text-red-600 bg-red-100 border-red-200 dark:bg-red-900/30 dark:border-red-800";
        if (score >= 8) colorClass = "text-green-600 bg-green-100 border-green-200 dark:bg-green-900/30 dark:border-green-800";
        else if (score >= 5) colorClass = "text-yellow-600 bg-yellow-100 border-yellow-200 dark:bg-yellow-900/30 dark:border-yellow-800";
      
        return (
          <div className={`flex flex-col items-center justify-center p-4 rounded-xl border ${colorClass}`}>
            <span className="text-3xl font-bold">{score}</span>
            <span className="text-xs uppercase font-semibold mt-1 opacity-80 text-center">{label}</span>
          </div>
        );
      };

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-10">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                <ScoreBadge score={report.overallScore || 0} label="Overall Score" />
                <ScoreBadge score={report.technicalScore || 0} label="Technical" />
                <ScoreBadge score={report.problemSolvingScore || 0} label="Problem Solving" />
                <ScoreBadge score={report.communicationScore || 0} label="Communication" />
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                <div className="border border-border rounded-xl p-5 bg-card shadow-sm">
                    <h3 className="font-bold text-green-600 dark:text-green-500 mb-3 flex items-center gap-2">Key Strengths</h3>
                    <ul className="space-y-2">
                        {report.strengths?.map((s, i) => (
                            <li key={i} className="text-sm">• {s}</li>
                        ))}
                    </ul>
                </div>
                <div className="border border-border rounded-xl p-5 bg-card shadow-sm">
                    <h3 className="font-bold text-orange-600 dark:text-orange-500 mb-3 flex items-center gap-2">Areas to Improve</h3>
                    <ul className="space-y-2">
                        {report.improvements?.map((s, i) => (
                            <li key={i} className="text-sm">• {s}</li>
                        ))}
                    </ul>
                </div>
            </div>

            <div className="mt-8">
                <h3 className="text-xl font-bold mb-4">Detailed breakdown</h3>
                <div className="space-y-4">
                    {report.questionFeedback?.map((q, i) => (
                         <div key={i} className="border border-border rounded-xl overflow-hidden shadow-sm">
                            <div className="p-4 bg-muted/50 border-b border-border">
                                <span className="font-semibold text-indigo-600 dark:text-indigo-400 mr-2">Q{i+1}:</span> 
                                {q.question}
                            </div>
                            <div className="p-4 border-b border-border">
                                <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">Your Answer</p>
                                <p className="text-sm">{q.yourAnswer}</p>
                            </div>
                            <div className="p-4 bg-indigo-50/50 dark:bg-indigo-950/20">
                                <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase mb-1">Feedback</p>
                                <p className="text-sm text-foreground">{q.feedback}</p>
                            </div>
                         </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default function HistoryPage() {
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedSession, setSelectedSession] = useState(null);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const token = JSON.parse(localStorage.getItem("token"));
                if (!token) {
                    window.location.href = '/login';
                    return;
                }

                const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/interview/history`, {
                    headers: { "Authorization": `Bearer ${token.token || token}` }
                });
                
                if (!res.ok) throw new Error("Failed to fetch history");
                
                const data = await res.json();
                setSessions(data.data || []);
            } catch (error) {
                console.error(error);
                toast.error("Failed to load interview history");
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, []);

    if (loading) {
        return (
            <div className="flex bg-background min-h-[calc(100vh-80px)] items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    if (selectedSession) {
        return (
            <div className="bg-background min-h-[calc(100vh-80px)] py-12 px-4 md:px-8">
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center justify-between mb-8 pb-4 border-b border-border">
                    <div>
                        <Button variant="ghost" onClick={() => setSelectedSession(null)} className="mb-2 -ml-3 text-muted-foreground">
                            <ArrowLeft size={16} className="mr-2" /> Back to History
                        </Button>
                        <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
                            Report: {selectedSession.role}
                        </h1>
                        <p className="text-muted-foreground mt-1">
                            {new Date(selectedSession.startedAt).toLocaleString()} • {selectedSession.level} Level
                        </p>
                    </div>
                    <Button onClick={() => window.print()} className="bg-indigo-600 text-white print:hidden">Print Report</Button>
                </div>

                <ReadOnlyReport report={selectedSession.scoreReport} />
            </div>
            </div>
        );
    }

    return (
        <div className="bg-background min-h-[calc(100vh-80px)] py-12 px-4 md:px-8">
            <div className="max-w-5xl mx-auto space-y-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-foreground">Interview History</h1>
                        <p className="text-muted-foreground mt-2">Review your past performance and transcripts.</p>
                    </div>
                </div>

                {sessions.length === 0 ? (
                    <div className="border border-dashed border-border rounded-xl p-12 text-center bg-muted/10">
                         <SearchX className="mx-auto h-12 w-12 text-muted-foreground opacity-30 mb-4" />
                         <h3 className="text-lg font-bold text-foreground">No interview sessions found</h3>
                         <p className="text-muted-foreground mt-1 max-w-sm mx-auto">
                             You haven't completed any mock interviews yet. Start one to see your history here.
                         </p>
                         <Link href="/interview">
                             <Button className="mt-6 bg-indigo-600 text-white">Start Interview</Button>
                         </Link>
                    </div>
                ) : (
                    <div className="border border-border rounded-xl bg-card shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b border-border">
                                    <tr>
                                        <th className="px-6 py-4 font-semibold">Date</th>
                                        <th className="px-6 py-4 font-semibold">Role</th>
                                        <th className="px-6 py-4 font-semibold">Level</th>
                                        <th className="px-6 py-4 font-semibold">Duration</th>
                                        <th className="px-6 py-4 font-semibold">Score</th>
                                        <th className="px-6 py-4 font-semibold text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {sessions.map((session) => (
                                        <tr key={session._id} className="border-b border-border hover:bg-muted/30 transition-colors">
                                            <td className="px-6 py-4 text-foreground font-medium flex items-center gap-2">
                                                <Calendar size={14} className="text-muted-foreground" />
                                                {new Date(session.startedAt).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4">{session.role}</td>
                                            <td className="px-6 py-4">
                                                <span className="bg-muted px-2.5 py-1 rounded-md text-xs font-semibold">{session.level}</span>
                                            </td>
                                            <td className="px-6 py-4 text-muted-foreground">{session.duration} min</td>
                                            <td className="px-6 py-4">
                                                <span className={`font-bold ${
                                                    session.scoreReport?.overallScore >= 8 ? 'text-green-600' :
                                                    session.scoreReport?.overallScore >= 5 ? 'text-yellow-600' : 'text-red-600'
                                                }`}>
                                                    {session.scoreReport?.overallScore || '-'}/10
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                {session.scoreReport ? (
                                                    <Button 
                                                        variant="ghost" 
                                                        size="sm" 
                                                        className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 dark:hover:bg-indigo-900/30"
                                                        onClick={() => setSelectedSession(session)}
                                                    >
                                                        View Report <ExternalLink size={14} className="ml-2" />
                                                    </Button>
                                                ) : (
                                                    <span className="text-muted-foreground text-xs italic">Analyzing...</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
