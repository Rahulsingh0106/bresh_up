"use client";

import { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AIModel } from "@/services/GlobalServices";
import { Loader2Icon, Mic, MicOff, Volume2, VolumeX } from "lucide-react";
import ChatBox from "./components/ChatBox";
import SetupWizard from "@/components/interview/SetupWizard";
import Timer from "@/components/interview/Timer";
import FeedbackScreen from "@/components/interview/FeedbackScreen";
import toast from "react-hot-toast";

const InterviewPage = () => {
    const [setupComplete, setSetupComplete] = useState(false);
    const [interviewComplete, setInterviewComplete] = useState(false);
    const [setupData, setSetupData] = useState(null);

    const [isListening, setIsListening] = useState(false);
    const [isSpeakingAI, setIsSpeakingAI] = useState(false);
    const [voiceModeEnabled, setVoiceModeEnabled] = useState(true);
    
    const [userInput, setUserInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [conversation, setConversation] = useState([]);

    const recognitionRef = useRef(null);
    const synthRef = useRef(null);

    useEffect(() => {
        // Initialize SpeechSynthesis
        if (typeof window !== "undefined" && 'speechSynthesis' in window) {
            synthRef.current = window.speechSynthesis;
        }

        // Initialize SpeechRecognition
        if (typeof window !== "undefined" && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = true;
            recognitionRef.current.interimResults = true;
            recognitionRef.current.lang = 'en-US';

            recognitionRef.current.onresult = (event) => {
                let currentTranscript = '';
                for (let i = event.resultIndex; i < event.results.length; i++) {
                    const transcript = event.results[i][0].transcript;
                    if (event.results[i].isFinal) {
                        setUserInput(prev => prev + (prev.length > 0 ? " " : "") + transcript);
                    } else {
                        currentTranscript += transcript;
                    }
                }
            };

            recognitionRef.current.onerror = (event) => {
                console.error("Speech recognition error", event.error);
                if (event.error !== 'no-speech') {
                    setIsListening(false);
                    toast.error(`Microphone error: ${event.error}`);
                }
            };

            recognitionRef.current.onend = () => {
                // If it was manually stopped, keep it false, else it might have timed out
                setIsListening(false);
            };
        }

        return () => {
            if (recognitionRef.current) {
                recognitionRef.current.stop();
            }
            if (synthRef.current) {
                synthRef.current.cancel();
            }
        };
    }, []);

    const speakText = (text) => {
        if (!voiceModeEnabled || !synthRef.current) return;
        
        synthRef.current.cancel(); // cancel previous speaking
        
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 1.0;
        utterance.pitch = 1.0;
        
        // Find a good voice
        const voices = synthRef.current.getVoices();
        const preferredVoice = voices.find(v => v.name.includes('Google') || v.name.includes('Samantha') || v.lang === 'en-US');
        if (preferredVoice) {
            utterance.voice = preferredVoice;
        }

        utterance.onstart = () => setIsSpeakingAI(true);
        utterance.onend = () => setIsSpeakingAI(false);
        utterance.onerror = () => setIsSpeakingAI(false);

        synthRef.current.speak(utterance);
    };

    const toggleListening = () => {
        if (!recognitionRef.current) {
            toast.error("Speech recognition not supported in your browser. Please use Google Chrome or Edge.");
            return;
        }

        if (isListening) {
            recognitionRef.current.stop();
            setIsListening(false);
        } else {
            // Stop AI if user starts speaking
            if (synthRef.current) synthRef.current.cancel();
            setIsSpeakingAI(false);
            
            try {
                recognitionRef.current.start();
                setIsListening(true);
            } catch (e) {
                console.error("Mic start error", e);
            }
        }
    };

    const handleSetupComplete = (data) => {
        setSetupData(data);
        setSetupComplete(true);
        
        // Trigger initial AI greeting
        startInterviewGreeting(data);
    };

    const startInterviewGreeting = async (data) => {
        setLoading(true);
        localStorage.setItem("interview_context", JSON.stringify(data));
        const initialPrompt = "Start the interview now with a short introduction.";
        const updatedConversation = [{ role: 'user', content: initialPrompt }];
        
        try {
            const aiResp = await AIModel("Mock Interview", [], initialPrompt);
            setConversation([{ role: 'model', content: aiResp }]);
            speakText(aiResp);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleEndInterview = () => {
        setInterviewComplete(true);
        if (recognitionRef.current) recognitionRef.current.stop();
        if (synthRef.current) synthRef.current.cancel();
    };

    const handleRetake = () => {
        setConversation([]);
        setInterviewComplete(false);
        setSetupComplete(false);
    };

    const sendMsg = async () => {
        if (!userInput.trim()) return;
        
        const textToSend = userInput;
        setUserInput(""); // clear input early
        if (isListening) toggleListening(); // stop mic when sending

        // Capture current conversation BEFORE adding the new message
        const currentConversation = [...conversation];
        
        // Optimistically update UI
        const updatedConversation = [...conversation, { role: 'user', content: textToSend }];
        setConversation(updatedConversation);
        
        setLoading(true);
        try {
            if (setupData) {
                localStorage.setItem("interview_context", JSON.stringify(setupData));
            }

            // Pass the conversation HISTORY (without the new message) and the new message text
            const aiResp = await AIModel("Mock Interview", currentConversation, textToSend);
            setConversation(prev => [...prev, { role: 'model', content: aiResp }]);
            speakText(aiResp);
        } catch (error) {
            toast.error("Failed to get AI response");
        } finally {
            setLoading(false);
        }
    };

    if (!setupComplete) {
        return <SetupWizard onComplete={handleSetupComplete} />;
    }

    if (interviewComplete) {
        // Pass setupData to feedback screen to record in db
        return <div className="p-4 md:p-8"><FeedbackScreen conversation={conversation} setupData={setupData} onRetake={handleRetake} /></div>;
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
                        <Button 
                            variant="outline" 
                            size="icon" 
                            onClick={() => {
                                setVoiceModeEnabled(!voiceModeEnabled);
                                if (voiceModeEnabled && synthRef.current) synthRef.current.cancel();
                            }}
                            title={voiceModeEnabled ? "Disable AI Voice" : "Enable AI Voice"}
                        >
                            {voiceModeEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
                        </Button>
                        <Timer durationMinutes={setupData?.duration || 10} onExpire={handleEndInterview} />
                        <Button variant="destructive" onClick={handleEndInterview}>End Interview</Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                        <div className="h-[60vh] bg-card border shadow-sm rounded-2xl flex flex-col justify-center items-center relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-violet-500/5" />
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl" />
                            
                            <div className="relative z-10 flex flex-col items-center animate-in fade-in zoom-in duration-500">
                                <div className={`relative w-24 h-24 rounded-full border-4 ${isSpeakingAI || isListening ? 'border-indigo-500 shadow-[0_0_20px_rgba(99,102,241,0.5)]' : 'border-muted'} transition-all duration-300`}>
                                    <img src="/male-avatar.png" className={`w-full h-full rounded-full object-cover ${isSpeakingAI ? 'animate-pulse' : 'opacity-70 grayscale'}`} alt="AI Avatar" />
                                </div>
                                <h2 className="mt-4 text-lg font-semibold text-foreground">AI Interviewer</h2>
                                <p className="text-sm text-muted-foreground">{isSpeakingAI ? "Speaking..." : isListening ? "Listening to you..." : "Waiting..."}</p>
                            </div>
                        </div>
                        
                        <div className="mt-6 flex items-center justify-center gap-4">
                            <Button 
                                size="lg" 
                                onClick={toggleListening} 
                                variant={isListening ? "destructive" : "default"}
                                className={`w-48 ${!isListening ? 'bg-indigo-600 hover:bg-indigo-700 text-white' : ''}`}
                            >
                                {isListening ? <MicOff className="mr-2 h-5 w-5" /> : <Mic className="mr-2 h-5 w-5" />}
                                {isListening ? "Stop Listening" : "Start Speaking"}
                            </Button>
                        </div>
                    </div>
                    
                    <div className="h-[60vh] lg:h-auto">
                        <ChatBox 
                            conversation={conversation} 
                            sendMsg={sendMsg} 
                            userInput={userInput} 
                            setUserInput={setUserInput} 
                            loading={loading} 
                            enableMic={isListening} 
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InterviewPage;
