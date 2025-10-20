<template>
	<div class="min-h-screen bg-gray-50">
		<div v-if="loading" class="py-20">
			<UiContainer>
				<div class="animate-pulse space-y-8">
					<div class="h-96 bg-gray-200 rounded-xl" />
					<div class="h-12 bg-gray-200 rounded w-1/2" />
					<div class="grid grid-cols-4 gap-4">
						<div v-for="i in 4" :key="i" class="h-24 bg-gray-200 rounded" />
					</div>
				</div>
			</UiContainer>
		</div>

		<div v-else-if="vehicle">
			<section
				class="relative bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white overflow-hidden"
			>
				<div class="absolute inset-0 opacity-10">
					<img :src="vehicle.coverImageUrl" alt="" class="w-full h-full object-cover blur-3xl" />
				</div>

				<UiContainer size="xl" padding="md" class="relative py-12">
					<div class="grid lg:grid-cols-2 gap-8 items-center max-w-7xl mx-auto">
						<div class="relative">
							<div class="aspect-video rounded-xl overflow-hidden shadow-xl">
								<img
									:src="vehicle.coverImageUrl"
									:alt="`${vehicle.brand} ${vehicle.model}`"
									class="w-full h-full object-cover"
								/>
							</div>

							<div
								v-if="vehicle.images && vehicle.images.length > 1"
								class="grid grid-cols-4 gap-2 mt-3"
							>
								<div
									v-for="(img, idx) in vehicle.images.slice(0, 4)"
									:key="idx"
									class="aspect-video rounded-md overflow-hidden cursor-pointer hover:opacity-75 transition-opacity"
								>
									<img :src="img" alt="" class="w-full h-full object-cover" />
								</div>
							</div>
						</div>

						<div>
							<div class="flex items-center gap-2 mb-3">
								<img
									:src="getBrandLogo(vehicle.brand)"
									:alt="vehicle.brand"
									class="w-10 h-10 object-contain"
								/>
								<span class="text-xs font-medium text-gray-400 uppercase tracking-wider">
									{{ vehicle.brand }}
								</span>
							</div>

							<h1 class="text-4xl font-black mb-3">
								{{ vehicle.model }}
							</h1>

							<div v-if="availableYears.length > 0" class="mb-4">
								<label class="text-xs text-gray-400 mb-2 block">Selecione o ano do modelo</label>
								<div class="flex flex-wrap gap-2">
									<button
										v-for="yearOption in availableYears"
										:key="yearOption.year"
										:class="[
											'px-4 py-2 rounded-lg font-medium text-sm transition-all',
											selectedYear === yearOption.year
												? 'bg-blue-600 text-white shadow-lg scale-105'
												: 'bg-white/20 text-white hover:bg-white/30 border border-white/20'
										]"
										@click="selectYear(yearOption.year)"
									>
										{{ yearOption.year }}
									</button>
								</div>
							</div>

							<div v-if="currentYearData" class="mb-4 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
								<p class="text-xs text-gray-400 mb-1">Valor FIPE {{ selectedYear }}</p>
								<p class="text-3xl font-black text-white">
									{{ formatCurrency(currentYearData?.price || 0) }}
								</p>
							</div>

							<div class="flex flex-wrap gap-2 mb-4">
								<UiBadge color="blue" variant="solid" size="md">
									{{ selectedYear }}
								</UiBadge>
								<UiBadge v-if="currentYearData" color="gray" variant="soft" size="md">
									{{ currentYearData?.gearbox || 'Automático' }}
								</UiBadge>
								<UiBadge v-if="currentYearData" color="yellow" variant="soft" size="md">
									{{ currentYearData?.horsepower }} cv
								</UiBadge>
							</div>

							<p class="text-base text-gray-300 mb-6 leading-relaxed">
								{{
									vehicle.description ||
									`${vehicle.brand} ${vehicle.model} - Uma máquina feita para quem busca desempenho e estilo.`
								}}
							</p>

							<div class="flex gap-3">
								<UiButton size="md" class="bg-gradient-to-r from-blue-600 to-purple-600">
									<Icon name="heroicons:heart-20-solid" class="w-4 h-4" />
									Adicionar à Garagem
								</UiButton>
								<UiButton
									variant="outline"
									size="md"
									class="border-white/30 text-white hover:bg-white/10"
								>
									<Icon name="heroicons:share-20-solid" class="w-4 h-4" />
									Compartilhar
								</UiButton>
							</div>
						</div>
					</div>
				</UiContainer>
			</section>

			<section class="py-12 bg-white">
				<UiContainer size="xl" padding="md">
					<div class="max-w-7xl mx-auto">
						<div class="text-center mb-8">
							<h2 class="text-2xl font-bold text-gray-900 mb-2">Ficha Técnica</h2>
							<p class="text-sm text-gray-600">Especificações completas do modelo</p>
						</div>

						<div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
							<div
								class="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4 border border-orange-200"
							>
								<div class="flex items-center justify-between mb-3">
									<div class="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
										<Icon name="heroicons:bolt-20-solid" class="w-5 h-5 text-white" />
									</div>
									<UiBadge color="yellow" variant="soft" size="sm">Motor</UiBadge>
								</div>
								<p class="text-xs text-gray-600 mb-1">Potência</p>
								<p class="text-2xl font-bold text-gray-900 mb-1">
									{{ currentYearData?.horsepower || 0 }}
								</p>
								<p class="text-xs text-gray-500">cavalos</p>
							</div>

							<div
								class="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200"
							>
								<div class="flex items-center justify-between mb-3">
									<div class="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
										<Icon name="heroicons:calendar-20-solid" class="w-5 h-5 text-white" />
									</div>
									<UiBadge color="blue" variant="soft" size="sm">Ano</UiBadge>
								</div>
								<p class="text-xs text-gray-600 mb-1">Modelo</p>
								<p class="text-2xl font-bold text-gray-900 mb-1">{{ selectedYear }}</p>
								<p class="text-xs text-gray-500">
									{{ new Date().getFullYear() - selectedYear }} anos
								</p>
							</div>

							<div
								class="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200"
							>
								<div class="flex items-center justify-between mb-3">
									<div class="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
										<Icon name="heroicons:cog-20-solid" class="w-5 h-5 text-white" />
									</div>
									<UiBadge color="green" variant="soft" size="sm">Câmbio</UiBadge>
								</div>
								<p class="text-xs text-gray-600 mb-1">Transmissão</p>
								<p class="text-lg font-bold text-gray-900 mb-1">
									{{ currentYearData?.gearbox || 'Auto' }}
								</p>
								<p class="text-xs text-gray-500">tipo</p>
							</div>

							<div
								class="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200"
							>
								<div class="flex items-center justify-between mb-3">
									<div class="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
										<Icon name="heroicons:fire-20-solid" class="w-5 h-5 text-white" />
									</div>
									<UiBadge color="purple" variant="soft" size="sm">Combustível</UiBadge>
								</div>
								<p class="text-xs text-gray-600 mb-1">Tipo</p>
								<p class="text-lg font-bold text-gray-900 mb-1">
									{{ currentYearData?.fuel || 'Gasolina' }}
								</p>
								<p class="text-xs text-gray-500">motor</p>
							</div>

							<div
								class="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-4 border border-yellow-200"
							>
								<div class="flex items-center justify-between mb-3">
									<div class="w-10 h-10 bg-yellow-500 rounded-lg flex items-center justify-center">
										<Icon name="heroicons:chart-bar-20-solid" class="w-5 h-5 text-white" />
									</div>
									<UiBadge color="yellow" variant="soft" size="sm">KM</UiBadge>
								</div>
								<p class="text-xs text-gray-600 mb-1">Rodagem</p>
								<p class="text-2xl font-bold text-gray-900 mb-1">
									{{ formatKm(currentYearData?.km || 0) }}
								</p>
								<p class="text-xs text-gray-500">total</p>
							</div>

							<div
								class="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-4 border border-red-200"
							>
								<div class="flex items-center justify-between mb-3">
									<div class="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center">
										<Icon name="heroicons:tag-20-solid" class="w-5 h-5 text-white" />
									</div>
									<UiBadge color="red" variant="soft" size="sm">FIPE</UiBadge>
								</div>
								<p class="text-xs text-gray-600 mb-1">Código</p>
								<p class="text-lg font-bold text-gray-900 mb-1">
									{{ currentYearData?.fipeCode || 'N/D' }}
								</p>
								<p class="text-xs text-gray-500">ref.</p>
							</div>
						</div>
					</div>
				</UiContainer>
			</section>

			<section class="py-12 bg-gray-50">
				<UiContainer size="xl" padding="md">
					<div class="max-w-7xl mx-auto bg-white rounded-xl p-6 shadow-lg border border-gray-100">
						<div class="flex items-center justify-between mb-6">
							<div>
								<h2 class="text-2xl font-bold text-gray-900 mb-1">Histórico de Preço FIPE</h2>
								<p class="text-sm text-gray-600">Evolução do valor de mercado</p>
							</div>
							<div class="text-right">
								<p class="text-xs text-gray-500 mb-1">Valor atual ({{ selectedYear }})</p>
								<p class="text-2xl font-bold text-green-600">
									{{ formatCurrency(currentYearData?.price || 0) }}
								</p>
								<p
									:class="[
										'text-xs font-medium mt-1',
										priceHistory.variation > 0 ? 'text-green-600' : 'text-red-600'
									]"
								>
									{{ priceHistory.variation > 0 ? '+' : ''
									}}{{ priceHistory.variation.toFixed(2) }}% (12 meses)
								</p>
							</div>
						</div>

						<div class="mb-6">
							<h3 class="text-xs font-semibold text-gray-700 mb-3">Últimos 6 meses</h3>
							<div class="grid grid-cols-3 md:grid-cols-6 gap-3">
								<div
									v-for="(price, idx) in priceHistory.last6Months"
									:key="idx"
									class="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-3 border border-blue-200"
								>
									<p class="text-xs text-gray-600 mb-1 font-medium">{{ price.month }}</p>
									<p class="text-base font-bold text-gray-900">{{ formatCurrency(price.value) }}</p>
									<p
										v-if="price.change"
										:class="[
											'text-xs font-medium mt-1',
											price.change > 0 ? 'text-green-600' : 'text-red-600'
										]"
									>
										{{ price.change > 0 ? '▲' : '▼' }} {{ Math.abs(price.change).toFixed(1) }}%
									</p>
								</div>
							</div>
						</div>

						<div>
							<h3 class="text-xs font-semibold text-gray-700 mb-3">
								Histórico Completo (12 meses)
							</h3>
							<div class="h-48 bg-gray-50 rounded-lg p-3">
								<Chart type="line" :data="priceChartData" :options="priceChartOptions" />
							</div>
						</div>
					</div>
				</UiContainer>
			</section>

			<section class="py-12 bg-white">
				<UiContainer size="xl" padding="md">
					<div class="max-w-7xl mx-auto">
						<div class="text-center mb-8">
							<h2 class="text-2xl font-bold text-gray-900 mb-2">Anúncios Disponíveis</h2>
							<p class="text-sm text-gray-600">Encontre este modelo à venda na plataforma</p>
						</div>

						<div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
							<VehicleCard
								v-for="ad in mockAds"
								:key="ad.id"
								:title="ad.title"
								:href="`/anuncios/${ad.slug}`"
								:cover-image-url="ad.coverImageUrl"
								:brand="ad.brand"
								:price="ad.price"
								:year="ad.year"
								:km="ad.km"
								:uf="ad.uf"
								:horsepower="ad.horsepower"
							/>
						</div>
					</div>
				</UiContainer>
			</section>

			<section class="py-12 bg-gray-50">
				<UiContainer size="xl" padding="md">
					<div class="max-w-7xl mx-auto">
						<div class="text-center mb-8">
							<h2 class="text-2xl font-bold text-gray-900 mb-2">Modelos Similares</h2>
							<p class="text-sm text-gray-600">Outros carros que você pode gostar</p>
						</div>

						<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
							<NuxtLink
								v-for="similar in randomSimilarModels"
								:key="similar.id"
								:to="`/carros/${similar.slug}`"
								class="group bg-white rounded-lg overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-200"
							>
								<div class="aspect-video overflow-hidden bg-gray-100">
									<img
										:src="similar.coverImageUrl"
										:alt="similar.title"
										class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
									/>
								</div>
								<div class="p-4">
									<div class="flex items-center gap-2 mb-2">
										<UiBadge color="blue" variant="soft" size="sm">{{ similar.year }}</UiBadge>
										<UiBadge color="yellow" variant="soft" size="sm"
											>{{ similar.horsepower }} cv</UiBadge
										>
									</div>
									<h3
										class="font-bold text-base text-gray-900 mb-2 group-hover:text-blue-600 transition-colors"
									>
										{{ similar.brand }} {{ similar.model }}
									</h3>
									<p class="text-xl font-bold text-green-600">
										{{ formatCurrency(similar.price) }}
									</p>
								</div>
							</NuxtLink>
						</div>
					</div>
				</UiContainer>
			</section>
		</div>

		<div v-else class="py-20">
			<UiContainer class="text-center">
				<Icon
					name="heroicons:exclamation-circle-20-solid"
					class="w-20 h-20 text-red-500 mx-auto mb-4"
				/>
				<h2 class="text-2xl font-bold text-gray-900 mb-2">Modelo não encontrado</h2>
				<p class="text-gray-600 mb-6">O modelo que você procura não existe ou foi removido.</p>
				<NuxtLink to="/carros">
					<UiButton> Voltar para modelos </UiButton>
				</NuxtLink>
			</UiContainer>
		</div>
	</div>
</template>

<script setup lang="ts">
import type { VehicleDetail, VehicleSummary } from '@/schemas/vehicle'

interface YearVariant {
	year: number
	price: number
	horsepower: number
	gearbox?: string
	fuel?: string
	km: number
	fipeCode?: string
}

interface ModelData
	extends Omit<
		VehicleDetail,
		'year' | 'price' | 'horsepower' | 'km' | 'gearbox' | 'fuel' | 'fipeCode'
	> {
	years: YearVariant[]
}

interface SearchResult {
	items: VehicleSummary[]
	total: number
	page: number
	pageSize: number
}

const route = useRoute()
const slug = route.params.slug as string

const loading = ref(true)
const vehicle = ref<ModelData | null>(null)
const selectedYear = ref<number>(new Date().getFullYear())
const relatedAds = ref<VehicleSummary[]>([])
const similarModels = ref<VehicleSummary[]>([])
const allModels = ref<VehicleSummary[]>([])

const availableYears = computed(() => {
	if (!vehicle.value?.years) return []
	return [...vehicle.value.years].sort((a, b) => b.year - a.year)
})

const currentYearData = computed(() => {
	if (!vehicle.value?.years) {
		return {
			year: selectedYear.value,
			price: 0,
			horsepower: 0,
			gearbox: 'Automático' as string | undefined,
			fuel: 'Gasolina' as string | undefined,
			km: 0,
			fipeCode: 'N/D' as string | undefined
		}
	}

	const yearData = vehicle.value.years.find(y => y.year === selectedYear.value)
	return yearData || vehicle.value.years[0]
})

function selectYear(year: number) {
	selectedYear.value = year
}

useHead({
	title: () =>
		vehicle.value
			? `${vehicle.value.brand} ${vehicle.value.model} - Auto URBAN`
			: 'Modelo - Auto URBAN',
	meta: [
		{
			name: 'description',
			content: () => vehicle.value?.description || 'Ficha técnica completa do modelo'
		}
	]
})

const priceHistory = computed(() => {
	if (!currentYearData.value) {
		return {
			last6Months: [],
			variation: 0
		}
	}

	const currentPrice = currentYearData.value.price
	const basePrice = currentPrice * 0.92

	const months = [
		'Jan',
		'Fev',
		'Mar',
		'Abr',
		'Mai',
		'Jun',
		'Jul',
		'Ago',
		'Set',
		'Out',
		'Nov',
		'Dez'
	]
	const currentMonth = new Date().getMonth()
	const currentYear = new Date().getFullYear()

	const last6Months = []
	for (let i = 5; i >= 0; i--) {
		const monthIndex = (currentMonth - i + 12) % 12
		const year = currentMonth - i < 0 ? currentYear - 1 : currentYear
		const progress = (6 - i) / 6
		const value = basePrice + (currentPrice - basePrice) * progress
		const prevValue = i < 5 ? basePrice + (currentPrice - basePrice) * ((5 - i) / 6) : null

		last6Months.push({
			month: `${months[monthIndex]}/${year}`,
			value: Math.round(value),
			change: prevValue ? ((value - prevValue) / prevValue) * 100 : null
		})
	}

	return {
		last6Months,
		variation: ((currentPrice - basePrice) / basePrice) * 100
	}
})

const priceChartData = computed(() => {
	if (!currentYearData.value) return { labels: [], datasets: [] }

	const currentPrice = currentYearData.value.price
	const months = [
		'Jan',
		'Fev',
		'Mar',
		'Abr',
		'Mai',
		'Jun',
		'Jul',
		'Ago',
		'Set',
		'Out',
		'Nov',
		'Dez'
	]
	const currentMonth = new Date().getMonth()
	const currentYear = new Date().getFullYear()

	const labels = []
	const values = []

	for (let i = 11; i >= 0; i--) {
		const monthIndex = (currentMonth - i + 12) % 12
		const year = currentMonth - i < 0 ? currentYear - 1 : currentYear
		labels.push(`${months[monthIndex]}/${year.toString().slice(2)}`)

		const baseValue = currentPrice * 0.88
		const progress = (12 - i) / 12
		const volatility = Math.sin(i * 0.5) * 0.02
		values.push(Math.round(baseValue + (currentPrice - baseValue) * progress * (1 + volatility)))
	}

	return {
		labels,
		datasets: [
			{
				data: values,
				borderColor: '#3b82f6',
				backgroundColor: 'rgba(59, 130, 246, 0.1)',
				tension: 0.4,
				borderWidth: 3,
				pointRadius: 4,
				pointBackgroundColor: '#3b82f6',
				fill: true
			}
		]
	}
})

const priceChartOptions = {
	responsive: true,
	maintainAspectRatio: false,
	plugins: {
		legend: {
			display: false
		},
		tooltip: {
			enabled: true,
			backgroundColor: 'rgba(0, 0, 0, 0.8)',
			padding: 12,
			titleColor: '#fff',
			bodyColor: '#fff',
			callbacks: {
				label: (context: { parsed: { y: number } }) => {
					return formatCurrency(context.parsed.y)
				}
			}
		}
	},
	scales: {
		x: {
			grid: {
				display: false
			},
			ticks: {
				font: {
					size: 11
				}
			}
		},
		y: {
			grid: {
				color: 'rgba(0, 0, 0, 0.05)'
			},
			ticks: {
				callback: (value: number | string) => {
					return formatCurrency(Number(value))
				},
				font: {
					size: 11
				}
			}
		}
	}
}

const mockAds = computed(() => {
	if (!vehicle.value || !currentYearData.value) return []

	const cities = [
		'São Paulo',
		'Rio de Janeiro',
		'Belo Horizonte',
		'Curitiba',
		'Porto Alegre',
		'Brasília'
	]
	const ufs = ['SP', 'RJ', 'MG', 'PR', 'RS', 'DF']

	return Array.from({ length: 5 }, (_, i) => ({
		id: `ad-${i}`,
		title: `${vehicle.value!.brand} ${vehicle.value!.model} ${selectedYear.value}`,
		coverImageUrl: vehicle.value!.coverImageUrl,
		brand: vehicle.value!.brand,
		slug: vehicle.value!.slug,
		model: vehicle.value!.model,
		price: currentYearData.value!.price + (Math.random() * 10000 - 5000),
		year: selectedYear.value - Math.floor(Math.random() * 2),
		km: Math.floor(Math.random() * 80000) + 10000,
		uf: ufs[i % ufs.length],
		city: cities[i % cities.length],
		horsepower: currentYearData.value!.horsepower
	}))
})

const randomSimilarModels = computed(() => {
	if (allModels.value.length === 0) return []

	const filtered = allModels.value.filter(m => m.id !== vehicle.value?.id)
	const shuffled = [...filtered].sort(() => Math.random() - 0.5)
	return shuffled.slice(0, 3)
})

async function loadVehicle() {
	loading.value = true
	try {
		const response = await $fetch<SearchResult>('/api/vehicles', {
			query: { pageSize: 100 }
		})

		if (response?.items) {
			allModels.value = response.items

			const matchingVehicles = response.items.filter((v: VehicleSummary) => v.slug === slug)

			if (matchingVehicles.length > 0) {
				const baseVehicle = matchingVehicles[0]

				if (!baseVehicle) return

				const years: YearVariant[] = matchingVehicles.map((v: VehicleSummary) => ({
					year: v.year,
					price: v.price,
					horsepower: v.horsepower,
					gearbox: (v as VehicleDetail).gearbox,
					fuel: (v as VehicleDetail).fuel,
					km: v.km,
					fipeCode: (v as VehicleDetail).fipeCode
				}))

				const allYears = years

				vehicle.value = {
					id: baseVehicle.id,
					title: `${baseVehicle.brand} ${baseVehicle.model}`,
					brand: baseVehicle.brand,
					model: baseVehicle.model,
					slug: baseVehicle.slug,
					city: baseVehicle.city,
					uf: baseVehicle.uf,
					coverImageUrl: baseVehicle.coverImageUrl,
					status: baseVehicle.status,
					featured: baseVehicle.featured,
					description: (baseVehicle as VehicleDetail).description,
					images: (baseVehicle as VehicleDetail).images || [baseVehicle.coverImageUrl],
					seller: (baseVehicle as VehicleDetail).seller,
					years: allYears
				}

				selectedYear.value = Math.max(...allYears.map(y => y.year))

				relatedAds.value = response.items
					.filter(
						(v: VehicleSummary) =>
							v.brand === vehicle.value!.brand &&
							v.model === vehicle.value!.model &&
							v.id !== vehicle.value!.id
					)
					.slice(0, 6)

				similarModels.value = response.items
					.filter(
						(v: VehicleSummary) =>
							v.brand === vehicle.value!.brand && v.model !== vehicle.value!.model
					)
					.slice(0, 3)
			}
		}
	} catch (error) {
		console.error('Error loading vehicle:', error)
	} finally {
		loading.value = false
	}
}

function formatCurrency(value: number): string {
	return new Intl.NumberFormat('pt-BR', {
		style: 'currency',
		currency: 'BRL',
		maximumFractionDigits: 0
	}).format(value)
}

function formatKm(km: number): string {
	if (km === 0) return '0 km'
	if (km < 1000) return `${km} km`
	return `${(km / 1000).toFixed(0)}k km`
}

function getBrandLogo(brand: string): string {
	const logos: Record<string, string> = {
		Audi: '/logos/audi.webp',
		BMW: '/logos/bmw.webp',
		Chevrolet: '/logos/chevrolet.webp',
		Ford: '/logos/ford.webp',
		Honda: '/logos/honda.webp',
		Hyundai: '/logos/hyundai.webp',
		'Mercedes-Benz': '/logos/mercedes-benz.webp',
		Nissan: '/logos/nissan.webp',
		Porsche: '/logos/porsche.webp',
		Renault: '/logos/renault.webp',
		Toyota: '/logos/toyota.webp',
		Volkswagen: '/logos/volkswagen.webp'
	}
	return logos[brand] || '/logos/default-car-logo.webp'
}

onMounted(() => {
	loadVehicle()
})
</script>
