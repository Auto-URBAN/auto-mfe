<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Admin Header -->
    <header class="bg-white shadow-sm border-b border-gray-200">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <!-- Logo -->
          <div class="flex items-center">
            <NuxtImg src="/imgs/Logo.svg" alt="Auto URBAN" class="h-8 w-auto" />
            <span class="ml-3 text-sm font-medium text-gray-500">Admin</span>
          </div>
          
          <!-- Admin Actions -->
          <div class="flex items-center space-x-4">
            <!-- Notification Bell -->
            <div class="relative">
              <button class="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                <Icon name="heroicons:bell" class="w-5 h-5" />
                <span v-if="pendingCount > 0" class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {{ pendingCount }}
                </span>
              </button>
            </div>
            
            <!-- User Dropdown -->
            <div class="relative">
              <button 
                @click="dropdownOpen = !dropdownOpen"
                class="flex items-center space-x-2 text-gray-700 hover:text-gray-900 p-2 rounded-md transition-colors"
              >
                <Icon name="heroicons:user-circle" class="w-5 h-5" />
                <span class="text-sm font-medium">Admin</span>
                <Icon name="heroicons:chevron-down" class="w-4 h-4" />
              </button>
              
              <div 
                v-show="dropdownOpen" 
                @click.away="dropdownOpen = false"
                class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-50"
              >
                <div class="py-1">
                  <button 
                    @click="logout(); dropdownOpen = false"
                    class="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    <Icon name="heroicons:arrow-left-on-rectangle" class="w-4 h-4 mr-2" />
                    Sair
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>

    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div class="flex gap-8">
        <!-- Sidebar -->
        <aside class="w-64 flex-shrink-0">
          <nav class="space-y-2">
            <NuxtLink
              to="/admin"
              class="group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors"
              :class="isActive('/admin') ? activeClasses : inactiveClasses"
            >
              <Icon name="heroicons:home" class="mr-3 h-5 w-5" />
              Dashboard
            </NuxtLink>
            
            <NuxtLink
              to="/admin/vehicles"
              class="group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors"
              :class="isActive('/admin/vehicles') ? activeClasses : inactiveClasses"
            >
              <Icon name="heroicons:truck" class="mr-3 h-5 w-5" />
              Veículos
              <span 
                v-if="pendingCount > 0"
                class="ml-auto bg-blue-500 text-white text-xs px-2 py-1 rounded-full"
              >
                {{ pendingCount }}
              </span>
            </NuxtLink>
            
            <NuxtLink
              to="/admin/users"
              class="group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors"
              :class="isActive('/admin/users') ? activeClasses : inactiveClasses"
            >
              <Icon name="heroicons:users" class="mr-3 h-5 w-5" />
              Usuários
            </NuxtLink>
          </nav>
        </aside>

        <!-- Main Content -->
        <main class="flex-1 min-w-0">
          <slot />
        </main>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAdmin } from '~/composables/useAdmin'

definePageMeta({
  middleware: 'admin-auth',
  layout: 'admin'
})

const route = useRoute()
const router = useRouter()
const admin = useAdmin()
const { stats, loading, error, loadStats } = admin

// Local state
const dropdownOpen = ref(false)

// Computed
const pendingCount = computed(() => stats.value?.totals?.pending || 0)

const activeClasses = 'bg-blue-50 border-blue-200 text-blue-700'
const inactiveClasses = 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'

// Methods
const isActive = (path: string) => {
  if (path === '/admin') {
    return route.path === '/admin'
  }
  return route.path.startsWith(path)
}

const logout = () => {
  // TODO: Implement admin logout
  router.push('/admin/login')
}

// Load initial data
onMounted(async () => {
  try {
    await loadStats()
  } catch (err) {
    console.error('Failed to load admin metrics:', err)
  }
})
</script>