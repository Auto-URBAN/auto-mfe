export default defineNuxtRouteMiddleware(to => {
	const { isLoggedIn } = useAuthSimple()

	if (import.meta.server) return

	if (!isLoggedIn.value) {
		const redirectTo = to.fullPath

		return navigateTo(`/auth/login?redirect=${encodeURIComponent(redirectTo)}`)
	}
})
