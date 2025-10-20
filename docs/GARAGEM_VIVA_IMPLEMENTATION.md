# Garagem Viva - Documentação de Implementação

## 🎯 Estrutura Criada

### 📋 Schemas (`schemas/garage.ts`)

Criados os seguintes schemas Zod com TypeScript types:

- **GarageCurrentCar** - Carros atualmente na posse do usuário
- **GarageHistoryCar** - Carros vendidos/históricos
- **GarageGoal** - Objetivos/carros que deseja ter
- **GarageStats** - Estatísticas consolidadas da garagem
- **GarageNotification** - Notificações e alertas
- **CarMod** - Modificações feitas nos carros
- **MoveCarPayload** - Payload para mover carros entre seções

### 🔌 API Endpoints (`server/api/garage/`)

Criados os seguintes endpoints:

1. **GET /api/garage/current** - Lista carros atuais
2. **GET /api/garage/history** - Lista histórico de carros
3. **GET /api/garage/goals** - Lista objetivos
4. **GET /api/garage/stats** - Estatísticas consolidadas
5. **GET /api/garage/notifications** - Notificações
6. **POST /api/garage/[id]/delete** - Remove um carro
7. **POST /api/garage/[id]/move** - Move carro entre seções (atual ↔ histórico)

### 🎨 Mock Data (`server/data/garage.json`)

Mock data realista contendo:

- 2 carros atuais (BMW M240i, Porsche Cayman GTS)
- 3 carros no histórico (Golf GTI, Civic Si, Focus ST)
- 3 objetivos (Porsche 911 Turbo, Audi RS3, Mercedes C63 AMG)
- 5 notificações de diferentes tipos
- Estatísticas completas com gráficos

### 🧩 Composable (`composables/useGarage.ts`)

Gerencia todo o estado e ações da garagem:

**Estado:**

- currentCars, historyCars, goals, stats, notifications
- loading, error
- Computed: unreadNotifications, totalValue, avgVariation

**Métodos:**

- loadCurrentCars(), loadHistoryCars(), loadGoals(), loadStats(), loadNotifications()
- loadAll() - carrega tudo de uma vez
- moveCar() - move entre seções
- deleteCar() - remove carro
- markNotificationAsRead(), markAllNotificationsAsRead()

### 🎨 Componentes

#### 1. GarageHeader (`components/garage/GarageHeader.vue`)

**Funcionalidade:**

- Saudação personalizada (Bom dia/tarde/noite)
- Subtitle aleatório emocional
- 5 KPI cards: Carros Atuais, Valor Total, Valorização 12m, Histórico, Objetivos

**Props:**

- userName, totalCars, totalValue, avgVariation, totalHistory, totalGoals

**Visual:**

- Dark metálico com honeycomb texture
- Cards com backdrop blur
- Cores temáticas (azul, verde, âmbar)

---

#### 2. CurrentCarCard (`components/garage/CurrentCarCard.vue`)

**Funcionalidade:**

- Exibe carro atual com foto, dados, valor FIPE, variação
- Mostra modificações (chips coloridos)
- Notas pessoais do usuário
- Ações: Editar, Ver Histórico FIPE, Mover para História

**Props:**

- car: GarageCurrentCar

**Emits:**

- edit, viewHistory, moveToHistory

**Visual:**

- Card com glow azul ao hover
- Badge verde para placa verificada
- Chips vermelhos para modificações

---

#### 3. HistoryTimeline (`components/garage/HistoryTimeline.vue`)

**Funcionalidade:**

- Timeline dos carros já vendidos/históricos
- Mostra período de posse, KM rodados, resultado financeiro
- Status badges (Vendido, Acidentado, Roubado, etc)
- Notas emocionais do usuário sobre cada carro

**Props:**

- cars: GarageHistoryCar[]

**Visual:**

- Cards em grayscale que viram coloridos ao hover
- Linha lateral indicadora
- Badges coloridos por status
- Resultado financeiro (verde/vermelho)

---

#### 4. GoalCard (`components/garage/GoalCard.vue`)

**Funcionalidade:**

- Exibe objetivo/carro desejado
- Mostra valor FIPE médio vs objetivo do usuário
- Indica anúncios salvos
- Badge "Monitorando" se alertas ativos
- Ações: Ver Anúncios, Comparar, Remover

**Props:**

- goal: GarageGoal

**Emits:**

- remove, viewAds, compare

**Visual:**

- Glow âmbar ao hover
- Distância do objetivo em % (verde/vermelho)
- Badge de sino para monitoramento ativo

---

#### 5. NotificationsFeed (`components/garage/NotificationsFeed.vue`)

**Funcionalidade:**

- Feed de notificações ordenadas por data
- 6 tipos: Valorização, Depreciação, Novo Anúncio, Alerta de Preço, Match de Objetivo, Insight
- Ícones e cores por tipo
- Badge azul para não lidas
- Botão "Marcar todas como lidas"

**Props:**

- notifications: GarageNotification[]

**Emits:**

- markAsRead, markAllRead

**Visual:**

- Borda lateral colorida por tipo
- Ícones específicos (seta para cima/baixo, sino, lâmpada)
- Timestamp "há X minutos/horas/dias"

---

#### 6. GarageStatsSection (`components/garage/GarageStatsSection.vue`)

**Funcionalidade:**

- Gráfico de linha: evolução do valor da garagem (12 meses)
- Gráfico de pizza: distribuição por tipo de carro
- Gráfico de barras: valorização média por marca
- 4 cards de insights (modelo mais valorizado, maior prejuízo, ano mais ativo, etc)

**Props:**

- stats: GarageStats

**Visual:**

- Gráficos Chart.js responsivos
- Cards de insights coloridos (verde positivo, vermelho negativo, cinza neutro)

---

### 📄 Página Principal (`pages/garagem/index.vue`)

**Estrutura:**

1. **Header** - KPIs e saudação
2. **Abas de Navegação:**
   - Meus Carros (current)
   - Minha História (history)
   - Meus Objetivos (goals)
   - Estatísticas (stats)
3. **Conteúdo Principal** - Renderiza componente da aba ativa
4. **Sidebar** - Feed de notificações (sticky)
5. **CTA Final** - "Explorar carros no marketplace"

**Estados:**

- Loading skeleton
- Empty states personalizados para cada aba
- Error handling com retry

---

## 🎨 Design System

### Cores Principais

- **Fundo:** `bg-zinc-950` (página), `bg-zinc-900/800` (cards)
- **Texto:** `text-white` (títulos), `text-zinc-400` (secundário)
- **Azul M:** `#3b82f6` (BMW/técnico)
- **Vermelho RS:** `#ef4444` (performance)
- **Âmbar:** `#f59e0b` (objetivos)
- **Verde:** `#10b981` (positivo/valorização)

### Efeitos Visuais

- Gradient overlays com blur
- Grayscale → Color no hover (histórico)
- Glow effects (azul/vermelho/âmbar)
- Backdrop blur nos cards
- Smooth transitions (300ms)

### Tipografia

- Títulos: `text-2xl/4xl font-bold`
- Body: `text-sm/base`
- Números: `text-xl/2xl font-bold`

---

## 🔄 Fluxos de Dados

### Carregamento Inicial

```
onMounted → loadAll() →
  → loadCurrentCars() → $fetch('/api/garage/current')
  → loadHistoryCars() → $fetch('/api/garage/history')
  → loadGoals() → $fetch('/api/garage/goals')
  → loadStats() → $fetch('/api/garage/stats')
  → loadNotifications() → $fetch('/api/garage/notifications')
```

### Ações do Usuário

**Mover Carro para História:**

```
User clica "Mover para História" →
emit('moveToHistory', carId) →
handleMoveToHistory(carId) →
useGarage.moveCar(id, 'current', 'history') →
POST /api/garage/[id]/move →
loadAll() → UI atualiza
```

**Ver Anúncios de Objetivo:**

```
User clica "Ver Anúncios" →
emit('viewAds', slug) →
handleViewAds(slug) →
router.push('/anuncios?model=slug')
```

**Marcar Notificação como Lida:**

```
User clica na notificação →
emit('markAsRead', id) →
markNotificationAsRead(id) →
Atualiza estado local (notification.read = true)
```

---

## 📊 Tipos de Notificações

| Tipo         | Ícone | Cor      | Descrição                   |
| ------------ | ----- | -------- | --------------------------- |
| APPRECIATION | ↗️    | Verde    | Carro valorizou             |
| DEPRECIATION | ↘️    | Vermelho | Carro desvalorizou          |
| NEW_AD       | 📢    | Azul     | Novos anúncios disponíveis  |
| PRICE_ALERT  | 🔔    | Âmbar    | Preço aproximou do objetivo |
| GOAL_MATCH   | ✅    | Verde    | Objetivo atingido           |
| INSIGHT      | 💡    | Roxo     | Insight de mercado          |

---

## 🎯 Tom de Voz (seguindo auto-urban-narrative-core.md)

### Microcopys Implementados:

**Header:**

- "Sua história sobre rodas continua."
- "O mercado respeita — e o coração sente pulsar."

**Empty States:**

- "Nenhum carro cadastrado ainda" (não "sem carros")
- "Os carros que você teve no passado aparecerão aqui"
- "Adicione carros que você sonha em ter no futuro"

**CTA Final:**

- "Continue escrevendo sua história."
- "O próximo carro certo pode estar esperando por você."

**Notificações:**

- "Valorizou 2,3% nos últimos 30 dias" (dados reais)
- "3 novos anúncios na sua faixa de preço" (específico)
- "Está entre os 10% que mais valorizaram" (orgulho)

---

## ✅ Checklist de Funcionalidades

- ✅ KPIs no header (5 métricas principais)
- ✅ Abas de navegação (Atuais, História, Objetivos, Stats)
- ✅ Cards de carros atuais com modificações
- ✅ Timeline de histórico com lucro/prejuízo
- ✅ Cards de objetivos com alertas
- ✅ Feed de notificações com tipos variados
- ✅ Estatísticas com gráficos Chart.js
- ✅ Empty states personalizados
- ✅ Loading states (skeleton)
- ✅ Error handling com retry
- ✅ Sidebar de notificações (sticky)
- ✅ CTA para marketplace
- ✅ Mock data realista
- ✅ Composable para gerenciar estado
- ✅ API endpoints funcionais

---

## 🚀 Próximos Passos (Futuro)

### Backend Real

- Integrar com banco de dados
- Autenticação (identificar usuário)
- CRUD completo de carros
- Sistema de alertas automático
- Integração com API FIPE real

### Funcionalidades Extras

- Upload de fotos
- Edição de carros inline
- Filtros na timeline de histórico
- Comparação de carros da garagem
- Exportar relatórios PDF
- Compartilhar garagem (link público)
- Gamificação (badges, conquistas)

### Melhorias de UX

- Drag & drop para reordenar
- Swipe gestures mobile
- Animações mais elaboradas
- Tour guiado (onboarding)
- Atalhos de teclado

---

## 📝 Notas de Implementação

1. **Formatação**: Os arquivos seguem o padrão Prettier do projeto (tabs, sem ponto-e-vírgula, aspas simples)

2. **Erros de Lint**: Há alguns warnings de ESLint sobre elementos self-closing que serão corrigidos automaticamente ao formatar

3. **Chart.js**: Simplificado para evitar conflitos de tipagem. Pode ser expandido conforme necessário

4. **Responsividade**: Grid adaptativo (mobile-first). Sidebar vira coluna única em mobile

5. **Acessibilidade**: Ícones com context, botões com labels, cores com contraste adequado

---

## 🎨 Identidade Visual

Seguindo o **auto-urban-narrative-core.md**:

- **Modo Dark**: Predominante (entusiasta noturno)
- **Metálico**: Texturas que lembram aço escovado
- **Honeycomb**: Textura sutil de fundo
- **Glow Effects**: Azul M, Vermelho RS
- **Tipografia**: Forte, técnica, tipo painel BMW

---

## 💬 Linguagem do Sistema

- **Pessoal**: "Seu BMW valorizou" (não "O veículo")
- **Emocional**: "Esse carro te ensinou o que é torque"
- **Técnica**: "326cv, 6 cilindros em linha"
- **Sem marketing**: "Dados FIPE reais" (não "oferta imperdível")

---

**✨ A Garagem Viva está pronta para receber os motores que contam histórias.**
