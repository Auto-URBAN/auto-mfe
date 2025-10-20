<template>
	<div class="min-h-screen bg-zinc-950 py-8">
		<UiContainer>
			<GarageHeader
				:user-name="userName"
				:total-cars="stats?.totalCars || 0"
				:total-value="totalValue"
				:avg-variation="avgVariation"
				:total-history="stats?.totalHistoricalCars || 0"
				:total-goals="stats?.totalGoals || 0"
			/>

			<div class="mt-8 flex flex-col gap-6 lg:flex-row">
				<div class="flex-1">
					<div class="mb-6 flex items-center gap-4 border-b border-zinc-800">
						<button
							v-for="tab in tabs"
							:key="tab.id"
							class="px-6 py-3 text-sm font-medium transition-colors"
							:class="
								activeTab === tab.id
									? 'border-b-2 border-blue-500 text-white'
									: 'text-zinc-400 hover:text-zinc-200'
							"
							@click="activeTab = tab.id"
						>
							{{ tab.label }}
							<span v-if="tab.count !== undefined" class="ml-2 text-xs opacity-60"
								>({{ tab.count }})</span
							>
						</button>
					</div>

					<div v-if="loading" class="space-y-4">
						<UiSkeleton v-for="i in 3" :key="i" class="h-64 rounded-xl" />
					</div>

					<div v-else-if="error" class="rounded-xl bg-red-900/20 p-6 text-center">
						<Icon
							name="heroicons:exclamation-triangle"
							class="mx-auto mb-2 h-12 w-12 text-red-400"
						/>
						<p class="text-red-400">{{ error }}</p>
						<button
							class="mt-4 rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700"
							@click="loadGarageData"
						>
							Tentar Novamente
						</button>
					</div>

					<div v-else>
						<div v-show="activeTab === 'current'" class="space-y-6">
							<div
								v-if="currentCars.length === 0"
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

							<GarageCurrentCarCard
								v-for="car in currentCars"
								:key="car.id"
								:car="car"
								@edit="handleEditCar"
								@view-history="handleViewHistory"
								@move-to-history="handleMoveToHistory"
							/>
						</div>

						<div v-show="activeTab === 'history'">
							<div
								v-if="historyCars.length === 0"
								class="rounded-xl bg-zinc-800/30 p-12 text-center"
							>
								<Icon name="heroicons:clock" class="mx-auto mb-4 h-16 w-16 text-zinc-600" />
								<h3 class="mb-2 text-xl font-semibold text-zinc-300">
									Nenhum histórico registrado
								</h3>
								<p class="text-zinc-500">Os carros que você teve no passado aparecerão aqui.</p>
							</div>

							<GarageHistoryTimeline v-else :cars="historyCars" />
						</div>

						<div v-show="activeTab === 'goals'" class="grid grid-cols-1 gap-6 md:grid-cols-2">
							<div
								v-if="goals.length === 0"
								class="col-span-full rounded-xl bg-zinc-800/30 p-12 text-center"
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

							<GarageGoalCard
								v-for="goal in goals"
								:key="goal.id"
								:goal="goal"
								@remove="handleRemoveGoal"
								@view-ads="handleViewAds"
								@compare="handleCompare"
							/>
						</div>

						<div v-show="activeTab === 'stats'">
							<GarageStatsSection v-if="stats" :stats="stats" />
							<div v-else class="rounded-xl bg-zinc-800/30 p-12 text-center">
								<p class="text-zinc-400">Nenhuma estatística disponível ainda.</p>
							</div>
						</div>
					</div>
				</div>

				<aside class="w-full lg:w-80">
					<div class="sticky top-8">
						<GarageNotificationsFeed
							:notifications="notifications"
							@mark-as-read="markNotificationAsRead"
							@mark-all-read="markAllNotificationsAsRead"
						/>
					</div>
				</aside>
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
const {
	loadAll,
	currentCars,
	historyCars,
	goals,
	stats,
	notifications,
	loading,
	error,
	totalValue,
	avgVariation,
	markNotificationAsRead,
	markAllNotificationsAsRead
} = useGarage()

const router = useRouter()

const userName = ref('Ruan')

const activeTab = ref<'current' | 'history' | 'goals' | 'stats'>('current')

const tabs = computed(() => [
	{ id: 'current' as const, label: 'Meus Carros', count: currentCars.value.length },
	{ id: 'history' as const, label: 'Minha História', count: historyCars.value.length },
	{ id: 'goals' as const, label: 'Meus Objetivos', count: goals.value.length },
	{ id: 'stats' as const, label: 'Estatísticas' }
])

async function loadGarageData() {
	await loadAll()
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
	router.push(`/carro?compare=${slug}`)
}

onMounted(() => {
	loadGarageData()
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
