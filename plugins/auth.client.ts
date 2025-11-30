export default defineNuxtPlugin(async () => {
	if (import.meta.server) return

	const { refreshTokens, isLoggedIn } = useAuthSimple()

	try {
		// Se houver token mas estiver perto do vencimento, renova automaticamente
		if (isLoggedIn.value) {
			await refreshTokens()
		}

		console.log('[Auth Plugin] Authentication state loaded')
	} catch (error) {
		console.error('[Auth Plugin] Error loading persisted auth:', error)
	}
})
