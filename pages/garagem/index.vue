<template>
	<div class="min-h-screen bg-zinc-700 py-8">
		<UiContainer>
			<GarageHeader
				:user-name="userName"
				:total-cars="currentCars?.length || 0"
				:total-value="totalValue"
				:avg-variation="avgVariation"
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
					<!-- Seção: Meus Objetivos -->
					<section>
						<div class="mb-6 flex items-center justify-between">
							<div>
								<h2 class="text-2xl font-bold text-white">Meus Objetivos</h2>
								<p class="text-sm text-zinc-400">Carros que você sonha em ter</p>
							</div>
							<span class="rounded-full bg-amber-900/30 px-3 py-1 text-sm text-amber-400">
								{{ goals?.length || 0 }} {{ goals?.length === 1 ? 'objetivo' : 'objetivos' }}
							</span>
						</div>

						<div
							v-if="!goals || goals.length === 0"
							class="rounded-xl bg-zinc-800/30 p-12 text-center"
						>
							<Icon name="heroicons:star" class="mx-auto mb-4 h-16 w-16 text-zinc-600" />
							<h3 class="mb-2 text-xl font-semibold text-zinc-300">Nenhum objetivo definido</h3>
							<p class="mb-4 text-zinc-500">Adicione carros que você sonha em ter no futuro.</p>
							<button
								class="rounded-lg bg-amber-600 px-6 py-3 font-medium text-white transition-colors hover:bg-amber-700"
							>
								Adicionar Objetivo
							</button>
						</div>

						<div v-else class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-5">
							<GarageGoalCard
								v-for="goal in goals"
								:key="goal.id"
								:goal="goal"
								@remove="handleRemoveGoal"
								@view-ads="handleViewAds"
								@compare="handleCompare"
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
								{{ currentCars?.length || 0 }} {{ currentCars?.length === 1 ? 'carro' : 'carros' }}
							</span>
						</div>

						<div
							v-if="!currentCars || currentCars.length === 0"
							class="rounded-xl bg-zinc-800/30 p-12 text-center"
						>
							<Icon name="heroicons:plus-circle" class="mx-auto mb-4 h-16 w-16 text-zinc-600" />
							<h3 class="mb-2 text-xl font-semibold text-zinc-300">
								Nenhum carro cadastrado ainda
							</h3>
							<p class="mb-4 text-zinc-500">
								Adicione seu primeiro carro para começar sua garagem.
							</p>
							<button
								class="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition-colors hover:bg-blue-700"
							>
								Adicionar Carro
							</button>
						</div>

						<div v-else class="grid grid-cols-5 gap-6">
							<GarageCurrentCarCard
								v-for="car in currentCars"
								:key="car.id"
								:car="car"
								@edit="handleEditCar"
								@view-history="handleViewHistory"
								@move-to-history="handleMoveToHistory"
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
import type { GarageCurrentCar, GarageHistoryCar, GarageGoal, GarageStats } from '@/schemas/garage'

const router = useRouter()

const userName = ref('Ruan')

//Fetch data directly with useFetch
const { data: currentCars, pending: loadingCurrent } =
	await useFetch<GarageCurrentCar[]>('/api/garage/current')
const { data: historyCars, pending: loadingHistory } =
	await useFetch<GarageHistoryCar[]>('/api/garage/history')
const { data: goals, pending: loadingGoals } = await useFetch<GarageGoal[]>('/api/garage/goals')
const { data: stats, pending: loadingStats } = await useFetch<GarageStats>('/api/garage/stats')

const loading = computed(
	() => loadingCurrent.value || loadingHistory.value || loadingGoals.value || loadingStats.value
)

const error = ref<string | null>(null)

const totalValue = computed(() => {
	if (!currentCars.value) return 0
	return currentCars.value.reduce((sum, car) => sum + car.fipeValue, 0)
})

const avgVariation = computed(() => {
	if (!currentCars.value || currentCars.value.length === 0) return 0
	const total = currentCars.value.reduce((sum, car) => sum + car.variation12m, 0)
	return total / currentCars.value.length
})

const sortedHistoryCars = computed(() => {
	if (!historyCars.value) return []
	return [...historyCars.value].sort((a, b) => {
		const dateA = new Date(a.sellDate || a.purchaseDate)
		const dateB = new Date(b.sellDate || b.purchaseDate)
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

function handleEditCar(carId: string) {
	console.log('Editar carro:', carId)
}

function handleViewHistory(carId: string) {
	console.log('Ver histórico FIPE:', carId)
}

function handleMoveToHistory(carId: string) {
	console.log('Mover para história:', carId)
}

function handleRemoveGoal(goalId: string) {
	console.log('Remover objetivo:', goalId)
}

function handleViewAds(slug: string) {
	router.push(`/anuncios?model=${slug}`)
}

function handleCompare(slug: string) {
	router.push(`/anuncios?compare=${slug}`)
}

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
