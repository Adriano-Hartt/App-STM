# 🛠️ Guia Completo: Rodando o STM App no seu Notebook

## Passo 1: Preparar seu ambiente

### Windows
1. Baixe Node.js (v18+) em https://nodejs.org
2. Instale normalmente (deixe as opções padrão)
3. Abra um **Command Prompt** (cmd) ou **PowerShell** como administrador
4. Teste a instalação:
```bash
node --version
npm --version
```

### Mac
```bash
# Instale via Homebrew (se não tem, instale primeiro)
brew install node
```

### Linux
```bash
sudo apt-get update
sudo apt-get install nodejs npm
```

---

## Passo 2: Clonar/Baixar o Projeto

### Opção A: Git (recomendado)
```bash
git clone <sua-url-do-repositorio>
cd stm-app-react
```

### Opção B: Arquivo .zip
1. Baixe o arquivo `stm-app-react.zip`
2. Descompacte em uma pasta
3. Abra a pasta no Terminal/CMD

---

## Passo 3: Abrir no VSCode

1. Abra **Visual Studio Code**
2. **Arquivo** > **Abrir Pasta**
3. Selecione a pasta `stm-app-react`
4. Aguarde a pasta carregar completamente

### ✅ Você deve ver:
- Pasta `src/` com todos os componentes
- Pasta `public/` com HTML
- Arquivo `package.json`
- Arquivo `.env.example`

---

## Passo 4: Configurar Credenciais Firebase

### A. Criar um projeto no Firebase

1. Acesse https://console.firebase.google.com
2. Clique em **"Adicionar projeto"**
3. Coloque nome: `stm-app`
4. Deixe as opções padrão e crie

### B. Ativar Autenticação

1. Na sidebar esquerda, vá em **"Build"** > **"Authentication"**
2. Clique em **"Começar"**
3. Clique no Provider **"Email/Password"**
4. Ative e salve

### C. Criar Firestore Database

1. **"Build"** > **"Firestore Database"**
2. Clique **"Criar banco de dados"**
3. **Modo: Produção**
4. **Localização: us-central1** (ou próxima ao Brasil)
5. **Criar**

### D. Copiar credenciais

1. Clique no ícone de **engrenagem** (configurações)
2. **"Configurações do projeto"**
3. Desça até **"Aplicativos do Firebase"**
4. Clique em **ícone do navegador `</>`**
5. **Registre o app** (pode deixar nome padrão)
6. Copie o objeto `firebaseConfig`:

```javascript
const firebaseConfig = {
  apiKey: "AIZA...",
  authDomain: "seu-projeto.firebaseapp.com",
  projectId: "seu-projeto",
  storageBucket: "seu-projeto.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcd1234"
};
```

### E. Criar arquivo .env

1. Na **raiz do projeto** (mesma pasta do `package.json`)
2. Crie um arquivo chamado `.env` (não `.env.example`)
3. Cole e preencha:

```
REACT_APP_FIREBASE_API_KEY=AIZA...
REACT_APP_FIREBASE_AUTH_DOMAIN=seu-projeto.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=seu-projeto
REACT_APP_FIREBASE_STORAGE_BUCKET=seu-projeto.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=123456789
REACT_APP_FIREBASE_APP_ID=1:123456789:web:abcd1234

REACT_APP_GOOGLE_SHEETS_API_KEY=sua_chave_aqui
REACT_APP_GOOGLE_FORMS_ID=seu_id_aqui
```

---

## Passo 5: Instalar Dependências

**No VSCode:**
1. Abra o **Terminal** (Ctrl + `)
2. Copie e cole:

```bash
npm install
```

Aguarde completar (2-5 minutos, dependendo da internet).

### ✅ Se vir "added XXX packages", está OK!

---

## Passo 6: Rodar o App

**No Terminal do VSCode:**
```bash
npm start
```

### ✅ Deve aparecer:
```
Compiled successfully!
Local: http://localhost:3000
```

### Seu navegador abre automaticamente com o app!

---

## 🎯 Testando o App

### Tela Inicial
- Clique em **"Entrar"** ou **"Cadastro"**

### Cadastro de Teste
1. Crie uma conta com:
   - Email: `teste@email.com`
   - Senha: `Senha123`
   - Nome: `Teste Silva`
   - CPF: `123.456.789-00`
   - Ligação JMU: `Servidor civil`
   - Lotação: `DGP`

2. Você será redirigido para **Home**

### Explorar Features
- **Eventos**: Veja lista e detalhe
- **Frequência**: Simulação de QR Code
- **Perfil**: Seus dados
- **Admin**: Apenas se for admin

---

## 🔧 Troubleshooting

### ❌ Erro: "npm: command not found"
**Solução**: Reinstale Node.js, depois reinicie o VSCode

### ❌ "Cannot find module"
**Solução**: Delete `node_modules` e `package-lock.json`, depois rode:
```bash
npm install
```

### ❌ Porta 3000 já em uso
**Solução**: Mude a porta:
```bash
PORT=3001 npm start
```

### ❌ Firebase credenciais inválidas
**Solução**: Verifique se copiou corretamente no arquivo `.env`

### ❌ App abre com branco
**Solução**: Abra o Console (F12) e veja os erros. Geralmente é .env não configurado.

---

## 📱 Editar Código

### Arquivo importante para editar primeiro:
- **`src/services/firebase.js`** - Configuração Firebase
- **`src/pages/Home.jsx`** - Página inicial do app

### Padrão de edição:
1. Edite o arquivo
2. **Salve** (Ctrl + S)
3. **Navegador recarrega automaticamente** (Hot Reload)

---

## 🚀 Build para Produção

Quando quiser deployar:

```bash
npm run build
```

Cria pasta `build/` com os arquivos prontos para upload.

---

## 📚 Recursos Úteis

- **React Docs**: https://react.dev
- **Firebase Docs**: https://firebase.google.com/docs
- **React Router**: https://reactrouter.com/

---

## ✅ Checklist de Primeiro Setup

- [ ] Node.js instalado (`node --version`)
- [ ] VSCode aberto com a pasta do projeto
- [ ] Arquivo `.env` criado com credenciais Firebase
- [ ] `npm install` completou sem erros
- [ ] `npm start` funcionando (app abriu no navegador)
- [ ] Consegui fazer cadastro de teste
- [ ] Consegui navegar entre abas do app

Se completou tudo ✅, **seu setup está 100% pronto!**

---

## 🆘 Problema Persistente?

1. **Feche tudo** (VSCode, navegador, terminal)
2. **Abra de novo**
3. **Execute novamente**:
```bash
npm install
npm start
```

Geralmente funciona! 😊

---

**Qualquer dúvida, documente o erro exato e procure a solução aqui!**
