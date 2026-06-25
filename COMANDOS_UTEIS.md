# 📟 Comandos Úteis do Terminal

Use esses comandos no **Terminal do VSCode** (Ctrl + `)

## 🚀 Iniciar o Projeto

```bash
# Instalar dependências (executar uma única vez)
npm install

# Rodar o servidor de desenvolvimento
npm start

# Rodar em porta diferente (se 3000 estiver ocupada)
PORT=3001 npm start
```

## 📦 Gerenciador de Pacotes

```bash
# Instalar uma novo pacote
npm install nome-do-pacote

# Instalar versão específica
npm install nome-do-pacote@1.2.3

# Remover um pacote
npm uninstall nome-do-pacote

# Listar todos os pacotes instalados
npm list
```

## 🔍 Verificação e Limpeza

```bash
# Verificar versão do Node
node --version

# Verificar versão do npm
npm --version

# Limpar cache do npm
npm cache clean --force

# Deletar dependências e reinstalar (quando tudo quebra)
rm -rf node_modules
rm package-lock.json
npm install
```

## 🏗️ Build e Deploy

```bash
# Criar build de produção
npm run build

# Testar o build localmente
npm run build
npx serve -s build

# Limpar o build anterior
rm -rf build
```

## 🧪 Testes (quando implementado)

```bash
# Rodar testes
npm test

# Rodar testes com cobertura
npm test -- --coverage
```

## 🛑 Parar o Servidor

```
Pressione Ctrl + C no terminal
```

## 💡 Dicas Úteis

### Navegar entre pastas
```bash
# Ver pasta atual
pwd

# Listar arquivos
ls

# Entrar em uma pasta
cd nome-da-pasta

# Voltar uma pasta
cd ..

# Ir para pasta do projeto (se estiver perdido)
cd ~/seu-usuario/caminho/stm-app-react
```

### Git (se usar versionamento)
```bash
# Ver status
git status

# Adicionar arquivo para commit
git add .

# Fazer commit
git commit -m "sua mensagem aqui"

# Fazer push para repositório remoto
git push origin main
```

## 🆘 Se o Terminal Ficar "Travado"

1. Pressione **Ctrl + C** (para tudo)
2. Digite `clear` (para limpar)
3. Tente novamente

---

**Boa sorte! 🚀**
