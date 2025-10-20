export default defineNuxtPlugin(async () => {
	if (import.meta.server) return

	const { loadPersistedAuth } = useAuth()

	try {
		loadPersistedAuth()

		console.log('[Auth Plugin] Authentication state loaded')
	} catch (error) {
		console.error('[Auth Plugin] Error loading persisted auth:', error)
	}
})
