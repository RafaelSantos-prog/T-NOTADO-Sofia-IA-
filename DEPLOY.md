# Guia de Deploy — Sofia AI

## 📋 Checklist Pré-Deploy

- [ ] Código compilado sem erros: `npm run build`
- [ ] Sem console.log() statements
- [ ] Sem API Keys hardcoded
- [ ] Sem dados de teste em localStorage
- [ ] README.md atualizado
- [ ] HTTPS habilitado no servidor
- [ ] Privacy Policy publicada
- [ ] Terms of Service publicados
- [ ] Monitoring configurado (optional)
- [ ] Backup strategy em lugar
- [ ] Testes finais em staging

## 🚀 Deploy na Vercel (Recomendado)

### Opção 1: CLI
```bash
# 1. Instale Vercel CLI
npm i -g vercel

# 2. Login
vercel login

# 3. Deploy
vercel

# Siga prompts (nome do projeto, framework React, etc)
# Vercel detecta automaticamente Vite

# 4. Acesse URL fornecida
# https://seus-dominio.vercel.app
```

### Opção 2: GitHub Integration
```bash
# 1. Push código para GitHub
git remote add origin https://github.com/seu-user/sofia-ai.git
git branch -M main
git push -u origin main

# 2. Acesse https://vercel.com
# 3. Clique "New Project"
# 4. Selecione seu repositório
# 5. Configure:
#    - Framework Preset: Vite
#    - Build Command: npm run build
#    - Output Directory: dist
# 6. Clique Deploy

# Auto-deploy ativa! Toda commit em main → deploy automático
```

### Variáveis de Ambiente (Se necessário)
```bash
# Na Vercel Dashboard:
# 1. Vá para Settings → Environment Variables
# 2. Adicione (se necessário):
# VITE_API_URL=https://api.seu-dominio.com

# No app:
# const API_URL = import.meta.env.VITE_API_URL
```

## 🌐 Deploy em Netlify

```bash
# 1. Instale Netlify CLI
npm install -g netlify-cli

# 2. Build localmente
npm run build

# 3. Deploy
netlify deploy --prod --dir=dist

# Siga prompts
# Seu site estará em: https://seu-site.netlify.app
```

## 🐳 Deploy com Docker

### Dockerfile
```dockerfile
# Build stage
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM node:18-alpine
WORKDIR /app
RUN npm install -g serve
COPY --from=builder /app/dist ./dist
EXPOSE 3000
CMD ["serve", "-s", "dist", "-l", "3000"]
```

### docker-compose.yml
```yaml
version: '3.8'
services:
  sophia-ai:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
    restart: unless-stopped
```

### Deploy com Docker
```bash
# 1. Build image
docker build -t sofia-ai:latest .

# 2. Run container
docker run -p 3000:3000 sofia-ai:latest

# 3. Acesse http://localhost:3000
```

## 🖥️ Deploy em Servidor Próprio

### Ubuntu/Debian + Nginx

```bash
# 1. SSH no servidor
ssh user@seu-servidor.com

# 2. Instale Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 3. Clone repositório
cd /var/www
git clone https://github.com/seu-user/sofia-ai.git
cd sofia-ai

# 4. Instale dependências
npm install --production

# 5. Build
npm run build

# 6. Configure Nginx como reverse proxy
sudo nano /etc/nginx/sites-available/sofia
```

### Nginx Config
```nginx
server {
    listen 80;
    server_name seu-dominio.com;

    # Redirecione HTTP para HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name seu-dominio.com;

    ssl_certificate /etc/letsencrypt/live/seu-dominio.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/seu-dominio.com/privkey.pem;

    root /var/www/sofia-ai/dist;
    index index.html;

    # Cache assets estáticos
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # SPA routing: redirecione 404 para index.html
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css text/javascript application/json application/javascript;
    gzip_min_length 1024;
}
```

### SSL com Let's Encrypt
```bash
# 1. Instale Certbot
sudo apt-get install certbot python3-certbot-nginx

# 2. Obtenha certificado
sudo certbot certonly --nginx -d seu-dominio.com

# 3. Nginx auto-renew
sudo systemctl enable certbot.timer
```

### PM2 (Process Manager)
```bash
# 1. Instale PM2
npm install -g pm2

# 2. Crie ecosystem.config.js
cat > ecosystem.config.js << EOF
module.exports = {
  apps: [{
    name: 'sofia-ai',
    script: 'npx serve -s dist -l 3000',
    env: {
      NODE_ENV: 'production'
    },
    instances: 'max',
    exec_mode: 'cluster',
    autorestart: true,
    error_file: './logs/error.log',
    out_file: './logs/out.log'
  }]
};
EOF

# 3. Start
pm2 start ecosystem.config.js

# 4. Make persistent
pm2 startup
pm2 save
```

## 🔒 HTTPS Obrigatório

Para produção, HTTPS é **OBRIGATÓRIO**:

1. **Vercel**: Automático (incluído)
2. **Netlify**: Automático (incluído)
3. **Docker/VPS**: Use Let's Encrypt (veja acima)

## 📊 Monitoring (Opcional)

### Sentry (Error Tracking)
```bash
npm install @sentry/react

# No App.jsx:
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "https://sua-chave@sentry.io/seu-id",
  environment: "production",
  tracesSampleRate: 0.1,
});
```

### Google Analytics (Opcional)
```bash
npm install react-ga4

# No main.jsx:
import ReactGA from "react-ga4";
ReactGA.initialize("GA_MEASUREMENT_ID");
```

## 🔄 CI/CD Pipeline (GitHub Actions)

### .github/workflows/deploy.yml
```yaml
name: Deploy to Vercel

on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run build
        run: npm run build
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
```

## 📈 Performance Otimização (Produção)

### Build Otimizado
```bash
npm run build
```

Resultados esperados:
- dist/index.html: ~0.45 KB
- dist/assets/index-*.css: ~15 KB gzip
- dist/assets/index-*.js: ~210 KB gzip (com React)

### Verificar Bundle Size
```bash
npm install source-map-explorer

# Após build:
source-map-explorer 'dist/assets/*.js'
```

## 🌍 CDN Setup (Opcional)

Se usar CloudFlare:

1. Adicione seu domínio a CloudFlare
2. Atualize nameservers
3. Na dashboard:
   - Speed → Optimization → Enable Brotli
   - Caching → Browser cache TTL: 1 month
   - HTTP/2: Enable
   - GZIP: Enable
   - Minify: Enable

## 📋 Pós-Deploy Checklist

- [ ] Acesse https://seu-dominio.com
- [ ] Teste com API Key válida
- [ ] Verifique responsividade (mobile/tablet/desktop)
- [ ] Abra DevTools → Console (sem erros?)
- [ ] Abra DevTools → Network (tamanho do bundle?)
- [ ] Teste localStorage: insira URL, recarregue, dados persistiram?
- [ ] Teste crise banner: envie "suicídio", aparece banner?
- [ ] Teste toast: envie com API Key inválida, vê toast de erro?
- [ ] Teste Shift+Enter: quebra linha funciona?
- [ ] Verifique lighthouse score: 90+?

## 🔐 Segurança em Produção

### Headers de Segurança (Nginx)
```nginx
add_header X-Content-Type-Options "nosniff";
add_header X-Frame-Options "SAMEORIGIN";
add_header X-XSS-Protection "1; mode=block";
add_header Referrer-Policy "strict-origin-when-cross-origin";
add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:;";
```

### Rate Limiting (para API)
```bash
# Se implementar backend no futuro:
# Use express-rate-limit ou similar
npm install express-rate-limit
```

### CORS Setup
```javascript
// Se tiver backend:
const cors = require('cors');
app.use(cors({
  origin: 'https://seu-dominio.com',
  credentials: true
}));
```

## 📧 Backups

### Backup de Dados (Se tiver backend)
```bash
# Daily backup at 2 AM
0 2 * * * /scripts/backup.sh

# Versione em S3/GCS:
aws s3 sync ./backup s3://seu-bucket/
```

## 🚨 Rollback em Caso de Erro

### Vercel
```bash
vercel rollback
```

### Manual (Git)
```bash
git revert HEAD
git push origin main
# Vercel auto-redeploy com versão anterior
```

### Docker
```bash
# Volta para tag anterior
docker run -p 3000:3000 sofia-ai:v1.0.0
```

## 📞 Suporte Pós-Deploy

### Monitoramento 24/7 (Recomendado)
- Uptime Robot: https://uptimerobot.com (free)
- Sentry: https://sentry.io (error tracking)
- LogRocket: https://logrocket.com (user session replay)

### Logging
```javascript
// No App.jsx ou useChat:
if (process.env.NODE_ENV === 'production') {
  console.log('Sofia deployed and running')
  // Envie para logging service
}
```

## 🎉 Parabéns! Deploy Completo

Sua Sofia AI está rodando em produção! 🚀

**URLs Úteis**:
- App: https://seu-dominio.com
- Vercel Dashboard: https://vercel.com/dashboard
- Google Gemini API: https://aistudio.google.com/
- Monitoring: https://uptimerobot.com

---

**Última atualização**: 25 de fevereiro de 2026

*Sofia está no ar para ajudar! 🧠❤️*
