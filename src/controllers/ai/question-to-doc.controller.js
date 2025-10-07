import { OLLAMA_CONFIG, ollamaClient } from "../../adapters/OllamaClient.js";
import { questionToPDFPrompt } from "../../iaPrompts/questionToPDF.prompt.js";
import { HTTP_CODES } from "../../lib/http_error_codes.js";
import { getOrCreateCollection } from "../../utils/OpenOrCreateChromaBDCollection.js";
import { textEmbed } from "../../utils/textEmbed.js";

export const questionToDocController = async (req, res) => {
    try {
        console.log("RESPONDIENDO PREGUNTA:", req.body);
        const { question, wordLimit } = req.body;
        if (!question) return res.status(HTTP_CODES._400_BAD_REQUEST).json({ error: "Falta la pregunta" });

        const docName = req.params.docName;
        if (!docName) return res.status(HTTP_CODES._400_BAD_REQUEST).json({ error: "Falta el nombre del documento" });
        const DOC_NAME = String(docName).trim();
        if (DOC_NAME.length === 0) return res.status(HTTP_CODES._400_BAD_REQUEST).json({ error: "Nombre de documento inválido" });

        // Obtener colección
        const collection = await getOrCreateCollection(DOC_NAME);

        // Generar embedding de la pregunta
        const [queryEmbedding] = await textEmbed(question);

        // Buscar contexto relevante en Chroma
        const results = await collection.query({
            queryEmbeddings: [queryEmbedding],
            nResults: 20,
        });

        const retrievedDocs = results.documents?.[0] || [];
        const context = retrievedDocs.join("\n\n---\n\n");


        // Llamada al modelo Ollama
        const response = await ollamaClient.chat({
            model: OLLAMA_CONFIG.model || "llama3.2:3b",
            messages: [
                { role: "system", content: questionToPDFPrompt(context, question, wordLimit) },
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
