# Sofia AI — Documentação Técnica Detalhada

## Índice
1. [Arquitetura Geral](#arquitetura-geral)
2. [Contextos (State Management)](#contextos-state-management)
3. [Custom Hooks](#custom-hooks)
4. [Serviços e Utils](#serviços-e-utils)
5. [Componentes](#componentes)
6. [Fluxos de Dados](#fluxos-de-dados)
7. [Design Patterns Utilizados](#design-patterns-utilizados)

---

## Arquitetura Geral

### Princípios seguidos:

**SOLID**
- **S**ingle Responsibility: Cada componente tem uma responsabilidade clara
- **O**pen/Closed: Extensível via props/context sem modificar código existente
- **L**iskov Substitution: Componentes intercambiáveis
- **I**nterface Segregation: APIs simples e focadas
- **D**ependency Inversion: Context API para injeção de deps

**Clean Architecture Camadas**
```
UI (Components) → Domain Logic (Hooks) → Services (API) → External APIs
```

---

## Contextos (State Management)

### AuthContext
**Arquivo**: `src/context/AuthContext.jsx`

**Responsabilidades**:
- Gerenciar API Key do usuário
- Persistir API Key em localStorage
- Manter estado de autenticação

**Interface**:
```javascript
{
  apiKey: string,              // API Key atual
  isAuthenticated: boolean,    // Se autenticado
  setAuth: (key: string) => void,      // Login
  logout: () => void           // Logout
}
```

**Fluxo**:
1. Usuário insere API Key na SetupScreen
2. `setAuth(key)` é chamado
3. AuthContext persiste em localStorage
4. `isAuthenticated` muda para true
5. App renderiza ChatScreen

---

### ChatContext
**Arquivo**: `src/context/ChatContext.jsx`

**Responsabilidades**:
- Manter lista de mensagens
- Manter histórico em formato Gemini
- Gerenciar estado de loading
- Persistir chat em localStorage

**Interface**:
```javascript
{
  messages: MessageObject[],   // Mensagens do usuário
  setMessages: (msgs) => void,
  history: GeminiFormat[],     // Formato para API
  setHistory: (hist) => void,
  isLoading: boolean,
  setIsLoading: (bool) => void,
  clearChatHistory: () => void
}
```

**Message Object**:
```javascript
{
  id: string,              // UUID auto-gerado
  role: 'user' | 'sofia',
  text: string,
  timestamp: Date,
  hasCrisis: boolean       // Detectado automaticamente
}
```

**Gemini Format**:
```javascript
{
  role: 'user' | 'model',
  parts: [{ text: string }]
}
```

---

### ToastContext
**Arquivo**: `src/context/ToastContext.jsx`

**Responsabilidades**:
- Gerenciar fila de notificações
- Auto-remover após duração
- Permitir dismissão manual

**Interface**:
```javascript
{
  toasts: ToastObject[],
  addToast: (msg: string, type: string, duration: number) => void,
  removeToast: (id: string) => void
}
```

**Toast Types**:
- `'success'` → Verde com checkmark
- `'error'` → Vermelho com X
- `'warning'` → Amarelo com !
- `'info'` → Roxo com checkmark

---

## Custom Hooks

### useChat
**Arquivo**: `src/hooks/useChat.js`

**Propósito**: Orquestrar toda lógica de chat

**Dependências**: useGemini, ChatContext

**Métodos**:
```javascript
sendMessageToSofia(userText: string): Promise<MessageObject>
// → Envia texto do usuário
// → Chama Gemini com histórico completo
// → Adiciona resposta ao contexto
// → Detecta crise
// → Retorna resposta

clearChat(): void
// → Reseta mensagens
// → Adiciona mensagem de boas-vindas
// → Limpa histórico
```

**Fluxo Detalhado - sendMessageToSofia**:
```
1. Validar input (não vazio)
2. Criar MessageObject com createMessage()
3. Adicionar ao messages array
4. Converter para GeminiFormat
5. Chamar sendMessage(API, history, prompt)
6. Esperar resposta
7. Criar Sofia message com detectCrisis()
8. Atualizar ChatContext
9. Retornar message para componente
```

### useGemini
**Arquivo**: `src/hooks/useGemini.js`

**Propósito**: Abstração da chamada à API Gemini

**Métodos**:
```javascript
call(apiKey: string, history: Array, prompt: string): Promise<string>
// → Valida API Key
// → Faz POST request
// → Parseia resposta
// → Lança erro se inválido
```

**Estados**:
- `isLoading`: true enquanto aguardando resposta
- `error`: mensagem de erro específica (ou null)

**Error Handling**:
- 400: "API Key inválida ou requisição malformada"
- 403: "Sem permissão. Verifique sua API Key"
- 429: "Limite de requisições atingido"
- Outros: Message da API ou "Erro desconhecido"

### useLocalStorage
**Arquivo**: `src/hooks/useLocalStorage.js`

**Propósito**: Sincronizar estado React com localStorage

**Assinatura**:
```javascript
const [value, setValue] = useLocalStorage(key: string, initial: any)
```

**Comportamento**:
- Lê de localStorage ao montar
- Escreve em localStorage ao mudar state
- Tipo é inferido do initial
- Try/catch para erros silenciosos

**Uso**:
```javascript
const [apiKey, setApiKey] = useLocalStorage('sofia-api-key', '')
```

### useAutoScroll
**Arquivo**: `src/hooks/useAutoScroll.js`

**Propósito**: Auto-scroll suave para elemento

**Assinatura**:
```javascript
const ref = useAutoScroll(dependency: any)
```

**Comportamento**:
- Sempre que `dependency` muda, scroll para `{ top: scrollHeight }`
- Comportamento: `smooth` para animação
- Usado em MessageList para seguir últimas mensagens

### useAutoResize
**Arquivo**: `src/hooks/useAutoResize.js`

**Propósito**: Textarea que expande com contenúdo

**Assinatura**:
```javascript
const ref = useAutoResize(maxHeight: number = 120)
```

**Comportamento**:
1. Ao digitar, event listener dispara `handleResize()`
2. Seta `textarea.style.height = 'auto'`
3. Calcula `scrollHeight`
4. Define altura = min(scrollHeight, maxHeight)
5. Se atingir max, ativa scroll interno

### useCrisisDetection
**Arquivo**: `src/hooks/useCrisisDetection.js`

**Propósito**: Verificar crise de forma simples

**Método**:
```javascript
checkCrisis(text: string): boolean
// → Retorna true se alguma keyword de CRISIS_KEYWORDS
// → Case-insensitive
```

---

## Serviços e Utils

### geminiService
**Arquivo**: `src/api/geminiService.js`

**Principais Funções**:

**sendMessage(apiKey, history, systemPrompt)**
```javascript
• Constrói URL com API Key como query param
• Faz POST com Content-Type: application/json
• Body contém: system_instruction, contents (history), configs
• Parseia response.candidates[0].content.parts[0].text
• Lança erro descritivo se resposta vazia/inválida
```

**validateApiKey(apiKey)**
```javascript
• Simples: verifica se string não vazia
• Retorna boolean
```

---

### messageFactory
**Arquivo**: `src/utils/messageFactory.js`

**createMessage(role, text)**
```javascript
return {
  id: crypto.randomUUID(),
  role,
  text,
  timestamp: new Date(),
  hasCrisis: detectCrisis(text)  // Automático
}
```

**detectCrisis(text)**
```javascript
• Converte para lowercase
• Verifica se inclui alguma keyword de CRISIS_KEYWORDS
• Retorna boolean
```

**messageToGeminiFormat(message)**
```javascript
return {
  role: message.role === 'user' ? 'user' : 'model',
  parts: [{ text: message.text }]
}
```

---

### formatTime
**Arquivo**: `src/utils/formatTime.js`

**formatTime(timestamp)**
```javascript
// Retorna: HH:mm
// Ex: "14:35"
```

**formatDate(timestamp)**
```javascript
// Retorna: "Today", "Yesterday", ou data formatada
// Útil para agrupar mensagens por dia (futuro)
```

---

### sanitizeHtml
**Arquivo**: `src/utils/sanitizeHtml.js`

**sanitizeHtml(html)**
```javascript
• Cria div temporário
• Seta textContent (não innerHTML)
• Retorna innerHTML (agora escapado)
• Previne XSS de input do usuário
```

**escapeHtml(text)**
```javascript
• Substitui &, <, >, ", ' por entities
• &amp;, &lt;, &gt;, &quot;, &#039;
```

**stripHtml(html)**
```javascript
• Remove todas tags HTML
• Retorna texto plano
```

---

## Componentes

### Estrutura de Pasta
```
components/
├── ui/                  # Componentes reutilizáveis
│   ├── Button
│   ├── Input
│   ├── Avatar
│   └── Toast
├── chat/                # Específicos do chat
│   ├── ChatHeader
│   ├── MessageList
│   ├── MessageBubble
│   ├── TypingIndicator
│   ├── ChatInput
│   └── CrisisBanner
└── screens/             # Telas completas
    ├── SetupScreen
    └── ChatScreen
```

### UI Components

#### Button.jsx
**Props**:
- `variant`: 'primary' | 'secondary' | 'ghost'
- `size`: 'sm' | 'md' | 'lg'
- `isLoading`: boolean (mostra spinner)
- `disabled`: boolean
- `onClick`: function
- `children`: ReactNode

**Estilos**:
- Primary: gradient roxo, sombra glow
- Secondary: surface com border
- Ghost: transparente até hover
- Spinner: CSS animation `spin`

#### Input.jsx
**Props**:
- `label`: string
- `type`: 'text' | 'password' | etc
- `value`: string
- `onChange`: function
- `error`: string (mostra em vermelho)
- `disabled`: boolean

#### Avatar.jsx
**Props**:
- `initials`: string (fallback)
- `image`: string (URL)
- `isOnline`: boolean (pulse indicator)
- `size`: 'sm' | 'md' | 'lg'

#### Toast.jsx
**Props**:
- `message`: string
- `type`: 'info' | 'success' | 'error' | 'warning'
- `onClose`: function
- `duration`: number (0 = manual)

### Chat Components

#### ChatHeader.jsx
- Exibe avatar + nome Sofia
- Botões: Limpar (com confirmação) e Sair
- Sticky ao topo

#### MessageList.jsx
- Container com `role="log"` (accessibility)
- useAutoScroll para seguir últimas msgs
- Renderiza todos Messages
- Mostra TypingIndicator se `isLoading`

#### MessageBubble.jsx
- Estilo diferente para user (direita) vs sofia (esquerda)
- Avatar apenas em messages da sofia
- Timestamp em cinza
- Indicador de crise (dot vermelho se hasCrisis)
- Animação slideUp ao montar

#### TypingIndicator.jsx
- 3 dots com bounce animation
- Animação-delay escalonado (0s, 0.2s, 0.4s)
- Apenas visual (sem spinner)

#### ChatInput.jsx
- Textarea com useAutoResize
- Botão Enviar desabilitado se vazio
- Enter envia, Shift+Enter quebra linha
- Props: onSendMessage, isDisabled, isLoading

#### CrisisBanner.jsx
- Aparece quando hasCrisis = true
- Contém info CVV (188) e SAMU (192)
- Grid 2 colunas em desktop, 1 em mobile
- Border left vermelha, ícone em círculo

### Screen Components

#### SetupScreen.jsx
**Fluxo**:
1. Exibe form com Input (API Key, masked)
2. Botão "Começar Conversa"
3. Validação: não vazio
4. onSubmit chama `setAuth(key)`
5. AuthContext persiste em localStorage

**Estilos**:
- Gradient background
- Logo com animação float
- Form em card com sombra
- Info box com instruções passo-a-passo

#### ChatScreen.jsx
**Fluxo**:
1. Renderiza ChatHeader, MessageList, ChatInput
2. Ao enviar msg: `handleSendMessage(text)`
3. useChat.sendMessageToSofia(text)
4. Detecta crise → mostra CrisisBanner
5. Adiciona Toast se necessário
6. Botões: Limpar chat (confirmação) e Logout

---

## Fluxos de Dados

### Fluxo 1: Autenticação
```
User Input (SetupScreen)
    ↓
onSubmit(apiKey)
    ↓
AuthContext.setAuth(apiKey)
    ↓
localStorage.setItem('sofia-api-key', apiKey)
    ↓
isAuthenticated = true
    ↓
React re-renders → ChatScreen
```

### Fluxo 2: Enviar Mensagem
```
User digita em ChatInput
    ↓
ChatInput.handleSend()
    ↓
useChat.sendMessageToSofia(text)
    ↓
createMessage('user', text) → ChatContext.messages
    ↓
messageToGeminiFormat() → ChatContext.history
    ↓
useGemini.call(apiKey, history, SYSTEM_PROMPT)
    ↓
POST /v1beta/models/gemini-1.5-flash:generateContent
    ↓
Resposta recebida
    ↓
createMessage('sofia', response.text)
    ↓
detectCrisis(response.text) → hasCrisis = true/false
    ↓
ChatContext.messages += sofia message
    ↓
MessageList re-renders (auto-scroll ativa)
    ↓
Se hasCrisis: mostra CrisisBanner + Toast aviso
```

### Fluxo 3: Detectar Crise e Avisar
```
Message text → detectCrisis(text)
    ↓
Verifica contra CRISIS_KEYWORDS
    ↓
hasCrisis = true
    ↓
MessageBubble renderiza com .crisis indicator
    ↓
ChatScreen verifica hasCrisisInChat
    ↓
setShowCrisisBanner(true)
    ↓
CrisisBanner renders com informações CVV/SAMU
    ↓
addToast('Aviso: Detectamos...', 'warning')
```

### Fluxo 4: Limpar Chat
```
User clica "Limpar"
    ↓
Modal: "Tem certeza?"
    ↓
Se confirmado:
   → ChatContext.clearChatHistory()
   → setShowCrisisBanner(false)
   → addToast('Chat limpo', 'success')
```

### Fluxo 5: Logout
```
User clica "Sair"
    ↓
AuthContext.logout()
    ↓
localStorage.removeItem('sofia-api-key')
    ↓
apiKey = '', isAuthenticated = false
    ↓
React re-renders → SetupScreen
```

---

## Design Patterns Utilizados

### 1. Context Pattern (State Management)
```javascript
// Criação
export const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [state, setState] = useState()
  return <AuthContext.Provider value={{ state, setState }}>
    {children}
  </AuthContext.Provider>
}

// Consumo
const { state } = useContext(AuthContext)
```

### 2. Custom Hook Pattern (Logic Extraction)
```javascript
export function useChat(apiKey) {
  const { messages, setMessages } = useContext(ChatContext)
  
  const sendMessageToSofia = useCallback(async (text) => {
    // Lógica aqui
  }, [dependencies])
  
  return { sendMessageToSofia, clearChat }
}
```

### 3. Factory Pattern (Message Creation)
```javascript
export function createMessage(role, text) {
  return {
    id: crypto.randomUUID(),
    role,
    text,
    timestamp: new Date(),
    hasCrisis: detectCrisis(text)
  }
}
```

### 4. Composition Pattern (Components)
```javascript
<ChatScreen>
  <ChatHeader />
  <MessageList>
    {messages.map(m => <MessageBubble {...m} />)}
  </MessageList>
  <ChatInput />
</ChatScreen>
```

### 5. Module Pattern (Service Layer)
```javascript
// api/geminiService.js
export async function sendMessage(apiKey, history, prompt) {
  // Encapsula lógica de API
}

export function validateApiKey(apiKey) {
  // Validação reutilizável
}
```

---

## Otimizações

### Performance
1. **useCallback** em event handlers para evitar re-renders
2. **useAutoScroll** com smooth behavior (vs instant jumps)
3. **CSS Modules** ao invés de CSS-in-JS (zero runtime overhead)
4. **localStorage** batching via Contexts

### Acessibilidade
1. **aria-label** em todos os botões
2. **role="log"** em message list
3. **aria-live="polite"** em toast container
4. **Focus visible** em inputs
5. **Keyboard support** (Enter, Shift+Enter)

### Segurança
1. **sanitizeHtml()** em todos user inputs
2. **API Key em localStorage** (não sessão)
3. **Sem XSS vectors** (textContent ao invés de innerHTML)

---

## Manutenção e Debugging

### Instruções de Debug
1. Abra DevTools (F12)
2. Verifique aba **Console** para erros
3. Aba **Network** para XHR requests
4. Aba **Application** → localStorage para dados persistidos
5. **React DevTools** extension para inspecionar state

### Adicionar Novo Recurso
1. Crie arquivo na pasta apropriada
2. Exporte função/componente
3. Incremente index.js da pasta se necessário
4. Importe em local de uso
5. Adicione JSDoc/comments
6. Teste em dev mode (`npm run dev`)
7. Compile (`npm run build`)

### Adicionar Novo Keyword de Crise
1. Abra `src/constants/crisisKeywords.js`
2. Adicione string em português ao array
3. Teste com mensagem contendo a palavra
4. Valide se CrisisBanner aparece

---

## Próximos Passos (Future Roadmap)

- [ ] Testes unitários (Vitest)
- [ ] Testes de integração (Testing Library)
- [ ] TypeScript para type safety
- [ ] Histórico persistente por sessão
- [ ] Temas (light/dark mode)
- [ ] Integração com mais modelos (GPT, etc)
- [ ] Transcrição de voz
- [ ] Exportar chat em PDF
- [ ] Modo offline
- [ ] PWA (Progressive Web App)

---

**Última atualização**: 25 de fevereiro de 2026
**Versão**: 1.0.0 (MVP)
**Status**: Production Ready ✅
