<template>
  <header class="bg-white border-b border-gray-200 sticky top-0 z-40 py-4">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        
        <!-- Logo -->
        <div class="flex items-center cursor-pointer" @click="router.push('/')">
          <img 
            src="/imgs/Logo-dark.svg" 
            alt="Auto URBAN" 
            class="h-10 w-auto"
          />
          <!-- Admin Badge -->
          <span v-if="isAdmin" class="ml-3 px-2 py-1 text-xs font-medium text-white bg-red-600 rounded-full">
            Admin
          </span>
        </div>

        <!-- Search (desktop) - hide in admin layout -->
        <div v-if="showSearch" class="hidden md:flex w-full max-w-2xl mx-6">
          <SearchEngine />
        </div>

        <!-- Actions -->
        <div class="flex items-center space-x-3">
          <!-- Not Authenticated -->
          <div v-if="!isAuthenticated" class="hidden md:flex items-center space-x-3">
            <button
              @click="router.push('/auth/login')"
              class="px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
            >
              Entrar
            </button>
            <button
              @click="router.push('/auth/register')"
              class="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
            >
              Anunciar
            </button>
          </div>
          
          <!-- Authenticated User -->
          <div v-else class="flex items-center space-x-3">
            <!-- Notifications -->
            <div class="relative">
              <button class="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                <Icon name="heroicons:bell" class="w-5 h-5" />
                <!-- Show pending count for admins -->
                <span v-if="isAdmin && pendingCount > 0" class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {{ pendingCount }}
                </span>
              </button>
            </div>
            
            <!-- Quick Actions (only for non-admin layout) -->
            <button
              v-if="!isAdmin"
              @click="router.push('/sell')"
              class="hidden md:flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
            >
              <Icon name="heroicons:plus" class="w-4 h-4 mr-1" />
              <span>Anunciar</span>
            </button>
            
            <!-- User Dropdown -->
            <div class="relative" ref="dropdownRef">
              <button 
                @click="toggleDropdown"
                class="flex items-center cursor-pointer hover:bg-gray-50 rounded-lg px-3 py-2 transition-colors"
              >
                <!-- Avatar -->
                <div class="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium mr-2">
                  {{ userInitials }}
                </div>
                
                <!-- User Info (desktop) -->
                <div class="hidden lg:block text-left mr-2">
                  <div class="text-sm font-medium text-gray-900">
                    {{ userName }}
                  </div>
                  <div class="text-xs text-gray-500">
                    {{ isAdmin ? 'Admin' : 'Usuário' }}
                  </div>
                </div>
                
                <Icon 
                  name="heroicons:chevron-down" 
                  class="w-4 h-4 text-gray-400 transition-transform"
                  :class="{ 'rotate-180': dropdownOpen }"
                />
              </button>

              <!-- Dropdown Menu -->
              <Transition
                enter-active-class="transition ease-out duration-200"
                enter-from-class="transform opacity-0 scale-95"
                enter-to-class="transform opacity-100 scale-100"
                leave-active-class="transition ease-in duration-150"
                leave-from-class="transform opacity-100 scale-100"
                leave-to-class="transform opacity-0 scale-95"
              >
                <div 
                  v-if="dropdownOpen"
                  class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-50"
                >
                  <div class="py-1">
                    <!-- Profile -->
                    <button
                      v-if="!isAdmin"
                      class="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                      @click="handleMenuClick('/profile')"
                    >
                      <Icon name="heroicons:user" class="w-4 h-4 mr-3" />
                      Meu perfil
                    </button>
                    
                    <!-- My Ads -->
                    <button
                      v-if="!isAdmin"
                      class="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                      @click="handleMenuClick('/my-ads')"
                    >
                      <Icon name="heroicons:document-text" class="w-4 h-4 mr-3" />
                      Meus anúncios
                    </button>
                    
                    <!-- Admin Access -->
                    <button
                      v-if="isAdmin"
                      class="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                      @click="handleMenuClick('/admin')"
                    >
                      <Icon name="heroicons:shield-check" class="w-4 h-4 mr-3" />
                      Painel Admin
                    </button>
                    
                    <!-- Exit Admin (go back to main site) -->
                    <button
                      v-if="isAdmin"
                      class="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                      @click="handleMenuClick('/')"
                    >
                      <Icon name="heroicons:arrow-left" class="w-4 h-4 mr-3" />
                      Voltar ao Site
                    </button>
                    
                    <hr v-if="isAdmin || !isAdmin" class="my-1 border-gray-200">
                    
                    <!-- Logout -->
                    <button
                      class="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      @click="handleLogout"
                    >
                      <Icon name="heroicons:arrow-left-on-rectangle" class="w-4 h-4 mr-3" />
                      Sair
                    </button>
                  </div>
                </div>
              </Transition>
            </div>
          </div>
          
          <!-- Mobile menu button -->
          <button 
            class="md:hidden p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <Icon name="heroicons:bars-3" class="w-5 h-5" />
          </button>
        </div>
      </div>
      
      <!-- Mobile Search (only for non-admin layout) -->
      <div v-if="showSearch" class="md:hidden pb-4">
        <SearchEngine />
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">

interface Props {
  showSearch?: boolean
}
const props = withDefaults(defineProps<Props>(), {
  showSearch: true
})

const router = useRouter()

// Local state
const dropdownOpen = ref(false)
const dropdownRef = ref<HTMLElement>()

// Destructure auth composable para uso no template
const { isAuthenticated, userName, userInitials, isAdmin, logout, adminStats } = useAuth()

// Computed
const pendingCount = computed(() => adminStats.value?.totals?.pending || 0)

// Methods
const toggleDropdown = () => {
  dropdownOpen.value = !dropdownOpen.value
}

const handleMenuClick = async (path: string) => {
  dropdownOpen.value = false
  await router.push(path)
}

async function handleLogout() {
  try {
    dropdownOpen.value = false
    await logout()
    await router.push('/')
  } catch (error) {
    console.error('Logout error:', error)
  }
}

// Click outside handler
const handleClickOutside = (event: MouseEvent) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
    dropdownOpen.value = false
  }
}

// Lifecycle
onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>