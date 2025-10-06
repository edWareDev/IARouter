import { Ollama } from "ollama";

export const OLLAMA_CONFIG = {
    host: 'http://localhost:11434',
    model: 'qwen2.5:3b',
    embedModel: 'nomic-embed-text'
};

export const ollamaClient = new Ollama({
    host: OLLAMA_CONFIG.host
});