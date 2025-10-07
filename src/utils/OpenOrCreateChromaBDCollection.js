import { ChromaClient } from "chromadb";

const client = new ChromaClient({
    host: "localhost",
    port: 8000,
    ssl: false,
});

export async function getOrCreateCollection(name) {
    const collections = await client.listCollections();

    const exists = collections.find(c => c.name === name);

    if (exists) {
        return await client.getCollection({ name });
    }

    // Crear sin función de embedding por defecto
    return await client.createCollection({
        name,
        metadata: { created: new Date().toISOString() },
        embeddingFunction: {
            generate: async () => [], // evita el warning
        },
    });
}
