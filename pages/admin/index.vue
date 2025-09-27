<template>
  <div>
    <!-- Page Header -->
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-gray-900">Dashboard Administrativo</h1>
      <p class="mt-2 text-sm text-gray-600">
        Visão geral da plataforma Auto URBAN
      </p>
    </div>

    <!-- Loading State -->
    <div v-if="adminStore.isLoading" class="space-y-6">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <USkeleton v-for="i in 4" :key="i" class="h-24" />
      </div>
    </div>

    <!-- Error State -->
    <UAlert
      v-else-if="adminStore.error"
      icon="i-heroicons-exclamation-triangle"
      color="red"
      variant="subtle"
      :title="adminStore.error"
      class="mb-6"
    />

    <!-- Dashboard Content -->
    <div v-else class="space-y-8">
      <!-- Metrics Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <BigNumberCard
          title="Total de Veículos"
          :value="metrics?.totals.vehicles || 0"
          icon="i-heroicons-truck"
          color="blue"
        />
        
        <BigNumberCard
          title="Aguardando Aprovação"
          :value="metrics?.totals.pending || 0"
          icon="i-heroicons-clock"
          color="yellow"
          :clickable="true"
          @click="navigateTo('/admin/vehicles?status=pending')"
        />
        
        <BigNumberCard
          title="Aprovados"
          :value="metrics?.totals.approved || 0"
          icon="i-heroicons-check-circle"
          color="green"
        />
        
        <BigNumberCard
          title="Total de Usuários"
          :value="metrics?.totals.users || 0"
          icon="i-heroicons-users"
          color="purple"
          :clickable="true"
          @click="navigateTo('/admin/users')"
        />
      </div>

      <!-- Charts Section -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- Top Brands -->
        <UCard>
          <template #header>
            <h3 class="text-lg font-semibold text-gray-900">Top Marcas</h3>
          </template>
          
          <div class="space-y-4">
            <div 
              v-for="brand in topBrands" 
              :key="brand.brand"
              class="flex items-center justify-between"
            >
              <span class="text-sm font-medium text-gray-900">{{ brand.brand }}</span>
              <div class="flex items-center space-x-2">
                <div class="w-24 bg-gray-200 rounded-full h-2">
                  <div 
                    class="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    :style="{ width: `${(brand.count / maxBrandCount) * 100}%` }"
                  />
                </div>
                <span class="text-sm text-gray-600 w-8 text-right">{{ brand.count }}</span>
              </div>
            </div>
          </div>
        </UCard>

        <!-- Top States -->
        <UCard>
          <template #header>
            <h3 class="text-lg font-semibold text-gray-900">Estados com Mais Anúncios</h3>
          </template>
          
          <div class="space-y-4">
            <div 
              v-for="uf in topStates" 
              :key="uf.uf"
              class="flex items-center justify-between"
            >
              <span class="text-sm font-medium text-gray-900">{{ uf.uf }}</span>
              <div class="flex items-center space-x-2">
                <div class="w-24 bg-gray-200 rounded-full h-2">
                  <div 
                    class="bg-green-600 h-2 rounded-full transition-all duration-300"
                    :style="{ width: `${(uf.count / maxStateCount) * 100}%` }"
                  />
                </div>
                <span class="text-sm text-gray-600 w-8 text-right">{{ uf.count }}</span>
              </div>
            </div>
          </div>
        </UCard>
      </div>

      <!-- Quick Actions -->
      <UCard>
        <template #header>
          <h3 class="text-lg font-semibold text-gray-900">Ações Rápidas</h3>
        </template>
        
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <UButton
            variant="outline"
            size="lg"
            icon="i-heroicons-eye"
            class="justify-start"
            @click="navigateTo('/admin/vehicles?status=pending')"
          >
            Revisar Anúncios Pendentes
          </UButton>
          
          <UButton
            variant="outline"
            size="lg"
            icon="i-heroicons-users"
            class="justify-start"
            @click="navigateTo('/admin/users')"
          >
            Gerenciar Usuários
          </UButton>
          
          <UButton
            variant="outline"
            size="lg"
            icon="i-heroicons-chart-bar"
            class="justify-start"
            disabled
          >
            Relatórios (Em Breve)
          </UButton>
        </div>
      </UCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAdminStore } from '~/stores/admin'
import BigNumberCard from '~/components/BigNumberCard.vue'

definePageMeta({
  layout: 'admin',
  middleware: 'admin-auth'
})

const adminStore = useAdminStore()

// Computed
const metrics = computed(() => adminStore.metrics)

const topBrands = computed(() => {
  if (!metrics.value?.byBrand) return []
  return metrics.value.byBrand.slice(0, 5)
})

const topStates = computed(() => {
  if (!metrics.value?.byUF) return []
  return metrics.value.byUF.slice(0, 5)
})

const maxBrandCount = computed(() => {
  return Math.max(...(topBrands.value.map(b => b.count) || [1]))
})

const maxStateCount = computed(() => {
  return Math.max(...(topStates.value.map(s => s.count) || [1]))
})

// Lifecycle
onMounted(async () => {
  await adminStore.loadMetrics()
})

// Meta
useHead({
  title: 'Admin Dashboard - Auto URBAN'
})
</script>