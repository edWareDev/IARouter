import { OLLAMA_CONFIG, ollamaClient } from "../../adapters/OllamaClient.js";
import { emailTextClasificationPrompt } from "../../iaPrompts/emailTextClasification.prompt.js";

export const tagMailController = async (req, res) => {
    try {
        const { to, subject, content } = req.body;

        const TO = String(to).trim();
        const SUBJECT = String(subject).trim();
        const CONTENT = String(content).trim();
        const textFormated = `${TO && `PARA: ${TO} `}${SUBJECT && `-- ASUNTO: ${SUBJECT} `}${CONTENT && `-- CONTENT: ${CONTENT}`}`;

        const response = await ollamaClient.chat({
            model: OLLAMA_CONFIG.model,
            messages: [
                {
                    role: "system", content: emailTextClasificationPrompt()
                },
                {
                    role: "user", content: textFormated
                }
            ]
        });
        const TAG_RESPONSE = Number(response.message.content);
        if (isNaN(TAG_RESPONSE)) throw new Error("Respuesta no es un número");

        res.json(response.message.content);
    } catch (error) {
        console.error(error.message || error);
        await tagMailController(req, res);
    }

};