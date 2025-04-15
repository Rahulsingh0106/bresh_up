const speech = require("@google-cloud/speech");
const { GoogleAuth } = require("google-auth-library")
const fs = require("fs");
require("dotenv").config();

const credentials = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON);
// Load credentials from JSON key file
const auth = new GoogleAuth({
    credentials: credentials,
    scopes: "https://www.googleapis.com/auth/cloud-platform",
});

// Initialize the Speech Client with the authentication object
const client = new speech.SpeechClient({ auth });

// Function to transcribe audio
const transcribeAudio = async (audioBuffer) => {
    try {
        const audio = {
            content: audioBuffer.toString("base64"),
        };

        const config = {
            encoding: "LINEAR16 ", // Ensure this matches your recorded format
            sampleRateHertz: 16000,
            languageCode: "en-US",
        };

        const request = { audio, config };

        const [response] = await client.recognize(request);
        const transcription = response.results
            .map((result) => result.alternatives[0].transcript)
            .join("\n");

        console.log("Transcription:", transcription);
        return transcription;
    } catch (error) {
        console.error("Speech-to-Text Error:", error);
        return null;
    }
};

module.exports = { transcribeAudio };
