import { Ollama } from "ollama";

export const OLLAMA_CONFIG = {
    host: 'http://localhost:11434',
    model: 'gpt-oss:120b-cloud',
    embedModel: 'nomic-embed-text'
};

export const ollamaClient = new Ollama({
    host: OLLAMA_CONFIG.host
});