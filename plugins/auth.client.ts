/**
 * Plugin de inicialização da autenticação
 * Carrega os dados de autenticação persistidos no localStorage quando a aplicação inicia
 */
export default defineNuxtPlugin(async () => {
	// Só executa no cliente
	if (import.meta.server) return

	const { loadPersistedAuth } = useAuth()

	try {
		// Carrega a autenticação persistida
		loadPersistedAuth()

		console.log('[Auth Plugin] Authentication state loaded')
	} catch (error) {
		console.error('[Auth Plugin] Error loading persisted auth:', error)
	}
})
