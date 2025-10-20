<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Loading State -->
    <div v-if="loading" class="py-20">
      <UiContainer>
        <div class="animate-pulse space-y-8">
          <div class="h-96 bg-gray-200 rounded-xl" />
          <div class="h-12 bg-gray-200 rounded w-1/2" />
          <div class="grid grid-cols-4 gap-4">
            <div v-for="i in 4" :key="i" class="h-24 bg-gray-200 rounded" />
          </div>
        </div>
      </UiContainer>
    </div>

    <!-- Content -->
    <div v-else-if="vehicle">
      <!-- 1️⃣ Header do Modelo -->
      <section class="relative bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white overflow-hidden">
        <div class="absolute inset-0 opacity-10">
          <img 
            :src="vehicle.coverImageUrl" 
            alt="" 
            class="w-full h-full object-cover blur-3xl"
          >
        </div>
        
        <UiContainer size="xl" padding="md" class="relative py-20">
          <div class="grid lg:grid-cols-2 gap-12 items-center">
            <!-- Left: Image -->
            <div class="relative">
              <div class="aspect-video rounded-2xl overflow-hidden shadow-2xl">
                <img
                  :src="vehicle.coverImageUrl"
                  :alt="`${vehicle.brand} ${vehicle.model}`"
                  class="w-full h-full object-cover"
                >
              </div>
              
              <!-- Image Gallery Thumbnails -->
              <div v-if="vehicle.images && vehicle.images.length > 1" class="grid grid-cols-4 gap-3 mt-4">
                <div
                  v-for="(img, idx) in vehicle.images.slice(0, 4)"
                  :key="idx"
                  class="aspect-video rounded-lg overflow-hidden cursor-pointer hover:opacity-75 transition-opacity"
                >
                  <img :src="img" alt="" class="w-full h-full object-cover">
                </div>
              </div>
            </div>

            <!-- Right: Info -->
            <div>
              <!-- Brand Logo -->
              <div class="flex items-center gap-3 mb-4">
                <img 
                  :src="getBrandLogo(vehicle.brand)" 
                  :alt="vehicle.brand"
                  class="w-12 h-12 object-contain"
                >
                <span class="text-sm font-medium text-gray-400 uppercase tracking-wider">
                  {{ vehicle.brand }}
                </span>
              </div>

              <!-- Model Name -->
              <h1 class="text-5xl font-black mb-4">
                {{ vehicle.model }}
              </h1>

              <!-- Badges -->
              <div class="flex flex-wrap gap-3 mb-6">
                <UiBadge color="blue" variant="solid" size="lg">
                  {{ vehicle.year }}
                </UiBadge>
                <UiBadge color="gray" variant="soft" size="lg">
                  {{ vehicle.gearbox || 'Automático' }}
                </UiBadge>
                <UiBadge color="yellow" variant="soft" size="lg">
                  {{ vehicle.horsepower }} cv
                </UiBadge>
              </div>

              <!-- Description -->
              <p class="text-lg text-gray-300 mb-8 leading-relaxed">
                {{ vehicle.description || `${vehicle.brand} ${vehicle.model} - Uma máquina feita para quem busca desempenho e estilo.` }}
              </p>

              <!-- CTA -->
              <div class="flex gap-4">
                <UiButton size="lg" class="bg-gradient-to-r from-blue-600 to-purple-600">
                  <Icon name="heroicons:heart-20-solid" class="w-5 h-5" />
                  Adicionar à Garagem
                </UiButton>
                <UiButton variant="outline" size="lg" class="border-white/30 text-white hover:bg-white/10">
                  <Icon name="heroicons:share-20-solid" class="w-5 h-5" />
                  Compartilhar
                </UiButton>
              </div>
            </div>
          </div>
        </UiContainer>
      </section>

      <!-- 2️⃣ Ficha Técnica -->
      <section class="py-16 bg-white">
        <UiContainer size="xl" padding="md">
          <div class="text-center mb-12">
            <h2 class="text-3xl font-bold text-gray-900 mb-3">Ficha Técnica</h2>
            <p class="text-gray-600">Especificações completas do modelo</p>
          </div>

          <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            <!-- Specs Cards -->
            <div class="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-6 border border-orange-200">
              <div class="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center mb-3">
                <Icon name="heroicons:bolt-20-solid" class="w-6 h-6 text-white" />
              </div>
              <p class="text-sm text-gray-600 mb-1">Potência</p>
              <p class="text-2xl font-bold text-gray-900">{{ vehicle.horsepower }} <span class="text-sm">cv</span></p>
            </div>

            <div class="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
              <div class="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center mb-3">
                <Icon name="heroicons:calendar-20-solid" class="w-6 h-6 text-white" />
              </div>
              <p class="text-sm text-gray-600 mb-1">Ano</p>
              <p class="text-2xl font-bold text-gray-900">{{ vehicle.year }}</p>
            </div>

            <div class="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
              <div class="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center mb-3">
                <Icon name="heroicons:cog-20-solid" class="w-6 h-6 text-white" />
              </div>
              <p class="text-sm text-gray-600 mb-1">Câmbio</p>
              <p class="text-xl font-bold text-gray-900">{{ vehicle.gearbox || 'AUTO' }}</p>
            </div>

            <div class="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
              <div class="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center mb-3">
                <Icon name="heroicons:fire-20-solid" class="w-6 h-6 text-white" />
              </div>
              <p class="text-sm text-gray-600 mb-1">Combustível</p>
              <p class="text-xl font-bold text-gray-900">{{ vehicle.fuel || 'GASOLINA' }}</p>
            </div>

            <div class="bg-gradient-to-br from-pink-50 to-pink-100 rounded-xl p-6 border border-pink-200">
              <div class="w-10 h-10 bg-pink-500 rounded-lg flex items-center justify-center mb-3">
                <Icon name="heroicons:swatch-20-solid" class="w-6 h-6 text-white" />
              </div>
              <p class="text-sm text-gray-600 mb-1">Cor</p>
              <p class="text-xl font-bold text-gray-900">{{ vehicle.color || 'N/D' }}</p>
            </div>

            <div class="bg-gradient-to-br from-cyan-50 to-cyan-100 rounded-xl p-6 border border-cyan-200">
              <div class="w-10 h-10 bg-cyan-500 rounded-lg flex items-center justify-center mb-3">
                <Icon name="heroicons:map-pin-20-solid" class="w-6 h-6 text-white" />
              </div>
              <p class="text-sm text-gray-600 mb-1">Localização</p>
              <p class="text-xl font-bold text-gray-900">{{ vehicle.city }}, {{ vehicle.uf }}</p>
            </div>

            <div class="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-6 border border-yellow-200">
              <div class="w-10 h-10 bg-yellow-500 rounded-lg flex items-center justify-center mb-3">
                <Icon name="heroicons:chart-bar-20-solid" class="w-6 h-6 text-white" />
              </div>
              <p class="text-sm text-gray-600 mb-1">Quilometragem</p>
              <p class="text-2xl font-bold text-gray-900">{{ formatKm(vehicle.km) }}</p>
            </div>

            <div class="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-6 border border-red-200">
              <div class="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center mb-3">
                <Icon name="heroicons:tag-20-solid" class="w-6 h-6 text-white" />
              </div>
              <p class="text-sm text-gray-600 mb-1">FIPE</p>
              <p class="text-sm font-bold text-gray-900">{{ vehicle.fipeCode || 'N/D' }}</p>
            </div>
          </div>
        </UiContainer>
      </section>

      <!-- 3️⃣ Histórico de Preço FIPE -->
      <section v-if="vehicle.prices && vehicle.prices.length > 0" class="py-16 bg-gray-50">
        <UiContainer size="xl" padding="md">
          <div class="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
            <div class="flex items-center justify-between mb-8">
              <div>
                <h2 class="text-3xl font-bold text-gray-900 mb-2">Histórico de Preço</h2>
                <p class="text-gray-600">Evolução do valor nos últimos meses</p>
              </div>
              <div class="text-right">
                <p class="text-sm text-gray-500 mb-1">Valor atual</p>
                <p class="text-3xl font-bold text-green-600">{{ formatCurrency(vehicle.price) }}</p>
                <p
v-if="priceVariation" :class="[
                  'text-sm font-medium mt-1',
                  priceVariation > 0 ? 'text-green-600' : 'text-red-600'
                ]">
                  {{ priceVariation > 0 ? '+' : '' }}{{ priceVariation.toFixed(2) }}% (12 meses)
                </p>
              </div>
            </div>

            <!-- Simple Price List -->
            <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <div
                v-for="(price, idx) in vehicle.prices"
                :key="idx"
                class="bg-gray-50 rounded-lg p-4 border border-gray-200"
              >
                <p class="text-xs text-gray-500 mb-1">{{ formatMonth(price.month) }}</p>
                <p class="text-lg font-bold text-gray-900">{{ formatCurrency(price.value) }}</p>
              </div>
            </div>
          </div>
        </UiContainer>
      </section>

      <!-- 4️⃣ Anúncios Ativos -->
      <section class="py-16 bg-white">
        <UiContainer size="xl" padding="md">
          <div class="text-center mb-12">
            <h2 class="text-3xl font-bold text-gray-900 mb-3">Anúncios Disponíveis</h2>
            <p class="text-gray-600">Encontre este modelo à venda na plataforma</p>
          </div>

          <div v-if="relatedAds.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <VehicleCard
              v-for="ad in relatedAds"
              :key="ad.id"
              :title="ad.title"
              :href="`/anuncios/${ad.id}`"
              :cover-image-url="ad.coverImageUrl"
              :brand="ad.brand"
              :price="ad.price"
              :year="ad.year"
              :km="ad.km"
              :uf="ad.uf"
              :horsepower="ad.horsepower"
            />
          </div>

          <div v-else class="text-center py-12 bg-gray-50 rounded-xl">
            <Icon name="heroicons:inbox-20-solid" class="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p class="text-gray-600">Nenhum anúncio ativo no momento</p>
            <UiButton variant="outline" class="mt-4">
              Ver todos os anúncios
            </UiButton>
          </div>
        </UiContainer>
      </section>

      <!-- 5️⃣ Modelos Similares -->
      <section class="py-16 bg-gray-50">
        <UiContainer size="xl" padding="md">
          <div class="text-center mb-12">
            <h2 class="text-3xl font-bold text-gray-900 mb-3">Modelos Similares</h2>
            <p class="text-gray-600">Outros carros que você pode gostar</p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <NuxtLink
              v-for="similar in similarModels"
              :key="similar.id"
              :to="`/carro/${similar.slug}`"
              class="group bg-white rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-200"
            >
              <div class="aspect-video overflow-hidden bg-gray-100">
                <img
                  :src="similar.coverImageUrl"
                  :alt="similar.title"
                  class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                >
              </div>
              <div class="p-6">
                <h3 class="font-bold text-lg text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                  {{ similar.brand }} {{ similar.model }}
                </h3>
                <p class="text-2xl font-bold text-green-600">{{ formatCurrency(similar.price) }}</p>
              </div>
            </NuxtLink>
          </div>
        </UiContainer>
      </section>
    </div>

    <!-- Error State -->
    <div v-else class="py-20">
      <UiContainer class="text-center">
        <Icon name="heroicons:exclamation-circle-20-solid" class="w-20 h-20 text-red-500 mx-auto mb-4" />
        <h2 class="text-2xl font-bold text-gray-900 mb-2">Modelo não encontrado</h2>
        <p class="text-gray-600 mb-6">O modelo que você procura não existe ou foi removido.</p>
        <NuxtLink to="/carro">
          <UiButton>
            Voltar para modelos
          </UiButton>
        </NuxtLink>
      </UiContainer>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { VehicleDetail, VehicleSummary } from '@/schemas/vehicle'

interface SearchResult {
  items: VehicleSummary[]
  total: number
  page: number
  pageSize: number
}

const route = useRoute()
const slug = route.params.slug as string

const loading = ref(true)
const vehicle = ref<VehicleDetail | null>(null)
const relatedAds = ref<VehicleSummary[]>([])
const similarModels = ref<VehicleSummary[]>([])

useHead({
  title: () => vehicle.value ? `${vehicle.value.brand} ${vehicle.value.model} - Auto URBAN` : 'Modelo - Auto URBAN',
  meta: [
    { name: 'description', content: () => vehicle.value?.description || 'Ficha técnica completa do modelo' }
  ]
})

const priceVariation = computed(() => {
  if (!vehicle.value?.prices || vehicle.value.prices.length < 2) return null
  const first = vehicle.value.prices[0]?.value
  const last = vehicle.value.prices[vehicle.value.prices.length - 1]?.value
  if (!first || !last) return null
  return ((last - first) / first) * 100
})

// Load vehicle details
async function loadVehicle() {
  loading.value = true
  try {
    const response = await $fetch<SearchResult>('/api/vehicles', {
      query: { pageSize: 100 }
    })

    if (response?.items) {
      // Find vehicle by slug
      vehicle.value = response.items.find((v: VehicleSummary) => v.slug === slug) as VehicleDetail || null
      
      if (vehicle.value) {
        // Load related ads (same brand and model)
        relatedAds.value = response.items
          .filter((v: VehicleSummary) => 
            v.brand === vehicle.value!.brand && 
            v.model === vehicle.value!.model &&
            v.id !== vehicle.value!.id
          )
          .slice(0, 6)

        // Load similar models (same brand, different model)
        similarModels.value = response.items
          .filter((v: VehicleSummary) => 
            v.brand === vehicle.value!.brand && 
            v.model !== vehicle.value!.model
          )
          .slice(0, 3)
      }
    }
  } catch (error) {
    console.error('Error loading vehicle:', error)
  } finally {
    loading.value = false
  }
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 0
  }).format(value)
}

function formatKm(km: number): string {
  if (km === 0) return '0 km'
  if (km < 1000) return `${km} km`
  return `${(km / 1000).toFixed(0)}k km`
}

function formatMonth(month: string): string {
  const [year, monthNum] = month.split('-')
  const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']
  if (!monthNum) return month
  return `${months[parseInt(monthNum) - 1]}/${year}`
}

function getBrandLogo(brand: string): string {
  const logos: Record<string, string> = {
    'Audi': '/logos/audi.webp',
    'BMW': '/logos/bmw.webp',
    'Chevrolet': '/logos/chevrolet.webp',
    'Ford': '/logos/ford.webp',
    'Honda': '/logos/honda.webp',
    'Hyundai': '/logos/hyundai.webp',
    'Mercedes-Benz': '/logos/mercedes-benz.webp',
    'Nissan': '/logos/nissan.webp',
    'Porsche': '/logos/porsche.webp',
    'Renault': '/logos/renault.webp',
    'Toyota': '/logos/toyota.webp',
    'Volkswagen': '/logos/volkswagen.webp'
  }
  return logos[brand] || '/logos/default-car-logo.webp'
}

onMounted(() => {
  loadVehicle()
})
</script>
