import express from "express";
import axios from "axios";
import { sendOllamaRequest } from "./ai.js";

const PORT = 3000;
const OLLAMA_URL = "http://localhost:11434/api/generate";

let app = express();
app.use(express.static("public"));

app.get("/", async (req, res) => {
    let test = await sendOllamaRequest(
        OLLAMA_URL,
        {
            model: "gemma3:1b",
            prompt: "hello",
            stream: false,
        },
        { "Content-Type": "application/json" },
    );
    res.send(test);
});

app.listen(PORT, () => {
    console.log(`Server Open on Port ${PORT}`);
});
