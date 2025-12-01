import type {
	Advertisement,
	AdvertisementRequest,
	AdvertisementFilters
} from '@/schemas/advertisement'

export const useAdvertisements = () => {
	const advertisements = useState<Advertisement[]>('advertisements', () => [])
	const selectedAdvertisement = useState<Advertisement | null>('selectedAdvertisement', () => null)
	const loading = ref(false)
	const error = ref<string | null>(null)

	const baseURL = 'http://localhost:8080/api/v1/advertisements'
	const headers = {
		'Content-Type': 'application/json'
	}

	/**
	 * Busca todos os anúncios ativos
	 */
	async function loadAllAdvertisements() {
		try {
			loading.value = true
			error.value = null
			const data = await $fetch<Advertisement[]>(`${baseURL}`, { headers })
			advertisements.value = data || []
		} catch (err) {
			error.value = 'Erro ao carregar anúncios'
			console.error('Erro ao carregar anúncios:', err)
		} finally {
			loading.value = false
		}
	}

	/**
	 * Busca anúncio por ID
	 */
	async function loadAdvertisementById(id: string) {
		try {
			loading.value = true
			error.value = null
			const data = await $fetch<Advertisement>(`${baseURL}/${id}`, { headers })
			selectedAdvertisement.value = data
			return data
		} catch (err) {
			error.value = 'Anúncio não encontrado'
			console.error('Erro ao carregar anúncio:', err)
			selectedAdvertisement.value = null
			return null
		} finally {
			loading.value = false
		}
	}

	/**
	 * Busca anúncios por modelo de carro
	 */
	async function loadAdvertisementsByModel(carModelSlug: string) {
		try {
			loading.value = true
			error.value = null
			const data = await $fetch<Advertisement[]>(`${baseURL}/model/${carModelSlug}`, { headers })
			advertisements.value = data || []
		} catch (err) {
			error.value = 'Erro ao carregar anúncios do modelo'
			console.error('Erro ao carregar anúncios do modelo:', err)
		} finally {
			loading.value = false
		}
	}

	/**
	 * Busca anúncios com filtros
	 */
	async function searchAdvertisements(filters: AdvertisementFilters) {
		try {
			loading.value = true
			error.value = null

			const params = new URLSearchParams()
			Object.entries(filters).forEach(([key, value]) => {
				if (value !== undefined && value !== null) {
					params.append(key, value.toString())
				}
			})

			const url = `${baseURL}/search?${params.toString()}`
			const data = await $fetch<Advertisement[]>(url, { headers })
			advertisements.value = data || []
		} catch (err) {
			error.value = 'Erro ao buscar anúncios'
			console.error('Erro ao buscar anúncios:', err)
		} finally {
			loading.value = false
		}
	}

	/**
	 * Cria um novo anúncio
	 */
	async function createAdvertisement(advertisementData: AdvertisementRequest) {
		try {
			loading.value = true
			error.value = null
			const data = await $fetch<Advertisement>(`${baseURL}`, {
				method: 'POST',
				headers,
				body: advertisementData
			})
			advertisements.value.unshift(data)
			return data
		} catch (err) {
			error.value = 'Erro ao criar anúncio'
			console.error('Erro ao criar anúncio:', err)
			throw err
		} finally {
			loading.value = false
		}
	}

	/**
	 * Atualiza um anúncio
	 */
	async function updateAdvertisement(id: string, advertisementData: AdvertisementRequest) {
		try {
			loading.value = true
			error.value = null
			const data = await $fetch<Advertisement>(`${baseURL}/${id}`, {
				method: 'PUT',
				headers,
				body: advertisementData
			})

			const index = advertisements.value.findIndex(ad => ad.id === id)
			if (index !== -1) {
				advertisements.value[index] = data
			}

			if (selectedAdvertisement.value?.id === id) {
				selectedAdvertisement.value = data
			}

			return data
		} catch (err) {
			error.value = 'Erro ao atualizar anúncio'
			console.error('Erro ao atualizar anúncio:', err)
			throw err
		} finally {
			loading.value = false
		}
	}

	/**
	 * Desativa um anúncio
	 */
	async function deactivateAdvertisement(id: string) {
		try {
			loading.value = true
			error.value = null
			await $fetch(`${baseURL}/${id}`, {
				method: 'DELETE',
				headers
			})

			advertisements.value = advertisements.value.filter(ad => ad.id !== id)

			if (selectedAdvertisement.value?.id === id) {
				selectedAdvertisement.value = null
			}
		} catch (err) {
			error.value = 'Erro ao desativar anúncio'
			console.error('Erro ao desativar anúncio:', err)
			throw err
		} finally {
			loading.value = false
		}
	}

	/**
	 * Conta anúncios ativos
	 */
	async function countAdvertisements() {
		try {
			const count = await $fetch<number>(`${baseURL}/count`, { headers })
			return count
		} catch (err) {
			console.error('Erro ao contar anúncios:', err)
			return 0
		}
	}

	/**
	 * Conta anúncios por modelo
	 */
	async function countAdvertisementsByModel(carModelSlug: string) {
		try {
			const count = await $fetch<number>(`${baseURL}/count/model/${carModelSlug}`, { headers })
			return count
		} catch (err) {
			console.error('Erro ao contar anúncios do modelo:', err)
			return 0
		}
	}

	//Computed properties
	const advertisementCount = computed(() => advertisements.value.length)
	const hasAdvertisements = computed(() => advertisements.value.length > 0)

	return {
		//State
		advertisements: readonly(advertisements),
		selectedAdvertisement: readonly(selectedAdvertisement),
		loading: readonly(loading),
		error: readonly(error),

		//Computed
		advertisementCount,
		hasAdvertisements,

		//Actions
		loadAllAdvertisements,
		loadAdvertisementById,
		loadAdvertisementsByModel,
		searchAdvertisements,
		createAdvertisement,
		updateAdvertisement,
		deactivateAdvertisement,
		countAdvertisements,
		countAdvertisementsByModel
	}
}
