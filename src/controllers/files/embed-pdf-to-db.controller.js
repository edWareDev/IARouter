import { pdfTextExtractor } from "../../utils/pdfTextExtractor.js";
import { textEmbed } from "../../utils/textEmbed.js";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { getOrCreateCollection } from "../../utils/OpenOrCreateChromaBDCollection.js";
import { HTTP_CODES } from "../../lib/http_error_codes.js";

const ALLOWED_MIMETYPES = new Set(["application/pdf"]);

export const embedPDFToDB = async (req, res) => {
    try {

        const FILE = req.file;
        if (!FILE) throw new Error("No se ha scargado ningún archivo");

        if (!ALLOWED_MIMETYPES.has(FILE.mimetype)) throw new Error("Tipo de documento no permitido.");

        const pdfPath = FILE.path;
        const text = await pdfTextExtractor(pdfPath);

        const splitter = new RecursiveCharacterTextSplitter({
            chunkSize: 1000,
            chunkOverlap: 200,
        });
        const chunks = await splitter.splitText(text);

        const collection = await getOrCreateCollection(`${FILE.originalname}-${FILE.filename}-${FILE.size}`);

        for (let i = 0; i < chunks.length; i++) {
            const embRes = await textEmbed(chunks[i], "qwen3-embedding:4b");

            const vector = embRes.embeddings?.[0] || embRes.embedding || embRes[0];

            if (!Array.isArray(vector)) {
                console.warn("Embedding inválido en chunk:", i);
                continue;
            }

            await collection.add({
                ids: [`doc_${Date.now()}_${i}`],
                embeddings: [vector],
                documents: [chunks[i]],
                metadatas: [{ chunk: i }],
            });
        }

        res.json({ message: `Indexación completada. Chunks: ${chunks.length}` });
    } catch (error) {
        console.error("Error en embed-to-pdf.controller:", error.message);
        res.status(HTTP_CODES._500_INTERNAL_SERVER_ERROR).json({ error: error.message || "Error interno" });
    }
};
