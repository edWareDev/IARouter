import fs from "fs/promises";

export async function getOrCreateChatHistory(chatId) {
    const filePath = `./chats/${chatId}.json`;

    try {
        const data = await fs.readFile(filePath, "utf-8");
        return JSON.parse(data);
    } catch (error) {
        if (error.code === "ENOENT") {
            // Archivo no existe, se crea uno nuevo
            const newChat = [];
            await fs.mkdir("./chats", { recursive: true });
            await fs.writeFile(filePath, JSON.stringify(newChat, null, 2));
            return newChat;
        } else {
            // Otros errores (permisos, corrupción, etc.)
            throw error;
        }
    }
}
