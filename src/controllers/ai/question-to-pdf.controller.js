import { OLLAMA_CONFIG, ollamaClient } from "../../adapters/OllamaClient.js";
import { questionToPDFPrompt } from "../../iaPrompts/questionToPDF.prompt.js";
import { HTTP_CODES } from "../../lib/http_error_codes.js";
import { getOrCreateCollection } from "../../utils/OpenOrCreateChromaBDCollection.js";
import { textEmbed } from "../../utils/textEmbed.js";

export const questionToPDFController = async (req, res) => {
    try {
        const { question } = req.body;
        if (!question) return res.status(HTTP_CODES._400_BAD_REQUEST).json({ error: "Falta la pregunta" });

        // Obtener colección
        const collection = await getOrCreateCollection("documentos");

        // Generar embedding de la pregunta
        const [queryEmbedding] = await textEmbed(question, "qwen3-embedding:4b");

        // Buscar contexto relevante en Chroma
        const results = await collection.query({
            queryEmbeddings: [queryEmbedding],
            nResults: 20,
        });

        const retrievedDocs = results.documents?.[0] || [];
        const context = retrievedDocs.join("\n\n---\n\n");
        console.log("🚀 ~ questionToPDFController ~ context:", context);


        // Llamada al modelo Ollama
        const response = await ollamaClient.chat({
            model: OLLAMA_CONFIG.model || "llama3.2:3b",
            messages: [
                { role: "system", content: questionToPDFPrompt(context, question) },
            ],
            stream: false,
        });

        const answer = response?.message?.content || "Sin respuesta generada.";

        res.send(answer);
    } catch (error) {
        console.error("❌ Error en questionToPDFController:", error);
        res.status(HTTP_CODES._500_INTERNAL_SERVER_ERROR).json({ error: "Error procesando la pregunta" });
    }
};
