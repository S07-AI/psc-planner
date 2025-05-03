import express from "express";
import axios from "axios";
import { sendGeminiRequest, formatGeminiRequest } from "./ai.js";
import multer from 'multer';
import path from 'path'
import fs from 'fs'
import cors from 'cors'
import { tempPdfString } from "./testpdf.js";
import pdfParse from 'pdf-parse';


const PORT = 8855;

let app = express();
app.use(express.static("public"));
app.use(cors());

// declares folder where uploaded pdfs will be hosted, if it doesnt exist (for some reason) it creates it
const uploadDir = './uploads'
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});

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

app.post('/upload', upload.single('pdf'), async (req,res) => {
    if (!req.file) {
        return res.status(400).send('No File Uploaded');
    }

    try {

        const dataBuffer = req.file.buffer;
        const pdfData = await pdfParse(dataBuffer);
        const textContent = pdfData.text;

        let csvOutline = await sendGeminiRequest(formatGeminiRequest(textContent));

        res.status(200).json({
            message : 'PDF Uploaded Suggessfully',
            text : textContent,
            csv : csvOutline,
        })


    } catch (error) {
        console.error(error);
        res.status(500).send("Failed to Process PDF");
    }

})

app.listen(PORT, () => {
    console.log(`Server Open on Port ${PORT}`);
});
