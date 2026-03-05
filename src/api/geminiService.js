/**
 * Send message to Gemini API via backend proxy.
 * Backend gerencia a chave de API securely.
 * @param {string} apiKey - (não usado - backend gerencia)
 * @param {Array} history - Message history in Gemini format
 * @param {string} systemPrompt - System instruction for Sofia
 * @returns {Promise<string>} Sofia's response text
 * @throws {Error} API errors with descriptive messages
 */
export async function sendMessage(apiKey, history, systemPrompt) {
  let backendUrl = import.meta.env.VITE_BACKEND_URL || 'zynara-lime.vercel.app';
  
  // Remover /api/chat se já estiver incluído (por segurança)
  backendUrl = backendUrl.replace(/\/api\/chat\/?$/, '');
  // Remover barra final se existir
  backendUrl = backendUrl.replace(/\/$/, '');

  // Adicione o system prompt ao início do histórico
  const historyWithSystem = [
    { role: 'user', parts: [{ text: systemPrompt }] },
    { role: 'model', parts: [{ text: 'Entendi! Estou pronta para ajudar.' }] },
    ...history,
  ];

  const response = await fetch(`${backendUrl}/api/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({
      contents: historyWithSystem,
      generationConfig: {
        temperature: 0.85,
        topP: 0.95,
        maxOutputTokens: 800,
      },
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    const code = data?.code;
    if (code === 400) throw new Error('Requisição malformada.');
    if (code === 403) throw new Error('Chave API inválida no servidor.');
    if (code === 429) throw new Error('Limite de requisições atingido. Aguarde um momento.');
    throw new Error(data?.error ?? 'Erro desconhecido na API.');
  }

  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error('Resposta vazia retornada pelo modelo.');

  return text;
}

/**
 * Validate Gemini API key format.
 * @param {string} apiKey - API key to validate
 * @returns {boolean} True if valid format
 */
export function validateApiKey(apiKey) {
  return apiKey && apiKey.trim().length > 0;
}