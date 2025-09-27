/**
 * Plugin to initialize stores and auth state
 */
export default defineNuxtPlugin(() => {
  if (import.meta.client) {
    // Initialize auth store with persisted data
    const authStore = useAuthStore()
    authStore.loadPersistedAuth()
  }
})