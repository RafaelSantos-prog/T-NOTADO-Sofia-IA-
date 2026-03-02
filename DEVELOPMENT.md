# Guia de Desenvolvimento — Sofia AI

## 🎯 Quick Start

```bash
# 1. Instale dependências
npm install

# 2. Inicie dev server
npm run dev

# 3. Acesse http://localhost:5173

# 4. Use uma API Key do Google Gemini
# Obtenha em: https://aistudio.google.com/app/apikey
```

## 📝 Padrões de Código

### Nomenclatura

**Componentes React**
```javascript
// ✅ PascalCase para nomes de arquivo
export function ChatScreen() { }   // ChatScreen.jsx

// ✅ Componentes são funções
export function Button({ variant, onClick, children }) { }

// ✅ Props são desestruturados
function MyComponent({ title, isOpen, onClose }) { }
```

**Hooks**
```javascript
// ✅ Comece com "use"
export function useChat(apiKey) { }
export function useAutoScroll(dependency) { }

// ✅ Arquivo em camelCase
useChat.js
useAutoScroll.js
```

**Utils/Services**
```javascript
// ✅ camelCase para funções
export function createMessage(role, text) { }
export function detectCrisis(text) { }
export async function sendMessage(apiKey, history, prompt) { }
```

**Contextos**
```javascript
// ✅ PascalCase + Context suffix
export const AuthContext = createContext()
export const ChatContext = createContext()

// ✅ Provider com Provider suffix
export function AuthProvider({ children }) { }
```

**CSS Modules**
```css
/* ✅ camelCase para classes */
.container { }
.buttonPrimary { }
.messageUser { }

/* ✅ Nomes descritivos */
.chatInputContainer { }
.messageBubbleText { }
```

### Estrutura de Componente

```javascript
import styles from './MyComponent.module.css'

/**
 * Brief description of what component does.
 * @param {type} propName - Description
 * @returns {ReactElement} Description
 */
export function MyComponent({ propName, onAction }) {
  // State
  const [state, setState] = useState(initialValue)
  const { contextValue } = useContext(SomeContext)

  // Callbacks
  const handleClick = useCallback(() => {
    // Logic here
  }, [dependencies])

  // Effects
  useEffect(() => {
    // Side effects
  }, [dependencies])

  // Render
  return (
    <div className={styles.container}>
      {/* JSX */}
    </div>
  )
}
```

### JSDoc Standard

```javascript
/**
 * Briefly describe what the function does.
 * 
 * @param {string} text - Description of parameter
 * @param {number} maxLength - Optional behavior description
 * @returns {boolean} Description of return value
 * @throws {Error} When specific condition fails
 * 
 * @example
 * const result = myFunction('hello', 10)
 * console.log(result) // true
 */
export function myFunction(text, maxLength = 100) {
  // Implementation
}
```

## 🚀 Commits e Versionamento

### Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types**:
- `feat`: Nova funcionalidade
- `fix`: Correção de bug
- `docs`: Documentação
- `style`: Formatação (sem lógica)
- `refactor`: Mudança de código sem alterar saída
- `perf`: Melhoria de performance
- `test`: Testes
- `chore`: Dependências, configuração

**Examples**:
```
feat(chat): add crisis banner alerts
fix(auth): validate empty API key correctly
docs(readme): update installation steps
refactor(hooks): extract message logic to factory
perf(styles): optimize CSS animations
```

### Versionamento Semântico

```
MAJOR.MINOR.PATCH
1.0.0

v1.0.0 - MVP Launch
v1.1.0 - Add new Gemini models
v1.1.1 - Bug fix in crisis detection
v2.0.0 - Complete redesign/breaking changes
```

## ✅ Checklist Antes de Commitar

- [ ] Código segue padrões da pasta
- [ ] JSDoc adicionado em novas funções
- [ ] Sem console.log() deixados (remova ou use debug)
- [ ] Imports estão organizados
- [ ] CSS Modules sem class conflicts
- [ ] Testado em dev server
- [ ] Build passa sem warnings: `npm run build`
- [ ] Sem console errors em DevTools
- [ ] Responsividade testada (mobile/tablet/desktop)
- [ ] Acessibilidade: aria-labels, keyboards

## 🧪 Testando Localmente

### Teste Manual
```bash
# Terminal 1: Dev server
npm run dev

# Terminal 2: Build production
npm run build

# Terminal 3: Preview build
npm run preview
```

### Teste de Performance
1. DevTools → Lighthouse tab
2. Run audit com "Throttling: Slow 4G"
3. Target: 90+ em todas categorias

### Teste de Acessibilidade
1. DevTools → Lighthouse → Accessibility
2. Keyboard: Navegar só com Tab/Enter
3. Screen reader: NVDA (Windows) ou VoiceOver (Mac)

### Teste de Segurança
1. Inspecionar XSS: Insira `<script>alert('xss')</script>` como message
2. Inspecionar localStorage: `localStorage.getItem('sofia-api-key')`
3. DevTools → Security tab

## 📦 Adicionar Dependências

**⚠️ Nota**: Projeto foi desenhado com ZERO dependências além de React e Vite.

Se alguma dependência for necessária:

```bash
# Instale
npm install package-name

# Atualize package.json automaticamente
# Se não fez: manualmente adicione em dependencies
```

**Antes de adicionar**:
1. ✅ Realmente necessário?
2. ✅ Não há alternativa nativa?
3. ✅ Mantido ativamente?
4. ✅ Segurança auditada?

## 🐛 Bug Report Template

Ao encontrar bug, use este template:

```markdown
## Descrição
[Breve descrição do problema]

## Passos para Reproduzir
1. [Passo 1]
2. [Passo 2]
3. [Etc.]

## Comportamento Esperado
[O que deveria acontecer]

## Comportamento Atual
[O que realmente aconteçe]

## Ambiente
- OS: [Windows/Mac/Linux]
- Browser: [Chrome/Firefox/Safari]
- URL: [localhost:5173]

## Screenshots/Logs
[Cole console errors aqui]

```

## 🎨 Adicionar Nova Tela

1. **Crie a pasta**:
```bash
mkdir src/components/screens/MyScreen
```

2. **Crie arquivos**:
```javascript
// MyScreen.jsx
export function MyScreen({ onAction }) {
  return <div className={styles.container}>...</div>
}

// MyScreen.module.css
.container { /* styles */ }
```

3. **Importe em App.jsx**:
```javascript
import { MyScreen } from './components/screens/MyScreen/MyScreen'

function AppContent() {
  return (
    <>
      {condition ? <MyScreen /> : <OtherScreen />}
    </>
  )
}
```

## 🧩 Adicionar Novo Componente UI

1. **Folder**:
```bash
mkdir src/components/ui/MyButton
```

2. **Arquivos**:
```javascript
// MyButton.jsx
/**
 * Reusable button component for [specific purpose].
 * @param {string} variant - 'primary' | 'secondary'
 * @param {function} onClick - Click handler
 * @param {ReactNode} children - Button content
 */
export function MyButton({ variant = 'primary', onClick, children }) {
  return (
    <button
      className={`${styles.button} ${styles[variant]}`}
      onClick={onClick}
    >
      {children}
    </button>
  )
}

// MyButton.module.css
.button { /* base styles */ }
.primary { /* variant */ }
.secondary { /* variant */ }
```

3. **Export no index**:
```javascript
// src/components/ui/index.js (create if not exists)
export { MyButton } from './MyButton/MyButton'
export { Button } from './Button/Button'
```

## 🪝 Adicionar Novo Hook

1. **Arquivo**:
```bash
src/hooks/useMyHook.js
```

2. **Implementação**:
```javascript
import { useCallback, useState } from 'react'

/**
 * Do something specific and useful.
 * @param {type} param - Description
 * @returns {object} Methods and state
 */
export function useMyHook(param) {
  const [state, setState] = useState()

  const method = useCallback(() => {
    // Logic
  }, [dependencies])

  return { state, method }
}
```

3. **Export em index.js**:
```javascript
export { useMyHook } from './useMyHook'
export { useChat } from './useChat'
```

## 🔄 Atualizar System Prompt da Sofia

**Arquivo**: `src/constants/systemPrompt.js`

Siga este template ao editar:

```javascript
export const SYSTEM_PROMPT = `
Você é Sofia, [descrição breve].

IDENTIDADE:
[Como Sofia se comporta]

DIRETRIZES:
- Ponto 1
- Ponto 2

PROTOCOLO DE CRISE:
Se [condição]:
1. [Ação 1]
2. [Ação 2]

FORMATO:
- Linguagem: português brasileiro
- Extensão: moderada
- Estilo: [descritivo]
`.trim()
```

**Depois de editar**:
1. Reinicie dev server
2. Teste com uma mensagem
3. Verifique se resposta segue novo prompt

## ⚠️ Adicionar Palavra-Chave de Crise

**Arquivo**: `src/constants/crisisKeywords.js`

```javascript
export const CRISIS_KEYWORDS = [
  'suicídio',
  'suicida',
  // ... adicione aqui em português
  'novapalavraqui',
]
```

**Testes**:
1. Envie mensagem com a nova palavra
2. Verifique se CrisisBanner aparece
3. Verifique se Toast aviso dispara

## 🚨 Troubleshooting

### "Cannot find module X"
- Verifique caminho do import
- Restart dev server: `npm run dev`
- Verifique se arquivo foi criado/não deletado

### "API Key inválida"
- User deve obter em https://aistudio.google.com/app/apikey
- Verificar se key foi copiada inteira
- Não há espaços antes/depois

### CSS não aparece
- Verifique `import styles from './Component.module.css'`
- Verifique classe existe no .css
- Verifique className: `className={styles.myClass}`
- Limpe cache: `Ctrl+Shift+R`

### Dev server lento
- Reinicie: `npm run dev`
- Limpe node_modules: `rm -rf node_modules && npm install`
- Feche outros apps pesados

## 📚 Recursos Úteis

- [React Docs](https://react.dev/)
- [Vite Docs](https://vitejs.dev/)
- [MDN CSS](https://developer.mozilla.org/en-US/docs/Web/CSS)
- [Gemini API](https://ai.google.dev/)
- [ES6 Cheatsheet](https://es6.io/)

## 🤝 Etiqueta do Projeto

- Saudação: "Olá! Bem-vindo ao Sofia" (em PT-BR sempre)
- Horário de resposta: Best effort
- Tone: Profissional mas amigável
- Acessibilidade: Sempre primeira prioridade
- Segurança: Nunca compromisse

---

**Última atualização**: 25 de fevereiro de 2026

*Obrigado por contribuir! Sofia é um projeto de código aberto para saúde mental digital. 🧠❤️*
