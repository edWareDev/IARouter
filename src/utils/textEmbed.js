import { OLLAMA_CONFIG, ollamaClient } from "../adapters/OllamaClient.js";

export const textEmbed = async (text) => {
    try {
        const TEXT = String(text).trim();

        const embedResponse = await ollamaClient.embed({
            model: OLLAMA_CONFIG.embedModel,
            input: TEXT
        });

        const embeddings = embedResponse.embeddings;
        return embeddings;

    } catch (error) {
        console.error(error.message || error);

    }
};