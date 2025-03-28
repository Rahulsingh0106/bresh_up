const pdfParse = require("pdf-parse");

const extractDetails = (text) => {
    const extractedData = {};

    // Extract name (First line heuristic)
    const lines = text.split("\n").map((line) => line.trim());
    extractedData.name = lines[0];

    // Extract email
    const emailMatch = text.match(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/);
    extractedData.email = emailMatch ? emailMatch[0] : "Not found";

    // Extract phone number (Pattern matching)
    const phoneMatch = text.match(/\b\d{10}\b/);
    extractedData.phone = phoneMatch ? phoneMatch[0] : "Not found";

    // Extract skills (Basic keyword match)
    const skillsList = ["PHP", "Laravel", "Node.js", "React", "MongoDB", "SQL", "JavaScript", "AWS"];
    extractedData.skills = skillsList.filter((skill) => text.includes(skill));

    // Extract education (Regex pattern)
    const educationMatch = text.match(/(B\.?Tech|M\.?Tech|Bachelors|Masters) in (.+)/i);
    extractedData.education = educationMatch
        ? { degree: educationMatch[1], university: educationMatch[2], year: new Date().getFullYear() - 5 }
        : { degree: "Unknown", university: "Unknown", year: "Unknown" };

    return extractedData;
};

const parseResume = async (pdfBuffer) => {
    try {
        const { text } = await pdfParse(pdfBuffer);
        return extractDetails(text);
    } catch (error) {
        console.error("Error parsing PDF:", error);
        return null;
    }
};

module.exports = { parseResume };
