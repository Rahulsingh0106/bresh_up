"use client";

import { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import dynamic from "next/dynamic";
import { AIModel, ConvertTextToSpeech } from "@/services/GlobalServices";
import { Loader2Icon } from "lucide-react";
import ChatBox from "./components/ChatBox";
import { useAuthRedirect } from "@/hooks/useAuth";
// Dynamically import RecordRTC (without SSR)
const RecordRTC = dynamic(() => import("recordrtc").then(mod => mod.default), { ssr: false });

const InterviewPage = () => {
    const { checking } = useAuthRedirect();

    if (checking) return <p className="text-center mt-10">Loading...</p>;
    const [enableMic, setEnableMic] = useState(false);
    const [userInput, setUserInput] = useState("");
    const recorderRef = useRef(null); // Use ref for recorder
    const silenceTimeoutRef = useRef(null);
    const [loading, setLoading] = useState(false);
    const [audioUrl, setAudioUrl] = useState()
    const [conversation, setConversation] = useState([]);
    useEffect(() => {
        return () => {
            if (recorderRef.current) {
                recorderRef.current.stopRecording();
            }
        };
    }, []);

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
            // console.log("Transcription:", userInput);
            // Display transcription in UI (state update)
        } catch (error) {
            console.error("Error sending audio:", error);
        }
    };
    useEffect(() => {
        console.log("Full Transcription:", userInput);
    }, [userInput]);
    // useEffect(() => {
    //     console.log("Full Conversation:", conversation)
    // }, [conversation])
    const connectToServer = async () => {
        setLoading(true)
        setEnableMic(true);
        if (typeof window !== "undefined" && typeof navigator !== "undefined") {
            try {
                const constraints = {
                    audio: {
                        echoCancellation: true,
                        noiseSuppression: true,
                    },
                };
                const stream = await navigator.mediaDevices.getUserMedia(constraints);

                // Wait for dynamic import to load RecordRTC properly
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
                        const buffer = await blob.arrayBuffer();
                        console.log("Audio Buffer:", buffer);

                        silenceTimeoutRef.current = setTimeout(() => {
                            console.log("User stopped talking");
                        }, 2000);
                    },
                });

                newRecorder.startRecording();
                recorderRef.current = newRecorder; // Store recorder instance
                setLoading(false)
                console.log("✅ Recording started...");
            } catch (error) {
                console.error("❌ Error accessing microphone:", error);
            }
        }
    };

    const disconnect = async (e) => {
        e.preventDefault();
        setLoading(true)
        if (recorderRef.current) {
            recorderRef.current.stopRecording(() => {
                console.log("🎤 Recording stopped.");
            });

            recorderRef.current = null; // Clear recorder instance
            setEnableMic(false);
            setLoading(false)
        } else {
            console.error("⚠️ Recorder is not initialized.");
        }
    };
    const sendMsg = async () => {
        // Create a new conversation array with the user's message
        const updatedConversation = [...conversation, { role: 'user', content: userInput }];

        // Update the state with the new conversation
        setConversation(updatedConversation);

        // Now call the AI function with the latest conversation
        await handleAIResponse(updatedConversation);
    };

    // Function to handle AI response
    const handleAIResponse = async (updatedConversation) => {
        const aiResp = await AIModel("Mock Interview", updatedConversation, userInput);
        const url = await ConvertTextToSpeech(aiResp);
        setAudioUrl(url);

        // Append the AI response to the conversation state
        setConversation(prev => [...prev, { role: 'model', content: aiResp }]);
    };



    return (
        <div className="p-5 m-5">
            <h2 className="text-lg font-bold">AI Agent</h2>
            <div className="mt-5 grid grid-cols-1 lg:grid-cols-3 gap-10">
                <div className="lg:col-span-2">
                    <div className="h-[70vh] bg-secondary border rounded-4xl flex flex-col justify-center items-center relative">
                        <img src="/male-avatar.png" width={200} height={200} className="h-[80px] w-[80px] rounded-full object-cover animate-pulse" />
                        <h2 className="text-gray-500">Rahul Singh</h2>
                        <audio src={audioUrl} type="audio/mp3" autoPlay />
                        <div className="p-5 bg-gray-200 px-10 rounded-lg absolute bottom-10 right-10">
                            <Button>S</Button>
                        </div>
                    </div>
                    <div className="mt-5 flex items-center justify-center">
                        {!enableMic ? (
                            <Button onClick={connectToServer} disabled={loading}>{loading && <Loader2Icon className="animate-spin" />}Connect</Button>
                        ) : (
                            <Button variant="destructive" onClick={disconnect} disabled={loading}>{loading && <Loader2Icon className="animate-spin" />}Disconnect</Button>
                        )}
                    </div>
                </div>
                <ChatBox conversation={conversation} sendMsg={sendMsg} userInput={userInput} setUserInput={setUserInput} loading={loading} enableMic={enableMic} />

            </div>
        </div>
    );
};

export default InterviewPage;
