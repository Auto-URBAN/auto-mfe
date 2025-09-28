<template>
  <div>
    <!-- Page Header -->
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-gray-900">Moderação de Veículos</h1>
      <p class="mt-2 text-sm text-gray-600">
        Gerencie anúncios de veículos da plataforma
      </p>
    </div>

    <!-- Status Tabs -->
    <div class="mb-6">
      <nav class="flex space-x-8 border-b border-gray-200">
        <button
          v-for="tab in tabs"
          :key="tab.key"
          @click="selectedTab = tab.key"
          :class="[
            'py-2 px-1 border-b-2 font-medium text-sm transition-colors',
            selectedTab === tab.key
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          ]"
        >
          {{ tab.label }}
          <span
            v-if="tab.count > 0"
            :class="[
              'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ml-2',
              tab.key === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'
            ]"
          >
            {{ tab.count }}
          </span>
        </button>
      </nav>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="space-y-4">
      <div v-for="i in 5" :key="i" class="h-24 bg-gray-200 animate-pulse rounded-lg" />
    </div>

    <!-- Error State -->
    <div
      v-else-if="error"
      class="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded"
    >
      <div class="flex">
        <Icon name="heroicons:exclamation-triangle" class="h-5 w-5 text-red-400 mr-2" />
        <p class="text-sm">{{ error }}</p>
      </div>
    </div>

    <!-- Vehicles Table -->
    <div v-else class="bg-white rounded-lg shadow">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Veículo
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Vendedor
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Data
              </th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="vehicle in filteredVehicles" :key="vehicle.id" class="hover:bg-gray-50">
              <!-- Vehicle Info -->
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <img
                    :src="vehicle.coverImageUrl || '/imgs/car-placeholder.jpg'"
                    :alt="vehicle.title"
                    class="h-12 w-12 rounded-lg object-cover"
                  />
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900">
                      {{ vehicle.title }}
                    </div>
                    <div class="text-sm text-gray-500">
                      {{ formatCurrency(vehicle.price) }} • {{ vehicle.km.toLocaleString() }} km
                    </div>
                  </div>
                </div>
              </td>

              <!-- Seller Info -->
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ vehicle.seller.phone }}</div>
                <div class="text-sm text-gray-500">{{ vehicle.city }}, {{ vehicle.uf }}</div>
              </td>

              <!-- Status -->
              <td class="px-6 py-4 whitespace-nowrap">
                <StatusBadge :status="vehicle.status" />
              </td>

              <!-- Date -->
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ formatDate(vehicle.createdAt) }}
              </td>

              <!-- Actions -->
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div class="flex justify-end space-x-2">
                  <button
                    @click="viewVehicle(vehicle.id)"
                    class="inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <Icon name="heroicons:eye" class="mr-1 w-4 h-4" />
                    Ver
                  </button>
                  
                  <button
                    v-if="vehicle.status === 'PENDING'"
                    @click="approveVehicle(vehicle.id)"
                    :disabled="moderatingId === vehicle.id"
                    class="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                  >
                    <Icon name="heroicons:check" class="mr-1 w-4 h-4" />
                    {{ moderatingId === vehicle.id ? 'Aprovando...' : 'Aprovar' }}
                  </button>
                  
                  <button
                    v-if="vehicle.status === 'PENDING'"
                    @click="openRejectModal(vehicle)"
                    class="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    <Icon name="heroicons:x-mark" class="mr-1 w-4 h-4" />
                    Rejeitar
                  </button>
                </div>
              </td>
            </tr>
            
            <!-- Empty State -->
            <tr v-if="filteredVehicles.length === 0">
              <td colspan="5" class="px-6 py-12 text-center">
                <Icon name="heroicons:truck" class="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 class="text-sm font-medium text-gray-900 mb-1">
                  Nenhum veículo encontrado
                </h3>
                <p class="text-sm text-gray-500">
                  Não há veículos {{ statusText }} no momento.
                </p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Reject Modal -->
    <div v-if="showRejectModal" class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div class="px-6 py-4 border-b border-gray-200">
          <h3 class="text-lg font-semibold">Rejeitar Anúncio</h3>
        </div>

        <div class="p-6 space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Motivo da rejeição
            </label>
            <textarea
              v-model="rejectionReason"
              placeholder="Descreva o motivo da rejeição..."
              rows="4"
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <div class="px-6 py-4 bg-gray-50 flex justify-end space-x-3 rounded-b-lg">
          <button
            @click="closeRejectModal"
            class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cancelar
          </button>
          <button
            :disabled="!rejectionReason.trim() || moderatingId !== null"
            @click="confirmReject"
            class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
          >
            {{ moderatingId !== null ? 'Rejeitando...' : 'Rejeitar Anúncio' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import StatusBadge from '~/components/StatusBadge.vue'
import type { VehicleStatus } from '~/schemas/vehicle'

definePageMeta({
  layout: 'admin',
  middleware: 'admin-auth'
})

const route = useRoute()
const router = useRouter()

// Admin vehicles data
const vehicles = ref([])
const loading = ref(false)
const error = ref<string | null>(null)

// Load vehicles function  
const loadVehicles = async () => {
  loading.value = true
  error.value = null
  
  try {
    const vehiclesData = await $fetch('/api/admin/vehicles')
    vehicles.value = vehiclesData
  } catch (err: any) {
    error.value = err.message || 'Erro ao carregar veículos'
    console.error('Error loading vehicles:', err)
  } finally {
    loading.value = false
  }
}

// Reactive data
const selectedTab = ref<VehicleStatus | 'all'>('pending')
const showRejectModal = ref(false)
const rejectionReason = ref('')
const vehicleToReject = ref(null)
const moderatingId = ref<string | null>(null)

// Computed
const tabs = computed(() => [
  {
    key: 'pending' as const,
    label: 'Pendentes',
    count: vehicles.value.filter(v => v.status === 'PENDING').length
  },
  {
    key: 'approved' as const,
    label: 'Aprovados',
    count: vehicles.value.filter(v => v.status === 'APPROVED').length
  },
  {
    key: 'rejected' as const,
    label: 'Rejeitados',
    count: vehicles.value.filter(v => v.status === 'REJECTED').length
  },
  {
    key: 'all' as const,
    label: 'Todos',
    count: vehicles.value.length
  }
])

const filteredVehicles = computed(() => {
  if (selectedTab.value === 'all') {
    return vehicles.value
  }
  return vehicles.value.filter(v => v.status === selectedTab.value.toUpperCase())
})

const statusText = computed(() => {
  const texts = {
    pending: 'pendentes',
    approved: 'aprovados', 
    rejected: 'rejeitados',
    all: 'cadastrados'
  }
  return texts[selectedTab.value]
})

// Methods
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value)
}

const formatDate = (date: string) => {
  return new Intl.DateTimeFormat('pt-BR').format(new Date(date))
}

const viewVehicle = (vehicleId: string) => {
  // Navigate to vehicle details (will be implemented in Sprint 2)
  navigateTo(`/carro/${vehicleId}`)
}

const approveVehicle = async (vehicleId: string) => {
  moderatingId.value = vehicleId
  
  try {
    const result = await $fetch(`/api/admin/vehicles/${vehicleId}/approve`, {
      method: 'POST'
    })
    
    // Update local state
    const vehicleIndex = vehicles.value.findIndex(v => v.id === vehicleId)
    if (vehicleIndex !== -1) {
      vehicles.value[vehicleIndex].status = 'APPROVED'
    }
    
    console.log('Veículo aprovado com sucesso')
  } catch (error: any) {
    console.error('Erro ao aprovar veículo:', error)
    alert('Erro ao aprovar veículo: ' + (error.message || 'Erro desconhecido'))
  } finally {
    moderatingId.value = null
  }
}

const openRejectModal = (vehicle: any) => {
  vehicleToReject.value = vehicle
  showRejectModal.value = true
  rejectionReason.value = ''
}

const closeRejectModal = () => {
  showRejectModal.value = false
  vehicleToReject.value = null
  rejectionReason.value = ''
}

const confirmReject = async () => {
  if (!vehicleToReject.value || !rejectionReason.value.trim()) return
  
  moderatingId.value = vehicleToReject.value.id
  
  try {
    const result = await $fetch(`/api/admin/vehicles/${vehicleToReject.value.id}/reject`, {
      method: 'POST',
      body: {
        reason: rejectionReason.value.trim()
      }
    })
    
    // Update local state
    const vehicleIndex = vehicles.value.findIndex(v => v.id === vehicleToReject.value.id)
    if (vehicleIndex !== -1) {
      vehicles.value[vehicleIndex].status = 'REJECTED'
      vehicles.value[vehicleIndex].rejectionReason = rejectionReason.value.trim()
    }
    
    console.log('Veículo rejeitado com sucesso')
    closeRejectModal()
  } catch (error: any) {
    console.error('Erro ao rejeitar veículo:', error)
    alert('Erro ao rejeitar veículo: ' + (error.message || 'Erro desconhecido'))
  } finally {
    moderatingId.value = null
  }
}

// Watch route params
watch(() => route.query.status, (status) => {
  if (status && ['pending', 'approved', 'rejected', 'all'].includes(status as string)) {
    selectedTab.value = status as VehicleStatus | 'all'
  }
}, { immediate: true })

// Watch selected tab to update URL
watch(selectedTab, (newTab) => {
  router.replace({ query: { ...route.query, status: newTab } })
})

// Lifecycle
onMounted(async () => {
  await loadVehicles()
})

// Meta
useHead({
  title: 'Moderação de Veículos - Admin Auto URBAN'
})
</script>