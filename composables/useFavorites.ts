interface FavoriteAdvertisement {
	id: string
	advertisementId: string
	userId: string
	createdAt: string
}

interface FavoriteRequest {
	advertisementId: string
}

export const useFavorites = () => {
	const { user } = useAuthSimple()

	//Mock user para testes - TODO: remover quando autenticação estiver pronta
	const mockUser = {
		id: '1',
		phone: '+5511999999999',
		role: 'USER' as const,
		firstName: 'Usuário',
		lastName: 'Teste',
		email: 'teste@autourban.com',
		phoneVerified: true
	}

	//Usar mock user se não estiver logado
	const currentUser = computed(() => user.value || mockUser)

	//Estado local dos favoritos
	const favorites = ref<FavoriteAdvertisement[]>([])
	const isLoading = ref(false)
	const useLocalStorage = ref(false)

	//Chaves para localStorage
	const getFavoritesKey = () => `favorites_user_${currentUser.value?.id || '1'}`

	//Funções para localStorage
	const loadFromLocalStorage = (): FavoriteAdvertisement[] => {
		if (import.meta.client) {
			try {
				const stored = localStorage.getItem(getFavoritesKey())
				return stored ? JSON.parse(stored) : []
			} catch (error) {
				console.error('Error loading favorites from localStorage:', error)
				return []
			}
		}
		return []
	}

	const saveToLocalStorage = (favs: FavoriteAdvertisement[]): void => {
		if (import.meta.client) {
			try {
				localStorage.setItem(getFavoritesKey(), JSON.stringify(favs))
			} catch (error) {
				console.error('Error saving favorites to localStorage:', error)
			}
		}
	}

	//Computed para verificar se um anúncio é favorito
	const isFavorite = (advertisementId: string): boolean => {
		return favorites.value.some(fav => fav.advertisementId === advertisementId)
	}

	//Buscar favoritos do usuário (com fallback para localStorage)
	const fetchFavorites = async (): Promise<void> => {
		if (!currentUser.value) {
			favorites.value = []
			return
		}

		try {
			isLoading.value = true
			const config = useRuntimeConfig()
			
			//Tentar carregar do backend primeiro
			const response = await $fetch<FavoriteAdvertisement[]>(
				`${config.public.apiBase}/users/favorites`,
				{
					headers: {
						'X-User-Id': currentUser.value.id.toString()
					}
				}
			)
			
			favorites.value = response || []
			useLocalStorage.value = false
			
		} catch (error) {
			console.warn('Backend não disponível, usando localStorage:', error)
			
			//Fallback para localStorage
			favorites.value = loadFromLocalStorage()
			useLocalStorage.value = true
			console.log('Favoritos carregados do localStorage:', favorites.value.length)
			
		} finally {
			isLoading.value = false
		}
	}

	//Adicionar anúncio aos favoritos
	const addFavorite = async (advertisementId: string): Promise<void> => {
		if (!currentUser.value) {
			throw new Error('Usuário não autenticado')
		}

		try {
			isLoading.value = true
			
			if (useLocalStorage.value) {
				//Usar localStorage
				const newFavorite: FavoriteAdvertisement = {
					id: `local_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
					advertisementId,
					userId: currentUser.value.id.toString(),
					createdAt: new Date().toISOString()
				}
				
				favorites.value.push(newFavorite)
				saveToLocalStorage(favorites.value)
				console.log('Favorito adicionado ao localStorage')
				
			} else {
				//Tentar usar backend
				const config = useRuntimeConfig()
				const response = await $fetch<FavoriteAdvertisement>(
					`${config.public.apiBase}/users/favorites`,
					{
						method: 'POST',
						headers: {
							'X-User-Id': currentUser.value.id.toString(),
							'Content-Type': 'application/json'
						},
						body: { advertisementId } as FavoriteRequest
					}
				)
				
				favorites.value.push(response)
				console.log('Favorito adicionado ao backend')
			}
			
		} catch (error) {
			console.error('Error adding favorite:', error)
			
			//Se o backend falhar, tentar localStorage como fallback
			if (!useLocalStorage.value) {
				console.log('Tentando localStorage como fallback...')
				const newFavorite: FavoriteAdvertisement = {
					id: `local_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
					advertisementId,
					userId: currentUser.value.id.toString(),
					createdAt: new Date().toISOString()
				}
				
				favorites.value.push(newFavorite)
				saveToLocalStorage(favorites.value)
				useLocalStorage.value = true
				console.log('Favorito salvo no localStorage como fallback')
			} else {
				throw error
			}
		} finally {
			isLoading.value = false
		}
	}

	//Remover anúncio dos favoritos
	const removeFavorite = async (advertisementId: string): Promise<void> => {
		if (!currentUser.value) {
			throw new Error('Usuário não autenticado')
		}

		if (!advertisementId || advertisementId === 'null' || advertisementId === 'undefined') {
			throw new Error('ID do anúncio inválido')
		}

		try {
			isLoading.value = true
			
			if (useLocalStorage.value) {
				//Usar localStorage
				favorites.value = favorites.value.filter(
					fav => fav.advertisementId !== advertisementId
				)
				saveToLocalStorage(favorites.value)
				console.log('Favorito removido do localStorage')
				
			} else {
				//Tentar usar backend
				const config = useRuntimeConfig()
				await $fetch(`${config.public.apiBase}/users/favorites/${advertisementId}`, {
					method: 'DELETE',
					headers: {
						'X-User-Id': currentUser.value.id.toString()
					}
				})
				
				favorites.value = favorites.value.filter(
					fav => fav.advertisementId !== advertisementId
				)
				console.log('Favorito removido do backend')
			}
			
		} catch (error) {
			console.error('Error removing favorite:', error)
			
			//Se o backend falhar, tentar localStorage como fallback
			if (!useLocalStorage.value) {
				console.log('Tentando localStorage como fallback...')
				favorites.value = favorites.value.filter(
					fav => fav.advertisementId !== advertisementId
				)
				saveToLocalStorage(favorites.value)
				useLocalStorage.value = true
				console.log('Favorito removido do localStorage como fallback')
			} else {
				throw error
			}
		} finally {
			isLoading.value = false
		}
	}

	//Toggle favorito (adiciona se não é, remove se é)
	const toggleFavorite = async (advertisementId: string): Promise<boolean> => {
		if (!currentUser.value) {
			//Redirecionar para login ou mostrar modal
			await navigateTo('/auth/login')
			return false
		}

		const currentlyFavorite = isFavorite(advertisementId)

		try {
			if (currentlyFavorite) {
				await removeFavorite(advertisementId)
			} else {
				await addFavorite(advertisementId)
			}
			return !currentlyFavorite
		} catch (error) {
			//Reverter estado local se a requisição falhar
			console.error('Error toggling favorite:', error)
			return currentlyFavorite
		}
	}

	//Contar total de favoritos
	const favoritesCount = computed(() => favorites.value.length)

	//Limpar favoritos (útil no logout)
	const clearFavorites = () => {
		favorites.value = []
	}

	//Auto-carregar favoritos quando o usuário estiver logado
	watchEffect(() => {
		if (currentUser.value) {
			fetchFavorites()
		} else {
			clearFavorites()
		}
	})

	return {
		favorites: readonly(favorites),
		isLoading: readonly(isLoading),
		favoritesCount,
		isFavorite,
		fetchFavorites,
		addFavorite,
		removeFavorite,
		toggleFavorite,
		clearFavorites
	}
}
