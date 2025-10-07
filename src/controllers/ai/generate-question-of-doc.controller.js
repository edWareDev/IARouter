import { OLLAMA_CONFIG, ollamaClient } from "../../adapters/OllamaClient.js";
import { generateQuestionPrompt } from "../../iaPrompts/generateQuestion.prompt.js";
import { HTTP_CODES } from "../../lib/http_error_codes.js";
import { getOrCreateCollection } from "../../utils/OpenOrCreateChromaBDCollection.js";

export const generateQuestionOfDocController = async (req, res) => {
    try {
        const { nivel, quantity = 1 } = req.body;
        if (!nivel || nivel > 5 || nivel < 1) {
            return res.status(HTTP_CODES._400_BAD_REQUEST).json({
                error: "El nivel seleccionado es inválido (debe ser entre 1 y 5)"
            });
        }

        const docName = req.params.docName;
        if (!docName) {
            return res.status(HTTP_CODES._400_BAD_REQUEST).json({
                error: "Falta el nombre del documento"
            });
        }

        const DOC_NAME = String(docName).trim();
        if (DOC_NAME.length === 0) {
            return res.status(HTTP_CODES._400_BAD_REQUEST).json({
                error: "Nombre de documento inválido"
            });
        }

        // Obtener colección
        const collection = await getOrCreateCollection(DOC_NAME);

        // Obtener todos los documentos de la colección
        const collectionData = await collection.get();

        const allDocs = collectionData.documents || [];

        if (allDocs.length === 0) {
            return res.status(HTTP_CODES._404_NOT_FOUND).json({
                error: "No se encontraron documentos en la colección"
            });
        }

        // Unir el contexto del documento
        const context = allDocs.join("\n\n---\n\n");

        // Llamada al modelo Ollama para generar pregunta
        const response = await ollamaClient.chat({
            model: OLLAMA_CONFIG.model || "llama3.2:3b",
            messages: [
                {
                    role: "system",
                    content: generateQuestionPrompt(context, quantity, nivel)
                },
            ],
            stream: false,
        });

        const responseContent = response?.message?.content || "{}";

        // Parsear la respuesta JSON
        let questionData;
        try {
            // Limpiar posibles marcadores de código markdown
            const cleanedResponse = responseContent
                .replace(/```json\n?/g, "")
                .replace(/```\n?/g, "")
                .trim();

            questionData = JSON.parse(cleanedResponse);
        } catch (parseError) {
            console.error("❌ Error parseando respuesta del modelo:", parseError);
            console.error("Respuesta recibida:", responseContent);
            return res.status(HTTP_CODES._500_INTERNAL_SERVER_ERROR).json({
                error: "Error al procesar la respuesta del modelo"
            });
        }

        // Validar estructura de la respuesta
        // if (!questionData.pregunta ||
        //     !Array.isArray(questionData.alternativas) ||
        //     questionData.alternativas.length !== 5 ||
        //     typeof questionData.respuesta !== 'number' ||
        //     questionData.respuesta < 0 ||
        //     questionData.respuesta > 4) {

        //     console.error("❌ Respuesta con formato inválido:", questionData);
        //     return res.status(HTTP_CODES._500_INTERNAL_SERVER_ERROR).json({
        //         error: "El modelo no generó una pregunta en el formato esperado"
        //     });
        // }

        res.json(questionData);

    } catch (error) {
        console.error("❌ Error en generateQuestionOfDocController:", error);
        res.status(HTTP_CODES._500_INTERNAL_SERVER_ERROR).json({
            error: "Error generando la pregunta"
        });
    }
};