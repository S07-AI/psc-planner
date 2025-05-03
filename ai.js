const API_URL = "http://localhost:11434/api/generate";

export async function askOllama(prompt) {
    const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            model: "llama3", // or any model you have pulled
            prompt: prompt,
            stream: false,
        }),
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    return data.response;
}
