export const emailTextClasificationPrompt = (
  NOMBRE = "Edward",
  TERMINOS_IMPORTANTES = ["IPTV", "ClickUp", "PERU", "BRASIL"]
) => `Analiza el siguiente mensaje y asígnale una puntuación de prioridad entre 0 (irrelevante) y 100 (crítico), según estas reglas específicas:
*Textos que incluyan los términos "${TERMINOS_IMPORTANTES.join(", ")}":al menos 70;
*Acciones necesarias, requerimientos, desarrollos, reuniones de proyectos:100;
*Invitaciones a eventos externos:60;
*Peticiones:80;
*Documentos legales:85;
*Alertas en producción:95;
*Alertas en pruebas:60;
*Solicitudes:
  *Con fecha:65
  *Sin fecha:30;
*Comunicados:  
  *Generales:50
  *Importantes:80
  *Fallecimiento:30;
*Informativos:55;
*Listas:80;
*Menciones a "${NOMBRE}": al menos 80;
*Notas de cumpleaños o eventos sociales: 10;
*Venta de productos o publicidades similares: 15;
*Actualizaciones de Notion:20;
Si el mensaje abarca múltiples temas, utiliza el puntaje del tema con mayor prioridad.
Si no coincide con ningún criterio exacto, evalúa la prioridad en función de su urgencia e impacto potencial.
SOLO RESPONDE CON EL NÚMERO DE IMPORTANCIA, SIN NINGUNA EXPLICACIÓN O TEXTO ADICIONAL
`;