import express from "express";
import axios from "axios";

const PORT = 3000;

let app = express();
app.use(express.static("public"));

app.get("/", (req, res) => {
    res.send("We have a website");
});

app.listen(PORT, () => {
    console.log(`Server Open on Port ${PORT}`);
});
