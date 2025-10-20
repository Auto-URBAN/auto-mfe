# Auto URBAN - MVP

## Visão Geral

Plataforma **mobile-first** de marketplace de carros, SPA/PWA (Nuxt 3), com Service Worker para cache offline.

## Stack Técnica

- **Frontend**: Nuxt 3 + Vue 3 + TypeScript
- **State**: Pinia + Zod schemas
- **UI**: Tailwind CSS + Nuxt UI
- **Cache**: PWA + IndexedDB
- **API**: Nitro backendataforma de Carros Exclusivos (Front SPA/PWA)

## 1) Visão geral

MVP **mobile-first**, SPA/PWA (Nuxt 3 sem SSR), com **Service Worker** para cachear buscas e **IndexedDB** para resultados recentes. UI inspirada na **Webmotors** (grid de cards com foto grande, filtros claros, ênfase em localização e preço), com melhorias de simplicidade e velocidade.

**Referências Webmotors (observado):**

- Catálogo/listagem com filtros de **Localização, Marca, Ano, Preço, Quilometragem** e detecção de localização para priorizar resultados próximos.
- Conteúdos e ajuda confirmam filtros “clássicos” (marca, modelo, ano, preço, km; novo/usado).
- Páginas de catálogo/categorias (SUVs, 7 lugares), e catálogo 0 km (fichas).
- Tabela FIPE/Webmotors como conteúdo de consulta de preço (inspiração para CTA/educação do comprador).

---

## Páginas Core

```
/                # Marketplace (busca + filtros)
/carros[id]    # Detalhes do veículo
/sell            # Publicar veículo
/auth/login      # Autenticação OTP
/account         # Meus anúncios
/admin           # Dashboard administrativo
```

## Componentes Principais

- `VehicleCard` - Card responsivo com foto/preço
- `SearchInput` - Busca com filtros
- `FilterBar` - Filtros avançados mobile/desktop
- `VehicleGrid` - Grid responsivo com paginação

---

## 3) Páginas do MVP (Front)

```
/                # Home (catálogo/lista + filtros)
/carros[id]    # Detalhes do veículo
/sell            # Publicar veículo (wizard 3 passos)
/auth/login      # Login (telefone + OTP mock)
/auth/register   # Cadastro simples
/account         # Meus anúncios (vendedor)
/admin           # Dashboard (big numbers)
/admin/vehicles  # Tabelas por status (PENDING/APPROVED/REJECTED)
/admin/users     # Lista básica de usuários
```

**Critérios por página**

### Home `/`

- Busca texto + filtros: **marca, UF, preço min/max, ano min/max, km máx**.
- Grid de **1 card por linha** no mobile; **carregar mais**.
- **SWR** no endpoint `/api/search` (SW + IndexedDB).
- Mostrar chips de filtros aplicados e “limpar tudo”.

### Detalhes `/carros[id]`

- **Galeria tocável** (swipe), foto **full-width**.
- Bloco “Especificações” (tabela simples).
- CTA fixo **WhatsApp**; se status = `PENDING` e usuário = dono, banner “em análise”.

### Publicar `/sell` (wizard)

1. **Dados** (marca, modelo, ano, preço, km, câmbio, combustível, cidade/UF).
2. **Fotos** (upload múltiplo, reordenar).
3. **Contato & resumo** (WhatsApp) → cria anúncio `PENDING`.

### Auth `/auth/*`

- Telefone + OTP (mock).
- Persistência com Access/Refresh (mock; pronto para backend real).

### Conta `/account`

- Lista “meus anúncios” por status; ações: editar (se `PENDING`/`REJECTED`), remover.

### Admin

- `/admin`: **big numbers** (totais, % aprovados), “Top marcas”, “Top UF”.
- `/admin/vehicles`: tabs por **status**; aprovar/recusar (com motivo).
- `/admin/users`: tabela simples (id, phone, role, nº de anúncios).

---

## 4) Componentes principais

- `VehicleCard.vue` — imagem grande, preço, título (Marca/Modelo/Ano), badges (km, UF).
- `SearchFilters.vue` — filtros + chips; suporte a bottom-sheet no mobile.
- `VehicleForm.vue` — wizard (3 passos) com validação (Zod).
- `ImageUploader.vue` — drag&drop, compressão cliente opcional, reordenação.
- `BigNumber.vue` / `MiniChart.vue` — cards e micro-gráficos do admin.
- `DataTable.vue` — tabela simples com paginação.

---

## 5) Estado, dados e PWA

### Stores (Pinia)

- `auth.store.ts` — tokens, user, role.
- `vehicles.store.ts` — buscas (lista/página), detalhe, criação/edição.
- `admin.store.ts` — métricas, filas por status, usuários.

### PWA/Service Worker

- Plugin: `@vite-pwa/nuxt` (Workbox).
- **runtimeCaching**:
  - `GET /api/search` → **StaleWhileRevalidate** (cache `api-search-swr`, 1h, máx 200 entradas).
  - Imagens → **CacheFirst** (30 dias).
- **IndexedDB**: guarda resultados por chave `userId|query|filters`.
- **BroadcastChannel**: notifica UI quando há versão fresca da busca.
- **Background Sync** (opcional) p/ POST quando offline.

---

## 6) Contratos de API (mock para integração futura)

> Base: `/api` (dev com MSW/Nitro). Todos em JSON.

### Auth

```
POST /auth/register       { phone }           -> 201 { userId }
POST /auth/login          { phone }           -> 200 { otpSent: true }
POST /auth/verify-otp     { phone, code }     -> 200 { accessToken, refreshToken, user:{ id, role } }
POST /auth/refresh        { refreshToken }    -> 200 { accessToken }
POST /auth/logout                             -> 204
```

### Busca pública / catálogo

```
GET  /vehicles/search?q&make&uf&priceMin&priceMax&yearMin&yearMax&kmMax&page&pageSize
200 { items: VehicleSummary[], page, pageSize, total }
GET  /vehicles/{id}       -> 200 VehicleDetail
```

### Vendedor

```
POST   /vehicles          (auth) -> 201 { id, status:"PENDING" }
GET    /me/vehicles       (auth) -> 200 VehicleSummary[]
PUT    /vehicles/{id}     (auth) -> 200
DELETE /vehicles/{id}     (auth) -> 204
```

### Admin

```
GET  /admin/metrics  (ADMIN) ->
200 {
  totals: { vehicles, approved, pending, rejected },
  byBrand: [{ brand, count }],
  byUF: [{ uf, count }]
}
GET  /admin/vehicles?status=PENDING|APPROVED|REJECTED (ADMIN)
POST /admin/vehicles/{id}/approve (ADMIN) -> 200
POST /admin/vehicles/{id}/reject  (ADMIN) -> 200 { reason }
GET  /admin/users (ADMIN) -> 200 [{ id, phone, role, ads }]
```

### Tipos (front)

```ts
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
```

---

## 7) UX/Conteúdo adicional (inspirado na Webmotors)

- **Foco em localização** (chip “perto de você” / “ver Brasil inteiro”).
- **Guia de preço**: link opcional para “Como consultar preços (FIPE/Webmotors)” em conteúdos/ajuda.
- **Categorias rápidas** (SUVs, 7 lugares) como atalhos — opcional pós-MVP.

---

## 8) Acessibilidade & Performance

- Contraste AA/AAA, inputs com `label`/`aria-*`, navegação por teclado.
- LCP ≤ 3s em mobile (dev).
- Lazy-load de imagens; `sizes/srcset`; `loading="lazy"`; `aspect-ratio` estável.
- Skeletons nos cards e na galeria.

---

## 9) Entrega por etapas (PRs)

### Fase 0 — Base técnica

- [ ] Adicionar `@vite-pwa/nuxt` + Workbox (manifest, runtimeCaching).
- [ ] `lib/api.ts` com interceptors (tokens).
- [ ] Pinia stores (`auth`, `vehicles`, `admin`).
- [ ] `lib/idb.ts` (IndexedDB via `idb`), `sw-channel.ts` (BroadcastChannel).
- [ ] Mocks (MSW/Nitro) dos endpoints acima.

### Fase 1 — Catálogo & Detalhes

- [ ] `Home` com `SearchFilters` e `VehicleCard`.
- [ ] `useSearch.ts` (SWR + IndexedDB).
- [ ] `/carros[id]` com galeria e CTA WhatsApp.

### Fase 2 — Autenticação & Publicação

- [ ] `/auth/login` & `/auth/register` (OTP mock).
- [ ] `/sell` (wizard 3 passos) + `ImageUploader`.
- [ ] `/account` (meus anúncios).

### Fase 3 — Admin

- [ ] `/admin` (big numbers + mini charts).
- [ ] `/admin/vehicles` (tabs + aprovar/recusar).
- [ ] `/admin/users`.

### Fase 4 — Refinos

- [ ] A11y, micro-otimizações, docs (`README`, `.env.example`), OpenAPI.

---

## 10) Dependências sugeridas & Scripts

```bash
pnpm add pinia idb zod
pnpm add -D @vite-pwa/nuxt @types/node
```

`.env.example`

```
VITE_API_BASE=/api
VITE_WHATSAPP_PREFIX=55
```

Scripts:

- `dev` – app + mocks
- `build` – PWA
- `preview` – servir build

---

## 11) Critérios de aceite (MVP)

- **PWA instalável**; buscas funcionam **offline** com últimos resultados.
- Fluxos: comprador (buscar → detalhes → WhatsApp), vendedor (login → publicar → “em análise”), admin (aprovar/recusar).
- **Lighthouse (mobile)**: PWA “Installable” e Performance ≥ 80 (dev).
- UI **mobile-first** com cards de **foto grande**, filtros claros e interação fluida.
