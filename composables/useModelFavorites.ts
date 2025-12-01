interface ModelFavorite {
	id: string
	modelSlug: string
	userId: string
	createdAt: string
}

interface ModelFavoriteRequest {
	modelSlug: string
}

export const useModelFavorites = () => {
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

	//Estado local dos modelos favoritos
	const modelFavorites = ref<ModelFavorite[]>([])
	const isLoading = ref(false)

	//Computed para verificar se um modelo é favorito
	const isModelFavorite = (modelSlug: string): boolean => {
		return modelFavorites.value.some(fav => fav.modelSlug === modelSlug)
	}

	//Buscar modelos favoritos do usuário
	const fetchModelFavorites = async (): Promise<void> => {
		if (!currentUser.value) {
			modelFavorites.value = []
			return
		}

		try {
			isLoading.value = true
			const config = useRuntimeConfig()
			const response = await $fetch<ModelFavorite[]>(
				`${config.public.apiBase}/users/model-favorites`,
				{
					headers: {
						'X-User-Id': currentUser.value.id.toString()
					}
				}
			)
			modelFavorites.value = response || []
		} catch (error) {
			console.error('Error fetching model favorites:', error)
			modelFavorites.value = []
		} finally {
			isLoading.value = false
		}
	}

	//Adicionar modelo aos favoritos
	const addModelFavorite = async (modelSlug: string): Promise<void> => {
		if (!currentUser.value) {
			throw new Error('Usuário não autenticado')
		}

		try {
			isLoading.value = true
			const config = useRuntimeConfig()
			const response = await $fetch<ModelFavorite>(
				`${config.public.apiBase}/users/model-favorites`,
				{
					method: 'POST',
					headers: {
						'X-User-Id': currentUser.value.id.toString(),
						'Content-Type': 'application/json'
					},
					body: { modelSlug } as ModelFavoriteRequest
				}
			)

			//Adiciona ao estado local
			modelFavorites.value.push(response)
		} catch (error) {
			console.error('Error adding model favorite:', error)
			throw error
		} finally {
			isLoading.value = false
		}
	}

	//Remover modelo dos favoritos
	const removeModelFavorite = async (modelSlug: string): Promise<void> => {
		if (!currentUser.value) {
			throw new Error('Usuário não autenticado')
		}

		if (!modelSlug || modelSlug === 'null' || modelSlug === 'undefined') {
			throw new Error('Slug do modelo inválido')
		}

		try {
			isLoading.value = true
			const config = useRuntimeConfig()

			await $fetch(`${config.public.apiBase}/users/model-favorites/${modelSlug}`, {
				method: 'DELETE',
				headers: {
					'X-User-Id': currentUser.value.id.toString()
				}
			})

			//Remove do estado local
			modelFavorites.value = modelFavorites.value.filter(fav => fav.modelSlug !== modelSlug)
		} catch (error) {
			console.error('Error removing model favorite:', error)
			throw error
		} finally {
			isLoading.value = false
		}
	}

	//Toggle modelo favorito (adiciona se não é, remove se é)
	const toggleModelFavorite = async (modelSlug: string): Promise<boolean> => {
		if (!currentUser.value) {
			//Redirecionar para login ou mostrar modal
			await navigateTo('/auth/login')
			return false
		}

		const currentlyFavorite = isModelFavorite(modelSlug)

		try {
			if (currentlyFavorite) {
				await removeModelFavorite(modelSlug)
			} else {
				await addModelFavorite(modelSlug)
			}
			return !currentlyFavorite
		} catch (error) {
			//Reverter estado local se a requisição falhar
			console.error('Error toggling model favorite:', error)
			return currentlyFavorite
		}
	}

	//Contar total de modelos favoritos
	const modelFavoritesCount = computed(() => modelFavorites.value.length)

	//Limpar modelos favoritos (útil no logout)
	const clearModelFavorites = () => {
		modelFavorites.value = []
	}

	//Auto-carregar favoritos quando o usuário estiver logado
	watchEffect(() => {
		if (currentUser.value) {
			fetchModelFavorites()
		} else {
			clearModelFavorites()
		}
	})

	return {
		modelFavorites: readonly(modelFavorites),
		isLoading: readonly(isLoading),
		modelFavoritesCount,
		isModelFavorite,
		fetchModelFavorites,
		addModelFavorite,
		removeModelFavorite,
		toggleModelFavorite,
		clearModelFavorites
	}
}
