import { pdfTextExtractor } from "../../utils/pdfTextExtractor.js";
import { textEmbed } from "../../utils/textEmbed.js";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { getOrCreateCollection } from "../../utils/OpenOrCreateChromaBDCollection.js";

export const embedPDFToDB = async (req, res) => {
    try {
        const pdfPath = "./FILES/Valtx_Agente_Corresponsal_Documentacion.pdf";
        const text = await pdfTextExtractor(pdfPath);

        const splitter = new RecursiveCharacterTextSplitter({
            chunkSize: 1000,
            chunkOverlap: 200,
        });
        const chunks = await splitter.splitText(text);

        const collection = await getOrCreateCollection("documentos");

        for (let i = 0; i < chunks.length; i++) {
            const embRes = await textEmbed(chunks[i], "qwen3-embedding:4b");
            const vector = embRes.embeddings?.[0] || embRes.embedding || embRes[0];

            if (!Array.isArray(vector)) {
                console.warn("⚠️ Embedding inválido en chunk:", i);
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
        console.error("❌ Error en questionToPdfController:", error);
        res.status(500).json({ error: error.message || "Error interno" });
    }
};
