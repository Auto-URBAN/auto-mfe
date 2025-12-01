# Auto URBAN - Roadmap Fase 2

## Status Atual (Fase 1 Completa ✅ + Fase 2 Quase Completa ✅)

### Sistema de Autenticação

- ✅ Login por telefone + OTP de 6 dígitos
- ✅ JWT tokens com refresh automático
- ✅ Persistência de sessão (cookies)
- ✅ Middleware de proteção de rotas
- ✅ Header dinâmico com estado do usuário

### Progresso da Fase 2 (85% Completo)

**✅ Páginas de Veículos Individuais (100%)**

- Páginas dinâmicas `/carros/[slug]` completas
- Ficha técnica, gráficos, favoritos, compartilhamento

**✅ Sistema de Busca Avançada (100%)**

- Busca inteligente, filtros, comparador de modelos
- Interface responsiva e otimizada

**✅ Sistema de Favoritos (100%)**

- Backend Spring Boot + Frontend Nuxt integrados
- API REST completa e testada

**🚧 Integração Simulação Financeira (Pendente)**

- Conectar com auto-simulation-bot (porta 3001)

**🚧 Garagem do Usuário (50%)**

- Favoritos ✅, falta: histórico, alertas, comparador

### Backend (Spring Boot)

- ✅ API REST funcional na porta 8080
- ✅ Autenticação JWT + OTP
- ✅ PostgreSQL integrado
- ✅ CORS configurado
- ✅ Endpoints: `/auth/send-otp`, `/auth/verify-otp`, `/cars`
- ✅ **Novo**: Endpoints `/api/v1/favorites/**`

### Frontend (Nuxt 3)

- ✅ Páginas de login e verificação
- ✅ Composable `useAuthSimple` funcional
- ✅ Integração completa com API real
- ✅ Página de perfil operacional
- ✅ **Novo**: Composable `useFavorites` integrado

---

## ✅ Implementado na Fase 2

### Páginas de Veículos Individuais Completas (30/11/2025)

**Frontend (Nuxt 3)**:

- ✅ `/pages/carros/[slug].vue` - Página dinâmica completa
- ✅ Galeria de imagens responsiva com zoom
- ✅ Ficha técnica interativa com cards visuais
- ✅ Seleção de anos/variantes com dados específicos
- ✅ Histórico de preços FIPE (últimos 12 meses)
- ✅ Gráfico de evolução de preços (Chart.js)
- ✅ Sistema de favoritos integrado com feedback visual
- ✅ Modal de simulação financeira (`VehicleSimulationModal`)
- ✅ Modal de compartilhamento social (`ShareModal`)
- ✅ Anúncios do mesmo modelo (mockados)
- ✅ Sugestões de modelos similares
- ✅ SEO otimizado com head() dinâmico
- ✅ Responsive design mobile-first

**APIs Integradas**:

- ✅ `GET /api/vehicles/{slug}` - Dados completos do veículo
- ✅ Busca de veículos relacionados (/api/vehicles)
- ✅ Sistema de favoritos funcionando

### Sistema de Busca Avançada Completo (30/11/2025)

**Frontend (Nuxt 3)**:

- ✅ `SearchEngine.vue` - Busca inteligente com autocomplete
- ✅ `SearchInput.vue` - Componente de input otimizado
- ✅ `AISearchSuggestions.vue` - Sugestões personalizadas
- ✅ `VehicleFilterSidebar.vue` - Filtros avançados
- ✅ `VehicleComparator.vue` - Comparação lado a lado
- ✅ `/pages/carros/index.vue` - Página comparador completa
- ✅ Composable `useSearch.ts` - Lógica reutilizável

**Funcionalidades**:

- ✅ Busca em tempo real
- ✅ Filtros por marca, modelo, ano, preço
- ✅ Comparação de até 4 veículos
- ✅ Categorização (esportivos, luxo, compactos, SUV)
- ✅ Interface responsiva
- ✅ Integração com API backend

### Sistema de Favoritos Completo (30/11/2025)

**Backend (Spring Boot)**:

- ✅ `Favorite.java` - Entidade JPA com relacionamento User/Vehicle
- ✅ `FavoriteRepository.java` - Repositório com queries customizadas
- ✅ `FavoriteService.java` - Lógica de negócio para CRUD de favoritos
- ✅ `FavoriteController.java` - API REST completa
- ✅ `FavoriteDTO.java` / `FavoriteRequestDTO.java` - DTOs para transferência
- ✅ Configuração de segurança permitindo endpoints públicos
- ✅ CORS configurado para integração frontend

**Frontend (Nuxt 3)**:

- ✅ `useFavorites.ts` - Composable integrado com API Java
- ✅ Componentes preparados para usar sistema de favoritos
- ✅ Headers X-User-Id configurados para autenticação

**APIs Funcionais**:

- ✅ `GET /api/v1/favorites/test` - Endpoint de teste
- ✅ `GET /api/v1/favorites` - Listar favoritos do usuário
- ✅ `POST /api/v1/favorites` - Adicionar aos favoritos
- ✅ `DELETE /api/v1/favorites/{vehicleId}` - Remover dos favoritos
- ✅ `POST /api/v1/favorites/toggle` - Toggle favorito

**Banco de Dados**:

- ✅ Tabela `favorites` com constraint único (user_id, vehicle_id)
- ✅ Relacionamento com tabela `users` existente
- ✅ Índices para otimização de queries

---

## Próximas Funcionalidades (Fase 2)

### ✅ Prioridade A: Páginas de Veículos Individuais (COMPLETA)

**Objetivo**: Criar páginas detalhadas para cada veículo

**Implementação**:

- ✅ Página `/carros/[slug].vue` (ex: /carros/porsche-911-turbo)
- ✅ Galeria de fotos com zoom e múltiplas imagens
- ✅ Informações completas (marca, modelo, ano, km, preço)
- ✅ Dados técnicos e equipamentos (ficha técnica interativa)
- ✅ Sistema de favoritos/curtidas integrado
- ✅ Botão "Simular Financiamento" (modal VehicleSimulationModal)
- ✅ Compartilhamento social (modal ShareModal)
- ✅ Histórico de preços FIPE (últimos 12 meses)
- ✅ Gráfico de evolução de preços
- ✅ Anúncios disponíveis do mesmo modelo
- ✅ Modelos similares recomendados
- ✅ SEO otimizado com meta tags dinâmicas

**APIs Funcionais**:

- ✅ `GET /api/vehicles/{slug}` - Detalhes completos do veículo
- ✅ Sistema completo de favoritos integrado
- ✅ Busca de veículos relacionados e similares

### ✅ Prioridade B: Sistema de Busca Avançada (IMPLEMENTADA)

**Objetivo**: Melhorar a experiência de busca e filtros

**Implementação**:

- ✅ Componente `SearchEngine.vue` - Busca inteligente de carros
- ✅ Componente `SearchInput.vue` - Input de busca otimizado
- ✅ Componente `AISearchSuggestions.vue` - Sugestões com IA
- ✅ Composable `useSearch.ts` - Lógica de busca reutilizável
- ✅ Filtros por marca, modelo, ano, preço (`VehicleFilterSidebar`)
- ✅ Busca em tempo real com autocomplete
- ✅ Comparador de modelos (`/carros`) - Compare até 4 veículos
- ✅ Paginação e filtros avançados
- ✅ Interface responsiva e intuitiva

**APIs Necessárias**:

- `GET /api/v1/cars/search` - Busca com filtros
- `GET /api/v1/brands` - Lista de marcas
- `GET /api/v1/models?brand=X` - Modelos por marca
- `GET /api/v1/cities` - Cidades disponíveis

### 🎯 Prioridade C: Integração Simulação Financeira

**Objetivo**: Conectar com auto-simulation-bot

**Implementação**:

- Integração com `http://localhost:3001` (simulation bot)
- Formulário de simulação no veículo
- Comparação de ofertas de múltiplos bancos
- Calculadora de parcelas interativa
- Pré-aprovação de crédito
- Histórico de simulações do usuário

**APIs Necessárias**:

- `POST /api/v1/simulation` - Nova simulação
- `GET /api/v1/simulation/{id}` - Resultado
- `GET /api/v1/banks` - Bancos disponíveis
- Integração com endpoints do simulation-bot

### 🎯 Prioridade D: Garagem do Usuário

**Objetivo**: Área personalizada do usuário

**Implementação**:

- ✅ Lista de veículos favoritos
- Histórico de buscas e visualizações
- Alertas de preço (notificar quando baixar)
- Comparador de até 3 veículos
- Simulações salvas
- Veículos recentemente visualizados

**APIs Necessárias**:

- ✅ `GET /api/v1/favorites` - Sistema completo de favoritos
- ✅ `POST /api/v1/favorites` - Adicionar/remover favoritos
- ✅ `DELETE /api/v1/favorites/{vehicleId}` - Remover favorito
- `POST /api/v1/users/alerts` - Criar alerta
- `GET /api/v1/users/history` - Histórico
- `GET /api/v1/users/simulations` - Simulações

---

## Estrutura Técnica Atual

### Repositórios

- **auto-mfe**: Frontend Nuxt 3 (porta 3000)
- **auto-ms**: Backend Spring Boot (porta 8080)
- **auto-simulation-bot**: Bot simulação (porta 3001)

### Stack Tecnológico

- **Frontend**: Nuxt 3.19.2, Vue 3, TypeScript, Tailwind CSS
- **Backend**: Spring Boot 3.4.1, Java 21, PostgreSQL, Redis
- **Infraestrutura**: Docker Compose

### Banco de Dados

- **PostgreSQL**: Usuários, OTPs, Veículos, Favoritos
- **Redis**: Cache, sessões (futuro)

---

## Próximos Comandos para Desenvolvimento

### Iniciar Ambiente

```bash
# Backend
cd r:\Projects\urban\auto-ms
.\gradlew.bat bootRun

# Frontend
cd r:\Projects\urban\auto-mfe
pnpm dev

# Simulation Bot
cd r:\Projects\urban\auto-simulation-bot
pnpm dev
```

### URLs de Desenvolvimento

- Frontend: http://localhost:3000
- Backend API: http://localhost:8080
- Simulation Bot: http://localhost:3001

---

## Decisão de Prioridade

**Para continuar o desenvolvimento, escolher uma das opções:**

1. **Páginas de Veículos** - Foco na experiência do usuário
2. **Busca Avançada** - Melhoria da funcionalidade core
3. **Simulação Financeira** - Diferencial competitivo
4. **Garagem do Usuário** - Engajamento e retenção

**Estado atual**: Pronto para implementação de qualquer funcionalidade acima.
**Recomendação**: Começar pela **Prioridade A (Páginas de Veículos)** para criar uma experiência completa de visualização.

---

## Fase 3: Funcionalidades Avançadas

### 🚀 Prioridade A: Sistema de Notificações

**Objetivo**: Engajar usuários com alertas personalizados

**Implementação**:

- Push notifications (PWA)
- Email notifications
- Alertas de preço (veículo favorito baixou preço)
- Novos veículos que atendem critérios salvos
- Lembrete de simulações pendentes
- Newsletter semanal personalizada

**Tecnologias**:

- Service Workers para PWA
- Sistema de filas (Redis/RabbitMQ)
- Templates de email (SendGrid/Mailgun)
- WebPush API

### 🚀 Prioridade B: Chat/Suporte

**Objetivo**: Comunicação direta com vendedores/suporte

**Implementação**:

- Chat em tempo real (WebSocket)
- Bot de FAQ automático
- Agendamento de test-drive
- Negociação de preços
- Histórico de conversas
- Status online/offline

**Tecnologias**:

- Socket.io ou WebSocket nativo
- Bot com IA (OpenAI/Claude)
- Sistema de tickets
- Integração WhatsApp Business

### 🚀 Prioridade C: Marketplace Completo

**Objetivo**: Permitir anúncios de usuários

**Implementação**:

- Cadastro de veículos para venda
- Upload múltiplo de fotos
- Validação de documentos
- Sistema de avaliações/reviews
- Planos premium para anunciantes
- Dashboard de vendedor

**APIs Necessárias**:

- `POST /api/v1/cars` - Criar anúncio
- `PUT /api/v1/cars/{id}` - Editar anúncio
- `POST /api/v1/cars/{id}/photos` - Upload fotos
- `GET /api/v1/users/{id}/reviews` - Avaliações

### 🚀 Prioridade D: Analytics e Insights

**Objetivo**: Dados inteligentes para usuários e negócio

**Implementação**:

- Dashboard de métricas (admin)
- Relatório de preços de mercado
- Tendências de vendas por região
- Sugestões personalizadas (ML)
- Análise de comportamento do usuário
- KPIs de conversão

**Tecnologias**:

- Google Analytics 4
- Mixpanel/Amplitude
- Machine Learning (Python/TensorFlow)
- Charts.js/D3.js
- Data pipeline (ETL)

---

## Fase 4: Escala e Performance

### ⚡ Prioridade A: Otimização e Cache

**Objetivo**: Suportar alto volume de usuários

**Implementação**:

- Cache Redis em múltiplas camadas
- CDN para imagens (Cloudinary/AWS S3)
- Lazy loading de imagens
- Paginação virtual
- Service Workers para cache offline
- Compressão de assets

**Melhorias**:

- Lighthouse Score 90+
- Core Web Vitals otimizados
- Bundle size < 200KB
- API response < 100ms

### ⚡ Prioridade B: Microserviços

**Objetivo**: Arquitetura escalável e modular

**Implementação**:

- Separar serviços por domínio:
  - `user-service` (usuários, auth)
  - `car-service` (veículos, buscas)
  - `simulation-service` (financiamento)
  - `notification-service` (alertas)
  - `chat-service` (comunicação)
- API Gateway (Kong/Zuul)
- Service Discovery (Eureka/Consul)
- Circuit Breakers (Hystrix)

### ⚡ Prioridade C: DevOps e CI/CD

**Objetivo**: Deploy automatizado e monitoramento

**Implementação**:

- GitHub Actions para CI/CD
- Docker containers para produção
- Kubernetes orchestration
- Monitoring (Prometheus/Grafana)
- Log aggregation (ELK Stack)
- Health checks automatizados

**Ambientes**:

- Development (localhost)
- Staging (homologação)
- Production (produção)
- Load testing (performance)

### ⚡ Prioridade D: Segurança Avançada

**Objetivo**: Proteção robusta de dados

**Implementação**:

- OAuth2 / OpenID Connect
- Rate limiting por IP/usuário
- Criptografia end-to-end (chat)
- Audit logs completos
- LGPD compliance
- Penetration testing

**Certificações**:

- SSL/TLS certificados
- OWASP Top 10 compliance
- ISO 27001 preparação
- PCI DSS (se processar pagamentos)

---

## Fase 5: Expansão e Inovação

### 🌟 Prioridade A: IA e Machine Learning

**Objetivo**: Experiência inteligente e personalizada

**Implementação**:

- Recomendações personalizadas (ML)
- Chatbot inteligente (GPT/Claude)
- Avaliação automática de veículos (Computer Vision)
- Predição de preços (Time Series)
- Detecção de fraudes (Anomaly Detection)
- Análise de sentimento (reviews)

**Tecnologias**:

- TensorFlow/PyTorch
- OpenAI/Claude APIs
- Computer Vision APIs
- MLOps pipeline
- Feature stores

### 🌟 Prioridade B: Mobile Apps Nativas

**Objetivo**: Experiência mobile premium

**Implementação**:

- React Native ou Flutter
- Push notifications nativas
- Geolocalização avançada
- Camera integration (fotos de veículos)
- Biometric authentication
- Offline-first architecture

**Features Mobile**:

- AR para visualização de veículos
- Integração com Apple CarPlay/Android Auto
- NFC para test-drives
- QR codes para informações rápidas

### 🌟 Prioridade C: Integração Financeira

**Objetivo**: Ecossistema financeiro completo

**Implementação**:

- Open Banking integration
- PIX para pagamentos instantâneos
- Carteira digital integrada
- Seguros de veículos
- Financiamento próprio (marketplace lending)
- Cripto payments (futuro)

**Parcerias**:

- Bancos tradicionais
- Fintechs
- Seguradoras
- Credtechs

### 🌟 Prioridade D: Expansão Geográfica

**Objetivo**: Escalar para outros mercados

**Implementação**:

- Multi-idiomas (i18n)
- Multi-moedas
- Regulamentações locais
- Parceiros regionais
- Adaptação cultural
- Logística local

**Mercados Alvo**:

- Outros estados (BR)
- América Latina
- Europa (Portugal/Espanha)
- Mercados emergentes

---

## Cronograma Sugerido

| Fase       | Duração     | Foco Principal      |
| ---------- | ----------- | ------------------- |
| **Fase 1** | ✅ Completa | Autenticação e Base |
| **Fase 2** | 2-3 meses   | Core Features       |
| **Fase 3** | 3-4 meses   | Engagement          |
| **Fase 4** | 4-6 meses   | Escala              |
| **Fase 5** | 6+ meses    | Inovação            |

**Total**: 15-19 meses para plataforma completa

---

## Métricas de Sucesso por Fase

### Fase 2 (Core)

- 1.000+ usuários registrados
- 100+ veículos visualizados/dia
- 50+ simulações/dia
- Tempo médio sessão: 5+ minutos

### Fase 3 (Engagement)

- 5.000+ usuários ativos
- 70%+ retention rate (7 dias)
- 500+ conversas chat/dia
- 20%+ conversion rate (lead → venda)

### Fase 4 (Escala)

- 50.000+ usuários
- 10.000+ veículos cadastrados
- 99.9% uptime
- < 2s page load time

### Fase 5 (Inovação)

- 500.000+ usuários
- Expansão internacional
- IPO ready metrics
- Market leader position
