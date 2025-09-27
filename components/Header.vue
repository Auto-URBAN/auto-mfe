<template>
  <header class="bg-white border-b border-gray-200 sticky top-0 z-40">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        
        <!-- Logo -->
        <div class="flex items-center cursor-pointer" @click="router.push('/')">
          <img 
            src="/imgs/Logo-dark.svg" 
            alt="Auto URBAN" 
            class="h-10 w-auto"
          />
        </div>

        <!-- Search (desktop) -->
        <div v-if="showSearch" class="hidden md:flex w-full max-w-2xl mx-6">
          <SearchEngine />
        </div>

        <!-- Actions -->
        <div class="flex items-center space-x-3">
          <!-- Not Authenticated -->
          <div v-if="!isAuthenticated" class="hidden md:flex items-center space-x-3">
            <UiButton
              variant="ghost"
              size="md"
              @click="router.push('/auth/login')"
            >
              Entrar
            </UiButton>
            <UiButton
              variant="primary"
              size="md"
              @click="router.push('/auth/register')"
            >
              Anunciar
            </UiButton>
          </div>
          
          <!-- Authenticated User -->
          <div v-else class="flex items-center space-x-3">
            <!-- Quick Actions -->
            <UiButton
              variant="ghost"
              size="md"
              icon-left="heroicons:plus-20-solid"
              @click="router.push('/sell')"
            >
              <span class="hidden md:inline">Anunciar</span>
            </UiButton>
            
            <!-- Notifications -->
            <UiButton 
              variant="ghost" 
              size="md" 
              icon-left="heroicons:bell-20-solid"
            />
            
            <!-- User Dropdown -->
            <UiDropdown
              :trigger-text="userName || 'Usuário'"
              trigger-variant="ghost"
              placement="bottom-end"
            >
              <template #trigger>
                <div class="flex items-center cursor-pointer hover:bg-gray-50 rounded-lg px-3 py-2 transition-colors">
                  <!-- Avatar -->
                  <div class="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center text-white text-sm font-medium mr-2">
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
                    name="heroicons:chevron-down-20-solid" 
                    class="w-4 h-4 text-gray-400"
                  />
                </div>
              </template>

              <template #panel="{ close }">
                <!-- User Menu Items -->
                <div class="py-1">
                  <button
                    class="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    @click="() => { router.push('/profile'); close() }"
                  >
                    <Icon name="heroicons:user-20-solid" class="w-4 h-4 mr-3" />
                    Meu perfil
                  </button>
                  
                  <button
                    class="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    @click="() => { router.push('/my-ads'); close() }"
                  >
                    <Icon name="heroicons:document-text-20-solid" class="w-4 h-4 mr-3" />
                    Meus anúncios
                  </button>
                  
                  <button
                    v-if="isAdmin"
                    class="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    @click="() => { router.push('/admin'); close() }"
                  >
                    <Icon name="heroicons:shield-check-20-solid" class="w-4 h-4 mr-3" />
                    Admin
                  </button>
                  
                  <hr class="my-1 border-gray-200">
                  
                  <button
                    class="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    @click="() => { handleLogout(); close() }"
                  >
                    <Icon name="heroicons:arrow-left-on-rectangle-20-solid" class="w-4 h-4 mr-3" />
                    Sair
                  </button>
                </div>
              </template>
            </UiDropdown>
          </div>
          
          <!-- Mobile menu button -->
          <UiButton 
            variant="ghost" 
            size="md" 
            icon-left="heroicons:bars-3-20-solid"
            class="md:hidden"
          />
        </div>
      </div>
      
      <!-- Mobile Search -->
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

// Auth & Router
const auth = useAuth()
const router = useRouter()

// Destructure auth composable for easier template usage
const { isAuthenticated, userName, userInitials, isAdmin, logout } = auth

// Methods
async function handleLogout() {
  try {
    await logout()
    await router.push('/')
  } catch (error) {
    console.error('Logout error:', error)
  }
}
</script>