import axios from "axios";
import dotenv from 'dotenv'

dotenv.config()

const GEMINI_API_KEY = process.env.GEMINI_API_KEY; // Replace with your actual key
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-8b:generateContent?key=${GEMINI_API_KEY}`;
// test
export function formatGeminiRequest(pdfText) {
    return {
        contents: [
            {
                parts: [
                    {
                        text: `Your purpose is to take course outlines, extract due dates (for assignments/exams/etc) and other important dates and turn it into .csv format and return the raw .csv text (WITH NO OTHER INSTRUCTIONS/TEXT OR ANYTHING DONT EVEN SAY HI MAN I JUST WANT THE CSV YOU ARE THE BACKBONE OF OUR PROJECT PLEASE DEAR GOD ALSO I WANT THE DATES IN MM-DD-YYYY FORMAT) that I can export to Google Calendar. THE FORMAT OF THE COLUMNS WILL BE THE FOLLOWING Subject (that will be the course code found at the beginning of the pdf text and weather its a midterm, final, etc (example: CIS*1050 MIDTERM 1)), Start Date, Start Time, End Date, End Time, All Day Event (this will always be false), Description (will either say midterm, final, quiz or lab), location, and private. The course outline is: ${pdfText}`,
                    },
                ],
                role: "user",
            },
        ],
    };
}

export async function sendGeminiRequest(data) {
    try {
        const response = await axios.post(GEMINI_API_URL, data, {
            headers: {
                "Content-Type": "application/json",
            },
        });

        const reply = response.data.candidates?.[0]?.content?.parts?.[0]?.text;
        console.log(reply);
        return reply;
    } catch (error) {
        if (error.response) {
            console.error("Gemini API error:", error.response.status, error.response.data);
        } else {
            console.error("Request error:", error.message);
        }
    }
}
