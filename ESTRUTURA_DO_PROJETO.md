# 📁 Estrutura do Projeto STM App

## Árvore Completa

```
stm-app-react/
│
├── 📄 README.md                    ← Leia primeiro! Informações gerais
├── 📄 SETUP_VSCODE.md              ← Como instalar e rodar no seu PC
├── 📄 COMANDOS_UTEIS.md            ← Comandos do terminal
├── 📄 ESTRUTURA_DO_PROJETO.md      ← Este arquivo
│
├── 📄 package.json                 ← Dependências e scripts
├── 📄 .env.example                 ← Template de variáveis (renomeie para .env)
├── 📄 .env.local.example           ← Template adicional de variáveis
├── 📄 .gitignore                   ← Arquivos ignorados pelo git
│
├── 📁 public/                      ← Arquivos públicos (não são processados)
│   ├── 📄 index.html               ← HTML principal (aqui o app é inserido)
│   └── 📄 manifest.json            ← Configuração PWA (app no celular)
│
├── 📁 src/                         ← CÓDIGO PRINCIPAL (é aqui que você edita!)
│   │
│   ├── 📄 index.jsx                ← Ponto de entrada (carrega App)
│   ├── 📄 App.jsx                  ← Rotas principais e lógica geral
│   │
│   ├── 📁 pages/                   ← PÁGINAS DO APP (cada tela é um arquivo)
│   │   ├── Splash.jsx              ← Tela inicial com botões Entrar/Cadastro
│   │   ├── Login.jsx               ← Tela de login
│   │   ├── Cadastro.jsx            ← Cadastro em 2 passos
│   │   ├── Home.jsx                ← Dashboard principal após login
│   │   ├── Eventos.jsx             ← Listagem de eventos
│   │   ├── DetalheEvento.jsx       ← Detalhes e inscrição em evento
│   │   ├── Frequencia.jsx          ← Tela de frequência e avaliação
│   │   ├── CameraQR.jsx            ← Câmera para escanear QR Code
│   │   ├── ConfirmarPresenca.jsx   ← Confirmação de presença
│   │   ├── PresencaOk.jsx          ← Mensagem de sucesso pós-frequência
│   │   ├── Perfil.jsx              ← Dados e configurações do usuário
│   │   └── Admin.jsx               ← Painel administrativo
│   │
│   ├── 📁 services/                ← LÓGICA E INTEGRAÇÕES (Firebase, APIs)
│   │   ├── firebase.js             ← Configuração Firebase (Auth, Firestore, Storage)
│   │   ├── auth.js                 ← Funções de autenticação (login, cadastro)
│   │   ├── firestore.js            ← Operações com banco de dados
│   │   └── sheets.js               ← Integração Google Sheets (não implementado ainda)
│   │
│   ├── 📁 hooks/                   ← HOOKS CUSTOMIZADOS (lógica reutilizável)
│   │   └── useAuth.js              ← Hook de autenticação (acessa user em qualquer página)
│   │
│   ├── 📁 styles/                  ← ESTILOS CSS
│   │   ├── globals.css             ← Estilos globais (variáveis, tipografia, reset)
│   │   └── App.css                 ← Estilos dos componentes do app
│   │
│   └── 📁 components/              ← COMPONENTES REUTILIZÁVEIS (futura expansão)
│       └── (vazio por enquanto, adicione conforme necessário)
│
└── 📁 node_modules/                ← Dependências instaladas (NÃO EDITAR!)
```

---

## 📚 O que cada arquivo faz?

### 🔵 Páginas (Você verá isso na tela)
| Arquivo | O que é | Quando aparece |
|---------|--------|-----------------|
| `Splash.jsx` | Tela inicial com logo | Sem login |
| `Login.jsx` | Formulário de login | Clica em "Entrar" |
| `Cadastro.jsx` | Formulário de cadastro (2 passos) | Clica em "Cadastro" |
| `Home.jsx` | Dashboard principal | Após login com sucesso |
| `Eventos.jsx` | Lista de todos os eventos | Clica em "Eventos" na Home |
| `DetalheEvento.jsx` | Detalhes e inscrição | Clica em um evento |
| `Frequencia.jsx` | Lista de frequência e avaliação | Clica em "Frequência" |
| `CameraQR.jsx` | Abre câmera para QR | Clica em "Escanear QR Code" |
| `ConfirmarPresenca.jsx` | Confirma os dados | Após escanear QR |
| `PresencaOk.jsx` | Mensagem de sucesso | Após confirmar presença |
| `Perfil.jsx` | Dados e logout do usuário | Clica em "Perfil" |
| `Admin.jsx` | Painel para gerenciar eventos | Apenas para admins |

### 🔴 Serviços (Você NÃO vê, mas acontece nos bastidores)
| Arquivo | O que faz |
|---------|-----------|
| `firebase.js` | Conecta com Firebase (autenticação, banco de dados) |
| `auth.js` | Funções: cadastrar, login, logout, obter dados do usuário |
| `firestore.js` | Funções: criar evento, inscrever em evento, registrar frequência |

### 🟢 Estilos (Design e cores)
| Arquivo | O que tem |
|---------|-----------|
| `globals.css` | Cores, fontes, tema geral (branco/escuro) |
| `App.css` | Estilos dos botões, cards, formulários, navegação |

---

## 🎯 Fluxo de um Usuário

```
📱 Abre o app
    ↓
Splash.jsx (Splash screen com "Entrar" e "Cadastro")
    ├→ Clica "Entrar" → Login.jsx → Home.jsx
    └→ Clica "Cadastro" → Cadastro.jsx (passo 1 + 2) → Home.jsx
    
Home.jsx (Dashboard)
    ├→ Clica "Eventos" → Eventos.jsx → DetalheEvento.jsx → Home.jsx
    ├→ Clica "Frequência" → Frequencia.jsx → CameraQR.jsx → ConfirmarPresenca.jsx → PresencaOk.jsx
    └→ Clica "Perfil" → Perfil.jsx
```

---

## 🔌 Como os Arquivos se Comunicam

```
App.jsx (roteador central)
  ├─ Define rotas (URL → página)
  └─ Valida se usuário está logado
  
Login.jsx / Cadastro.jsx
  ├─ Formulários do usuário
  └─ Chama funções de auth.js
  
auth.js (service)
  ├─ loginUsuario() → firebase
  ├─ cadastroUsuario() → firebase
  └─ obterDadosUsuario() → firestore
  
firebase.js (config)
  └─ Credenciais Firebase (conecta tudo)
  
Home.jsx / Eventos.jsx
  ├─ Chama firestore.js para obter dados
  └─ Exibe na tela
```

---

## 🔑 Arquivos Importantes para Editar

### Se quer mudar as cores/design:
- `src/styles/globals.css` ← Veja as variáveis CSS no início
- `src/styles/App.css` ← Estilos dos componentes

### Se quer adicionar nova página:
1. Crie `src/pages/MinhaNovaPage.jsx`
2. Adicione a rota em `App.jsx`
3. Importe em `App.jsx`: `import MinhaNovaPage from './pages/MinhaNovaPage'`

### Se quer mudar funcionalidade Firebase:
- `src/services/firestore.js` ← Banco de dados
- `src/services/auth.js` ← Autenticação

---

## 📊 Fluxo de Dados

```
Firebase Console (credenciais)
    ↓
.env (variáveis de ambiente)
    ↓
firebase.js (configuração)
    ↓
auth.js & firestore.js (funções)
    ↓
Páginas (Home, Eventos, etc)
    ↓
User vê na tela
```

---

## ⚙️ Como Editar com Segurança

1. **Nunca** edite `node_modules/`
2. **Sempre** edite em `src/` ou adicione em `public/`
3. **Salve com Ctrl+S** (VSCode recarrega automaticamente)
4. **Se quebrar algo**, procure o erro em F12 > Console
5. **Em último caso**, deleta `node_modules`, refaz `npm install`

---

## 🚀 Próximas Etapas

Para completar o app:

1. ✅ Estrutura pronta
2. ✅ Pages prontas
3. ✅ Serviços prontos
4. ⏳ Implementar QR Code scanner (biblioteca `html5-qrcode`)
5. ⏳ Integrar Google Sheets API
6. ⏳ Adicionar notificações push
7. ⏳ Testes automatizados

---

**Qualquer dúvida, procure o arquivo mencionado aqui!** 😊
