import fs from "fs/promises";
import { pdf } from "pdf-parse";


export const pdfTextExtractor = async (filePath) => {
    try {
        const data = await fs.readFile(filePath);
        const parsed = await pdf(data);
        return parsed.text;
    } catch (error) {
        console.error(error.message || error);

    }
};