const axios = require("axios");
const pdfParse = require("pdf-parse");
const mammoth = require("mammoth");
const Tesseract = require("tesseract.js");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const ai = new GoogleGenerativeAI(GEMINI_API_KEY);

async function downloadFile(fileUrl) {
  const response = await axios.get(fileUrl, { responseType: "arraybuffer" });
  return Buffer.from(response.data);
}
async function extractTextFromPDF(buffer) { const data = await pdfParse(buffer); return data.text; }
async function extractTextFromDocx(buffer) { const result = await mammoth.extractRawText({ buffer }); return result.value; }
async function extractTextFromImage(buffer) { const { data: { text } } = await Tesseract.recognize(buffer, "eng"); return text; }

async function processFileWithAI(fileUrl, fileType, action) {
  const buffer = await downloadFile(fileUrl);

  let extractedText = "";
  if (fileType === "pdf") extractedText = await extractTextFromPDF(buffer);
  else if (fileType === "docx") extractedText = await extractTextFromDocx(buffer);
  else if (fileType === "image") extractedText = await extractTextFromImage(buffer);
  else throw new Error("Unsupported file type");

  // Gemini AI call
  const model = ai.getGenerativeModel({ model: "gemini-2.0-flash" });
  let aiText;
  if (action === "quiz") {
    const prompt = `Generate a multiple-choice quiz with exactly 6 questions based on the provided text.

For each question:
- Provide 4 clear, full-sentence options labeled "A)", "B)", "C)", "D)"
- At the end of each question, give the correct answer on a separate line as "Answer: X" (where X is A, B, C, or D).

Format the output as:

Q1. Question text here
A) Option 1
B) Option 2
C) Option 3
D) Option 4
Answer: D

Q2. Question text here
A) Option 1
B) Option 2
C) Option 3
D) Option 4
Answer: B

... continue for 6 questions ...

Do not use markdown, bullet points, stars, or any extra formatting. Only use plain text, the exact option labels and answer lines specified above.

Use the following text for quiz generation:
{text goes here}
\n${extractedText}`;
    const result = await model.generateContent(prompt);
    aiText = result.response.text();
  } else if (action === "notes") {
    const prompt = `Summarize the following text into concise, well-structured short notes. 
- Use clear and complete sentences. 
- Format the output as a bulleted list. 
- Each bullet should contain one important point.
- Do not use markdown, stars, or any extra formatting, just plain text and simple dash bullets ("- ").

Text to summarize:
{text goes here}
\n${extractedText}`;
    const result = await model.generateContent(prompt);
    aiText = result.response.text();
  } else {
    throw new Error("Invalid action");
  }
  return aiText;
}

module.exports = { processFileWithAI };
