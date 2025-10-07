import { ChromaClient } from "chromadb";

const client = new ChromaClient({
    host: "localhost",
    port: 8000,
    ssl: false,
});

export async function deleteCollection(collectionName) {
    const result = await client.deleteCollection({ name: collectionName });

    return result;
}
