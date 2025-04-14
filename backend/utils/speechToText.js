const speech = require("@google-cloud/speech");
const fs = require("fs");

// Load credentials from JSON key file
const client = new speech.SpeechClient({
    keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON
});

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
