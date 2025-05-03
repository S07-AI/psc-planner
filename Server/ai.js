import axios from "axios";

export const headers = {
    "Content-Type": "application/json",
};

export function formatRequest(weatherData) {
    let data = {
        model: "gemma3:1b",
        prompt: `Hello`,
        stream: false,
    };

    return data;
}

export async function sendOllamaRequest(url, data, headers) {
    try {
        const response = await axios.post(url, data, { headers });
        const actualResponse = response.data.response;
        console.log(actualResponse);

        return actualResponse;
    } catch (error) {
        if (error.response) {
            console.error(
                "Error: ",
                error.response.status,
                error.response.data,
            );
        } else {
            console.error("Error: ", error.message);
        }
    }
}
