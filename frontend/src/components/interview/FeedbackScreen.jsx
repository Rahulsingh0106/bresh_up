import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { RefreshCcw, Download, CheckCircle2, AlertCircle } from "lucide-react";
import toast from "react-hot-toast";

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

export default function FeedbackScreen({ conversation, onRetake }) {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        // Mock API call to get feedback using the conversation history
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:5000'}/api/interview/feedback`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ conversation }),
        });
        
        if (!res.ok) throw new Error("Failed to fetch report");
        const data = await res.json();
        setReport(data);
      } catch (error) {
        toast.error("Error generating feedback report.");
        console.error(error);
        // Fallback mock data in case the server is completely unreachable
        setReport({
          overallScore: 7,
          communicationScore: 8,
          technicalScore: 6,
          problemSolvingScore: 7,
          strengths: ["Clear communication", "Good understanding of fundamentals"],
          improvements: ["Need to dive deeper into practical implementations", "Avoid hesitation when unsure"],
          topicsToRevise: ["React Hooks advanced patterns", "System Design Scalability"],
          questionFeedback: [
             { question: "Mock question?", yourAnswer: "Mock answer.", feedback: "Mock feedback." }
          ]
        });
      } finally {
        setLoading(false);
      }
    };

    fetchFeedback();
  }, [conversation]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-lg font-medium text-foreground">Analyzing your interview performance...</p>
        <p className="text-sm text-muted-foreground">Generating detailed feedback and scores.</p>
      </div>
    );
  }

  if (!report) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12 w-full animate-in fade-in zoom-in-95 duration-500">
      <div className="flex items-center justify-between mb-8 pb-4 border-b">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Interview Feedback Report</h2>
          <p className="text-muted-foreground mt-1">Review your performance and areas for improvement.</p>
        </div>
        <div className="flex gap-3 print:hidden">
          <Button variant="outline" onClick={onRetake} className="gap-2">
            <RefreshCcw size={16} /> Retake Interview
          </Button>
          <Button onClick={handlePrint} className="gap-2 bg-indigo-600 hover:bg-indigo-700 text-white">
            <Download size={16} /> Save Report
          </Button>
        </div>
      </div>

      {/* Scores */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <ScoreBadge score={report.overallScore} label="Overall Score" />
        <ScoreBadge score={report.technicalScore} label="Technical" />
        <ScoreBadge score={report.problemSolvingScore} label="Problem Solving" />
        <ScoreBadge score={report.communicationScore} label="Communication" />
      </div>

      <div className="grid md:grid-cols-2 gap-8 mt-8">
        {/* Strengths & Improvements */}
        <Card className="border-border shadow-sm">
          <CardHeader className="pb-3 border-b bg-muted/30">
            <CardTitle className="text-lg flex items-center gap-2">
              <CheckCircle2 className="text-green-500" size={20} /> Key Strengths
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <ul className="space-y-2">
              {report.strengths.map((s, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-foreground">
                  <span className="text-green-500 font-bold mt-0.5">•</span> {s}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="border-border shadow-sm">
          <CardHeader className="pb-3 border-b bg-muted/30">
            <CardTitle className="text-lg flex items-center gap-2">
              <AlertCircle className="text-orange-500" size={20} /> Areas to Improve
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <ul className="space-y-2">
              {report.improvements.map((s, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-foreground">
                  <span className="text-orange-500 font-bold mt-0.5">•</span> {s}
                </li>
              ))}
            </ul>
            <div className="mt-6 pt-4 border-t border-border">
              <h4 className="text-sm font-semibold mb-2">Topics to Revise:</h4>
              <div className="flex flex-wrap gap-2">
                {report.topicsToRevise.map((t, i) => (
                  <span key={i} className="px-2.5 py-1 bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300 text-xs rounded-full font-medium border border-indigo-200 dark:border-indigo-800">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Question Feedback */}
      <div className="mt-10">
        <h3 className="text-xl font-bold mb-6 text-foreground">Detailed Breakdown</h3>
        <div className="space-y-6">
          {report.questionFeedback.map((q, i) => (
            <Card key={i} className="border-border shadow-sm overflow-hidden">
              <div className="p-4 bg-muted/50 border-b">
                <p className="font-semibold text-foreground"><span className="text-indigo-600 dark:text-indigo-400 mr-2">Q{i+1}:</span> {q.question}</p>
              </div>
              <div className="p-4 border-b">
                <p className="text-sm font-medium text-muted-foreground mb-1">Your Answer:</p>
                <p className="text-sm text-foreground">{q.yourAnswer}</p>
              </div>
              <div className="p-4 bg-indigo-50/50 dark:bg-indigo-950/10">
                <p className="text-sm font-medium text-muted-foreground mb-1">Feedback:</p>
                <p className="text-sm text-foreground">{q.feedback}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
