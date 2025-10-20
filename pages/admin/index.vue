<template>
	<div>
		<div class="mb-8">
			<h1 class="text-2xl font-bold text-gray-900">Dashboard Administrativo</h1>
			<p class="mt-2 text-sm text-gray-600">Visão geral da plataforma Auto URBAN</p>
		</div>

		<div v-if="adminLoading" class="space-y-6">
			<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
				<div v-for="i in 4" :key="i" class="h-24 bg-gray-200 rounded-lg animate-pulse" />
			</div>
		</div>

		<div
			v-else-if="adminError"
			class="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded"
		>
			<div class="flex">
				<Icon name="heroicons:exclamation-triangle" class="h-5 w-5 text-red-400 mr-2" />
				<p class="text-sm">{{ adminError }}</p>
			</div>
		</div>

		<div v-else class="space-y-8">
			<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
				<BigNumberCard
					title="Total de Veículos"
					:value="metrics?.totals?.vehicles || 0"
					icon="heroicons:truck"
					color="blue"
				/>

				<BigNumberCard
					title="Aguardando Aprovação"
					:value="metrics?.totals?.pending || 0"
					icon="heroicons:clock"
					color="yellow"
					:clickable="true"
					@click="navigateTo('/admin/vehicles?status=pending')"
				/>

				<BigNumberCard
					title="Aprovados"
					:value="metrics?.totals?.approved || 0"
					icon="heroicons:check-circle"
					color="green"
				/>

				<BigNumberCard
					title="Total de Usuários"
					:value="metrics?.totals?.users || 0"
					icon="heroicons:users"
					color="purple"
					:clickable="true"
					@click="navigateTo('/admin/users')"
				/>
			</div>

			<div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
				<div class="bg-white rounded-lg shadow p-6">
					<div class="mb-4">
						<h3 class="text-lg font-semibold text-gray-900">Top Marcas</h3>
					</div>

					<div class="space-y-4">
						<div
							v-for="brand in topBrands"
							:key="brand.brand"
							class="flex items-center justify-between"
						>
							<span class="text-sm font-medium text-gray-900">{{ brand.brand }}</span>
							<div class="flex items-center space-x-2">
								<div class="w-24 bg-gray-200 rounded-full h-2">
									<div
										class="bg-blue-600 h-2 rounded-full transition-all duration-300"
										:style="{ width: `${(brand.count / maxBrandCount) * 100}%` }"
									/>
								</div>
								<span class="text-sm text-gray-600 w-8 text-right">{{ brand.count }}</span>
							</div>
						</div>
					</div>
				</div>

				<div class="bg-white rounded-lg shadow p-6">
					<div class="mb-4">
						<h3 class="text-lg font-semibold text-gray-900">Estados com Mais Anúncios</h3>
					</div>

					<div class="space-y-4">
						<div v-for="uf in topStates" :key="uf.uf" class="flex items-center justify-between">
							<span class="text-sm font-medium text-gray-900">{{ uf.uf }}</span>
							<div class="flex items-center space-x-2">
								<div class="w-24 bg-gray-200 rounded-full h-2">
									<div
										class="bg-green-600 h-2 rounded-full transition-all duration-300"
										:style="{ width: `${(uf.count / maxStateCount) * 100}%` }"
									/>
								</div>
								<span class="text-sm text-gray-600 w-8 text-right">{{ uf.count }}</span>
							</div>
						</div>
					</div>
				</div>
			</div>

			<div class="bg-white rounded-lg shadow p-6">
				<div class="mb-4">
					<h3 class="text-lg font-semibold text-gray-900">Ações Rápidas</h3>
				</div>

				<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
					<button
						@click="navigateTo('/admin/vehicles?status=pending')"
						class="flex items-center justify-start px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
					>
						<Icon name="heroicons:eye" class="mr-2 w-4 h-4" />
						Revisar Anúncios Pendentes
					</button>

					<button
						@click="navigateTo('/admin/users')"
						class="flex items-center justify-start px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
					>
						<Icon name="heroicons:users" class="mr-2 w-4 h-4" />
						Gerenciar Usuários
					</button>

					<button
						disabled
						class="flex items-center justify-start px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-400 bg-gray-50 cursor-not-allowed"
					>
						<Icon name="heroicons:chart-bar" class="mr-2 w-4 h-4" />
						Relatórios (Em Breve)
					</button>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import BigNumberCard from '~/components/BigNumberCard.vue'

definePageMeta({
	layout: 'admin',
	middleware: 'admin-auth'
})

const auth = useAuth()
const { adminStats, adminLoading, adminError, loadAdminStats } = auth

const metrics = computed(() => adminStats.value)

const topBrands = computed(() => {
	if (!metrics.value?.byBrand) return []
	return metrics.value.byBrand.slice(0, 5)
})

const topStates = computed(() => {
	if (!metrics.value?.byUF) return []
	return metrics.value.byUF.slice(0, 5)
})

const maxBrandCount = computed(() => {
	return Math.max(...(topBrands.value.map(b => b.count) || [1]))
})

const maxStateCount = computed(() => {
	return Math.max(...(topStates.value.map(s => s.count) || [1]))
})

onMounted(async () => {
	try {
		await loadAdminStats()
	} catch (err) {
		console.error('Failed to load admin metrics:', err)
	}
})

useHead({
	title: 'Admin Dashboard - Auto URBAN'
})
</script>
