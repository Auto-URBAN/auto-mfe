export default defineNuxtRouteMiddleware(to => {
	const { isAuthenticated } = useAuth()

	if (import.meta.server) return

	if (!isAuthenticated.value) {
		const redirectTo = to.fullPath

		return navigateTo(`/auth/login?redirect=${encodeURIComponent(redirectTo)}`)
	}
})
