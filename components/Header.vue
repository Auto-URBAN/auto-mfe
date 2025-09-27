<template>
  <header class="sticky top-0 z-50 w-full border-b" :class="headerClasses">
    <Container class="px-6 lg:px-8">
      <div class="flex h-16 items-center justify-between">
        <!-- Logo -->
        <div class="flex items-center cursor-pointer" @click="$router.push('/')">
          <img 
            :src="variant === 'dark' ? '/imgs/Logo.svg' : '/imgs/Logo-dark.svg'" 
            alt="Auto URBAN" 
            class="h-8 w-auto"
          />
        </div>
        
        <!-- Search -->
        <div v-if="showSearch" class="flex-1 max-w-lg mx-8">
          <SearchEngine />
        </div>
        
        <!-- Actions -->
        <div class="flex items-center space-x-4">
          <!-- Auth Section -->
          <div v-if="!authStore.isAuthenticated" class="hidden md:flex items-center space-x-2">
            <UButton
              variant="ghost"
              size="sm"
              @click="$router.push('/auth/login')"
              :class="buttonClasses"
            >
              Entrar
            </UButton>
            <UButton
              color="blue"
              size="sm"
              @click="$router.push('/auth/login')"
            >
              Anunciar
            </UButton>
          </div>
          
          <!-- User Menu -->
          <div v-else class="flex items-center space-x-3">
            <!-- Quick Actions -->
            <UButton
              variant="ghost"
              size="sm"
              icon="i-heroicons-plus"
              @click="$router.push('/sell')"
              :class="buttonClasses"
            >
              <span class="hidden md:inline">Anunciar</span>
            </UButton>
            
            <!-- Notifications -->
            <UButton
              variant="ghost"
              size="sm"
              icon="i-heroicons-bell"
              :class="buttonClasses"
            />
            
            <!-- User Dropdown -->
            <UDropdown :items="userMenuItems">
              <template #default>
                <div class="flex items-center cursor-pointer">
                  <UAvatar
                    :text="authStore.userInitials"
                    size="sm"
                    :ui="{ background: 'bg-blue-500' }"
                  />
                  <UIcon 
                    name="i-heroicons-chevron-down-20-solid" 
                    class="w-4 h-4 ml-1"
                    :class="iconClasses"
                  />
                </div>
              </template>
            </UDropdown>
          </div>
          
          <!-- Mobile menu -->
          <UButton
            variant="ghost"
            size="sm"
            icon="i-heroicons-bars-3"
            class="md:hidden"
            :class="buttonClasses"
          />
        </div>
      </div>
    </Container>
  </header>
</template>

<script setup lang="ts">
interface Props {
  variant?: 'light' | 'dark' | 'transparent'
  showSearch?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'light',
  showSearch: true
})

// Store
const authStore = useAuthStore()

// Computed classes for theming
const headerClasses = computed(() => {
  switch (props.variant) {
    case 'dark':
      return 'bg-gray-900 border-gray-800'
    case 'transparent':
      return 'bg-white/80 backdrop-blur-sm border-gray-200/50'
    default:
      return 'bg-white border-gray-200'
  }
})

const buttonClasses = computed(() => {
  return props.variant === 'dark' 
    ? 'text-white hover:text-gray-200' 
    : 'text-gray-700 hover:text-gray-900'
})

const iconClasses = computed(() => {
  return props.variant === 'dark' 
    ? 'text-gray-300' 
    : 'text-gray-500'
})

// User menu items
const router = useRouter()

const userMenuItems = computed(() => {
  const baseItems = [
    {
      label: 'Meu perfil',
      icon: 'i-heroicons-user',
      click: () => router.push('/profile')
    },
    {
      label: 'Meus anúncios', 
      icon: 'i-heroicons-cog-6-tooth',
      click: () => router.push('/my-ads')
    }
  ]
  
  if (authStore.isAdmin) {
    baseItems.push({
      label: 'Admin',
      icon: 'i-heroicons-shield-check',
      click: () => router.push('/admin')
    })
  }
  
  return [
    baseItems,
    [{
      label: 'Sair',
      icon: 'i-heroicons-arrow-left-on-rectangle',
      click: handleLogout
    }]
  ]
})

// Methods
async function handleLogout() {
  try {
    await authStore.logout()
    await router.push('/')
  } catch (error) {
    console.error('Logout error:', error)
  }
}

// Initialize auth on mount
onMounted(() => {
  authStore.loadPersistedAuth()
})
</script>