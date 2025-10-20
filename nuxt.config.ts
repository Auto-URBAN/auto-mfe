// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	modules: ['@nuxt/icon', '@vite-pwa/nuxt', '@nuxt/image', '@nuxtjs/tailwindcss', '@nuxt/eslint'],

	compatibilityDate: '2024-11-01',
	devtools: { enabled: true },

	// CSS Configuration
	css: ['~/assets/css/main.css'],

	runtimeConfig: {
		apiUrl: process.env.NUXT_API_URL || 'http://localhost:3001',
		public: {
			apiBase: process.env.VITE_API_BASE || '/api',
			whatsappPrefix: process.env.VITE_WHATSAPP_PREFIX || '55'
		}
	}, // PWA Configuration via module options
	pwa: {
		registerType: 'autoUpdate',
		workbox: {
			navigateFallback: '/',
			globPatterns: ['**/*.{js,css,html,png,svg,ico}'],
			runtimeCaching: [
				{
					urlPattern: /^\/api\/search/,
					handler: 'StaleWhileRevalidate',
					options: {
						cacheName: 'api-search-swr',
						expiration: {
							maxEntries: 200,
							maxAgeSeconds: 3600 // 1 hour
						}
					}
				},
				{
					urlPattern: /\.(png|jpg|jpeg|svg|gif|webp)$/,
					handler: 'CacheFirst',
					options: {
						cacheName: 'images-cache',
						expiration: {
							maxEntries: 100,
							maxAgeSeconds: 2592000 // 30 days
						}
					}
				}
			]
		},
		manifest: {
			name: 'Auto URBAN - Marketplace de Carros',
			short_name: 'Auto URBAN',
			description: 'Encontre e venda carros exclusivos',
			theme_color: '#EC4899',
			background_color: '#ffffff',
			display: 'standalone',
			orientation: 'portrait',
			scope: '/',
			start_url: '/',
			icons: [
				{
					src: '/favicon.ico',
					sizes: '64x64',
					type: 'image/x-icon'
				}
			]
		}
	},

	future: {
		compatibilityVersion: 4
	},

	// Auto-import composables and utils
	imports: {
		dirs: ['composables', 'utils']
	}
})
