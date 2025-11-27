# Boa Bola TV

Aplicativo dedicado para armazenar e distribuir conteúdos gerados no canal Boa Bola TV. Uma Single Page Application (SPA) desenvolvida em React + TypeScript utilizando Vite e Material UI (MUI).

## 🚀 Funcionalidades

### Principais
- **Biblioteca de Vídeos**: Lista paginada com busca, filtros por categoria e tags
- **Transmissões ao Vivo**: Exibição de conteúdo ao vivo do YouTube
- **Estatísticas de Partidas**: Sistema completo para registro e acompanhamento de estatísticas de tênis
- **Área de Assinantes**: Dashboard exclusivo com gráficos e dados avançados
- **Painel Administrativo**: Gerenciamento de usuários e configurações

### Recursos Técnicos
- 🎨 Tema claro/escuro responsivo
- 🌐 Internacionalização (pt-BR)
- �� Autenticação e autorização por perfis
- 📊 Gráficos interativos com Recharts
- 🎬 Player YouTube reutilizável

## 📋 Perfis de Usuário

| Perfil | Acesso |
|--------|--------|
| VISITOR | Vídeos e Transmissões |
| USER | Vídeos e Transmissões |
| PRESENTER | + Estatísticas |
| SUBSCRIBER | + Área de Assinantes |
| ADMIN | Acesso completo |

## 🛠️ Tecnologias

- **Framework**: React 19, TypeScript, Vite
- **UI**: Material UI (MUI v7)
- **Roteamento**: React Router v7
- **Estado**: Zustand
- **Data Fetching**: TanStack React Query
- **Gráficos**: Recharts
- **i18n**: react-i18next
- **Testes**: Vitest + React Testing Library
- **Qualidade**: ESLint + Prettier + TypeScript strict

## 🏗️ Arquitetura

\`\`\`
src/
├── components/        # Componentes reutilizáveis
│   ├── common/       # Componentes genéricos
│   └── layout/       # Layouts da aplicação
├── features/         # Feature folders
│   ├── admin/        # Painel administrativo
│   ├── auth/         # Autenticação
│   ├── player/       # Player YouTube
│   ├── stats/        # Estatísticas de partidas
│   ├── subscribers/  # Área de assinantes
│   └── video-library/# Biblioteca de vídeos
├── hooks/            # Custom hooks
├── i18n/             # Internacionalização
├── routes/           # Configuração de rotas
├── services/         # Serviços e APIs
│   └── mock/         # Dados mockados
├── store/            # Estado global (Zustand)
├── theme/            # Configuração de tema
├── types/            # Tipos TypeScript
└── utils/            # Utilitários
\`\`\`

## 🚀 Começando

### Pré-requisitos

- Node.js 18+
- npm ou yarn

### Instalação

\`\`\`bash
# Clone o repositório
git clone https://github.com/fabiobo2005/boabolatv.git
cd boabolatv

# Instale as dependências
npm install

# Execute em modo de desenvolvimento
npm run dev
\`\`\`

### Scripts Disponíveis

\`\`\`bash
npm run dev      # Servidor de desenvolvimento
npm run build    # Build de produção
npm run preview  # Preview do build
npm run lint     # Verificação de código
npm run test     # Executar testes
npm run format   # Formatar código
\`\`\`

## 🔐 Credenciais de Teste

| E-mail | Senha | Perfil |
|--------|-------|--------|
| admin@boabolatv.com | admin123 | ADMIN |
| presenter@boabolatv.com | presenter123 | PRESENTER |
| subscriber@boabolatv.com | subscriber123 | SUBSCRIBER |
| user@boabolatv.com | user123 | USER |

## 📍 Rotas

- \`/login\` - Página de login (pública)
- \`/videos\` - Biblioteca de vídeos (pública)
- \`/live\` - Transmissões ao vivo (pública)
- \`/stats\` - Estatísticas (PRESENTER, ADMIN)
- \`/subscriber\` - Área de assinantes (SUBSCRIBER, ADMIN)
- \`/admin\` - Administração (ADMIN)

## 🔌 Pontos de Extensão

### Integração com APIs
O projeto está preparado para integração com backends através de:
- Services layer em \`src/services/\`
- React Query para cache e sincronização
- Mock data que pode ser substituída por chamadas reais

### Novos Idiomas
Adicione novos arquivos em \`src/i18n/locales/\` seguindo o padrão do \`pt-BR.json\`

### Novos Esportes
Tipos e estruturas em \`src/types/stats.ts\` suportam expansão para outros esportes de raquete

## 📄 Licença

Este projeto está sob a licença MIT.
