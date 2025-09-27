<template>
  <div>
    <!-- Page Header -->
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-gray-900">Gerenciamento de Usuários</h1>
      <p class="mt-2 text-sm text-gray-600">
        Visualize e gerencie usuários da plataforma
      </p>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <BigNumberCard
        title="Total de Usuários"
        :value="totalUsers"
        icon="i-heroicons-users"
        color="blue"
      />
      
      <BigNumberCard
        title="Usuários Regulares"
        :value="regularUsersCount"
        icon="i-heroicons-user"
        color="green"
      />
      
      <BigNumberCard
        title="Administradores"
        :value="adminUsersCount"
        icon="i-heroicons-shield-check"
        color="purple"
      />
    </div>

    <!-- Loading State -->
    <div v-if="adminStore.isLoading" class="space-y-4">
      <USkeleton v-for="i in 5" :key="i" class="h-16" />
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

    <!-- Users Table -->
    <UCard v-else>
      <template #header>
        <div class="flex justify-between items-center">
          <h3 class="text-lg font-semibold text-gray-900">Lista de Usuários</h3>
          
          <!-- Filter Dropdown -->
          <USelectMenu
            v-model="selectedFilter"
            :options="filterOptions"
            placeholder="Filtrar por tipo"
            class="w-48"
          />
        </div>
      </template>

      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Usuário
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Telefone
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tipo
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Anúncios
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Cadastro
              </th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="user in filteredUsers" :key="user.id" class="hover:bg-gray-50">
              <!-- User Info -->
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="flex-shrink-0 h-10 w-10">
                    <div class="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center">
                      <span class="text-white font-medium text-sm">
                        {{ getUserInitials(user) }}
                      </span>
                    </div>
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900">
                      ID: {{ user.id }}
                    </div>
                  </div>
                </div>
              </td>

              <!-- Phone -->
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ formatPhone(user.phone) }}</div>
              </td>

              <!-- Role -->
              <td class="px-6 py-4 whitespace-nowrap">
                <UBadge
                  :label="user.role === 'ADMIN' ? 'Admin' : 'Usuário'"
                  :color="user.role === 'ADMIN' ? 'purple' : 'gray'"
                  variant="solid"
                  size="xs"
                />
              </td>

              <!-- Ads Count -->
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">
                  {{ user.ads?.total || 0 }} anúncios
                </div>
                <div v-if="user.ads?.byStatus" class="text-xs text-gray-500">
                  {{ user.ads.byStatus.approved || 0 }} aprovados,
                  {{ user.ads.byStatus.pending || 0 }} pendentes
                </div>
              </td>

              <!-- Created Date -->
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ formatDate(user.createdAt) }}
              </td>

              <!-- Actions -->
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div class="flex justify-end space-x-2">
                  <UButton
                    variant="ghost"
                    size="sm"
                    icon="i-heroicons-eye"
                    @click="viewUserAds(user.id)"
                  >
                    Ver Anúncios
                  </UButton>
                  
                  <UDropdown>
                    <UButton
                      variant="ghost"
                      size="sm"
                      icon="i-heroicons-ellipsis-horizontal"
                    />
                    
                    <template #panel>
                      <div class="p-2 space-y-1">
                        <UButton
                          v-if="user.role !== 'ADMIN'"
                          variant="ghost"
                          size="sm"
                          icon="i-heroicons-shield-check"
                          class="w-full justify-start"
                          @click="promoteToAdmin(user.id)"
                        >
                          Promover a Admin
                        </UButton>
                        
                        <UButton
                          variant="ghost"
                          size="sm"
                          icon="i-heroicons-no-symbol"
                          color="red"
                          class="w-full justify-start"
                          disabled
                        >
                          Suspender (Em Breve)
                        </UButton>
                      </div>
                    </template>
                  </UDropdown>
                </div>
              </td>
            </tr>
            
            <!-- Empty State -->
            <tr v-if="filteredUsers.length === 0">
              <td colspan="6" class="px-6 py-12 text-center">
                <UIcon name="i-heroicons-users" class="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 class="text-sm font-medium text-gray-900 mb-1">
                  Nenhum usuário encontrado
                </h3>
                <p class="text-sm text-gray-500">
                  Não há usuários {{ filterText }} no momento.
                </p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </UCard>
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
const toast = useToast()

// Reactive data
const selectedFilter = ref('all')

// Filter options
const filterOptions = [
  { label: 'Todos os usuários', value: 'all' },
  { label: 'Usuários regulares', value: 'user' },
  { label: 'Administradores', value: 'admin' }
]

// Computed
const totalUsers = computed(() => adminStore.users.length)
const regularUsersCount = computed(() => adminStore.regularUsers.length)
const adminUsersCount = computed(() => adminStore.adminUsers.length)

const filteredUsers = computed(() => {
  const allUsers = adminStore.users
  
  if (selectedFilter.value === 'user') {
    return allUsers.filter(u => u.role === 'USER')
  }
  
  if (selectedFilter.value === 'admin') {
    return allUsers.filter(u => u.role === 'ADMIN')
  }
  
  return allUsers
})

const filterText = computed(() => {
  const texts = {
    all: 'cadastrados',
    user: 'regulares',
    admin: 'administradores'
  }
  return texts[selectedFilter.value as keyof typeof texts] || 'cadastrados'
})

// Methods
const formatPhone = (phone: string) => {
  // Format Brazilian phone number
  if (phone.length === 11) {
    return phone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')
  }
  return phone
}

const formatDate = (date: string) => {
  return new Intl.DateTimeFormat('pt-BR').format(new Date(date))
}

const getUserInitials = (user: any) => {
  // Generate initials from user ID (since we don't have names)
  return user.id.substring(0, 2).toUpperCase()
}

const viewUserAds = (userId: string) => {
  // Navigate to vehicles page filtered by user
  navigateTo(`/admin/vehicles?user=${userId}`)
}

const promoteToAdmin = async (userId: string) => {
  // TODO: Implement promote to admin functionality
  toast.add({
    title: 'Em Breve',
    description: 'Funcionalidade em desenvolvimento',
    color: 'yellow'
  })
}

// Lifecycle
onMounted(async () => {
  await adminStore.loadUsers()
})

// Meta
useHead({
  title: 'Gerenciamento de Usuários - Admin Auto URBAN'
})
</script>