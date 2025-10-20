import type {
	GarageCurrentCar,
	GarageHistoryCar,
	GarageGoal,
	GarageStats,
	GarageNotification
} from '@/schemas/garage'

export const useGarage = () => {
	const currentCars = useState<GarageCurrentCar[]>('garage-current', () => [])
	const historyCars = useState<GarageHistoryCar[]>('garage-history', () => [])
	const goals = useState<GarageGoal[]>('garage-goals', () => [])
	const stats = useState<GarageStats | null>('garage-stats', () => null)
	const notifications = useState<GarageNotification[]>('garage-notifications', () => [])

	const loading = ref(false)
	const error = ref<string | null>(null)

	const unreadNotifications = computed(() => notifications.value.filter(n => !n.read).length)

	const totalValue = computed(() => {
		return currentCars.value.reduce((sum, car) => sum + car.fipeValue, 0)
	})

	const avgVariation = computed(() => {
		if (currentCars.value.length === 0) return 0
		const total = currentCars.value.reduce((sum, car) => sum + car.variation12m, 0)
		return total / currentCars.value.length
	})

	async function loadCurrentCars() {
		try {
			loading.value = true
			error.value = null
			const data = await $fetch<GarageCurrentCar[]>('/api/garage/current')
			currentCars.value = data
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
			const data = await $fetch<GarageHistoryCar[]>('/api/garage/history')
			historyCars.value = data
		} catch (err) {
			error.value = 'Erro ao carregar histórico'
			console.error(err)
		} finally {
			loading.value = false
		}
	}

	async function loadGoals() {
		try {
			loading.value = true
			error.value = null
			const data = await $fetch<GarageGoal[]>('/api/garage/goals')
			goals.value = data
		} catch (err) {
			error.value = 'Erro ao carregar objetivos'
			console.error(err)
		} finally {
			loading.value = false
		}
	}

	async function loadStats() {
		try {
			loading.value = true
			error.value = null
			const data = await $fetch<GarageStats>('/api/garage/stats')
			stats.value = data
		} catch (err) {
			error.value = 'Erro ao carregar estatísticas'
			console.error(err)
		} finally {
			loading.value = false
		}
	}

	async function loadNotifications() {
		try {
			loading.value = true
			error.value = null
			const data = await $fetch<GarageNotification[]>('/api/garage/notifications')
			notifications.value = data
		} catch (err) {
			error.value = 'Erro ao carregar notificações'
			console.error(err)
		} finally {
			loading.value = false
		}
	}

	async function loadAll() {
		await Promise.all([
			loadCurrentCars(),
			loadHistoryCars(),
			loadGoals(),
			loadStats(),
			loadNotifications()
		])
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
		goals,
		stats,
		notifications,
		loading,
		error,
		unreadNotifications,
		totalValue,
		avgVariation,
		loadCurrentCars,
		loadHistoryCars,
		loadGoals,
		loadStats,
		loadNotifications,
		loadAll,
		moveCar,
		deleteCar,
		markNotificationAsRead,
		markAllNotificationsAsRead
	}
}
