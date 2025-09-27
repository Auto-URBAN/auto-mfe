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
            <UButton
              variant="ghost"
              size="sm"
              icon="i-heroicons-bell"
              :badge="pendingCount"
            />
            <UDropdown>
              <UButton
                variant="ghost" 
                size="sm"
                icon="i-heroicons-user-circle"
                trailing-icon="i-heroicons-chevron-down-20-solid"
              >
                Admin
              </UButton>
              
              <template #panel>
                <div class="p-2">
                  <UButton 
                    variant="ghost"
                    size="sm"
                    icon="i-heroicons-arrow-left-on-rectangle"
                    class="w-full justify-start"
                    @click="logout"
                  >
                    Sair
                  </UButton>
                </div>
              </template>
            </UDropdown>
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
              <UIcon name="i-heroicons-home" class="mr-3 h-5 w-5" />
              Dashboard
            </NuxtLink>
            
            <NuxtLink
              to="/admin/vehicles"
              class="group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors"
              :class="isActive('/admin/vehicles') ? activeClasses : inactiveClasses"
            >
              <UIcon name="i-heroicons-truck" class="mr-3 h-5 w-5" />
              Veículos
              <UBadge
                v-if="pendingCount > 0"
                :label="pendingCount.toString()"
                variant="solid"
                size="xs"
                class="ml-auto"
              />
            </NuxtLink>
            
            <NuxtLink
              to="/admin/users"
              class="group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors"
              :class="isActive('/admin/users') ? activeClasses : inactiveClasses"
            >
              <UIcon name="i-heroicons-users" class="mr-3 h-5 w-5" />
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
import { useAdminStore } from '~/stores/admin'

definePageMeta({
  middleware: 'admin-auth',
  layout: false
})

const route = useRoute()
const router = useRouter()
const adminStore = useAdminStore()

// Computed
const pendingCount = computed(() => adminStore.metrics?.totals.pending || 0)

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
onMounted(() => {
  adminStore.loadMetrics()
})
</script>