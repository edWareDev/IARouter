import { ChromaClient } from "chromadb";

const client = new ChromaClient({
    host: "localhost",
    port: 8000,
    ssl: false,
});

export async function listAllCollections() {
    const collections = await client.listCollections();

    return [...collections.map(col => {
        return {
            id: col.id,
            name: col._name,
            created: col.metadata._created,
        };
    })];
}
