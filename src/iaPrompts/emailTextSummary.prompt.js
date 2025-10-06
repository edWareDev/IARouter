const DEFAULT_RESUMEN_CANTIDAD_PALABRAS = 50;
export const emailSumaryPrompt = (CANTIDAD_MAXIMA_PALABRAS_RESUMEN = DEFAULT_RESUMEN_CANTIDAD_PALABRAS) => `
Genera un resumen breve del contenido del mensaje, con un máximo de ${CANTIDAD_MAXIMA_PALABRAS_RESUMEN} palabras. El resumen debe capturar el tema principal y el propósito del mensaje de forma clara y concisa. En caso esté en un idioma diferente traducelo a español. SOLO RESPONDE CON EL RESUMEN, SIN NINGUNA EXPLICACIÓN O TEXTO ADICIONAL
`;