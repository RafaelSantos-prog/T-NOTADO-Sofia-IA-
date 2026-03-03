import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

dotenv.config();

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3000;

// ===== MIDDLEWARE =====
app.use(express.json({ limit: '10mb' }));

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
];

// Adicionar domínios do Vercel em produção
if (process.env.VERCEL_URL) {
  allowedOrigins.push(`https://${process.env.VERCEL_URL}`);
}

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));

// ===== HEALTH CHECK =====
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok',
    timestamp: new Date().toISOString(),
    apiConfigured: !!process.env.GEMINI_API_KEY,
  });
});

// ===== CHAT ENDPOINT =====
app.post('/api/chat', async (req, res) => {
  try {
    const { contents, generationConfig } = req.body;

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({
        error: 'API Key não configurada no servidor',
      });
    }

    if (!contents || !Array.isArray(contents)) {
      return res.status(400).json({
        error: 'Nenhuma mensagem enviada',
      });
    }

    // Chamar Gemini API
    const response = await fetch(
      'https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=' +
      process.env.GEMINI_API_KEY,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: contents,
          generationConfig: generationConfig || {
            temperature: 0.85,
            topP: 0.95,
            maxOutputTokens: 800,
          },
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      const errorCode = data?.error?.code;
      let errorMessage = 'Erro na API Gemini';

      if (errorCode === 400) {
        errorMessage = 'Requisição malformada';
      } else if (errorCode === 403) {
        errorMessage = 'API Key inválida ou sem permissão';
      } else if (errorCode === 429) {
        errorMessage = 'Limite de requisições atingido. Aguarde um momento.';
      }

      return res.status(response.status).json({
        error: errorMessage,
        code: errorCode,
      });
    }

    const responseText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!responseText) {
      return res.status(500).json({
        error: 'Resposta vazia retornada pela API',
      });
    }

    res.json({
      candidates: [{
        content: {
          parts: [{
            text: responseText,
          }],
        },
      }],
    });
  } catch (error) {
    console.error('Erro no servidor:', error);
    res.status(500).json({
      error: error.message || 'Erro interno do servidor',
    });
  }
});

// ===== ERROR HANDLING =====
app.use((err, req, res, next) => {
  console.error('Erro não tratado:', err);
  res.status(500).json({
    error: 'Erro interno do servidor',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
});

// ===== START SERVER =====
app.listen(PORT, () => {
  console.log(`\n🚀 Sofia Backend rodando em: http://localhost:${PORT}`);
  console.log(`   Health Check: http://localhost:${PORT}/health`);
  console.log(`   Chat API: POST http://localhost:${PORT}/api/chat\n`);
});