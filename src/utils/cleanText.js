import { stripHtml } from "string-strip-html";

// Regex precompiladas para mejor rendimiento
const CONTROL_CHARS_REGEX = /[\u0000-\u001F\u007F]/g;
const INVISIBLE_CHARS_REGEX = /[\u00A0\u00AD\u034F\u061C\u115F\u1160\u17B4\u17B5\u2000-\u200F\u2028\u2029\u202F\u205F\u2060-\u206F\u2800\u3000\u3164\uFEFF\uFFA0]/g;
const MULTIPLE_NEWLINES_REGEX = /\n{3,}/g;
const HORIZONTAL_WHITESPACE_REGEX = /[ \t]+/g; // ✅ Solo espacios y tabs, NO newlines

export function cleanEmailText(input) {
    if (!input) return '';

    const text = String(input);

    // Si contiene HTML, procesarlo primero
    let result;
    if (text.includes('<')) {
        const { result: stripped } = stripHtml(text, {
            stripTogetherWithTheirContents: ["script", "style"],
            skipHtmlDecoding: false,
        });
        result = stripped;
    } else {
        result = text;
    }

    return result
        .replace(CONTROL_CHARS_REGEX, ' ')
        .replace(INVISIBLE_CHARS_REGEX, ' ')
        .replace(MULTIPLE_NEWLINES_REGEX, '\n\n')
        .replace(HORIZONTAL_WHITESPACE_REGEX, ' ') // ✅ Preserva \n pero normaliza espacios
        .trim();
}