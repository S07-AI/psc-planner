import express from "express";
import axios from "axios";
import { sendGeminiRequest, formatGeminiRequest } from "./ai.js";
import multer from 'multer';
import path from 'path'
import fs from 'fs'
import cors from 'cors'
import { tempPdfString } from "./testpdf.js";


const PORT = 3000;
const OLLAMA_URL = "http://localhost:11434/api/generate";

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

app.post('/upload', upload.single('pdf'), (req,res) => {
    if (!req.file) {
        return res.status(400).send('No File Uploaded');
    }

    res.status(200).json({message : 'PDF Uploaded Successfully', file : req.file.filename})

})

app.listen(PORT, () => {
    console.log(`Server Open on Port ${PORT}`);
});
