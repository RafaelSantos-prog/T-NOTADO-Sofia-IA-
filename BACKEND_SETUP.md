# Sofia AI — Setup Profissional com Backend

## 🎯 **Resumo Rápido**

**Antes:** Chave API no .env (vulnerável)  
**Agora:** Chave armazenada seguramente no backend 🔐

---

## 📋 **Sequência de Comandos**

### **Passo 1: Obter Chave Gemini**
```bash
# No navegador:
https://aistudio.google.com/app/apikey
# Crie uma chave e copie
```

### **Passo 2: Salvar Chave no Backend**
```bash
# Abra o arquivo:
server/.env

# Mude isto:
GEMINI_API_KEY=sua_chave_aqui
```

### **Passo 3: Instalar Backend**
```bash
cd server
npm install
npm start
```

Você verá:
```
🚀 Sofia Backend rodando em: http://localhost:3000
```

### **Passo 4: Iniciar Frontend (outro terminal)**
```bash
npm run dev
```

Você verá:
```
Local: http://localhost:5173
```

### **Passo 5: Usar!**
1. Abra http://localhost:5173
2. Cadastre ou entre com Google
3. Complete onboarding
4. **Chat com Sofia!** 🧠

---

## 📁 **O Que Foi Criado**

```
server/
├── index.js              # 🔥 Servidor Express
├── package.json          # Dependências
├── .env                  # ⚙️ Chave API (SEGURA!)
└── README.md             # Documentação completa
```

---

## 🔒 **Segurança**

| Antes | Depois |
|-------|--------|
| ❌ Chave no `.env` (visível) | ✅ Chave só no Backend |
| ❌ Chave no browser | ✅ Browser não vê a chave |
| ❌ Fácil de vazar | ✅ Protegido |

---

## 🚀 **Pronto para Produção**

Deploy simples em:
- Railway
- Heroku
- AWS
- DigitalOcean
- Qualquer servidor Node.js

Veja `server/README.md` para instruções.

---

**Sofia agora está empresarial!** 💼
