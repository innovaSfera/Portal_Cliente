# 🏥 Portal Cliente - Instituto Barros

Portal web para clientes do Instituto Barros com funcionalidades de agendamento via WhatsApp, gestão de perfil e visualização de histórico de atendimentos.

![Next.js](https://img.shields.io/badge/Next.js-15.4.5-black)
![React](https://img.shields.io/badge/React-19.0.0-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4.16-38bdf8)

## 📋 Índice

- [Sobre o Projeto](#sobre-o-projeto)
- [Funcionalidades](#funcionalidades)
- [Tecnologias](#tecnologias)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Instalação](#instalação)
- [Deploy na Vercel](#deploy-na-vercel)
- [Módulos](#módulos)
- [Configurações](#configurações)

## 🎯 Sobre o Projeto

O Portal Cliente do Instituto Barros é uma aplicação web moderna e responsiva desenvolvida para facilitar o agendamento de consultas e serviços, permitindo que os clientes:

- Façam login de forma segura
- Agendem consultas diretamente via WhatsApp
- Visualizem seu calendário de atendimentos
- Gerenciem suas informações de perfil
- Acessem histórico de atendimentos

## ✨ Funcionalidades

### 🔐 Autenticação
- Sistema de login frontend com validação
- Proteção de rotas com middleware
- Persistência de sessão (localStorage + cookies)
- Redirecionamento automático para áreas autenticadas

### 📅 Agenda
- **Visualizações múltiplas**: Mês, Semana e Dia
- **Navegação intuitiva**: Anterior/Próximo/Hoje
- **Gestão de eventos**: Criar, editar e excluir compromissos
- **Integração WhatsApp**: Botão FAB para agendamento rápido
- **Campos personalizados**: Serviço, data/hora, descrição e telefone

### 📱 WhatsApp Integration
- Modal de agendamento dedicado
- Seletor de serviços (Consulta, Exame, Retorno, Avaliação, Terapia)
- Formatação automática de mensagem com emojis
- Suporte para números brasileiros (+55)
- Abertura direta no WhatsApp Web ou App

### 👤 Perfil
- Visualização de dados do usuário
- Configurações de conta
- Logout seguro

### 🎨 Interface
- Design responsivo (mobile-first)
- Tema escuro/claro
- Cores personalizadas: #18194d (primário)
- Logo Instituto Barros
- Menu lateral colapsável
- Breadcrumbs de navegação

## 🚀 Tecnologias

### Core
- **Next.js 15.4.5** - Framework React com App Router
- **React 19.0.0** - Biblioteca UI
- **TypeScript 5** - Tipagem estática
- **Tailwind CSS 3.4.16** - Estilização utilitária

### Bibliotecas
- **ApexCharts** - Gráficos (opcional)
- **React Hook Form** - Validação de formulários
- **Swiper** - Carrosséis
- **jsvectormap** - Mapas vetoriais

### Ferramentas
- **ESLint** - Linting
- **PostCSS** - Processamento CSS
- **npm** - Gerenciador de pacotes

## 📁 Estrutura do Projeto

```
Portal_Cliente/
├── public/
│   └── images/
│       ├── brand/              # Logos e marca
│       │   └── instituto-barros-logo-cinza.png
│       └── user/               # Avatares
├── src/
│   ├── app/                    # Rotas (App Router)
│   │   ├── (home)/            # Página inicial (histórico)
│   │   ├── auth/
│   │   │   └── sign-in/       # Página de login
│   │   ├── calendar/          # Módulo de agenda
│   │   ├── pages/
│   │   │   └── settings/      # Configurações de perfil
│   │   ├── profile/           # Perfil do usuário
│   │   ├── layout.tsx         # Layout raiz
│   │   ├── layout-content.tsx # Layout condicional
│   │   └── providers.tsx      # Context providers
│   ├── components/
│   │   ├── Auth/              # Componentes de autenticação
│   │   │   ├── Signin/        # Formulário de login
│   │   │   └── SigninWithPassword.tsx
│   │   ├── Breadcrumbs/       # Navegação breadcrumb
│   │   │   └── Breadcrumb.tsx
│   │   ├── CalenderBox/       # Componente de calendário
│   │   │   └── index.tsx
│   │   ├── FormElements/      # Inputs e formulários
│   │   │   ├── InputGroup/
│   │   │   ├── DatePicker/
│   │   │   └── ...
│   │   ├── Layouts/           # Estrutura da aplicação
│   │   │   ├── header/        # Cabeçalho
│   │   │   └── sidebar/       # Menu lateral
│   │   ├── MenuMobile/        # Menu mobile (oculto)
│   │   ├── Tables/            # Componentes de tabelas
│   │   ├── ui/                # Componentes UI base
│   │   └── ui-elements/       # Elementos customizados
│   ├── contexts/
│   │   └── auth-context.tsx   # Context de autenticação
│   ├── css/
│   │   ├── satoshi.css        # Fonte Satoshi
│   │   └── style.css          # Estilos globais
│   ├── hooks/                 # Custom hooks
│   │   ├── use-click-outside.ts
│   │   └── use-mobile.ts
│   ├── lib/                   # Utilitários
│   │   └── utils.ts
│   ├── middleware.ts          # Proteção de rotas
│   └── types/                 # Tipos TypeScript
├── .eslintrc.json
├── .gitignore
├── next.config.mjs
├── package.json
├── postcss.config.js
├── tailwind.config.ts
├── tsconfig.json
└── README.md
```

## 🛠️ Instalação

### Pré-requisitos
- Node.js 18+ 
- npm ou yarn

### Passos

1. **Clone o repositório**
```bash
git clone https://github.com/innovaSfera/Portal_Cliente.git
cd Portal_Cliente
```

2. **Instale as dependências**
```bash
npm install
```

3. **Execute em desenvolvimento**
```bash
npm run dev
```

4. **Acesse no navegador**
```
http://localhost:3000
```

## 🌐 Deploy na Vercel

### Deploy Automático (Recomendado)

1. Acesse [vercel.com](https://vercel.com)
2. Clique em "Add New" → "Project"
3. Importe o repositório `innovaSfera/Portal_Cliente`
4. Configure as variáveis de ambiente (se necessário)
5. Clique em "Deploy"

### Deploy via CLI

```bash
npm install -g vercel
vercel login
vercel
```

### Variáveis de Ambiente (Opcional)

Crie um arquivo `.env.local`:

```env
NEXT_PUBLIC_APP_URL=https://seu-dominio.vercel.app
```

## 📦 Módulos

### 1. Autenticação (`src/contexts/auth-context.tsx`)

**Responsabilidade**: Gerenciar estado de autenticação

**Funcionalidades**:
- `login(email, password)` - Autentica usuário
- `logout()` - Desconecta usuário
- `isAuthenticated` - Estado de autenticação
- `user` - Dados do usuário logado

**Comportamento**:
- Credenciais fixas: `admin@admin.com` / `admin123`
- Salva token em localStorage e cookie
- Redireciona para `/calendar` após login
- Limpa sessão no logout

**Uso**:
```tsx
import { useAuth } from '@/contexts/auth-context';

const { login, logout, isAuthenticated, user } = useAuth();
```

### 2. Middleware (`src/middleware.ts`)

**Responsabilidade**: Proteção de rotas

**Comportamento**:
- Verifica cookie `auth-token`
- Redireciona não autenticados para `/auth/sign-in`
- Redireciona autenticados de `/auth/*` para `/calendar`
- Permite acesso livre a assets (`/_next`, `/images`, etc.)

**Rotas Protegidas**:
- `/` (Home/Histórico)
- `/calendar` (Agenda)
- `/profile` (Perfil)
- `/pages/settings` (Configurações)

### 3. Calendário (`src/components/CalenderBox/index.tsx`)

**Responsabilidade**: Gerenciamento de agenda

**Estados**:
- `viewMode`: "month" | "week" | "day"
- `currentDate`: Data atual visualizada
- `events`: Array de eventos
- `modalOpen`: Modal de evento aberto
- `whatsappModalOpen`: Modal WhatsApp aberto

**Funcionalidades**:
- **Navegação**: `navigatePrev()`, `navigateNext()`, `goToToday()`
- **Eventos**: `handleSave()`, `handleEdit()`, `handleDelete()`
- **WhatsApp**: `handleWhatsAppSend()`, `handleWhatsAppClick()`

**Interface Event**:
```tsx
interface Event {
  id: number;
  date: Date;
  title: string;
  description?: string;
  phone?: string;
}
```

**Visualizações**:
- **Mês**: Grade 7x6 com dias do mês
- **Semana**: 7 dias da semana atual
- **Dia**: Detalhes do dia selecionado

### 4. Login (`src/app/auth/sign-in/page.tsx`)

**Responsabilidade**: Interface de autenticação

**Componentes**:
- Logo Instituto Barros
- Formulário email/senha
- Validação de campos
- Feedback de erro

**Comportamento**:
- Oculta sidebar e header
- Layout centralizado
- Redirecionamento após sucesso

### 5. Layout Condicional (`src/app/layout-content.tsx`)

**Responsabilidade**: Renderização condicional de UI

**Lógica**:
```tsx
if (pathname.startsWith('/auth')) {
  // Sem sidebar/header
  return <main>{children}</main>
} else {
  // Com sidebar/header
  return <DefaultLayout>{children}</DefaultLayout>
}
```

### 6. Breadcrumb (`src/components/Breadcrumbs/Breadcrumb.tsx`)

**Responsabilidade**: Navegação e ação contextual

**Props**:
- `pageName`: string - Nome da página
- `onButtonClick?`: () => void - Callback do botão FAB

**Comportamento**:
- Exibe título da página
- Botão circular "+" quando `onButtonClick` está presente
- Cor primária do sistema (#18194d)

### 7. Menu Lateral (`src/components/Layouts/sidebar/data/index.ts`)

**Estrutura**:
```tsx
NAV_DATA = [
  {
    label: "MAIN MENU",
    items: [
      { title: "Perfil", url: "/pages/settings", icon: User },
      { title: "Agenda", url: "/calendar", icon: Calendar },
      { title: "Histórico", url: "/", icon: HomeIcon }
    ]
  }
]
```

**Comportamento**:
- Colapsável em desktop
- Oculto em mobile
- Indicador visual de página ativa

### 8. Header (`src/components/Layouts/header/index.tsx`)

**Componentes**:
- Botão de toggle do sidebar
- Informações do usuário
- Botão de logout

**Responsividade**:
- Mobile: Apenas toggle
- Desktop: Toggle + user info

## ⚙️ Configurações

### Cores (tailwind.config.ts)

```typescript
colors: {
  primary: "#18194d",  // Azul Instituto Barros
  // ... outras cores
}
```

### Fonte

**Satoshi** - fonte personalizada em `src/css/satoshi.css`

### Next.js (next.config.mjs)

```javascript
const nextConfig = {
  images: {
    domains: ["localhost"],
  },
};
```

## 🔒 Segurança

⚠️ **Importante**: Este projeto usa autenticação **frontend-only** para demonstração.

**Para produção, implemente**:
- Backend com API REST/GraphQL
- Tokens JWT com refresh
- Validação server-side
- HTTPS obrigatório
- Rate limiting
- Sanitização de inputs

## 📝 Scripts

```bash
npm run dev      # Desenvolvimento (localhost:3000)
npm run build    # Build de produção
npm run start    # Servidor de produção
npm run lint     # Verificar código
```

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -m 'feat: adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

## 📄 Licença

Este projeto é propriedade do Instituto Barros.

## 👥 Autores

- **innovaSfera** - Desenvolvimento
- **Instituto Barros** - Cliente

## 📞 Suporte

Para suporte, entre em contato com o Instituto Barros.

---

**Versão**: 1.0.0  
**Última atualização**: Janeiro 2026
