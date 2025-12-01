import type {
	GarageCurrentCar,
	GarageHistoryCar,
	GarageStats,
	GarageNotification
} from '@/schemas/garage'

export const useGarage = () => {
	const currentCars = useState<GarageCurrentCar[]>('garage-current', () => [])
	const historyCars = useState<GarageHistoryCar[]>('garage-history', () => [])
	const stats = useState<GarageStats | null>('garage-stats', () => null)
	const notifications = useState<GarageNotification[]>('garage-notifications', () => [])

	const loading = ref(false)
	const error = ref<string | null>(null)

	const unreadNotifications = computed(() => notifications.value.filter(n => !n.read).length)

	const totalValue = computed(() => {
		if (!currentCars.value || currentCars.value.length === 0) return 0
		const total = currentCars.value.reduce((sum, car) => {
			const value = car?.fipeValue || 0
			return sum + (typeof value === 'number' && !isNaN(value) ? value : 0)
		}, 0)
		return typeof total === 'number' && !isNaN(total) ? total : 0
	})

	const avgVariation = computed(() => {
		if (!currentCars.value || currentCars.value.length === 0) return 0
		const total = currentCars.value.reduce((sum, car) => {
			const variation = car?.variation12m || 0
			return sum + (typeof variation === 'number' && !isNaN(variation) ? variation : 0)
		}, 0)
		const result = total / currentCars.value.length
		return typeof result === 'number' && !isNaN(result) ? result : 0
	})

	const baseURL = 'http://localhost:8080/api/v1/garage'
	const headers = {
		'X-User-Id': '1',
		'Content-Type': 'application/json'
	}

	async function loadCurrentCars() {
		try {
			loading.value = true
			error.value = null
			const data = await $fetch<GarageCurrentCar[]>(`${baseURL}/current`, { headers })
			currentCars.value = data || []
		} catch (err) {
			error.value = 'Erro ao carregar carros atuais'
			console.error('Erro ao carregar carros:', err)
		} finally {
			loading.value = false
		}
	}

	async function loadHistoryCars() {
		try {
			loading.value = true
			error.value = null
			const data = await $fetch<GarageHistoryCar[]>(`${baseURL}/history`, { headers })
			historyCars.value = data || []
		} catch (err) {
			error.value = 'Erro ao carregar histórico'
			console.error(err)
		} finally {
			loading.value = false
		}
	}

	// Objetivos agora são gerenciados pelo useWishlist

	async function loadStats() {
		try {
			loading.value = true
			error.value = null
			const data = await $fetch<GarageStats>(`${baseURL}/stats`, { headers })
			stats.value = data
		} catch (err) {
			error.value = 'Erro ao carregar estatísticas'
			console.error(err)
		} finally {
			loading.value = false
		}
	}

	async function loadNotifications() {
		// Notifications não implementadas no backend ainda
		notifications.value = []
	}

	async function addCar(carData: Omit<GarageCurrentCar, 'id'>) {
		try {
			loading.value = true
			error.value = null

			// Converter dados para o formato esperado pelo backend Java
			const backendData = {
				brand: carData.brand,
				model: carData.model,
				year: carData.year,
				color: carData.color,
				km: carData.km,
				fipeValue: carData.fipeValue,
				variation12m: carData.variation12m || 0,
				plateVerified: carData.plateVerified || false,
				mods:
					carData.mods?.map(mod => ({
						type: mod.type,
						description: mod.description,
						date: mod.date
					})) || [],
				photos: carData.photos || [],
				purchaseDate: carData.purchaseDate
					? new Date(carData.purchaseDate).toISOString().slice(0, 19)
					: null,
				purchasePrice: carData.purchasePrice || carData.fipeValue,
				notes: carData.notes || ''
			}

			const data = await $fetch<GarageCurrentCar>(`${baseURL}/cars`, {
				method: 'POST',
				headers,
				body: backendData
			})
			currentCars.value.push(data)
			await loadStats()
			return data
		} catch (err) {
			error.value = 'Erro ao adicionar carro'
			console.error(err)
			throw err
		} finally {
			loading.value = false
		}
	}

	// Funções de objetivos movidas para useWishlist

	async function loadAll() {
		await Promise.all([loadCurrentCars(), loadHistoryCars(), loadStats(), loadNotifications()])
	}

	async function moveCar(
		carId: string,
		from: 'current' | 'history',
		to: 'current' | 'history',
		additionalData?: Record<string, unknown>
	) {
		try {
			loading.value = true
			error.value = null
			await $fetch(`/api/garage/${carId}/move`, {
				method: 'POST',
				body: { from, to, additionalData }
			})
			await loadAll()
		} catch (err) {
			error.value = 'Erro ao mover carro'
			console.error(err)
		} finally {
			loading.value = false
		}
	}

	async function moveCarToHistory(
		carId: string,
		historyData: {
			sellPrice: number
			sellDate?: Date
			kmEnd?: number
			storyNote?: string
		}
	) {
		try {
			loading.value = true
			error.value = null

			// Preparar dados para o backend
			const backendData = {
				sellPrice: historyData.sellPrice,
				sellDate: historyData.sellDate
					? historyData.sellDate.toISOString().slice(0, 19)
					: new Date().toISOString().slice(0, 19),
				kmEnd: historyData.kmEnd,
				storyNote: historyData.storyNote || '',
				status: 'SOLD'
			}

			const historyRecord = await $fetch(`${baseURL}/cars/${carId}/move-to-history`, {
				method: 'POST',
				headers,
				body: backendData
			})

			// Remover dos carros atuais e adicionar ao histórico
			currentCars.value = currentCars.value.filter(car => car.id !== carId)
			historyCars.value.unshift(historyRecord)

			await loadStats()
			return historyRecord
		} catch (err) {
			error.value = 'Erro ao mover carro para histórico'
			console.error(err)
			throw err
		} finally {
			loading.value = false
		}
	}

	async function deleteCar(carId: string) {
		try {
			loading.value = true
			error.value = null
			await $fetch(`/api/garage/${carId}/delete`, {
				method: 'POST'
			})
			await loadAll()
		} catch (err) {
			error.value = 'Erro ao remover carro'
			console.error(err)
		} finally {
			loading.value = false
		}
	}

	async function markNotificationAsRead(notificationId: string) {
		const notification = notifications.value.find(n => n.id === notificationId)
		if (notification) {
			notification.read = true
		}
	}

	async function markAllNotificationsAsRead() {
		notifications.value = notifications.value.map(n => ({ ...n, read: true }))
	}

	return {
		currentCars,
		historyCars,
		stats,
		notifications,
		loading,
		error,
		unreadNotifications,
		totalValue,
		avgVariation,
		loadCurrentCars,
		loadHistoryCars,
		loadStats,
		loadNotifications,
		loadAll,
		addCar,
		moveCarToHistory,
		moveCar,
		deleteCar,
		markNotificationAsRead,
		markAllNotificationsAsRead
	}
}
