# Sofia AI — Backend Setup Guide

## 🚀 **Arquitetura Profissional**

```
┌──────────────────────────────────────────────────────┐
│ Frontend (React + Vite)                              │
│ - Chat UI                                            │
│ - Autenticação de Usuário                            │
│ - Persistência Local                                 │
│ Porta: http://localhost:5173                         │
└────────────────┬─────────────────────────────────────┘
                 │ (requisição HTTPS/HTTP)
                 ↓
┌──────────────────────────────────────────────────────┐
│ Backend (Node.js + Express)                          │
│ - Gerencia Chave Gemini API (segura)                 │
│ - Proxy para Gemini API                              │
│ - Validação de Requisições                           │
│ - Rate Limiting                                      │
│ Porta: http://localhost:3000                         │
└────────────────┬─────────────────────────────────────┘
                 │ (requisição segura)
                 ↓
┌──────────────────────────────────────────────────────┐
│ Google Gemini API (Servidor Google)                  │
│ - Processamento de IA                                │
│ - Respostas de Sofia                                 │
└──────────────────────────────────────────────────────┘
```

---

## ✅ **Vantagens desta Arquitetura**

- ✅ **Chave API Segura** — Nunca exposta ao navegador
- ✅ **Validação no Backend** — Controle total sobre requisições
- ✅ **Rate Limiting** — Protege contra abuso
- ✅ **Logs do Servidor** — Monitorar uso
- ✅ **Deploy Fácil** — Heroku, Railway, DigitalOcean, AWS

---

## 📝 **Instalação Passo a Passo**

### **1️⃣ Obter Chave Gemini**

```bash
# Acesse no navegador:
https://aistudio.google.com/app/apikey

# Crie uma nova chave (grátis)
# Copie a chave
```

---

### **2️⃣ Configurar Backend**

```bash
# Entre na pasta do servidor
cd server

# Crie o arquivo .env com sua chave:
# (O arquivo .env já existe, apenas adicione a chave)
VITE_GEMINI_API_KEY=sua_chave_aqui

# Instale as dependências
npm install
```

---

### **3️⃣ Iniciar Backend + Frontend**

**Terminal 1** — Backend:
```bash
cd server
npm start
# ou para desenvolvimento (com reload automático):
npm run dev
```

Você verá:
```
🚀 Sofia Backend rodando em: http://localhost:3000
   Health Check: http://localhost:3000/health
   Chat API: POST http://localhost:3000/api/chat
```

---

**Terminal 2** — Frontend:
```bash
npm run dev
```

Você verá:
```
Local: http://localhost:5173
```

---

### **4️⃣ Usar a Aplicação**

1. **Abra no navegador:** http://localhost:5173
2. **Cadastre-se** (ou Google OAuth)
3. **Complete o onboarding**
4. **Comece a chamar Sofia!** 🧠

---

## 🔧 **Estrutura de Pastas**

```
projeto/
├── src/                 # Frontend React
│   ├── api/
│   │   └── geminiService.js  # Chama /api/chat do backend
│   ├── components/
│   ├── context/
│   └── ...
├── server/              # Backend Node.js
│   ├── index.js         # Servidor Express Principal
│   ├── .env             # Configurações (GEMINI_API_KEY)
│   └── package.json
├── .env                 # Config Frontend (VITE_BACKEND_URL)
└── package.json         # Frontend deps
```

---

## 📡 **API do Backend**

### **Health Check**
```bash
GET http://localhost:3000/health

Response:
{
  "status": "ok",
  "timestamp": "2026-02-25T10:00:00.000Z",
  "apiConfigured": true
}
```

### **Chat Endpoint**
```bash
POST http://localhost:3000/api/chat

Request Body:
{
  "contents": [
    { "role": "user", "parts": [{ "text": "Olá Sofia" }] }
  ],
  "generationConfig": {
    "temperature": 0.85,
    "topP": 0.95,
    "maxOutputTokens": 800
  }
}

Response:
{
  "candidates": [{
    "content": {
      "parts": [{ "text": "Olá! Como posso ajudar?" }]
    }
  }]
}
```

---

## 🚨 **Troubleshooting**

### **"Backend não conecta"**
```bash
# Verificar se está rodando:
curl http://localhost:3000/health

# Se retornar erro, verificar:
# 1. Está na pasta server?
# 2. npm install foi executado?
# 3. npm start (ou npm run dev)?
```

### **"Chave API inválida"**
```bash
# Verificar .env no server/:
cat server/.env

# Confirmar que tem a chave:
GEMINI_API_KEY=sk-...
```

### **CORS Error**
```bash
# Verificar FRONTEND_URL no server/.env:
FRONTEND_URL=http://localhost:5173

# Se em produção, ajustar para seu domínio:
FRONTEND_URL=https://seudominio.com
```

---

## 🌐 **Deploy para Produção**

### **Opção 1: Railway (Recomendado)**
```bash
# Instale CLI
npm install -g railway

# Faça login
railway login

# Crie projeto
railway init

# Configure variáveis (GEMINI_API_KEY, FRONTEND_URL)
railway variables

# Deploy
railway up
```

### **Opção 2: Heroku**
```bash
# Instale Heroku CLI
# https://devcenter.heroku.com/articles/heroku-cli

# Crie Procfile na raiz:
cd server
echo "web: npm start" > Procfile

# Deploy
heroku create sofia-backend
heroku config:set GEMINI_API_KEY=sua_chave
git push heroku main
```

---

## 📊 **Logs e Monitoramento**

Sistema backend automaticamente loga:
- ✅ Requisições recebidas
- ✅ Erros da API Gemini
- ✅ Rate limiting
- ✅ Tempo de resposta

---

## ✨ **Próximos Passos (Opcional)**

1. **Rate Limiting** — Limitar requisições por usuário
2. **Banco de Dados** — Armazene histórico de chats
3. **Autenticação JWT** — Segurança avançada
4. **Criptografia de Chaves** — Armazene chaves encriptadas
5. **WebSocket** — Chat em tempo real

---

**Sofia está pronta para produção! 🚀**
