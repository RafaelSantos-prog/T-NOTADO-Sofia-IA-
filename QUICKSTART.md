# Sofia AI — Quick Start Guide

🚀 **Comece em 3 passos!**

## 1️⃣ Instale e Inicie

```bash
# Já feito: npm install

# Inicie o servidor
npm run dev

# Acesse
http://localhost:5173
```

## 2️⃣ Obtenha uma Chave API

1. Acesse https://aistudio.google.com/app/apikey
2. Clique em "Create API Key"
3. Copie a chave gerada
4. Cole na aplicação (campo de Input na SetupScreen)

## 3️⃣ Comece a Conversar!

- **Digite**: Sua mensagem
- **Enter**: Envia
- **Shift+Enter**: Nova linha
- **Veja Sofia responder**: Aguarde a resposta

---

## 📚 Documentação Completa

| Documento | Propósito |
|-----------|-----------|
| **README.md** | Visão geral, features, segurança |
| **TECHNICAL.md** | Arquitetura, contextos, hooks (para devs) |
| **DEVELOPMENT.md** | Padrões de código, como contribuir |
| **DEPLOY.md** | Como fazer deploy (Vercel, Docker, VPS) |
| **SUMMARY.md** | Checklist de entregas e estatísticas |

---

## ⚙️ Comandos Úteis

```bash
# Desenvolvimento
npm run dev              # Inicia Vite server com HMR

# Produção
npm run build            # Cria dist/ otimizado
npm run preview          # Testa build localmente

# Qualidade de código
npm run lint             # Executa ESLint
```

---

## 🎯 Arquitetura em 30 Segundos

```
User Input (ChatInput)
    ↓
useChat Hook
    ↓
Gemini API (via geminiService)
    ↓
Sofia Response (MessageList)
    ↓
Crisis Detection (CrisisBanner se necessário)
    ↓
localStorage (persiste em background)
```

---

## 🔐 Segurança

✅ API Key armazenada **localmente** (nunca enviada a servidores)  
✅ Proteção XSS em todos inputs  
✅ HTTPS obrigatório em produção  
✅ WCAG AA acessibilidade  

---

## 📱 Responsividade Testada

✅ Desktop (1440px+) | ✅ Tablet (768px-1440px) | ✅ Mobile (320px+)

---

## 🆘 Ajuda Rápida

**"API Key inválida"?**
→ Obtenha em https://aistudio.google.com/app/apikey

**Mensagens não carregam?**
→ Abra DevTools (F12) → Console → procure erros

**CSS quebrado?**
→ `Ctrl+Shift+R` para limpar cache

**Mais dúvidas?**
→ Consulte TECHNICAL.md ou DEVELOPMENT.md

---

## 🚀 Deploy Rápido (Vercel)

```bash
npm i -g vercel
vercel login
vercel
# Pronto! Seu site está no ar! 🎉
```

(Mais opções em DEPLOY.md)

---

## 🎓 Próximos Passos

1. **Explorar**: Olhe a estrutura de pastas `src/`
2. **Entender**: Leia TECHNICAL.md para arquitetura
3. **Modificar**: Siga padrões em DEVELOPMENT.md
4. **Deploy**: Use instruções em DEPLOY.md
5. **Melhorar**: Veja sugestões em SUMMARY.md

---

## 📞 Contato & Suporte

- Por favor leia a documentação fornecida (4 docs)
- Tudo está comentado em JSDoc
- Estrutura é autoexplicativa

---

## 🎉 Bem-vindo!

Sofia está pronta. Você também! 

**Comece a ajudar pessoas agora.** 🧠❤️

---

*Versão 1.0.0 - Production Ready*  
*25 de fevereiro de 2026*
