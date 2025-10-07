import mammoth from "mammoth";

export const docxTextExtractor = async (filePath) => {
    try {
        const { value: text } = await mammoth.extractRawText({ path: filePath });
        return text;
    } catch (error) {
        console.error(error.message || error);

    }
};