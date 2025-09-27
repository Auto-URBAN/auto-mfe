# 🚗 Auto URBAN - Contexto de Desenvolvimento

## 📋 Regras de Arquitetura e Desenvolvimento

### 🏗️ **Estrutura de Código**

- **Funções sempre separadas**: Cada função deve ter responsabilidade única e ser bem isolada
- **Componentes Vue (.vue)**: Evitar uso excessivo de composables internas
- **Composables externas**: Usar apenas quando necessário para compartilhar contexto entre componentes
- **Sem arquivos .js**: Todo código JavaScript deve estar em .ts ou dentro de componentes .vue
- **Sem arquivos .css**: Todo estilo deve usar Tailwind CSS v4
- **TypeScript obrigatório**: Tipagem forte em todo o código
- **Zod obrigatório**: Todos os tipos TypeScript devem ser convertidos para schemas Zod para validação futura

### 🎨 **Estilização**

- **Tailwind v4**: Usar apenas Tailwind para estilização
- **Classes utilitárias**: Preferir classes Tailwind a CSS customizado
- **Mobile-first**: Design responsivo começando pelo mobile
- **Touch targets**: Mínimo 44px para elementos tocáveis
- **Consistência visual**: Seguir design system baseado no Nuxt UI

### 🧩 **Estrutura de Componentes**

```
components/
├── ui/              # Componentes base reutilizáveis
├── forms/           # Formulários específicos
├── layout/          # Componentes de layout (Header, Footer)
└── features/        # Componentes específicos por feature
```

### 📁 **Estrutura de Pastas**

```
/
├── assets/          # Assets estáticos
├── components/      # Componentes Vue
├── composables/     # Lógica compartilhada
├── layouts/         # Layouts do Nuxt
├── lib/            # Utilitários e helpers
├── pages/          # Páginas/rotas
├── plugins/        # Plugins do Nuxt
├── public/         # Arquivos públicos
├── schemas/        # Schemas Zod para validação
├── server/         # API Nitro
├── stores/         # Pinia stores
└── utils/          # Funções utilitárias
```

## 🎯 MVP - Plataforma de Carros Exclusivos

### 📱 **Características Principais**

- **PWA mobile-first** com Service Worker
- **Marketplace** inspirado na Webmotors com melhorias UX
- **Sistema completo**: busca, detalhes, publicação, administração
- **Cache offline** com IndexedDB
- **Autenticação** telefone + OTP (mock)

### 🔧 **Stack Técnica**

- **Framework**: Nuxt 3 + Vue 3 + TypeScript
- **Estado**: Pinia stores
- **UI**: Nuxt UI + Tailwind v4
- **PWA**: @vite-pwa/nuxt com Workbox
- **Validação**: Zod schemas
- **Cache**: IndexedDB + Service Worker
- **Comunicação**: BroadcastChannel

### 🗂️ **Stores Pinia**

```typescript
stores/
├── auth.ts          # Autenticação e usuário
├── vehicles.ts      # Veículos e buscas
├── admin.ts         # Dashboard administrativo
└── ui.ts           # Estado da UI (modals, loading)
```

### 📄 **Páginas do MVP**

```
/                    # Home - catálogo com filtros
/vehicle/[id]        # Detalhes do veículo
/sell               # Publicar veículo (wizard 3 passos)
/account            # Meus anúncios (vendedor)
/auth/login         # Login telefone + OTP
/auth/register      # Cadastro
/admin              # Dashboard (big numbers)
/admin/vehicles     # Moderação por status
/admin/users        # Lista usuários
```

### 🔗 **API Contracts (Mock)**

```typescript
// Auth
POST /auth/register     { phone } → { userId }
POST /auth/login        { phone } → { otpSent: true }
POST /auth/verify-otp   { phone, code } → { accessToken, refreshToken, user }
POST /auth/refresh      { refreshToken } → { accessToken }

// Vehicles
GET  /vehicles/search   ?q&make&uf&priceMin&priceMax&yearMin&yearMax&kmMax&page
GET  /vehicles/{id}     → VehicleDetail
POST /vehicles          → { id, status: "PENDING" }
GET  /me/vehicles       → VehicleSummary[]

// Admin
GET  /admin/metrics     → { totals, byBrand, byUF }
GET  /admin/vehicles    ?status=PENDING|APPROVED|REJECTED
POST /admin/vehicles/{id}/approve
POST /admin/vehicles/{id}/reject { reason }
```

### 📊 **Tipos TypeScript Base**

```typescript
type VehicleStatus = 'PENDING' | 'APPROVED' | 'REJECTED'

interface VehicleSummary {
	id: string
	title: string // "Marca Modelo Ano"
	brand: string
	model: string
	year: number
	price: number
	km: number
	city: string
	uf: string
	coverImageUrl: string
	status: VehicleStatus
}

interface VehicleDetail extends VehicleSummary {
	description?: string
	gearbox?: 'MANUAL' | 'AUTO'
	fuel?: 'GASOLINA' | 'ALCOOL' | 'DIESEL' | 'HIBRIDO' | 'ELETRICO'
	color?: string
	images: string[]
	seller: { id: string; phone: string; whatsapp: string }
}

interface User {
	id: string
	phone: string
	role: 'USER' | 'ADMIN'
}
```

## 🚀 Plano de Execução por Fases

### **Fase 0 - Base Técnica** ✅

- [x] Setup Nuxt 3 + PWA + Pinia + Tailwind v4
- [x] Estrutura de pastas e configurações
- [ ] Stores Pinia básicos
- [ ] Lib para API e IndexedDB
- [ ] Service Worker com cache strategies

### **Fase 1 - Catálogo & Marketplace**

- [ ] Home: grid de veículos + filtros
- [ ] VehicleCard component
- [ ] SearchFilters com chips
- [ ] Página de detalhes redesenhada
- [ ] Cache SWR + IndexedDB

### **Fase 2 - Autenticação & Publicação**

- [ ] Sistema auth (login/register)
- [ ] Wizard publicação (3 passos)
- [ ] Upload de imagens
- [ ] Área do usuário (/account)

### **Fase 3 - Administração**

- [ ] Dashboard admin com métricas
- [ ] Sistema de moderação
- [ ] Controle de usuários

### **Fase 4 - PWA & Polimentos**

- [ ] Offline capabilities
- [ ] Performance otimizations
- [ ] A11y compliance
- [ ] Documentação final

## 🛠️ **Comandos de Desenvolvimento**

```bash
# Desenvolvimento
pnpm dev

# Build
pnpm build

# Preview
pnpm preview

# Dependências principais já instaladas
# - nuxt@^3.16.0
# - @nuxt/ui@^2.21.0
# - @pinia/nuxt@0.11.2
# - @vite-pwa/nuxt@1.0.4
# - tailwindcss@4.0.0
# - pinia@3.0.3
# - idb@8.0.3
# - zod@^3.24.2
```

## 📝 **Padrões de Commit**

```
feat: nova funcionalidade
fix: correção de bug
refactor: refatoração de código
style: mudanças de estilo/formatação
docs: documentação
test: testes
chore: tarefas de build/config
```

## 🎨 **Design System**

- **Cores primárias**: Pink-500 (#EC4899) da configuração PWA
- **Tipografia**: Font-sans (sistema)
- **Espaçamento**: Sistema Tailwind (4, 8, 12, 16, 24, 32px)
- **Breakpoints**: sm:640px, md:768px, lg:1024px, xl:1280px
- **Grid**: CSS Grid para layouts complexos, Flexbox para alinhamentos

## 🔍 **Critérios de Qualidade**

- **Performance**: LCP ≤ 3s mobile, PWA score ≥ 90
- **A11y**: WCAG AA compliance, contraste adequado
- **SEO**: Meta tags, structured data (opcional)
- **Mobile**: Touch-friendly (≥44px), gestos nativos
- **Offline**: Cache inteligente, sync em background

---

**Última atualização**: 27/09/2025
**Status do projeto**: Fase 0 - Base Técnica em andamento
