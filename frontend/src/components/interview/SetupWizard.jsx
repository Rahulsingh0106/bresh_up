import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

export default function SetupWizard({ onComplete }) {
  const [step, setStep] = useState(1);
  const [role, setRole] = useState("");
  const [level, setLevel] = useState("");
  const [duration, setDuration] = useState("");

  useEffect(() => {
    // Load from localStorage if exists
    const saved = localStorage.getItem("interview_setup");
    if (saved) {
      const data = JSON.parse(saved);
      if (data.role) setRole(data.role);
      if (data.level) setLevel(data.level);
      if (data.duration) setDuration(data.duration);
    }
  }, []);

  const handleNext = () => setStep(step + 1);
  const handleBack = () => setStep(step - 1);

  const handleStart = () => {
    const setupData = { role, level, duration: parseInt(duration) };
    localStorage.setItem("interview_setup", JSON.stringify(setupData));
    onComplete(setupData);
  };

  const roles = ["Frontend", "Backend", "Full Stack", "DSA", "System Design"];
  const levels = ["Junior", "Mid", "Senior"];
  const durations = [
    { label: "10 minutes", value: "10" },
    { label: "20 minutes", value: "20" },
    { label: "30 minutes", value: "30" }
  ];

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-80px)] bg-background p-4">
      <Card className="w-full max-w-lg shadow-lg border-border bg-card">
        <CardHeader>
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-indigo-600">Step {step} of 3</span>
            <div className="flex space-x-1">
              {[1, 2, 3].map((i) => (
                <div key={i} className={`h-1.5 w-8 rounded-full ${step >= i ? "bg-indigo-600" : "bg-muted"}`} />
              ))}
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">Interview Setup</CardTitle>
          <CardDescription>
            {step === 1 && "What role are you interviewing for?"}
            {step === 2 && "What is your target seniority level?"}
            {step === 3 && "How long do you want the mock interview to last?"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {step === 1 && (
            <div className="space-y-3">
              {roles.map((r) => (
                <div
                  key={r}
                  onClick={() => setRole(r)}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${role === r ? "border-indigo-600 bg-indigo-600/10" : "border-border hover:border-indigo-600/50 hover:bg-muted"}`}
                >
                  <p className="font-medium">{r}</p>
                </div>
              ))}
              <Button disabled={!role} onClick={handleNext} className="w-full mt-6 bg-indigo-600 hover:bg-indigo-700 text-white">Next</Button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-3">
              {levels.map((l) => (
                <div
                  key={l}
                  onClick={() => setLevel(l)}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${level === l ? "border-indigo-600 bg-indigo-600/10" : "border-border hover:border-indigo-600/50 hover:bg-muted"}`}
                >
                  <p className="font-medium">{l}</p>
                </div>
              ))}
              <div className="flex gap-4 mt-6">
                <Button variant="outline" onClick={handleBack} className="flex-1">Back</Button>
                <Button disabled={!level} onClick={handleNext} className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white">Next</Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-3">
              {durations.map((d) => (
                <div
                  key={d.value}
                  onClick={() => setDuration(d.value)}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${duration === d.value ? "border-indigo-600 bg-indigo-600/10" : "border-border hover:border-indigo-600/50 hover:bg-muted"}`}
                >
                  <p className="font-medium">{d.label}</p>
                </div>
              ))}
              <div className="flex gap-4 mt-6">
                <Button variant="outline" onClick={handleBack} className="flex-1">Back</Button>
                <Button disabled={!duration} onClick={handleStart} className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white">Start Interview</Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
