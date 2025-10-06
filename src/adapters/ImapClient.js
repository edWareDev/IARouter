import { ImapFlow } from "imapflow";

const IMAP_HOST = process.env.IMAP_HOST;
const IMAP_PORT = Number(process.env.IMAP_PORT); // Asegura que sea número
const IMAP_SECURE = process.env.IMAP_SECURE === "true"; // Asegura booleano

export const getImapClient = async (username, password) => {
    try {
        const config = {
            host: IMAP_HOST,
            port: IMAP_PORT,
            secure: IMAP_SECURE,
            auth: { user: username, pass: password },
            logger: false,
            socketTimeout: 30000,
            verifyOnly: false,
            ignoreTLS: false,
            requireTLS: true,
            tls: {
                rejectUnauthorized: false
            }
        };

        const client = new ImapFlow(config);

        return client;
    } catch (error) {
        console.error("No fue posible iniciar el cliente IMAP", error.message);
        throw error;
    }
};