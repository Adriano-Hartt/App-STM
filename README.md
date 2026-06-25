# STM App - Sistema de Treinamento e Monitoramento da JMU

Aplicativo mobile-first para gerenciamento de treinamentos, eventos e frequência na Secretaria do Superior Tribunal Militar (STM).

## 📱 Características

- ✅ Cadastro e autenticação de usuários
- 📅 Listagem e inscrição em eventos
- 📷 Confirmação de frequência via QR Code
- 📝 Avaliação de reação pós-evento
- 📊 Integração com Google Sheets para registros
- 👑 Painel administrativo para gerenciamento
- 📱 PWA instalável como app no celular

## 🚀 Instalação e Setup

### Pré-requisitos

- Node.js 16+ instalado
- npm ou yarn
- Conta Firebase (criar em https://firebase.google.com)
- Conta Google Cloud com Sheets API ativada

### 1. Clonar o repositório

```bash
git clone <seu-repositorio>
cd stm-app-react
```

### 2. Instalar dependências

```bash
npm install
```

### 3. Configurar Firebase

1. Vá para [Firebase Console](https://console.firebase.google.com)
2. Crie um novo projeto chamado "STM-App"
3. Ative os seguintes serviços:
   - **Authentication** (Email/Password)
   - **Firestore Database** (Modo produção)
   - **Storage**
4. Copie as credenciais do projeto

### 4. Criar arquivo .env

Copie o arquivo `.env.example` para `.env` e preencha com suas credenciais:

```bash
cp .env.example .env
```

**Arquivo `.env`:**
```
REACT_APP_FIREBASE_API_KEY=sua_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=seu_auth_domain.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=seu_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=seu_storage_bucket.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=seu_sender_id
REACT_APP_FIREBASE_APP_ID=seu_app_id
REACT_APP_GOOGLE_SHEETS_API_KEY=sua_google_sheets_api_key
REACT_APP_GOOGLE_FORMS_ID=seu_google_forms_id
```

### 5. Configurar Firestore (regras de segurança)

No console Firebase, vá para **Firestore > Regras** e configure:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Usuários
    match /usuarios/{userId} {
      allow read, write: if request.auth.uid == userId;
      allow read: if request.auth != null && get(/databases/$(database)/documents/usuarios/$(request.auth.uid)).data.isAdmin == true;
    }

    // Eventos
    match /eventos/{eventoId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && get(/databases/$(database)/documents/usuarios/$(request.auth.uid)).data.isAdmin == true;
    }

    // Frequência
    match /frequencia/{docId} {
      allow create: if request.auth != null;
      allow read: if request.auth != null && get(/databases/$(database)/documents/usuarios/$(request.auth.uid)).data.isAdmin == true;
    }
  }
}
```

### 6. Rodar em desenvolvimento

```bash
npm start
```

O app abrirá em `http://localhost:3000`

## 📁 Estrutura do Projeto

```
stm-app-react/
├── public/
│   ├── index.html
│   └── manifest.json (PWA)
├── src/
│   ├── pages/
│   │   ├── Splash.jsx
│   │   ├── Login.jsx
│   │   ├── Cadastro.jsx
│   │   ├── Home.jsx
│   │   ├── Eventos.jsx
│   │   ├── DetalheEvento.jsx
│   │   ├── Frequencia.jsx
│   │   ├── CameraQR.jsx
│   │   ├── ConfirmarPresenca.jsx
│   │   ├── PresencaOk.jsx
│   │   ├── Perfil.jsx
│   │   └── Admin.jsx
│   ├── services/
│   │   ├── firebase.js (config Firebase)
│   │   ├── auth.js (autenticação)
│   │   ├── firestore.js (operações Firestore)
│   │   └── sheets.js (integração Google Sheets)
│   ├── hooks/
│   │   └── useAuth.js (hook de auth)
│   ├── styles/
│   │   ├── globals.css
│   │   └── App.css
│   ├── App.jsx (rotas)
│   └── index.jsx
├── .env.example
├── package.json
└── README.md
```

## 🗄️ Estrutura do Firestore

### Coleção: `usuarios`
```json
{
  "uid": "user-id",
  "nome": "João Silva",
  "email": "joao@example.com",
  "cpf": "123.456.789-00",
  "matricula": "STM-00124",
  "ligacaoJMU": "Servidor civil",
  "lotacao": "DGP",
  "isAdmin": false,
  "dataCadastro": "2024-06-12",
  "eventosInscritos": ["evento-id-1", "evento-id-2"]
}
```

### Coleção: `eventos`
```json
{
  "titulo": "Gestão de Pessoas",
  "descricao": "Capacitação para servidores",
  "tipo": "Capacitação presencial",
  "data": "2024-06-15",
  "horarioInicio": "09:00",
  "horarioFim": "12:00",
  "local": "Auditório A",
  "cargaHoraria": 3,
  "inscritos": ["user-id-1", "user-id-2"],
  "inscritosCount": 24,
  "capacidade": 40,
  "dataCriacao": "2024-06-12"
}
```

### Coleção: `frequencia`
```json
{
  "usuarioId": "user-id",
  "eventoId": "evento-id",
  "nome": "João Silva",
  "matricula": "STM-00124",
  "lotacao": "DGP",
  "dataHora": "2024-06-15T09:02:00",
  "qrCodeData": "qr-code-string"
}
```

## 🔌 Integração Google Sheets

Para salvar frequência no Google Sheets, você precisa:

1. Criar uma Google Apps Script que receba dados HTTP
2. Configurar a URL da script como webhook
3. Adicionar um backend Node.js que chame a Sheets API (opcional mas recomendado)

### Exemplo com Google Apps Script:

```javascript
function doPost(e) {
  const sheet = SpreadsheetApp.getActiveSheet();
  const data = JSON.parse(e.postData.contents);
  
  sheet.appendRow([
    data.nome,
    data.matricula,
    data.evento,
    data.dataHora
  ]);
  
  return ContentService.createTextOutput(JSON.stringify({success: true}))
    .setMimeType(ContentService.MimeType.JSON);
}
```

## 📱 Instalar como App no Celular

1. Abra o app no navegador do celular
2. Menu > "Adicionar à tela inicial" (Android) ou "Compartilhar > Adicionar à tela inicial" (iOS)
3. Abra como app nativo (sem URL bar)

## 🔐 Autenticação

O app usa Firebase Authentication com email/senha. Os dados do usuário são salvos no Firestore.

### Fluxo de Login:
1. Usuário faz login com email/senha
2. Firebase autentica e retorna token
3. App busca dados completos do Firestore
4. Usuário redirecionado para Home

### Fluxo de Cadastro:
1. Usuário preenche dados pessoais (Passo 1)
2. Completa vínculo institucional (Passo 2)
3. Dados salvos em `usuarios` do Firestore
4. Usuário automaticamente logado

## 🎯 Próximos Passos para Completar

1. **Integração QR Code**: Implementar bibliotec a `jsQR` ou `html5-qrcode` para ler QR Codes da câmera
2. **Google Forms API**: Pré-preencher formulário de avaliação
3. **Notificações Push**: Alertas para eventos próximos
4. **Backend**: Node.js + Express para validar e enviar ao Google Sheets
5. **Testes**: Jest + React Testing Library
6. **Deploy**: Firebase Hosting para produção

## 📝 Notas de Desenvolvimento

- Todas as páginas estão estruturadas e prontas para integração completa
- Os serviços Firebase estão configurados e apenas aguardam credenciais
- O design é 100% responsivo para mobile
- PWA está configurado no manifest.json

## 🤝 Suporte

Para dúvidas sobre a arquitetura ou integração, verifique:
- [Firebase Documentation](https://firebase.google.com/docs)
- [React Router v6](https://reactrouter.com/)
- [Google Sheets API](https://developers.google.com/sheets/api)

---

**Desenvolvido com ❤️ para o STM**
