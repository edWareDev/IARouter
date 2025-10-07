export const generateQuestionPrompt = (context, quantity, nivel) => {
    const nivelDescripcion = {
        1: "muy básica, sobre conceptos fundamentales",
        2: "básica, sobre comprensión general",
        3: "intermedia, requiere análisis",
        4: "avanzada, requiere síntesis de conceptos",
        5: "experta, requiere pensamiento crítico profundo"
    };

    return `Eres un experto generador de preguntas educativas. A partir del siguiente contenido del documento, debes generar ${quantity} pregunta(s) de opción múltiple de nivel ${nivel} (${nivelDescripcion[nivel]}) de cualquier parte aleatoria del documento.

CONTENIDO DEL DOCUMENTO:
${context}

INSTRUCCIONES:
1. Genera ${quantity} pregunta(s) clara y relevante basada en el contenido del documento
2. La dificultad debe ser nivel ${nivel} de 5 (${nivelDescripcion[nivel]})
3. Crea exactamente 5 alternativas de respuesta
4. Solo una alternativa debe ser correcta
5. Las alternativas incorrectas deben ser plausibles pero claramente incorrectas
6. Indica el índice (0-4) de la respuesta correcta
7. **El índice de la respuesta correcta debe variar aleatoriamente entre 0 y 4 en cada pregunta, no debe repetirse el mismo índice en todas**
8. Todas las preguntas deben ser de temas diferentes

FORMATO DE RESPUESTA (SOLO JSON, SIN TEXTO ADICIONAL):
[
    {
    "pregunta": "Tu pregunta aquí",
    "alternativas": [
        "Alternativa 1",
        "Alternativa 2",
        "Alternativa 3",
        "Alternativa 4",
        "Alternativa 5"
    ],
    "respuesta": Índice de la alternativa correcta (0-4)
    }
]

IMPORTANTE:
- Responde ÚNICAMENTE con el objeto JSON, sin explicaciones adicionales
- No uses markdown ni bloques de código
- El campo "respuesta" debe ser un número del 0 al 4 indicando el índice de la alternativa correcta
- Asegúrate de que la pregunta esté completamente basada en el contenido del documento`;
};
