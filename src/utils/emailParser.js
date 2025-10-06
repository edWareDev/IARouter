import { simpleParser } from "mailparser";

/**
 * Parsea el contenido de un mensaje de email
 * @param {Buffer} source - Source del mensaje IMAP
 * @param {number} maxWords - Máximo número de palabras a extraer (default: 30)
 * @returns {Promise<string>} Contenido parseado del email
 */
export async function parseEmailContent(source, maxWords = 30) {
    try {
        const parsed = await simpleParser(source);
        const allText = String(parsed.text || parsed.html || '').replace(/\s+/g, ' ').trim();
        return allText.split(' ').slice(0, maxWords).join(' ');
    } catch (error) {
        console.error('Error parseando contenido de email:', error);
        return 'No se pudo extraer el fragmento';
    }
}

/**
 * Extrae información básica del mensaje IMAP
 * @param {Object} msg - Mensaje IMAP con envelope y uid
 * @returns {Object} Datos básicos del email
 */
export function extractEmailBasicInfo(msg) {
    return {
        uid: msg.uid,
        subject: msg.envelope?.subject || 'Sin asunto',
        from: msg.envelope?.from?.map(a => `${a.name || ''} <${a.address}>`).join(', ') || 'Desconocido',
        date: msg.internalDate || msg.envelope?.date,
        flags: msg.flags ? Array.from(msg.flags) : []
    };
}

/**
 * Procesa un mensaje IMAP completo extrayendo info básica y contenido
 * @param {Object} msg - Mensaje IMAP
 * @param {number} maxWords - Máximo número de palabras a extraer del contenido
 * @returns {Promise<Object>} Objeto con información completa del email
 */
export async function processEmailMessage(msg, maxWords = 30) {
    const basicInfo = extractEmailBasicInfo(msg);
    const content = await parseEmailContent(msg.source, maxWords);
    
    return {
        ...basicInfo,
        content
    };
}
