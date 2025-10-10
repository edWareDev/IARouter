import fs from "fs/promises";

export async function updateChatHistory(chatId, newData) {
    const filePath = `./chats/${chatId}.json`;

    try {
        // Intentar leer el archivo existente
        const oldData = await fs.readFile(filePath, "utf-8");
        const allData = [...JSON.parse(oldData), ...newData];

        await fs.writeFile(filePath, JSON.stringify(allData, null, 2));
        return allData;
    } catch (error) {
        if (error.code === "ENOENT" || error.name === "SyntaxError") {
            // Si no existe o está dañado, crear nuevo archivo
            const newChat = [newData];
            await fs.mkdir("./chats", { recursive: true });
            await fs.writeFile(filePath, JSON.stringify(newChat, null, 2));
            return newChat;
        } else {
            throw error;
        }
    }
}
