import express from "express";
import axios from "axios";
import { sendGeminiRequest, formatGeminiRequest } from "./ai.js";
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import cors from 'cors';
import { tempPdfString } from "./testpdf.js";
import pdfParse from 'pdf-parse/lib/pdf-parse.js';
import { v4 as uuidv4 } from 'uuid';

const PORT = 8855;

const app = express();
app.use(express.static("public"));
app.use(cors());

// Create public directory if it doesn't exist
if (!fs.existsSync('./public')) {
    fs.mkdirSync('./public');
}
if (!fs.existsSync('./public/downloads')) {
    fs.mkdirSync('./public/downloads');
}

// 💾 Use in-memory storage
const storage = multer.memoryStorage();

const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'application/pdf') cb(null, true);
        else cb(new Error('Only PDF files are allowed!'));
    },
});

app.get("/", async (req, res) => {
    let test = await sendGeminiRequest(formatGeminiRequest(tempPdfString));
    res.send(test);
});

app.post('/upload', upload.single('pdf'), async (req, res) => {
    if (!req.file) {
        return res.status(400).send('No File Uploaded');
    }

    try {
        const dataBuffer = req.file.buffer; // ✅ from memory
        const pdfData = await pdfParse(dataBuffer);
        const textContent = pdfData.text;

        const csvOutline = await sendGeminiRequest(formatGeminiRequest(textContent));
        
        // Generate unique filename and save CSV
        const fileName = `${uuidv4()}.csv`;
        const filePath = path.join('public/downloads', fileName);
        fs.writeFileSync(filePath, csvOutline);

        res.status(200).json({
            message: 'PDF Uploaded Successfully',
            text: textContent,
            csvUrl: `/downloads/${fileName}`
        });

    } catch (error) {
        console.error(error);
        res.status(500).send("Failed to Process PDF");
    }
});

app.listen(PORT, () => {
    console.log(`Server Open on Port ${PORT}`);
});
