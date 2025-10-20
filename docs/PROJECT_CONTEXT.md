# Auto URBAN - Project Context & Standards

> **Documento de Contexto Completo**  
> Use este documento no início de novos chats para fornecer contexto completo ao AI Assistant.

---

## 📋 Índice

1. [Visão Geral do Projeto](#visão-geral-do-projeto)
2. [Stack Tecnológica](#stack-tecnológica)
3. [Estrutura de Pastas](#estrutura-de-pastas)
4. [Schemas e Types](#schemas-e-types)
5. [Endpoints da API](#endpoints-da-api)
6. [Componentes Principais](#componentes-principais)
7. [Padrões de Código](#padrões-de-código)
8. [Regras de Formatação](#regras-de-formatação)
9. [Convenções de Nomenclatura](#convenções-de-nomenclatura)
10. [Fluxos de Dados](#fluxos-de-dados)
11. [Configurações Importantes](#configurações-importantes)
12. [Scripts Disponíveis](#scripts-disponíveis)

---

## 🎯 Visão Geral do Projeto

**Nome:** Auto URBAN  
**Tipo:** Marketplace de veículos seminovos e novos  
**Objetivo:** Plataforma para compra/venda de veículos com análise de preços FIPE, comparação de modelos e informações detalhadas.

### Funcionalidades Principais:

1. **Listagem de Anúncios** (`/anuncios`)
   - Filtros avançados (marca, modelo, preço, ano, km, UF)
   - Paginação
   - Cards com informações resumidas

2. **Detalhes do Veículo** (`/anuncios/[slug]`)
   - Galeria de imagens
   - Especificações técnicas
   - Histórico de preços FIPE
   - Gráficos de valorização/depreciação
   - Contato com vendedor (WhatsApp)

3. **Comparador de Modelos** (`/carro`)
   - Comparação lado a lado (até 4 modelos)
   - Métricas: Potência, Ano, Câmbio, Combustível
   - Custo de Manutenção (escala 1-10)
   - Custo de Seguro
   - Gráfico de Depreciação (5 anos)
   - Seleção de múltiplos anos do mesmo modelo

4. **Página de Modelo** (`/carro/[slug]`)
   - Estrutura multi-year (mesmo modelo, diferentes anos)
   - Seletor de ano com dados dinâmicos
   - Histórico de preços por ano
   - Anúncios relacionados e similares

5. **Home Page** (`/`)
   - Hero section
   - Featured vehicles (link para comparador)
   - Market insights (rankings)
   - Philosophy section

---

## 🛠 Stack Tecnológica

### Core Framework

```json
{
	"framework": "Nuxt 3.19.2",
	"vue": "3.5.22",
	"typescript": "5.9.2",
	"node": ">=18.0.0",
	"packageManager": "pnpm 9.10.0"
}
```

### Principais Dependências

**UI & Styling:**

- `@nuxtjs/tailwindcss@6.14.0` - Utility-first CSS
- `@nuxt/icon@1.10.3` - Ícones (Heroicons)
- `tailwindcss@3.4.15` - Framework CSS

**Data Visualization:**

- `chart.js@4.5.0` - Gráficos
- `vue-chartjs@5.3.2` - Wrapper Vue para Chart.js

**Validação:**

- `zod@3.25.76` - Schema validation & TypeScript types

**Forms:**

- `maska@3.2.0` - Input masking (telefone, CPF, etc)

**Dev Tools:**

- `@nuxt/eslint@0.5.7` - Linting
- `prettier@3.6.2` - Code formatting
- `husky@9.1.7` - Git hooks
- `lint-staged@16.2.4` - Pre-commit automation

---

## 📁 Estrutura de Pastas

```
auto-mfe/
├── .vscode/              # Configurações do VS Code
│   ├── settings.json     # Prettier, ESLint, format on save
│   └── extensions.json   # Extensões recomendadas
│
├── assets/
│   └── css/
│       └── main.css      # Estilos globais
│
├── components/           # Componentes Vue reutilizáveis
│   ├── home/            # Componentes específicos da home
│   │   ├── SectionFeatured.vue    # Cards featured (link p/ comparador)
│   │   ├── SectionMarket.vue      # Market insights
│   │   ├── SectionHero.vue        # Hero section
│   │   └── SectionGarage.vue      # Garage section
│   │
│   ├── ui/              # Componentes de UI base
│   │   ├── Button.vue
│   │   ├── Input.vue
│   │   ├── Modal.vue
│   │   ├── Card.vue
│   │   ├── Badge.vue
│   │   ├── Alert.vue
│   │   ├── Select.vue
│   │   ├── RangeSlider.vue
│   │   └── ...
│   │
│   ├── Vehicle/         # Componentes relacionados a veículos
│   │   ├── Card.vue     # Card de veículo (usado em listagens)
│   │   ├── Gallery.vue  # Galeria de imagens
│   │   ├── Specs.vue    # Especificações técnicas
│   │   ├── Grid.vue     # Grid de veículos
│   │   └── Contact.vue  # Informações de contato
│   │
│   ├── Chart.vue                  # Wrapper Chart.js
│   ├── VehicleFilterSidebar.vue   # Sidebar de filtros
│   ├── VehicleGalleryModal.vue    # Modal de galeria
│   ├── SearchInput.vue            # Input de busca
│   ├── FilterBar.vue              # Barra de filtros
│   └── ...
│
├── composables/         # Vue composables (hooks reutilizáveis)
│   ├── useAuth.ts      # Autenticação
│   ├── useSearch.ts    # Busca e filtros
│   └── useSmartFilters.ts  # Filtros inteligentes
│
├── docs/                # Documentação do projeto
│   ├── PROJECT_CONTEXT.md        # Este arquivo
│   ├── STRIP_COMMENTS.md         # Remoção de comentários
│   ├── PRETTIER_SETUP.md         # Configuração Prettier
│   ├── HOME_REDESIGN.md          # Redesign da home
│   └── ...
│
├── layouts/             # Layouts do Nuxt
│   ├── default.vue     # Layout padrão
│   └── admin.vue       # Layout admin
│
├── lib/                 # Bibliotecas auxiliares
│   └── api.ts          # Cliente API
│
├── middleware/          # Middlewares do Nuxt
│   ├── auth.ts         # Middleware de autenticação
│   └── admin-auth.ts   # Middleware admin
│
├── pages/               # Páginas (rotas automáticas)
│   ├── index.vue                 # Home (/)
│   ├── anuncios/
│   │   ├── index.vue            # Listagem (/anuncios)
│   │   └── [slug].vue           # Detalhes (/anuncios/:slug)
│   ├── carro/
│   │   ├── index.vue            # Comparador (/carro)
│   │   └── [slug].vue           # Modelo multi-year (/carro/:slug)
│   ├── auth/
│   │   ├── login.vue
│   │   └── verify.vue
│   ├── admin/
│   │   ├── index.vue
│   │   ├── users.vue
│   │   └── vehicles.vue
│   └── ...
│
├── plugins/             # Plugins do Nuxt
│   ├── auth.client.ts  # Plugin de autenticação (client-side)
│   └── maska.ts        # Plugin de máscaras
│
├── public/              # Arquivos estáticos
│   ├── robots.txt
│   ├── imgs/
│   └── logos/
│
├── schemas/             # Schemas Zod (validação + types)
│   ├── index.ts        # Exports centralizados
│   ├── vehicle.ts      # Schemas de veículos (PRINCIPAL)
│   ├── user.ts         # Schemas de usuários
│   ├── filters.ts      # Schemas de filtros
│   ├── admin.ts        # Schemas admin
│   ├── brand.ts        # Schemas de marcas
│   └── ...
│
├── scripts/             # Scripts utilitários
│   └── strip-comments.js  # Remove comentários automaticamente
│
├── server/              # Backend Nuxt (API routes)
│   ├── api/
│   │   ├── vehicles/
│   │   │   ├── index.get.ts      # GET /api/vehicles (PRINCIPAL)
│   │   │   ├── [id].ts           # GET /api/vehicles/:id
│   │   │   └── [id]/
│   │   │       └── related.ts    # GET /api/vehicles/:id/related
│   │   ├── brands/
│   │   │   └── index.get.ts      # GET /api/brands
│   │   ├── filters.get.ts        # GET /api/filters
│   │   ├── auth/
│   │   │   ├── login.post.ts
│   │   │   └── verify-otp.post.ts
│   │   ├── admin/
│   │   │   ├── metrics.ts
│   │   │   ├── users.ts
│   │   │   └── vehicles.ts
│   │   └── banks/
│   │       ├── index.ts
│   │       └── with-tax.ts
│   │
│   └── data/            # Mock data (SSR)
│       ├── vehicles.json   # Dados de veículos (PRINCIPAL)
│       └── brands.json     # Dados de marcas
│
├── utils/               # Funções utilitárias
│   └── installments.ts # Cálculos de parcelas
│
├── .prettierrc          # Configuração Prettier
├── .prettierignore      # Arquivos ignorados pelo Prettier
├── eslint.config.mjs    # Configuração ESLint
├── nuxt.config.ts       # Configuração Nuxt
├── tailwind.config.js   # Configuração Tailwind
├── tsconfig.json        # Configuração TypeScript
└── package.json         # Dependências e scripts
```

---

## 🗂 Schemas e Types

**Localização:** `schemas/vehicle.ts` (ARQUIVO PRINCIPAL)

### Schemas Disponíveis:

```typescript
// Enums
export const VehicleStatus = z.enum(['PENDING', 'APPROVED', 'REJECTED'])
export const Gearbox = z.enum(['MANUAL', 'AUTO'])
export const FuelType = z.enum(['GASOLINA', 'ALCOOL', 'DIESEL', 'HIBRIDO', 'ELETRICO'])
export const BrazilianState = z.enum(['AC', 'AL', 'AP', ...])

// Schemas Principais
export const VehicleSummary = z.object({
  id: z.string(),
  title: z.string(),
  brand: z.string(),
  model: z.string(),
  year: z.number(),
  price: z.number(),
  km: z.number(),
  horsepower: z.number(),
  slug: z.string(),
  city: z.string(),
  uf: BrazilianState,
  coverImageUrl: z.string().url(),
  status: VehicleStatus,
  featured: z.boolean().optional(),
  createdAt: z.date().optional()
})

export const VehicleDetail = VehicleSummary.extend({
  description: z.string().optional(),
  gearbox: Gearbox.optional(),
  fuel: FuelType.optional(),
  color: z.string().optional(),
  images: z.array(z.string().url()),
  fipeCode: z.string().optional(),
  averageValue: z.number().optional(),
  minValue: z.number().optional(),
  maxValue: z.number().optional(),
  prices: z.array(Price).optional(),
  partners: z.array(Partner).optional(),
  seller: Seller
})

export const SearchFilters = z.object({
  q: z.string().optional(),
  brand: z.string().optional(),
  model: z.string().optional(),
  uf: BrazilianState.optional(),
  priceMin: z.number().optional(),
  priceMax: z.number().optional(),
  yearMin: z.number().optional(),
  yearMax: z.number().optional(),
  kmMax: z.number().optional(),
  fuel: FuelType.optional(),
  gearbox: Gearbox.optional(),
  page: z.number().default(1),
  pageSize: z.number().default(20),
  featured: z.boolean().optional(),
  ranking: z.enum(['valorizados', 'depreciados']).optional()
})

export const SearchResult = z.object({
  items: z.array(VehicleSummary),
  page: z.number(),
  pageSize: z.number(),
  total: z.number()
})

// Multi-Year Support (para /carro/[slug])
export interface YearVariant {
  year: number
  price: number
  horsepower: number
  gearbox: Gearbox
  fuel: FuelType
  km: number
  fipeCode: string
}

export interface ModelData extends VehicleDetail {
  years: YearVariant[]
}
```

### Types Exportados:

```typescript
export type VehicleStatus = z.infer<typeof VehicleStatus>
export type Gearbox = z.infer<typeof Gearbox>
export type FuelType = z.infer<typeof FuelType>
export type BrazilianState = z.infer<typeof BrazilianState>
export type VehicleSummary = z.infer<typeof VehicleSummary>
export type VehicleDetail = z.infer<typeof VehicleDetail>
export type SearchFilters = z.infer<typeof SearchFilters>
export type SearchResult = z.infer<typeof SearchResult>
```

---

## 🔌 Endpoints da API

### **GET /api/vehicles**

**Principal endpoint** - Lista e filtra veículos

**Query Params:**

```typescript
{
  // Busca
  q?: string                    // Busca por texto

  // Filtros
  brand?: string               // Marca (ex: "BMW", "Porsche")
  model?: string               // Modelo (ex: "M3", "911")
  uf?: BrazilianState         // Estado (ex: "SP", "RJ")
  priceMin?: number           // Preço mínimo
  priceMax?: number           // Preço máximo
  yearMin?: number            // Ano mínimo
  yearMax?: number            // Ano máximo
  kmMax?: number              // Quilometragem máxima
  fuel?: FuelType             // Combustível
  gearbox?: Gearbox           // Câmbio

  // Paginação
  page?: number               // Página (default: 1)
  pageSize?: number           // Itens por página (default: 20)

  // Especiais
  featured?: boolean          // Apenas destacados
  ranking?: 'valorizados' | 'depreciados'  // Rankings

  // Busca por ID
  id?: string                 // Retorna VehicleDetail específico
}
```

**Response:**

```typescript
SearchResult {
  items: VehicleSummary[]
  page: number
  pageSize: number
  total: number
}

// OU (quando id está presente)

VehicleDetail {
  // ... todos os campos
}
```

**Implementação:** `server/api/vehicles/index.get.ts`  
**Mock Data:** `server/data/vehicles.json`

---

### **GET /api/brands**

Lista todas as marcas disponíveis

**Response:**

```typescript
{
  brands: string[]
}
```

**Implementação:** `server/api/brands/index.get.ts`  
**Mock Data:** `server/data/brands.json`

---

### **GET /api/filters**

Retorna opções de filtros disponíveis

**Response:**

```typescript
{
  brands: string[]
  years: { min: number, max: number }
  prices: { min: number, max: number }
  states: BrazilianState[]
}
```

**Implementação:** `server/api/filters.get.ts`

---

## 🧩 Componentes Principais

### VehicleCard

**Localização:** `components/Vehicle/Card.vue`

**Props:**

```typescript
{
  title: string
  href: string
  coverImageUrl: string
  brand: string
  price?: number
  year?: number
  km?: number
  uf?: string
  horsepower?: number
  featured?: boolean
  showSpecs?: boolean
  priceLabel?: string
}
```

**Uso:**

```vue
<VehicleCard
	:title="vehicle.title"
	:href="`/anuncios/${vehicle.slug}`"
	:cover-image-url="vehicle.coverImageUrl"
	:brand="vehicle.brand"
	:price="vehicle.price"
	:year="vehicle.year"
	:km="vehicle.km"
/>
```

---

### VehicleFilterSidebar

**Localização:** `components/VehicleFilterSidebar.vue`

**Props:**

```typescript
{
  loading?: boolean
  mode?: 'vehicles' | 'models'  // Para anuncios ou comparador
}
```

**Events:**

```typescript
@update:filters="handleFiltersUpdate"  // Emite SearchFilters
@close="showMobileFilters = false"     // Para modal mobile
```

**Funcionalidades:**

- Filtro por marca (select)
- Filtro por UF (select)
- Range de preço (slider)
- Range de ano (slider)
- Quilometragem máxima (slider)
- Combustível (select)
- Câmbio (select)
- Ordenação
- Categorias (para modo comparador)

---

### Chart

**Localização:** `components/Chart.vue`

**Props:**

```typescript
{
  type: 'line' | 'bar' | 'pie'
  data: ChartData
  options: ChartOptions
  height?: number
}
```

**Uso:**

```vue
<Chart type="line" :data="depreciationData" :options="chartOptions" :height="200" />
```

---

## 📝 Padrões de Código

### 1. Estrutura de Componentes Vue

```vue
<template>
	<div class="container">
		<!-- Template aqui -->
	</div>
</template>

<script setup lang="ts">
// Imports
import type { SearchResult, VehicleSummary } from '@/schemas/vehicle'

// Composables
const route = useRoute()
const router = useRouter()

// Props (se necessário)
const props = defineProps<{
	title: string
	items: VehicleSummary[]
}>()

// Emits (se necessário)
const emit = defineEmits<{
	'update:filters': [filters: SearchFilters]
	close: []
}>()

// State
const loading = ref(false)
const items = ref<VehicleSummary[]>([])

// Computed
const total = computed(() => items.value.length)

// Methods
async function loadData() {
	loading.value = true
	try {
		const response = await $fetch<SearchResult>('/api/vehicles')
		items.value = response.items
	} catch (error) {
		console.error('Error:', error)
	} finally {
		loading.value = false
	}
}

// Lifecycle
onMounted(() => {
	loadData()
})
</script>

<style scoped>
/* Estilos específicos do componente (se necessário) */
/* Prefira usar Tailwind */
</style>
```

---

### 2. Imports e Types

**Sempre use type imports:**

```typescript
import type { VehicleSummary, SearchResult } from '@/schemas/vehicle'
```

**Ordem de imports:**

```typescript
// 1. Types
import type { VehicleSummary } from '@/schemas/vehicle'

// 2. Components (se não auto-imported)
import VehicleCard from '@/components/Vehicle/Card.vue'

// 3. Composables
const route = useRoute()

// 4. Utils
import { formatCurrency } from '@/utils/format'
```

---

### 3. Nomenclatura

**Componentes:**

- PascalCase para arquivos: `VehicleCard.vue`
- PascalCase para uso: `<VehicleCard />`

**Composables:**

- camelCase com prefixo `use`: `useAuth.ts`
- Uso: `const { user } = useAuth()`

**Funções:**

- camelCase: `loadVehicles()`, `handleClick()`

**Variáveis:**

- camelCase: `vehiclesList`, `isLoading`

**Constants:**

- UPPER_SNAKE_CASE: `MAX_ITEMS`, `API_URL`

**Types/Interfaces:**

- PascalCase: `VehicleSummary`, `SearchFilters`

---

### 4. Fetch de Dados

**Sempre use $fetch (Nuxt):**

```typescript
// ✅ Correto
const response = await $fetch<SearchResult>('/api/vehicles', {
	query: { brand: 'BMW' }
})

// ❌ Evite
const response = await fetch('/api/vehicles')
```

**Com error handling:**

```typescript
async function loadData() {
	loading.value = true
	try {
		const response = await $fetch<SearchResult>('/api/vehicles', {
			query: queryParams
		})
		items.value = response.items
		total.value = response.total
	} catch (error) {
		console.error('Load error:', error)
		items.value = []
	} finally {
		loading.value = false
	}
}
```

---

### 5. Formulários e Filtros

**Use refs para state:**

```typescript
const filters = ref<Partial<SearchFilters>>({
	brand: undefined,
	priceMin: undefined,
	priceMax: undefined
})

function handleFiltersUpdate(newFilters: Partial<SearchFilters>) {
	filters.value = { ...newFilters }
	currentPage.value = 1
	loadVehicles()
}
```

---

### 6. Navegação

**Use NuxtLink para navegação interna:**

```vue
<!-- ✅ Correto -->
<NuxtLink :to="`/anuncios/${vehicle.slug}`">
	Ver Detalhes
</NuxtLink>

<!-- ❌ Evite -->
<a :href="`/anuncios/${vehicle.slug}`">Ver Detalhes</a>
```

**Links externos:**

```vue
<a :href="whatsappUrl" target="_blank" rel="noopener">
	Enviar WhatsApp
</a>
```

---

### 7. Paginação

```typescript
const currentPage = ref(1)
const pageSize = ref(20)
const total = ref(0)

const totalPages = computed(() => Math.ceil(total.value / pageSize.value))

async function goToPage(page: number) {
	if (page >= 1 && page <= totalPages.value) {
		currentPage.value = page
		await loadData()
		scrollToTop()
	}
}
```

---

### 8. Loading States

```vue
<template>
	<!-- Loading -->
	<div v-if="loading" class="flex justify-center py-12">
		<Icon name="heroicons:arrow-path-20-solid" class="w-8 h-8 animate-spin" />
	</div>

	<!-- Content -->
	<div v-else-if="items.length > 0">
		<!-- ... -->
	</div>

	<!-- Empty -->
	<div v-else class="text-center py-12">
		<p class="text-gray-500">Nenhum resultado encontrado</p>
	</div>
</template>
```

---

### 9. Formatação de Valores

```typescript
// Moeda
function formatCurrency(value: number): string {
	return new Intl.NumberFormat('pt-BR', {
		style: 'currency',
		currency: 'BRL',
		maximumFractionDigits: 0
	}).format(value)
}

// Número
function formatNumber(value: number): string {
	return value.toLocaleString('pt-BR')
}

// Data
function formatDate(date: string | Date): string {
	return new Date(date).toLocaleDateString('pt-BR')
}
```

---

## 🎨 Regras de Formatação

### Prettier

**Configuração (`.prettierrc`):**

```json
{
	"useTabs": true,
	"semi": false,
	"tabWidth": 2,
	"singleQuote": true,
	"printWidth": 100,
	"trailingComma": "none",
	"arrowParens": "avoid",
	"singleAttributePerLine": false,
	"endOfLine": "auto"
}
```

**Características:**

- ✅ Tabs (não espaços)
- ✅ Sem ponto-e-vírgula
- ✅ Aspas simples
- ✅ Linha máxima: 100 caracteres
- ✅ Sem trailing commas
- ✅ Arrow functions sem parênteses (quando possível)

---

### ESLint

**Configuração (`eslint.config.mjs`):**

```javascript
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt({
	rules: {
		'no-inline-comments': 'error',
		'spaced-comment': ['error', 'never'],
		'no-warning-comments': 'off'
	}
})
```

---

### Remoção de Comentários

**IMPORTANTE:** O projeto está configurado para remover automaticamente TODOS os comentários.

**Quando acontece:**

1. ✅ `pnpm format` - Remove comentários + formata
2. ✅ `git commit` - Pre-commit hook (lint-staged)
3. ✅ VS Code Save - Se extensão "Run on Save" instalada

**Script:** `scripts/strip-comments.js`

**Arquivos processados:**

- `.vue` (template + script + style)
- `.ts`, `.js`, `.mjs`

**Características:**

- ✅ Remove `//`, `/* */`, `<!-- -->`
- ✅ Preserva URLs (`http://`, `https://`)
- ✅ Respeita strings (não remove // dentro de strings)
- ✅ Remove linhas em branco excessivas

**NÃO escreva comentários no código!** Eles serão removidos automaticamente.

---

### VS Code

**Format on Save:** ✅ Ativado

**Configurações importantes (`.vscode/settings.json`):**

```json
{
	"prettier.enable": true,
	"editor.formatOnSave": true,
	"editor.defaultFormatter": "esbenp.prettier-vscode",
	"editor.codeActionsOnSave": {
		"source.fixAll.eslint": "explicit"
	}
}
```

---

## 🔄 Fluxos de Dados

### Fluxo de Listagem de Anúncios

```
User Input (Filtros)
    ↓
VehicleFilterSidebar emite @update:filters
    ↓
Page recebe e atualiza filters ref
    ↓
loadVehicles() é chamado
    ↓
$fetch('/api/vehicles', { query: filters })
    ↓
API retorna SearchResult
    ↓
vehicles.value = response.items
    ↓
VehicleCard renderiza cada item
```

---

### Fluxo de Detalhes do Veículo

```
User clica em VehicleCard
    ↓
Navega para /anuncios/[slug]
    ↓
Page usa useRoute() para pegar slug
    ↓
$fetch('/api/vehicles', { query: { slug } })
    ↓
API retorna VehicleDetail
    ↓
Page renderiza:
  - VehicleGallery
  - Specs
  - Price History (Chart)
  - Contact Info
  - Related Ads
```

---

### Fluxo de Comparador

```
User acessa /carro
    ↓
loadModels() busca todos modelos
    ↓
Agrupa por brand-model (remove duplicatas)
    ↓
User clica no botão + no card
    ↓
toggleSelection() adiciona ao selectedModels
    ↓
Painel de comparação renderiza lado a lado
    ↓
Calcula métricas:
  - getMaintenanceCost()
  - getInsuranceCost()
  - getDepreciationData()
    ↓
Renderiza Charts e comparações
```

---

### Fluxo Multi-Year (Modelo)

```
User acessa /carro/[slug]
    ↓
loadVehicle() busca por slug
    ↓
Agrupa veículos pelo slug em years[]
    ↓
selectedYear = ano mais recente
    ↓
currentYearData computed retorna YearVariant
    ↓
User clica em botão de ano
    ↓
selectYear(year) atualiza selectedYear
    ↓
currentYearData recomputa automaticamente
    ↓
Todos os dados atualizam (preço, specs, gráficos)
```

---

## ⚙️ Configurações Importantes

### nuxt.config.ts

```typescript
export default defineNuxtConfig({
	modules: ['@nuxtjs/tailwindcss', '@nuxt/icon', '@nuxt/image', '@vite-pwa/nuxt', '@nuxt/eslint'],

	app: {
		head: {
			title: 'Auto URBAN',
			meta: [
				{ charset: 'utf-8' },
				{ name: 'viewport', content: 'width=device-width, initial-scale=1' }
			]
		}
	},

	css: ['~/assets/css/main.css'],

	compatibilityDate: '2024-11-01'
})
```

---

### tailwind.config.js

```javascript
module.exports = {
	content: [
		'./components/**/*.{js,vue,ts}',
		'./layouts/**/*.vue',
		'./pages/**/*.vue',
		'./plugins/**/*.{js,ts}',
		'./app.vue'
	],
	theme: {
		extend: {
			colors: {
				// Cores customizadas se necessário
			}
		}
	},
	plugins: []
}
```

---

### tsconfig.json

```json
{
	"extends": "./.nuxt/tsconfig.json",
	"compilerOptions": {
		"strict": true,
		"noUnusedLocals": true,
		"noUnusedParameters": true
	}
}
```

---

## 🚀 Scripts Disponíveis

```json
{
	"scripts": {
		"dev": "nuxt dev",
		"build": "nuxt build",
		"generate": "nuxt generate",
		"preview": "nuxt preview",
		"start": "node .output/server/index.mjs",

		"format": "pnpm strip-comments && prettier --write \"**/*.{js,ts,vue,json,css,scss,md}\"",
		"format:check": "prettier --check \"**/*.{js,ts,vue,json,css,scss,md}\"",
		"strip-comments": "node scripts/strip-comments.js",
		"lint:fix": "eslint . --fix",

		"prepare": "husky || true"
	}
}
```

### Uso:

```bash
# Desenvolvimento
pnpm dev

# Build produção
pnpm build

# Preview build
pnpm preview

# Formatar código (remove comentários + prettier)
pnpm format

# Verificar formatação
pnpm format:check

# Remover apenas comentários
pnpm strip-comments

# Fix ESLint
pnpm lint:fix
```

---

## 📊 Dados Mock (SSR)

### server/data/vehicles.json

**Estrutura Multi-Year:**

Alguns modelos têm múltiplas entradas com mesmo `brand`, `model` e `slug`, mas `year` e `price` diferentes:

```json
[
	{
		"id": "vh001",
		"brand": "Porsche",
		"model": "911",
		"slug": "porsche-911-turbo",
		"year": 2023,
		"price": 1449000,
		"horsepower": 650
	},
	{
		"id": "vh009",
		"brand": "Porsche",
		"model": "911",
		"slug": "porsche-911-turbo",
		"year": 2024,
		"price": 1549000,
		"horsepower": 650
	},
	{
		"id": "vh010",
		"brand": "Porsche",
		"model": "911",
		"slug": "porsche-911-turbo",
		"year": 2025,
		"price": 1649000,
		"horsepower": 670
	}
]
```

**Modelos com multi-year:**

- Porsche 911 Turbo: 2023, 2024, 2025
- BMW M3 Competition: 2022, 2023, 2024
- VW Golf GTI: 2023, 2024, 2025

---

## 🎯 Casos de Uso Comuns

### 1. Adicionar novo filtro

```typescript
// 1. Atualizar SearchFilters em schemas/vehicle.ts
export const SearchFilters = z.object({
	// ... existentes
	newFilter: z.string().optional()
})

// 2. Adicionar campo em VehicleFilterSidebar.vue
const filters = ref<Partial<SearchFilters>>({
	newFilter: undefined
})

// 3. Adicionar lógica no endpoint server/api/vehicles/index.get.ts
if (query.newFilter) {
	filteredVehicles = filteredVehicles.filter(v => v.newField === query.newFilter)
}
```

---

### 2. Criar nova página

```bash
# Criar arquivo em pages/
touch pages/nova-pagina.vue
```

```vue
<template>
	<div>
		<h1>Nova Página</h1>
	</div>
</template>

<script setup lang="ts">
useHead({
	title: 'Nova Página - Auto URBAN'
})
</script>
```

**Rota automática:** `/nova-pagina`

---

### 3. Adicionar novo componente

```bash
# Criar em components/
touch components/NovoComponente.vue
```

```vue
<template>
	<div class="novo-componente">
		{{ title }}
	</div>
</template>

<script setup lang="ts">
const props = defineProps<{
	title: string
}>()
</script>
```

**Uso (auto-imported):**

```vue
<NovoComponente title="Teste" />
```

---

### 4. Adicionar endpoint da API

```bash
# Criar em server/api/
touch server/api/novo-endpoint.get.ts
```

```typescript
export default defineEventHandler(async event => {
	const query = getQuery(event)

	return {
		data: 'Resposta'
	}
})
```

**URL:** `GET /api/novo-endpoint`

---

## 🔍 Debugging

### Console Logs (Temporários)

```typescript
console.log('Loading vehicles with params:', queryParams)
console.log('API Response:', response)
```

**ATENÇÃO:** Serão removidos ao salvar/formatar!

---

### Vue Devtools

Instale a extensão: **Vue.js devtools**

**Features:**

- Inspect component tree
- Ver state/props
- Track events
- Performance profiling

---

### Network Tab

Use o DevTools do navegador:

1. F12 → Network
2. Filtre por "Fetch/XHR"
3. Veja requests para `/api/vehicles`

---

## 📚 Recursos Adicionais

### Documentação Oficial:

- [Nuxt 3](https://nuxt.com/)
- [Vue 3](https://vuejs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Zod](https://zod.dev/)
- [Chart.js](https://www.chartjs.org/)

### Docs do Projeto:

- `docs/STRIP_COMMENTS.md` - Remoção de comentários
- `docs/PRETTIER_SETUP.md` - Configuração Prettier
- `docs/HOME_REDESIGN.md` - Redesign da home
- `docs/HOME_PAGE_IMPLEMENTATION.md` - Implementação home
- `docs/HISTORICO_FASES.md` - Histórico de fases

---

## 🎉 Checklist para Novo Chat

Ao iniciar um novo chat, forneça este documento e inclua:

✅ **Contexto básico:**

```
Projeto: Auto URBAN - Marketplace de veículos
Framework: Nuxt 3 + TypeScript + Tailwind
Package Manager: pnpm
```

✅ **Arquivo principal:**

```
Schemas: schemas/vehicle.ts
API: server/api/vehicles/index.get.ts
Mock Data: server/data/vehicles.json
```

✅ **Regras importantes:**

```
- Sempre use types do schemas/vehicle.ts
- Sempre use $fetch (não fetch nativo)
- NÃO escreva comentários (serão removidos)
- Use Tailwind (não CSS customizado)
- Tabs, sem ponto-e-vírgula, aspas simples
```

✅ **Estruturas especiais:**

```
- Multi-year support em /carro/[slug]
- Comparador com até 4 modelos em /carro
- Featured vehicles linkam para comparador com ?slug=
```

---

## 📝 Template de Início de Chat

```markdown
# Auto URBAN - Contexto do Projeto

Estou trabalhando no projeto **Auto URBAN**, um marketplace de veículos.

## Stack:

- Nuxt 3.19.2 + Vue 3 + TypeScript
- Tailwind CSS + Chart.js
- Zod para validação
- pnpm como package manager

## Arquivos principais:

- Schemas: `schemas/vehicle.ts`
- API: `server/api/vehicles/index.get.ts`
- Mock Data: `server/data/vehicles.json`

## Regras importantes:

1. ✅ Use types de `schemas/vehicle.ts`
2. ✅ Use `$fetch` (não `fetch`)
3. ❌ NÃO escreva comentários (removidos automaticamente)
4. ✅ Use Tailwind (não CSS customizado)
5. ✅ Tabs, sem `;`, aspas simples

## Estruturas especiais:

- Multi-year support: `/carro/[slug]` suporta múltiplos anos do mesmo modelo
- Comparador: `/carro` compara até 4 modelos com métricas customizadas
- Featured links: Vão para comparador com `?slug=` query param

## Contexto completo:

Ver `docs/PROJECT_CONTEXT.md` para detalhes completos.

---

## Minha tarefa:

[DESCREVA SUA TAREFA AQUI]
```

---

**Última atualização:** Outubro 2025  
**Versão:** 1.0  
**Status:** ✅ Completo e validado
