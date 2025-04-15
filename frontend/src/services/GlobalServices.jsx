import axios from 'axios';
import OpenAI from 'openai';
import { CoachingOptions } from './Options';
import { PollyClient, SynthesizeSpeechCommand } from '@aws-sdk/client-polly';
export const getToken = async () => {
    const result = await axios.get('/api/getToken');
    return result.data.token
}


const openai = new OpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: process.env.NEXT_PUBLIC_AI_OPENROUTER,
    dangerouslyAllowBrowser: true
})
export const AIModel = async (breshupOptions, lastTwoConversation, message = false) => {
    const option = CoachingOptions.find((item) => item.name == breshupOptions);
    console.log(lastTwoConversation)
    let data = JSON.parse(localStorage.getItem("token"))
    const userData = data.user_details;
    const PROMPT = option.prompt.replace("{user_resume_data}", userData);
    const completion = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/resume/getAiResponse`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ prompt: PROMPT, lastTwoConversation: lastTwoConversation, message: message })
    });
    const completionData = await completion.json();
    // console.log(completionData.response.result);
    return completionData.response.result
    // const completion = await openai.chat.completions.create({
    //     model: "google/gemini-2.0-pro-exp-02-05:free",
    //     messages: [
    //         { role: "assistant", content: PROMPT },
    //         ...lastTwoConversation
    //     ],
    // })
    // console.log(completion.choices[0].message)
    // return completion.choices[0].message;
}

export const ConvertTextToSpeech = async (text) => {
    const pollyClient = new PollyClient({
        region: 'us-east-1',
        credentials: {
            accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_KEY
        }
    })

    const command = new SynthesizeSpeechCommand({
        Text: text,
        OutputFormat: 'mp3',
        VoiceId: 'Matthew'
    })

    try {
        const { AudioStream } = await pollyClient.send(command)
        const audioArrayBuffer = await AudioStream.transformToByteArray()
        const audioBlob = new Blob([audioArrayBuffer], { type: 'audio/mp3' })

        const audioUrl = URL.createObjectURL(audioBlob)
        return audioUrl
    } catch (error) {
        console.error(error)
    }
}