import fs from "fs/promises";

export const txtTextExtractor = async (filePath) => {
    try {
        return fs.readFile(filePath, 'utf8');
    } catch (error) {
        console.error(error.message || error);

    }
};