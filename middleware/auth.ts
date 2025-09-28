/**
 * Middleware de autenticação
 * Redireciona usuários não autenticados para a página de login
 */
export default defineNuxtRouteMiddleware((to) => {
  const { isAuthenticated } = useAuth()
  
  // Só executa no cliente para evitar problemas de hidratação
  if (import.meta.server) return
  
  if (!isAuthenticated.value) {
    // Salva a página de destino para redirecionar após login
    const redirectTo = to.fullPath
    
    return navigateTo(`/auth/login?redirect=${encodeURIComponent(redirectTo)}`)
  }
})