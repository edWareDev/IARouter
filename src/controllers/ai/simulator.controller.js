import { OLLAMA_CONFIG, ollamaClient } from "../../adapters/OllamaClient.js";
import { simulatorPrompt } from "../../iaPrompts/simulator.prompt.js";
import { HTTP_CODES } from "../../lib/http_error_codes.js";
import { getOrCreateChatHistory } from "../../utils/getOrCreateChatHistory.js";
import { updateChatHistory } from "../../utils/updateChatHistory.js";


export const simulatorController = async (req, res) => {
    try {
        const { chatId, question } = req.body;
        if (!question) return res.status(HTTP_CODES._400_BAD_REQUEST).json({ error: "Falta la pregunta" });

        // Obtener historial de conversación
        const chatHistory = await getOrCreateChatHistory(chatId);
        console.log("🚀 ~ simulatorController ~ chatHistory:", chatHistory);

        const MESSAGES = [
            { role: "system", content: simulatorPrompt() },
            ...chatHistory,
            { role: "user", content: question },
        ];

        // Llamada al modelo Ollama
        const response = await ollamaClient.chat({
            model: OLLAMA_CONFIG.model || "llama3.2:3b",
            messages: MESSAGES,
            stream: false,
        });

        const answer = response?.message?.content || "Sin respuesta generada.";
        console.log("🚀 ~ simulatorController ~ answer:", answer);

        await updateChatHistory(chatId, [
            { role: "user", content: question },
            { role: "assistant", content: answer },
        ]);

        res.send(answer);
    } catch (error) {
        console.error("❌ Error en questionToPDFController:", error);
        res.status(HTTP_CODES._500_INTERNAL_SERVER_ERROR).json({ error: "Error procesando la pregunta" });
    }
};
