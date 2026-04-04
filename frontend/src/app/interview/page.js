"use client";

import { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import dynamic from "next/dynamic";
import { AIModel, ConvertTextToSpeech } from "@/services/GlobalServices";
import { Loader2Icon } from "lucide-react";
import ChatBox from "./components/ChatBox";
import { useAuthRedirect } from "@/hooks/useAuth";
import SetupWizard from "@/components/interview/SetupWizard";
import Timer from "@/components/interview/Timer";
import FeedbackScreen from "@/components/interview/FeedbackScreen";

// Dynamically import RecordRTC (without SSR)
const RecordRTC = dynamic(() => import("recordrtc").then(mod => mod.default), { ssr: false });

const InterviewPage = () => {
    const [setupComplete, setSetupComplete] = useState(false);
    const [interviewComplete, setInterviewComplete] = useState(false);
    const [setupData, setSetupData] = useState(null);

    const [enableMic, setEnableMic] = useState(false);
    const [userInput, setUserInput] = useState("");
    const recorderRef = useRef(null);
    const silenceTimeoutRef = useRef(null);
    const [loading, setLoading] = useState(false);
    const [audioUrl, setAudioUrl] = useState();
    const [conversation, setConversation] = useState([]);

    useEffect(() => {
        return () => {
            if (recorderRef.current) {
                recorderRef.current.stopRecording();
            }
        };
    }, []);

    const handleSetupComplete = (data) => {
        setSetupData(data);
        setSetupComplete(true);
    };

    const handleEndInterview = () => {
        setInterviewComplete(true);
        if (recorderRef.current) {
            recorderRef.current.stopRecording();
            recorderRef.current = null;
        }
    };

    const handleRetake = () => {
        setConversation([]);
        setAudioUrl(null);
        setInterviewComplete(false);
        setSetupComplete(false);
    };

    const sendAudioToServer = async (blob) => {
        const formData = new FormData();
        formData.append("audio", blob, "audio.webm");

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/transcribe`, {
                method: "POST",
                body: formData,
            });

            const data = await response.json();
            if (data.transcription) {
                setUserInput((prevInput) => prevInput + " " + data.transcription);
            }
        } catch (error) {
            console.error("Error sending audio:", error);
        }
    };

    const connectToServer = async () => {
        setLoading(true)
        setEnableMic(true);
        if (typeof window !== "undefined" && typeof navigator !== "undefined") {
            try {
                const constraints = {
                    audio: { echoCancellation: true, noiseSuppression: true },
                };
                const stream = await navigator.mediaDevices.getUserMedia(constraints);

                const RecordRTCInstance = await import("recordrtc").then(mod => mod.default);

                const newRecorder = new RecordRTCInstance(stream, {
                    type: "audio",
                    mimeType: "audio/webm;codecs=opus",
                    recorderType: RecordRTCInstance.StereoAudioRecorder,
                    timeSlice: 2000,
                    desiredSampRate: 16000,
                    numberOfAudioChannels: 1,
                    bufferSize: 4096,
                    audioBitsPerSecond: 128000,
                    ondataavailable: async (blob) => {
                        clearTimeout(silenceTimeoutRef.current);
                        sendAudioToServer(blob);
                        silenceTimeoutRef.current = setTimeout(() => console.log("User stopped talking"), 2000);
                    },
                });

                newRecorder.startRecording();
                recorderRef.current = newRecorder;
                setLoading(false)
            } catch (error) {
                console.error("❌ Error accessing microphone:", error);
            }
        }
    };

    const disconnect = async (e) => {
        if(e) e.preventDefault();
        setLoading(true)
        if (recorderRef.current) {
            recorderRef.current.stopRecording();
            recorderRef.current = null;
            setEnableMic(false);
            setLoading(false)
        }
    };

    const sendMsg = async () => {
        const updatedConversation = [...conversation, { role: 'user', content: userInput }];
        setConversation(updatedConversation);
        await handleAIResponse(updatedConversation);
    };

    const handleAIResponse = async (updatedConversation) => {
        // Pass setupData context to GlobalServices if we modify AIModel signature.
        // For now we set it in local storage so GlobalServices can grab it.
        if (setupData) {
            localStorage.setItem("interview_context", JSON.stringify(setupData));
        }

        const aiResp = await AIModel("Mock Interview", updatedConversation, userInput);
        const url = await ConvertTextToSpeech(aiResp);
        setAudioUrl(url);

        setConversation(prev => [...prev, { role: 'model', content: aiResp }]);
    };

    if (!setupComplete) {
        return <SetupWizard onComplete={handleSetupComplete} />;
    }

    if (interviewComplete) {
        return <div className="p-4 md:p-8"><FeedbackScreen conversation={conversation} onRetake={handleRetake} /></div>;
    }

    return (
        <div className="bg-background min-h-[calc(100vh-80px)] p-4 md:p-8">
            <div className="max-w-6xl mx-auto">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-foreground">AI Mock Interview</h2>
                        <p className="text-sm text-muted-foreground mt-1">
                            Role: <span className="font-medium text-foreground">{setupData?.role}</span> • Level: <span className="font-medium text-foreground">{setupData?.level}</span>
                        </p>
                    </div>
                    <div className="flex items-center gap-4">
                        <Timer durationMinutes={setupData?.duration || 10} onExpire={handleEndInterview} />
                        <Button variant="destructive" onClick={handleEndInterview}>End Interview</Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                        <div className="h-[60vh] bg-card border shadow-sm rounded-2xl flex flex-col justify-center items-center relative overflow-hidden">
                            {/* Abstract decorative background */}
                            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-violet-500/5" />
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl" />
                            
                            <div className="relative z-10 flex flex-col items-center animate-in fade-in zoom-in duration-500">
                                <div className={`relative w-24 h-24 rounded-full border-4 ${audioUrl || enableMic ? 'border-indigo-500 shadow-[0_0_20px_rgba(99,102,241,0.5)]' : 'border-muted'} transition-all duration-300`}>
                                    <img src="/male-avatar.png" className={`w-full h-full rounded-full object-cover ${audioUrl || enableMic ? 'animate-pulse' : 'opacity-70 grayscale'}`} alt="AI Avatar" />
                                </div>
                                <h2 className="mt-4 text-lg font-semibold text-foreground">AI Interviewer</h2>
                                <p className="text-sm text-muted-foreground">{enableMic ? "Listening..." : "Waiting to start..."}</p>
                            </div>

                            <audio src={audioUrl} type="audio/mp3" autoPlay onEnded={() => setAudioUrl(null)} />
                        </div>
                        
                        <div className="mt-6 flex items-center justify-center gap-4">
                            {!enableMic ? (
                                <Button size="lg" onClick={connectToServer} disabled={loading} className="bg-indigo-600 hover:bg-indigo-700 text-white w-48">
                                    {loading && <Loader2Icon className="animate-spin mr-2 h-5 w-5" />}
                                    Start Speaking
                                </Button>
                            ) : (
                                <Button size="lg" variant="destructive" onClick={disconnect} disabled={loading} className="w-48">
                                    {loading && <Loader2Icon className="animate-spin mr-2 h-5 w-5" />}
                                    Stop Speaking
                                </Button>
                            )}
                        </div>
                    </div>
                    
                    <div className="h-[60vh] lg:h-auto">
                        <ChatBox conversation={conversation} sendMsg={sendMsg} userInput={userInput} setUserInput={setUserInput} loading={loading} enableMic={enableMic} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InterviewPage;
