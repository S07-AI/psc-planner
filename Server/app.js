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
import { oauth2Client, getAuthUrl, createCalendarEvent } from './google.js';
import dotenv from 'dotenv';

const PORT = 8855;

const app = express();
app.use(express.static("public"));
app.use(cors());
app.use(express.json()); // Add this line to parse JSON bodies

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

app.get('/auth/google', (req, res) => {
    const url = getAuthUrl();
    res.json({ url });
});

app.get('/auth/google/callback', async (req, res) => {
    const { code } = req.query;
    if (!code) {
        console.error('No code received');
        return res.redirect('http://localhost:3000/auth-error');
    }

    try {
        const { tokens } = await oauth2Client.getToken(code);
        oauth2Client.setCredentials(tokens);
        
        // Send tokens to frontend
        res.redirect(`http://localhost:3000?tokens=${encodeURIComponent(JSON.stringify(tokens))}`);
    } catch (error) {
        console.error('OAuth error:', error);
        res.redirect('http://localhost:3000/auth-error');
    }
});

app.post('/calendar/create', async (req, res) => {
    console.log('Received request body:', req.body); // Debug log

    const { events, auth } = req.body || {};
    
    if (!events || !auth) {
        return res.status(400).json({ 
            error: 'Missing events or auth data',
            receivedBody: req.body 
        });
    }

    try {
        console.log('Received events:', events); // Debug log
        console.log('Auth tokens:', auth); // Debug log

        const results = await Promise.all(
            events.map(event => createCalendarEvent(event, auth))
        );
        
        console.log('Created events:', results); // Debug log
        res.json({ success: true, results });
    } catch (error) {
        console.error('Calendar creation error:', error); // Debug log
        res.status(500).json({ 
            error: 'Failed to create events',
            details: error.message 
        });
    }
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
