<template>
	<div class="min-h-screen bg-zinc-700 py-8">
		<UiContainer>
			<GarageHeader
				:user-name="userName"
				:total-cars="currentCars?.length || 0"
				:total-value="safeNumber(totalValue)"
				:avg-variation="safeNumber(avgVariation)"
				:total-history="historyCars?.length || 0"
				:total-goals="goals?.length || 0"
			/>

			<div class="mt-8 space-y-12">
				<div v-if="loading" class="space-y-4">
					<UiSkeleton v-for="i in 6" :key="i" class="h-64 rounded-xl" />
				</div>

				<div v-else-if="error" class="rounded-xl bg-red-900/20 p-6 text-center">
					<Icon name="heroicons:exclamation-triangle" class="mx-auto mb-2 h-12 w-12 text-red-400" />
					<p class="text-red-400">{{ error }}</p>
					<button
						class="mt-4 rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700"
						@click="$router.go(0)"
					>
						Tentar Novamente
					</button>
				</div>

				<div v-else class="space-y-16">
					<!-- Seção: Favoritos -->
					<section>
						<div class="mb-6 flex items-center justify-between">
							<div>
								<h2 class="text-2xl font-bold text-white">Anúncios Favoritos</h2>
								<p class="text-sm text-zinc-400">Anúncios reais que você está acompanhando</p>
							</div>
							<span class="rounded-full bg-red-900/30 px-3 py-1 text-sm text-red-400">
								{{ favoritesCount }} {{ favoritesCount === 1 ? 'favorito' : 'favoritos' }}
							</span>
						</div>

						<div
							v-if="favoritesLoading"
							class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-5"
						>
							<div v-for="i in 5" :key="i" class="h-64 rounded-xl bg-zinc-800/30 animate-pulse" />
						</div>

						<div
							v-else-if="!favoriteVehicles || favoriteVehicles.length === 0"
							class="rounded-xl bg-zinc-800/30 p-12 text-center"
						>
							<Icon name="heroicons:heart" class="mx-auto mb-4 h-16 w-16 text-zinc-600" />
							<h3 class="mb-2 text-xl font-semibold text-zinc-300">Nenhum anúncio favorito</h3>
							<p class="mb-4 text-zinc-500">
								Favorite anúncios reais que você está interessado em comprar.
							</p>
							<NuxtLink
								to="/anuncios"
								class="inline-flex items-center gap-2 rounded-lg bg-red-600 px-6 py-3 font-medium text-white transition-colors hover:bg-red-700"
							>
								<Icon name="heroicons:magnifying-glass" class="h-5 w-5" />
								Explorar Anúncios
							</NuxtLink>
						</div>

						<div v-else class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-5">
							<div
								v-for="vehicle in favoriteVehicles"
								:key="vehicle.id"
								class="group relative overflow-hidden rounded-xl bg-zinc-800/30 transition-all duration-300 hover:bg-zinc-800/50"
							>
								<NuxtLink :to="`/anuncios/${vehicle.slug || vehicle.id}`" class="block">
									<div class="aspect-video overflow-hidden">
										<img
											:src="vehicle.coverImageUrl"
											:alt="vehicle.title"
											class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
										/>
									</div>
									<div class="p-4">
										<div class="mb-2 flex items-center justify-between">
											<span class="text-xs text-zinc-400">{{ vehicle.year }}</span>
											<span class="text-xs text-emerald-400">{{ vehicle.brand }}</span>
										</div>
										<h3 class="mb-2 font-semibold text-white line-clamp-1">
											{{ vehicle.model }}
										</h3>
										<p class="text-lg font-bold text-emerald-400">
											{{ formatCurrency(vehicle.price) }}
										</p>
									</div>
								</NuxtLink>

								<button
									class="absolute top-3 right-3 w-10 h-10 rounded-full bg-red-500/80 backdrop-blur-sm flex items-center justify-center text-white hover:bg-red-600 transition-all hover:scale-110 group"
									title="Remover dos favoritos"
									@click="removeFavoriteByVehicle(vehicle)"
								>
									<Icon
										name="heroicons:heart-solid"
										class="w-5 h-5 group-hover:scale-110 transition-transform"
									/>
								</button>
							</div>
						</div>
					</section>

					<!-- Seção: Meus Objetivos -->
					<section>
						<div class="mb-6 flex items-center justify-between">
							<div>
								<h2 class="text-2xl font-bold text-white">Objetivos de Carro</h2>
								<p class="text-sm text-zinc-400">Modelos que você deseja ter no futuro</p>
							</div>
							<div class="flex items-center gap-3">
								<span class="rounded-full bg-amber-900/30 px-3 py-1 text-sm text-amber-400">
									{{ goals?.length || 0 }} {{ goals?.length === 1 ? 'objetivo' : 'objetivos' }}
								</span>
								<NuxtLink
									to="/carros"
									class="flex items-center gap-2 rounded-lg bg-amber-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-amber-700"
								>
									<Icon name="heroicons:plus" class="h-4 w-4" />
									Explorar Modelos
								</NuxtLink>
							</div>
						</div>

						<div
							v-if="!goals || goals.length === 0"
							class="rounded-xl bg-zinc-800/30 p-12 text-center"
						>
							<Icon name="heroicons:star" class="mx-auto mb-4 h-16 w-16 text-zinc-600" />
							<h3 class="mb-2 text-xl font-semibold text-zinc-300">Nenhum objetivo definido</h3>
							<p class="mb-4 text-zinc-500">
								Navegue pelos modelos de carros e adicione aqueles que deseja ter como objetivos.
							</p>
							<NuxtLink
								to="/carros"
								class="inline-block rounded-lg bg-amber-600 px-6 py-3 font-medium text-white transition-colors hover:bg-amber-700"
							>
								Explorar Modelos
							</NuxtLink>
						</div>

						<div v-else class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-5">
							<GarageGoalCard
								v-for="goal in goals"
								:key="goal.id"
								:goal="goal"
								@remove="handleRemoveGoal"
								@view-ads="handleViewAds"
								@compare="handleCompare"
								@achieved="handleGoalAchieved"
							/>
						</div>
					</section>

					<!-- Seção: Meus Carros -->
					<section>
						<div class="mb-6 flex items-center justify-between">
							<div>
								<h2 class="text-2xl font-bold text-white">Meus Carros</h2>
								<p class="text-sm text-zinc-400">
									Garagem atual · Valor total: {{ formatCurrency(totalValue) }}
								</p>
							</div>
							<span class="rounded-full bg-blue-900/30 px-3 py-1 text-sm text-blue-400">
								{{ currentCars?.length || 0 }}
								{{ currentCars?.length === 1 ? 'carro' : 'carros' }}
							</span>
						</div>

						<div v-if="garageLoading" class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
							<div v-for="i in 3" :key="i" class="h-64 rounded-xl bg-zinc-800/30 animate-pulse" />
						</div>

						<div
							v-else-if="!currentCars || currentCars.length === 0"
							class="rounded-xl bg-zinc-800/30 p-12 text-center"
						>
							<Icon name="heroicons:plus-circle" class="mx-auto mb-4 h-16 w-16 text-zinc-600" />
							<h3 class="mb-2 text-xl font-semibold text-zinc-300">Sua garagem está vazia</h3>
							<p class="mb-4 text-zinc-500">
								Quando você alcançar um objetivo de carro, ele aparecerá aqui automaticamente!
								Comece adicionando objetivos de carros que deseja ter.
							</p>
							<NuxtLink
								to="/carros"
								class="inline-block rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition-colors hover:bg-blue-700"
							>
								<Icon name="heroicons:star" class="w-4 h-4 inline mr-2" />
								Explorar e Adicionar Objetivos
							</NuxtLink>
						</div>

						<div v-else class="grid grid-cols-5 gap-6">
							<GarageCurrentCarCard
								v-for="car in currentCars"
								:key="car.id"
								:car="car"
								@edit="handleEditCar"
								@view-history="handleViewHistory"
								@move-to-history="handleMoveToHistory"
								@sold="handleCarSold"
							/>
						</div>
					</section>

					<!-- Seção: Minha História -->
					<section>
						<div class="mb-6 flex items-center justify-between">
							<div>
								<h2 class="text-2xl font-bold text-white">Minha História</h2>
								<p class="text-sm text-zinc-400">Carros que já passaram pela sua vida</p>
							</div>
							<span class="rounded-full bg-zinc-700/50 px-3 py-1 text-sm text-zinc-300">
								{{ historyCars?.length || 0 }} {{ historyCars?.length === 1 ? 'carro' : 'carros' }}
							</span>
						</div>

						<div
							v-if="!historyCars || historyCars.length === 0"
							class="rounded-xl bg-zinc-800/30 p-12 text-center"
						>
							<Icon name="heroicons:clock" class="mx-auto mb-4 h-16 w-16 text-zinc-600" />
							<h3 class="mb-2 text-xl font-semibold text-zinc-300">Nenhum histórico registrado</h3>
							<p class="text-zinc-500">Os carros que você teve no passado aparecerão aqui.</p>
						</div>

						<div v-else class="grid grid-cols-5 gap-6">
							<GarageHistoryCarCard v-for="car in sortedHistoryCars" :key="car.id" :car="car" />
						</div>
					</section>

					<GarageStatsSection v-if="stats" :stats="stats" />
				</div>
			</div>

			<div
				class="mt-12 rounded-2xl bg-gradient-to-r from-blue-900/30 to-purple-900/30 p-8 text-center"
			>
				<h2 class="mb-2 text-2xl font-bold text-white">Continue escrevendo sua história.</h2>
				<p class="mb-6 text-zinc-300">O próximo carro certo pode estar esperando por você.</p>
				<NuxtLink
					to="/anuncios"
					class="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition-colors hover:bg-blue-700"
				>
					<Icon name="heroicons:magnifying-glass" class="h-5 w-5" />
					Explorar carros no marketplace
				</NuxtLink>
			</div>
		</UiContainer>
	</div>
</template>

<script setup lang="ts">
import type { VehicleSummary } from '@/schemas/vehicle'
import type { UserWishlist } from '@/schemas/wishlist'
import type { GarageCurrentCar } from '@/schemas/garage'

const router = useRouter()

const userName = ref('Ruan')

//Sistema de favoritos
const {
	favorites,
	isLoading: favoritesLoading,
	favoritesCount,
	removeFavorite: removeFavoriteAction
} = useFavorites()

//Sistema da garagem
const {
	currentCars: garageCurrentCars,
	historyCars: garageHistoryCars,
	stats: garageStats,
	loading: garageLoading,
	error: garageError,
	totalValue: garageTotalValue,
	avgVariation: garageAvgVariation,
	loadAll: loadGarageData,
	addCar,
	moveCarToHistory
} = useGarage()

//Sistema de objetivos/wishlist separado
const { wishlistItems: garageGoals, loadWishlist, removeFromWishlist: removeGoal } = useWishlist()

//Estado para veículos favoritos detalhados
const favoriteVehicles = ref<VehicleSummary[]>([])

//Carregar detalhes dos veículos favoritos
const loadFavoriteVehicles = async () => {
	if (!favorites.value.length) {
		favoriteVehicles.value = []
		return
	}

	try {
		//Use advertisementId to fetch vehicle details
		const vehicleIds = favorites.value.map(fav => fav.advertisementId)

		const responses = await Promise.all(
			vehicleIds.map(slug => $fetch<VehicleSummary>(`/api/vehicles/${slug}`).catch(() => null))
		)

		favoriteVehicles.value = responses.filter(Boolean) as VehicleSummary[]
	} catch (error) {
		console.error('Erro ao carregar veículos favoritos:', error)
		favoriteVehicles.value = []
	}
}

//Remover favorito por veículo
const removeFavoriteByVehicle = async (vehicle: VehicleSummary) => {
	const vehicleName = `${vehicle.brand} ${vehicle.model}`

	if (!confirm(`Tem certeza que deseja remover ${vehicleName} dos seus favoritos?`)) {
		return
	}

	try {
		//Para novos favoritos, use o slug do veículo como advertisementId
		const advertisementId = vehicle.slug || vehicle.id

		await removeFavoriteAction(advertisementId)

		//Remove do estado local
		favoriteVehicles.value = favoriteVehicles.value.filter(v => v.id !== vehicle.id)
	} catch (error) {
		console.error('Erro ao remover favorito:', error)
		alert('Erro ao remover favorito. Tente novamente.')
	}
}

//Watch para recarregar quando favoritos mudarem
watch(
	favorites,
	() => {
		loadFavoriteVehicles()
	},
	{ immediate: true }
)

//Carregar dados da garagem no mounted
onMounted(async () => {
	await loadGarageData()
})

//Usar dados do composable da garagem
const currentCars = garageCurrentCars
const historyCars = garageHistoryCars
const goals = garageGoals
const stats = garageStats
const loading = garageLoading
const error = garageError
const totalValue = garageTotalValue
const avgVariation = garageAvgVariation

const sortedHistoryCars = computed(() => {
	if (!historyCars.value) return []
	return [...historyCars.value].sort((a, b) => {
		const dateA = new Date(a.soldDate || a.purchaseDate)
		const dateB = new Date(b.soldDate || b.purchaseDate)
		return dateB.getTime() - dateA.getTime()
	})
})

function formatCurrency(value: number): string {
	return new Intl.NumberFormat('pt-BR', {
		style: 'currency',
		currency: 'BRL',
		maximumFractionDigits: 0
	}).format(value)
}

function safeNumber(value: unknown): number {
	if (typeof value === 'number' && !isNaN(value)) {
		return value
	}
	return 0
}

function handleEditCar(carId: string) {
	console.log('Editar carro:', carId)
}

function handleViewHistory(carId: string) {
	console.log('Ver histórico FIPE:', carId)
}

function handleMoveToHistory(carId: string) {
	console.log('Mover para história:', carId)
}

async function handleRemoveGoal(goalId: string) {
	try {
		await removeGoal(goalId)
	} catch (error) {
		console.error('Erro ao remover objetivo:', error)
	}
}

function handleViewAds(carModelSlug: string) {
	router.push(`/anuncios?model=${carModelSlug}`)
}

function handleCompare(carModelSlug: string) {
	router.push(`/anuncios?compare=${carModelSlug}`)
}

async function handleGoalAchieved(goal: UserWishlist) {
	const goalName = `${goal.brand} ${goal.model}`

	if (!confirm(`Parabéns! Você conseguiu o ${goalName}? Deseja movê-lo para "Meus Carros"?`)) {
		return
	}

	try {
		//Mostrar loading
		console.log(`Movendo ${goalName} para "Meus Carros"...`)

		//Adicionar aos meus carros
		const newCar = await addCar({
			brand: goal.brand,
			model: goal.model,
			year: new Date().getFullYear(),
			color: 'A definir',
			km: 0,
			fipeValue: goal.targetPriceMax || 50000,
			variation12m: 0,
			plateVerified: false,
			mods: [],
			photos: [],
			purchaseDate: new Date(),
			purchasePrice: goal.targetPriceMax || 50000,
			isActive: true
		})

		console.log('Carro adicionado com sucesso:', newCar)

		//Remover dos objetivos
		await removeGoal(String(goal.id))
		console.log('Objetivo removido com sucesso')

		//Recarregar dados para garantir sincronização
		await loadGarageData()
		await loadWishlist()

		alert(
			`🎉 ${goalName} foi movido para "Meus Carros"! Você pode editar os detalhes na seção "Meus Carros".`
		)
	} catch (error) {
		console.error('Erro ao mover objetivo para meus carros:', error)
		alert(
			`Erro ao mover ${goalName}. Por favor, tente novamente.\n\nDetalhes: ${error instanceof Error ? error.message : 'Erro desconhecido'}`
		)
	}
}

async function handleCarSold(car: GarageCurrentCar) {
	const carName = `${car.brand} ${car.model} ${car.year}`

	const sellPrice = prompt(`Por quanto você vendeu o ${carName}? (Digite apenas o valor numérico)`)
	if (!sellPrice || isNaN(Number(sellPrice))) {
		alert('Valor inválido. Operação cancelada.')
		return
	}

	if (
		!confirm(`Confirmar venda do ${carName} por R$ ${Number(sellPrice).toLocaleString('pt-BR')}?`)
	) {
		return
	}

	try {
		console.log('Movendo carro para histórico:', car, 'por:', sellPrice)

		//Mover carro para histórico usando a API real
		await moveCarToHistory(car.id, {
			sellPrice: Number(sellPrice),
			sellDate: new Date(),
			kmEnd: car.km,
			storyNote: `Vendido por R$ ${Number(sellPrice).toLocaleString('pt-BR')}`
		})

		alert(`🎉 ${carName} foi movido para "Minha História"!`)
	} catch (error) {
		console.error('Erro ao vender carro:', error)
		alert(
			`Erro ao processar venda de ${carName}. Tente novamente.\n\nDetalhes: ${error instanceof Error ? error.message : 'Erro desconhecido'}`
		)
	}
}

//Watcher para recarregar favoritos quando mudarem
watch(
	() => favorites.value,
	async newFavorites => {
		if (newFavorites && newFavorites.length > 0) {
			await loadFavoriteVehicles()
		} else {
			favoriteVehicles.value = []
		}
	},
	{ deep: true, immediate: false }
)

//Carregar dados quando a página for montada
onMounted(async () => {
	try {
		//Verificar se usuário está logado
		const { loadPersistedAuth, currentUser } = useAuth()
		await loadPersistedAuth()

		//TEMPORÁRIO: Criar mock user para teste se não houver usuário logado
		if (!currentUser.value) {
			const auth = useAuth()
			auth.user.value = {
				id: '1',
				phone: '+5511999999999',
				role: 'USER' as const
			}
			auth.isAuthenticated.value = true
		}

		//Carregar dados da garagem (carros atuais, histórico, estatísticas)
		await loadGarageData()

		//Carregar wishlist/objetivos
		await loadWishlist()

		//Carregar detalhes dos veículos favoritos se houver
		if (favorites.value.length > 0) {
			await loadFavoriteVehicles()
		}
	} catch (error) {
		console.error('Erro ao carregar dados da garagem:', error)
	}
})

useHead({
	title: 'Minha Garagem - Auto URBAN',
	meta: [
		{
			name: 'description',
			content: 'Sua garagem pessoal. História, presente e futuro sobre rodas.'
		}
	]
})
</script>
