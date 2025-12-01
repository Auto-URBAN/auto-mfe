import type { UserWishlist, UserWishlistRequest } from '@/schemas/wishlist'
import { UserWishlist as UserWishlistSchema } from '@/schemas/wishlist'

export const useWishlist = () => {
	const wishlistItems = useState<UserWishlist[]>('wishlist', () => [])
	const loading = ref(false)
	const error = ref<string | null>(null)

	const baseURL = 'http://localhost:8080/api/v1/wishlist'
	const headers = {
		'X-User-Id': '1',
		'Content-Type': 'application/json'
	}

	/**
	 * Carrega todos os itens da wishlist do usuário
	 */
	async function loadWishlist() {
		try {
			loading.value = true
			error.value = null
			const rawData = await $fetch<any[]>(`${baseURL}`, { headers })

			// Validar e transformar dados com o schema Zod
			const validatedData = (rawData || [])
				.map(item => {
					try {
						return UserWishlistSchema.parse(item)
					} catch (validationError) {
						console.error('Erro de validação no item da wishlist:', item, validationError)
						return null
					}
				})
				.filter(Boolean) as UserWishlist[]

			wishlistItems.value = validatedData
		} catch (err) {
			error.value = 'Erro ao carregar objetivos'
			console.error('Erro ao carregar wishlist:', err)
		} finally {
			loading.value = false
		}
	}

	/**
	 * Adiciona um item à wishlist
	 */
	async function addToWishlist(wishlistData: UserWishlistRequest) {
		try {
			loading.value = true
			error.value = null
			const data = await $fetch<UserWishlist>(`${baseURL}`, {
				method: 'POST',
				headers,
				body: wishlistData
			})
			wishlistItems.value.unshift(data)
			return data
		} catch (err) {
			error.value = 'Erro ao adicionar objetivo'
			console.error('Erro ao adicionar à wishlist:', err)
			throw err
		} finally {
			loading.value = false
		}
	}

	/**
	 * Busca um item específico da wishlist
	 */
	async function getWishlistItem(itemId: string) {
		try {
			loading.value = true
			error.value = null
			const data = await $fetch<UserWishlist>(`${baseURL}/${itemId}`, { headers })
			return data
		} catch (err) {
			error.value = 'Objetivo não encontrado'
			console.error('Erro ao buscar item da wishlist:', err)
			return null
		} finally {
			loading.value = false
		}
	}

	/**
	 * Atualiza um item da wishlist
	 */
	async function updateWishlistItem(itemId: string, wishlistData: UserWishlistRequest) {
		try {
			loading.value = true
			error.value = null
			const data = await $fetch<UserWishlist>(`${baseURL}/${itemId}`, {
				method: 'PUT',
				headers,
				body: wishlistData
			})

			const index = wishlistItems.value.findIndex(item => item.id === itemId)
			if (index !== -1) {
				wishlistItems.value[index] = data
			}

			return data
		} catch (err) {
			error.value = 'Erro ao atualizar objetivo'
			console.error('Erro ao atualizar item da wishlist:', err)
			throw err
		} finally {
			loading.value = false
		}
	}

	/**
	 * Remove um item da wishlist
	 */
	async function removeFromWishlist(itemId: string) {
		try {
			loading.value = true
			error.value = null

			// Tentar remover do backend primeiro
			try {
				await $fetch(`${baseURL}/${itemId}`, {
					method: 'DELETE',
					headers
				})
			} catch (backendError) {
				console.warn('Backend não disponível para remoção, removendo localmente:', backendError)
			}

			// Remover do estado local (sempre executa)
			wishlistItems.value = wishlistItems.value.filter(item => item.id !== itemId)
			console.log('Objetivo removido:', itemId)
		} catch (err) {
			error.value = 'Erro ao remover objetivo'
			console.error('Erro ao remover da wishlist:', err)
			throw err
		} finally {
			loading.value = false
		}
	}

	/**
	 * Conta itens na wishlist
	 */
	async function countWishlistItems() {
		try {
			const count = await $fetch<number>(`${baseURL}/count`, { headers })
			return count
		} catch (err) {
			console.error('Erro ao contar itens da wishlist:', err)
			return 0
		}
	}

	/**
	 * Verifica se um modelo está na wishlist
	 */
	const isInWishlist = (carModelSlug: string): boolean => {
		return wishlistItems.value.some(item => item.carModelSlug === carModelSlug)
	}

	//Computed properties
	const wishlistCount = computed(() => wishlistItems.value.length)
	const hasWishlistItems = computed(() => wishlistItems.value.length > 0)
	const wishlistByBrand = computed(() => {
		const grouped = {} as Record<string, UserWishlist[]>
		wishlistItems.value.forEach(item => {
			if (!grouped[item.brand]) {
				grouped[item.brand] = []
			}
			grouped[item.brand]!.push(item)
		})
		return grouped
	})

	return {
		//State
		wishlistItems: readonly(wishlistItems),
		loading: readonly(loading),
		error: readonly(error),

		//Computed
		wishlistCount,
		hasWishlistItems,
		wishlistByBrand,

		//Actions
		loadWishlist,
		addToWishlist,
		getWishlistItem,
		updateWishlistItem,
		removeFromWishlist,
		countWishlistItems,
		isInWishlist
	}
}
