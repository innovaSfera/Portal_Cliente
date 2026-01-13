# 🌍 Configuração de Ambientes

O Portal Cliente possui configurações diferentes para desenvolvimento e produção.

## 📁 Arquivos de Ambiente

### `.env.local` (Desenvolvimento Local)
- **Usado quando**: `npm run dev`
- **API**: `http://localhost:5101/api`
- **Ignorado pelo Git**: ✅ Sim (não é versionado)

### `.env.production` (Produção)
- **Usado quando**: `npm run build` ou `npm start`
- **API**: `https://instituto-barros-sistema.azurewebsites.net/api`
- **Versionado no Git**: ✅ Sim (pode ser versionado com valores de produção)

### `.env.example` (Exemplo/Template)
- **Usado para**: Documentação e referência
- **Versionado no Git**: ✅ Sim

## 🚀 Como Usar

### Desenvolvimento Local
1. Certifique-se de que o arquivo `.env.local` existe
2. Inicie a API local: `dotnet run` (em `instituto_barros_sistema`)
3. Inicie o Portal Cliente: `npm run dev`
4. Acesse: `http://localhost:3000`

### Produção
1. O arquivo `.env.production` já está configurado
2. Faça o build: `npm run build`
3. Execute: `npm start`
4. A aplicação usará a API de produção automaticamente

## ⚙️ Variáveis de Ambiente

| Variável | Descrição |
|----------|-----------|
| `NEXT_PUBLIC_API_URL` | URL base da API backend |
| `NEXT_PUBLIC_APP_NAME` | Nome da aplicação exibido no frontend |

## 📝 Notas Importantes

- **Prefixo `NEXT_PUBLIC_`**: Variáveis com este prefixo ficam disponíveis no browser
- **Mudanças de ambiente**: Reinicie o servidor Next.js após alterar arquivos `.env`
- **Prioridade**: `.env.local` > `.env.production` > `.env.example`
