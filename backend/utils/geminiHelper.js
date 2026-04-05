const { GoogleGenerativeAI } = require("@google/generative-ai");
const pdfParse = require("pdf-parse");
require("dotenv").config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const executeWithRetry = async (fn, maxRetries = 2) => {
    for (let i = 0; i < maxRetries; i++) {
        try {
            return await fn();
        } catch (error) {
            if (error.status === 429 && i < maxRetries - 1) {
                let retryDelay = 15; // default 15 seconds
                if (error.errorDetails) {
                    const retryInfo = error.errorDetails.find(d => d['@type'] === 'type.googleapis.com/google.rpc.RetryInfo');
                    if (retryInfo && retryInfo.retryDelay) {
                        retryDelay = parseInt(retryInfo.retryDelay) || 15;
                    }
                }
                console.warn(`[Gemini API] Rate Limit (429) hit. Pausing for ${retryDelay} seconds before retry ${i + 1}/${maxRetries}...`);
                await new Promise(resolve => setTimeout(resolve, retryDelay * 1000));
                continue;
            }
            throw error; // If it's not a 429 or we ran out of retries, bubble it up
        }
    }
};

const extractPDFText = async (buffer) => {
  const data = await pdfParse(buffer);
  return data.text;
};

const analyzeResume = async (resumeText) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const prompt = `
            You are an expert in analyzing resumes. Extract structured information from the following resume text:
            
            Return only valid JSON with these keys:
            {
              "name": "John Doe",
              "email": "john.doe@example.com",
              "phone": "+1234567890",
              "linkedin": "https://linkedin.com/in/johndoe",
              "github": "https://github.com/johndoe",
              "skills": ["JavaScript", "Python", "React"],
              "education": [
                {
                  "degree": "Bachelor's in Computer Science",
                  "university": "XYZ University",
                  "year": "2018-2022"
                }
              ],
              "experience": [
                {
                  "position": "Software Engineer",
                  "company": "ABC Corp",
                  "years": "2022-Present"
                }
              ],
              "certifications": ["AWS Certified Developer"],
              "projects": ["Project A", "Project B"]
            }

            Do not add explanations, introductions, or any extra text. Just return JSON.

            Resume:  
            ${resumeText}
        `;

    const response = await executeWithRetry(() => model.generateContent(prompt));
    let rawText = response.response.text();

    // 🛑 Fix: If the response is already an object, return it directly
    if (typeof rawText === "object") {
      return rawText;
    }

    // Extract JSON if it's inside a code block
    const jsonMatch = rawText.match(/```json([\s\S]*?)```/);
    if (jsonMatch) {
      rawText = jsonMatch[1].trim();
    }

    return rawText;
  } catch (error) {
    console.error("❌ Gemini API Error:", error);
    return { error: "Error analyzing resume. Please try again." };
  }
};

const aiResponse = async (prompt, lastTwoConversation, message = false) => {
  try {
    // Format conversation history: each entry should have a 'parts' array
    // Filter out system prompts if they sneak in, Gemini enforces user/model alternation starting with user.
    let formattedHistory = [];
    
    if (Array.isArray(lastTwoConversation)) {
        formattedHistory = lastTwoConversation.map(item => ({
            role: item.role === 'model' ? 'model' : 'user',
            parts: [{ text: item.content || "..." }] // prevent empty text
        }));
    }

    // Gemini strictly requires history to start with 'user'
    if (formattedHistory.length > 0 && formattedHistory[0].role === 'model') {
        formattedHistory.unshift({
            role: 'user',
            parts: [{ text: "Let's begin the interview." }]
        });
    }

    // Gemini strictly requires alternating roles. We can clean up the history to ensure alternation if needed,
    // but prepending 'user' to a 'model' start usually fixes 99% of frontend mismatch issues.
    let validHistory = [];
    let expectedRole = 'user';
    for (const msg of formattedHistory) {
         // Skip consecutive messages of the same role to prevent crashes
         if (msg.role === expectedRole) {
             validHistory.push(msg);
             expectedRole = expectedRole === 'user' ? 'model' : 'user';
         }
    }

    // Start a chat session with the formatted history and properly set the system instructions
    const model = genAI.getGenerativeModel({ 
        model: "gemini-2.0-flash",
        systemInstruction: prompt
    });

    const chat = model.startChat({
      history: validHistory
    });

    let response;
    if (message) {
      response = await executeWithRetry(() => chat.sendMessage(message));
    } else {
      response = await executeWithRetry(() => chat.sendMessage("Hello, start the mock interview."));
    }

    const result = response.response.text();
    return { result: result };
  } catch (error) {
    console.error("❌ Gemini API Error:", error);
    return { result: "Error analyzing text." };
  }
};


const analyzeText = async (text) => {

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const prompt = `${text}`;
    const response = await executeWithRetry(() => model.generateContent(prompt));
    const result = await response.response.text();
    return { result: result };
  } catch (error) {
    console.error("❌ Gemini API Error:", error);
    return "Error analyzing text.";
  }
};

const generateScoreReport = async (conversation) => {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
        
        let conversationText = "";
        conversation.forEach((msg, idx) => {
            conversationText += `${msg.role === 'model' ? 'Interviewer' : 'Candidate'}: ${msg.content}\n`;
        });

        const prompt = `
            You are an expert technical interview evaluator. Based on the following interview transcript, generate a comprehensive evaluation report.
            
            Return ONLY a valid JSON object with the exact following schema and no markdown blocks, no extra text:
            {
                "overallScore": <number 1-10>,
                "communicationScore": <number 1-10>,
                "technicalScore": <number 1-10>,
                "problemSolvingScore": <number 1-10>,
                "strengths": ["string", "string"],
                "improvements": ["string", "string"],
                "topicsToRevise": ["string", "string"],
                "questionFeedback": [
                    { 
                        "question": "string",
                        "yourAnswer": "string",
                        "feedback": "string"
                    }
                ]
            }

            Here is the transcript:
            ${conversationText || "No conversation happened."}
        `;

        const response = await executeWithRetry(() => model.generateContent(prompt));
        let rawText = response.response.text();
        
        const jsonMatch = rawText.match(/```json([\s\S]*?)```/);
        if (jsonMatch) {
            rawText = jsonMatch[1].trim();
        } else {
            rawText = rawText.replace(/```/g, "").trim();
        }

        return JSON.parse(rawText);
    } catch (error) {
        console.error("❌ Gemini API Error generating report:", error);
        throw new Error("Error generating score report");
    }
};

module.exports = { extractPDFText, analyzeResume, aiResponse, generateScoreReport };
