<template>
  <div class="min-h-screen bg-gray-50">
    <Header variant="light" :show-search="true" />
    <main class="flex-1">
      <slot />
    </main>
    <Footer />
  </div>
</template>

<script setup lang="ts">
// Initialize auth on app start
const authStore = useAuthStore()

onMounted(() => {
  authStore.loadPersistedAuth()
})
</script>