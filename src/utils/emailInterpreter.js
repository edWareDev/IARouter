/**
 * Formatea los datos del email para clasificación
 * @param {Object} emailData - Datos del email con from, subject y content
 * @returns {string} Mensaje formateado para la IA
 */
export function formatEmailForClassification(emailData) {
    const { from, subject, content } = emailData;
    return `${from}:(${subject})${content}`;
}

/**
 * Procesa el resultado de clasificación de la IA
 * @param {string|number} rawImportancia - Resultado crudo de la IA
 * @returns {number|null} Número de importancia procesado o null si es inválido
 */
export function processImportanceScore(rawImportancia) {
    if (!rawImportancia) return null;
    
    // Extraer número del resultado (puede venir con texto adicional)
    const match = String(rawImportancia).match(/\d+/);
    if (!match) return null;
    
    const score = parseInt(match[0], 10);
    
    // Validar que esté en rango válido (0-100)
    if (isNaN(score) || score < 0 || score > 100) return null;
    
    return score;
}

/**
 * Combina los datos del email con su puntuación de importancia
 * @param {Object} emailData - Datos básicos del email
 * @param {number|null} importancia - Puntuación de importancia
 * @returns {Object} Objeto completo con email y clasificación
 */
export function combineEmailWithScore(emailData, importancia) {
    return {
        ...emailData,
        importancia
    };
}

/**
 * Valida que los datos del email tengan la estructura mínima requerida
 * @param {Object} emailData - Datos del email a validar
 * @returns {boolean} True si los datos son válidos
 */
export function validateEmailData(emailData) {
    return !!(emailData?.uid && emailData?.from && emailData?.subject !== undefined);
}

/**
 * Procesa una lista de emails añadiendo metadatos útiles
 * @param {Array} emails - Lista de emails procesados
 * @returns {Array} Lista con metadatos adicionales
 */
export function enhanceEmailsMetadata(emails) {
    return emails.map(email => ({
        ...email,
        hasValidScore: email.importancia !== null && !isNaN(email.importancia),
        scoreCategory: categorizeImportanceScore(email.importancia),
        timestamp: new Date().toISOString()
    }));
}

/**
 * Categoriza la puntuación de importancia en rangos
 * @param {number|null} score - Puntuación de 0-100
 * @returns {string} Categoría de importancia
 */
function categorizeImportanceScore(score) {
    if (score === null || isNaN(score)) return 'unknown';
    if (score <= 20) return 'low';
    if (score <= 40) return 'medium-low';
    if (score <= 60) return 'medium';
    if (score <= 80) return 'medium-high';
    return 'high';
}
