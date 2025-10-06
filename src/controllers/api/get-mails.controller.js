import { simpleParser } from "mailparser";
import { getImapClient } from "../../adapters/ImapClient.js";
import { parseBasicAuth } from "../../utils/basicAuthParser.js";
import { HTTP_CODES } from "../../lib/http_error_codes.js";
import { cleanEmailText } from "../../utils/cleanText.js";

const WORDS_QUANTITY = 40;

export const getMailsController = async (req, res) => {
    const { username, password } = parseBasicAuth(req.headers.authorization);
    if (!username || !password) return res.status(HTTP_CODES._401_UNAUTHORIZED).send({ error: 'Es necesario enviar credenciales.' });

    const ids = req.body?.ids;
    if (!Array.isArray(ids) || ids.length === 0) return res.status(HTTP_CODES._400_BAD_REQUEST).send({ error: 'Debes enviar un array de ids en el body' });

    try {
        const imapClient = await getImapClient(username, password);
        await imapClient.connect();
        await imapClient.mailboxOpen("INBOX");

        // Buscar por UID
        const messages = [];
        for await (const msg of imapClient.fetch({ uid: ids }, {
            uid: true,
            envelope: true,
            internalDate: true,
            flags: true,
            bodyStructure: true,
            source: true
        })) {
            const parsed = await simpleParser(msg.source);
            const allText = cleanEmailText(String(parsed.text || parsed.html || ''));
            const content = allText.split(' ').slice(0, WORDS_QUANTITY).join(' ');

            messages.push({
                uid: msg.uid,
                subject: cleanEmailText(msg.envelope?.subject || "Sin asunto"),
                from: msg.envelope?.from?.map(a => `${a.name || ''} <${a.address}>`).join(', ') || 'Desconocido',
                to: msg.envelope?.to?.map(a => `${a.name || ''} <${a.address}>`).join(', ') || '',
                date: msg.internalDate,
                seen: msg.flags ? (msg.flags.has ? msg.flags.has('\\Seen') : Array.from(msg.flags).includes('\\Seen')) : false,
                hasAttachments: msg.flags ? (msg.flags.has ? msg.flags.has('\\Flagged') : Array.from(msg.flags).includes('\\Flagged')) : false,
                content
            });
        }

        await imapClient.logout();
        res.send(messages);
    } catch (error) {
        console.error("Error en el endpoint:", error);
        res.status(HTTP_CODES._500_INTERNAL_SERVER_ERROR).send({ error: "Ocurrió un error procesando la solicitud." });
    }
};