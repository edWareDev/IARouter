export function parseBasicAuth(header) {
    if (!header?.startsWith('Basic ')) return null;
    try {
        const [username, password] = Buffer
            .from(header.slice(6), 'base64')
            .toString('utf8')
            .split(':');
        return { username, password };
    } catch {
        return null;
    }
}