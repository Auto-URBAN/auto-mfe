export default defineNuxtRouteMiddleware(to => {
	if (process.dev) {
		return
	}

	if (to.path.startsWith('/admin') && to.path !== '/admin/login') {
		const isAuthenticated = false

		if (!isAuthenticated) {
			return navigateTo('/admin/login')
		}
	}
})
