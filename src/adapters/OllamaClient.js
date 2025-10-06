import { Ollama } from "ollama";

export const OLLAMA_CONFIG = {
    host: 'http://localhost:11434',
    model: 'qwen2.5:3b'
};

export const ollamaClient = new Ollama({
    host: OLLAMA_CONFIG.host
});

// function buildOllamaPayload(systemPrompt, data) {
//     return {
//         model: String(OLLAMA_CONFIG.model).trim(),
//         messages: [
//             {
//                 role: "system",
//                 content: systemPrompt
//             },
//             {
//                 role: "user",
//                 content: data
//             }
//         ],
//         stream: false
//     };
// }

// export async function classifyEmailImportance(emailMessage) {
//     try {
//         const response = await fetch(OLLAMA_CONFIG.baseUrl, {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify(buildOllamaPayload(emailMessage))
//         });

//         if (!response.ok) {
//             console.error(`Error en API Ollama: ${response.status} ${response.statusText}`);
//             return null;
//         }

//         const result = await response.json();
//         return result?.message?.content || null;

//     } catch (error) {
//         console.error('Error clasificando email con Ollama:', error);
//         return null;
//     }
// }

// export async function classifyMultipleEmails(emailMessages) {
//     const results = [];

//     for (let i = 0; i < emailMessages.length; i++) {
//         const message = emailMessages[i];
//         console.log(`🤖 Clasificando email ${i + 1}/${emailMessages.length}`);

//         const importance = await classifyEmailImportance(message);
//         results.push(importance);

//         // Pequeña pausa entre peticiones para no sobrecargar la API
//         if (i < emailMessages.length - 1) {
//             await new Promise(resolve => setTimeout(resolve, 100));
//         }
//     }

//     return results;
// }