const { GoogleGenerativeAI } = require("@google/generative-ai");
const pdfParse = require("pdf-parse");
require("dotenv").config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

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

    const response = await model.generateContent(prompt);
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
    console.log(lastTwoConversation);

    // Format conversation history: each entry should have a 'parts' array
    const formattedHistory = lastTwoConversation.map(item => ({
      role: item.role,
      parts: [{ text: item.content }]
    }));

    // Append the latest assistant prompt in the required format
    formattedHistory.push({
      role: "model",
      parts: [{ text: prompt }]
    });

    // Start a chat session with the formatted history
    const chat = genAI.getGenerativeModel({ model: "gemini-2.0-flash" }).startChat({
      history: formattedHistory
    });

    let response;
    if (message) {
      response = await chat.sendMessage(message);
    } else {
      response = await chat.sendMessage(prompt);
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
    const response = await model.generateContent(prompt);
    const result = await response.response.text();
    return { result: result };
  } catch (error) {
    console.error("❌ Gemini API Error:", error);
    return "Error analyzing text.";
  }
};

module.exports = { extractPDFText, analyzeResume, aiResponse };
