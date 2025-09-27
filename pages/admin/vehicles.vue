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
          <UiBadge
            v-if="tab.count > 0"
            :label="tab.count.toString()"
            variant="solid"
            size="xs"
            :color="tab.key === 'pending' ? 'warning' : 'accent'"
            class="ml-2"
          />
        </button>
      </nav>
    </div>

    <!-- Loading State -->
    <div v-if="adminStore.isLoading" class="space-y-4">
      <div v-for="i in 5" :key="i" class="h-24 bg-gray-200 animate-pulse rounded-lg" />
    </div>

    <!-- Error State -->
    <UiAlert
      v-else-if="adminStore.error"
      variant="danger"
      :title="adminStore.error"
      class="mb-6"
    />

    <!-- Vehicles Table -->
    <UiCard v-else>
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
                  <UiButton
                    variant="outline"
                    size="sm"
                    icon-left="heroicons:eye-20-solid"
                    @click="viewVehicle(vehicle.id)"
                  >
                    Ver
                  </UiButton>
                  
                  <UiButton
                    v-if="vehicle.status === 'PENDING'"
                    variant="solid"
                    color="success"
                    size="sm"
                    icon-left="heroicons:check-20-solid"
                    :loading="moderatingId === vehicle.id"
                    @click="approveVehicle(vehicle.id)"
                  >
                    Aprovar
                  </UiButton>
                  
                  <UiButton
                    v-if="vehicle.status === 'PENDING'"
                    variant="solid"
                    color="danger"
                    size="sm"
                    icon-left="heroicons:x-mark-20-solid"
                    @click="openRejectModal(vehicle)"
                  >
                    Rejeitar
                  </UiButton>
                </div>
              </td>
            </tr>
            
            <!-- Empty State -->
            <tr v-if="filteredVehicles.length === 0">
              <td colspan="5" class="px-6 py-12 text-center">
                <UIcon name="i-heroicons-truck" class="mx-auto h-12 w-12 text-gray-400 mb-4" />
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
    </UiCard>

    <!-- Reject Modal -->
    <UiModal v-model="showRejectModal">
      <UiCard>
        <template #header>
          <h3 class="text-lg font-semibold">Rejeitar Anúncio</h3>
        </template>

        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Motivo da rejeição
            </label>
            <UTextarea
              v-model="rejectionReason"
              placeholder="Descreva o motivo da rejeição..."
              :rows="4"
            />
          </div>
        </div>

        <template #footer>
          <div class="flex justify-end space-x-3">
            <UiButton
              variant="outline"
              @click="closeRejectModal"
            >
              Cancelar
            </UiButton>
            <UiButton
              color="danger"
              :loading="moderatingId !== null"
              :disabled="!rejectionReason.trim()"
              @click="confirmReject"
            >
              Rejeitar Anúncio
            </UiButton>
          </div>
        </template>
      </UiCard>
    </UiModal>
  </div>
</template>

<script setup lang="ts">
import { useAdmin } from '~/composables/useAdmin'
import StatusBadge from '~/components/StatusBadge.vue'
import type { VehicleStatus } from '~/schemas/vehicle'

definePageMeta({
  layout: 'admin',
  middleware: 'admin-auth'
})

const route = useRoute()
const router = useRouter()
const admin = useAdmin()
const { vehicles, loading, error, loadVehicles, updateVehicleStatus, deleteVehicle } = admin

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
    count: adminStore.vehiclesByStatus('PENDING').length
  },
  {
    key: 'approved' as const,
    label: 'Aprovados',
    count: adminStore.vehiclesByStatus('APPROVED').length
  },
  {
    key: 'rejected' as const,
    label: 'Rejeitados',
    count: adminStore.vehiclesByStatus('REJECTED').length
  },
  {
    key: 'all' as const,
    label: 'Todos',
    count: adminStore.allVehicles.length
  }
])

const filteredVehicles = computed(() => {
  if (selectedTab.value === 'all') {
    return adminStore.allVehicles
  }
  return adminStore.vehiclesByStatus(selectedTab.value)
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
  navigateTo(`/vehicle/${vehicleId}`)
}

const approveVehicle = async (vehicleId: string) => {
  moderatingId.value = vehicleId
  
  try {
    const result = await adminStore.approveVehicle(vehicleId)
    
    if (result.success) {
      console.log('Veículo aprovado com sucesso')
    } else {
      alert('Erro ao aprovar veículo: ' + (result.error || 'Erro desconhecido'))
    }
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
    const result = await adminStore.rejectVehicle(
      vehicleToReject.value.id,
      rejectionReason.value.trim()
    )
    
    if (result.success) {
      console.log('Veículo rejeitado com sucesso')
      closeRejectModal()
    } else {
      alert('Erro ao rejeitar veículo: ' + (result.error || 'Erro desconhecido'))
    }
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
  await adminStore.loadVehicles()
})

// Meta
useHead({
  title: 'Moderação de Veículos - Admin Auto URBAN'
})
</script>