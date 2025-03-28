"use client";

import { useRef, useEffect, useState } from "react";
import Draggable from "react-draggable";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { RealtimeTranscriber } from "assemblyai";
import { getToken } from "@/services/GlobalServices";

const ASSEMBLY_AI_API_KEY = "0d521ecd314b407687a6120d0a96607d"; // 🔹 Replace with your API key

const InterviewRoom = ({ onEndMeeting }) => {
    const videoRef = useRef(null);
    const draggableRef = useRef(null);
    const [stream, setStream] = useState(null);
    const [messages, setMessages] = useState([]);
    const [inputText, setInputText] = useState("");
    const [socket, setSocket] = useState(null);
    const realtimeTranscriber = useRef(null);
    useEffect(() => {
        const startVideo = async () => {
            realtimeTranscriber.current = new RealtimeTranscriber({
                token: await getToken(),
                sample_rate: 16_000
            });

            realtimeTranscriber.current.on('transcript', async (transcript) => {
                console.log(transcript)
            })

            await realtimeTranscriber.current.connect()
            try {
                const userStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
                videoRef.current.srcObject = userStream;
                setStream(userStream);
                //startAssemblyAI(userStream); // 🔹 Start Assembly AI when audio is available
            } catch (error) {
                console.error("Error accessing webcam:", error);
            }
        };

        startVideo();
        return () => {
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
        };
    }, []);

    // 🔹 Initialize Assembly AI WebSocket
    // const startAssemblyAI = async (userStream) => {
    //     const ws = new WebSocket("wss://api.assemblyai.com/v2/realtime/ws?sample_rate=16000");

    //     ws.onopen = () => {
    //         console.log("Connected to Assembly AI");
    //         ws.send(JSON.stringify({ config: { sample_rate: 16000, encoding: "pcm_s16le" } }));
    //         sendAudioStream(userStream, ws);
    //     };

    //     ws.onmessage = (event) => {
    //         const data = JSON.parse(event.data);
    //         if (data.text) {
    //             setInputText(data.text); // 🔹 Update input field with transcribed text
    //         }
    //     };

    //     ws.onerror = (error) => console.error("WebSocket Error:", error);
    //     ws.onclose = () => console.log("Assembly AI WebSocket closed");

    //     setSocket(ws);
    // };

    // 🔹 Capture and send audio to Assembly AI
    const sendAudioStream = (userStream, ws) => {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const source = audioContext.createMediaStreamSource(userStream);
        const processor = audioContext.createScriptProcessor(4096, 1, 1);

        processor.onaudioprocess = (event) => {
            if (ws.readyState === WebSocket.OPEN) {
                const audioData = event.inputBuffer.getChannelData(0);
                const int16Array = new Int16Array(audioData.length);
                for (let i = 0; i < audioData.length; i++) {
                    int16Array[i] = Math.max(-1, Math.min(1, audioData[i])) * 32767;
                }
                ws.send(int16Array.buffer);
            }
        };

        source.connect(processor);
        processor.connect(audioContext.destination);
    };

    // 🔹 Handles message sending
    const handleSendMessage = () => {
        if (inputText.trim() !== "") {
            setMessages([...messages, inputText]);
            setInputText(""); // Clear input after sending
        }
    };

    return (
        <div className="w-screen h-screen flex bg-gray-900 text-white">
            {/* ✅ Left Section (Video Section) */}
            <div className="w-2/3 flex flex-col items-center justify-center p-4">
                <h1 className="text-2xl font-bold mb-4">Live Interview</h1>

                {/* ✅ Draggable Mini Camera Window */}
                <Draggable nodeRef={draggableRef}>
                    <div ref={draggableRef} className="absolute top-10 left-10 cursor-move">
                        <Card className="overflow-hidden rounded-lg shadow-lg border border-gray-700">
                            <video ref={videoRef} autoPlay playsInline className="w-40 h-40 bg-black"></video>
                        </Card>
                    </div>
                </Draggable>
            </div>

            {/* ✅ Right Section (Chat Section) */}
            <div className="w-1/3 flex flex-col border-l border-gray-700 p-4">
                <h2 className="text-xl font-bold">Chat</h2>
                <div className="flex-grow overflow-y-auto p-2 border border-gray-600 rounded-md h-3/4">
                    {messages.map((msg, index) => (
                        <div key={index} className="bg-gray-800 p-2 rounded-md my-2">{msg}</div>
                    ))}
                </div>

                {/* ✅ Input Field and Send Button */}
                <div className="flex mt-4">
                    <input
                        type="text"
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        className="flex-grow p-2 bg-gray-800 border border-gray-600 rounded-md text-white"
                        placeholder="Speak or type a message..."
                    />
                    <Button onClick={handleSendMessage} className="ml-2">Send</Button>
                </div>
            </div>

            {/* ✅ Bottom Action Bar */}
            {/* <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 w-2/3 bg-gray-800 rounded-xl py-3 px-6 flex justify-center gap-6 shadow-lg border border-gray-700"> */}
            <Button variant="outline">Next Question</Button>
            <Button onClick={onEndMeeting} variant="destructive">End Meeting</Button>
            {/* </div> */}
        </div>
    );
};

export default InterviewRoom;
