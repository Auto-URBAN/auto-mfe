<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Use the unified Header component -->
    <Header />

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
import Header from '~/components/Header.vue'

definePageMeta({
  middleware: 'admin-auth',
  layout: 'admin'
})

const route = useRoute()
const auth = useAuth()
const { adminStats, loadAdminStats } = auth

// Computed
const pendingCount = computed(() => adminStats.value?.totals?.pending || 0)

const activeClasses = 'bg-blue-50 border-blue-200 text-blue-700'
const inactiveClasses = 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'

// Methods
const isActive = (path: string) => {
  if (path === '/admin') {
    return route.path === '/admin'
  }
  return route.path.startsWith(path)
}

// Load initial data
onMounted(async () => {
  try {
    await loadAdminStats()
  } catch (err) {
    console.error('Failed to load admin metrics:', err)
  }
})
</script>