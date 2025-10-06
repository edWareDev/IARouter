import { OLLAMA_CONFIG, ollamaClient } from "../../adapters/OllamaClient.js";
import { emailSumaryPrompt } from "../../iaPrompts/emailTextSummary.prompt.js";

export const sumarizeMailController = async (req, res) => {
    try {
        const { to, subject, content } = req.body;

        if (!to || !subject || !content) throw new Error("Falta información básica evaluar");

        const TO = String(to).trim();
        const SUBJECT = String(subject).trim();
        const CONTENT = String(content).trim();
        const textFormated = `${TO && `PARA: ${TO} `}${SUBJECT && `-- ASUNTO: ${SUBJECT} `}${CONTENT && `-- CONTENT: ${CONTENT}`}`;

        const response = await ollamaClient.chat({
            model: OLLAMA_CONFIG.model,
            messages: [
                {
                    role: "system", content: emailSumaryPrompt()
                },
                {
                    role: "user", content: textFormated
                }
            ]
        });
        const IA_RESPONSE = response.message.content;
        if (!IA_RESPONSE) throw new Error("Respuesta inválida");

        res.json(IA_RESPONSE);
    } catch (error) {
        console.error(error.message || error);
        await sumarizeMailController(req, res);
    }

};