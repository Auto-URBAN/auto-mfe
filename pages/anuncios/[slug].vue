<template>
	<UiContainer class="py-6">
		<nav class="mb-6">
			<ol class="flex items-center space-x-2 text-sm">
				<li>
					<NuxtLink to="/" class="text-blue-600 hover:text-blue-800"> Início </NuxtLink>
				</li>
				<li>
					<Icon name="heroicons:chevron-right-20-solid" class="w-4 h-4 text-gray-400" />
				</li>
				<li>
					<NuxtLink :to="`/?make=${vehicle?.brand}`" class="text-blue-600 hover:text-blue-800">
						{{ vehicle?.brand }}
					</NuxtLink>
				</li>
				<li>
					<Icon name="heroicons:chevron-right-20-solid" class="w-4 h-4 text-gray-400" />
				</li>
				<li class="text-gray-600">{{ vehicle?.model }} {{ vehicle?.year }}</li>
			</ol>
		</nav>

		<div v-if="pending" class="space-y-6">
			<div class="h-64 lg:h-96 bg-gray-200 animate-pulse rounded-lg" />
			<div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
				<div class="lg:col-span-2 space-y-6">
					<div class="h-48 bg-gray-200 animate-pulse rounded-lg" />
					<div class="h-32 bg-gray-200 animate-pulse rounded-lg" />
				</div>
				<div class="h-64 bg-gray-200 animate-pulse rounded-lg" />
			</div>
		</div>

		<UiAlert
			v-else-if="error"
			variant="error"
			:title="error.message || 'Erro ao carregar veículo'"
			class="mb-6"
		>
			<template #default>
				<UiButton variant="outline" @click="refresh()"> Tentar novamente </UiButton>
			</template>
		</UiAlert>

		<div v-else-if="vehicle" class="space-y-8">
			<div class="space-y-3 lg:space-y-0 lg:flex lg:items-center lg:justify-between lg:gap-4">
				<div class="flex-1">
					<h1 class="text-xl lg:text-3xl font-bold text-gray-900 leading-tight">
						{{ vehicle.title }}
					</h1>
					<div class="flex flex-wrap items-center gap-2 mt-2 text-xs lg:text-sm text-gray-600">
						<span class="inline-flex items-center">
							<Icon name="heroicons:clock" class="w-3 h-3 mr-1" />
							{{ vehicle.km.toLocaleString('pt-BR') }} km
						</span>
						<span class="text-gray-400">•</span>
						<span class="inline-flex items-center">
							<Icon name="heroicons:map-pin" class="w-3 h-3 mr-1" />
							{{ vehicle.city }}, {{ vehicle.uf }}
						</span>
						<span class="text-gray-400 hidden sm:inline">•</span>
						<span class="text-gray-500 text-xs">ID: {{ vehicle.id.substring(0, 8) }}</span>
					</div>
				</div>
			</div>

			<div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
				<div class="lg:col-span-2 space-y-8">
					<VehicleGallery :vehicle="vehicle" />

					<div class="lg:hidden space-y-4">
						<div class="bg-white rounded-lg shadow-lg overflow-hidden">
							<div class="p-4 bg-gradient-to-r from-blue-600 to-blue-700">
								<div class="flex items-center justify-between text-white">
									<div class="flex items-center space-x-3">
										<div
											class="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center"
										>
											<Icon name="heroicons:phone" class="w-5 h-5" />
										</div>
										<div>
											<p class="font-semibold text-sm">{{ formatSellerName(vehicle.seller.id) }}</p>
											<p class="text-xs opacity-90">{{ formatPhone(vehicle.seller.phone) }}</p>
										</div>
									</div>
									<button
										class="p-1 hover:bg-white/20 rounded transition-colors"
										@click="toggleContactExpanded"
									>
										<Icon
											:name="contactExpanded ? 'heroicons:chevron-up' : 'heroicons:chevron-down'"
											class="w-4 h-4"
										/>
									</button>
								</div>
							</div>

							<div v-show="contactExpanded" class="p-4 space-y-3">
								<div class="space-y-2">
									<div class="flex items-center justify-between text-sm">
										<div class="flex items-center space-x-2">
											<Icon name="heroicons:identification" class="w-4 h-4 text-gray-500" />
											<span class="text-gray-600">Placa:</span>
											<span class="font-mono font-semibold text-gray-900">{{
												formatPlate(vehicle.id)
											}}</span>
										</div>
									</div>

									<div class="flex items-center justify-between text-sm">
										<div class="flex items-center space-x-2">
											<Icon name="heroicons:map-pin" class="w-4 h-4 text-gray-500" />
											<span class="text-gray-600">Local:</span>
											<span class="font-semibold text-gray-900"
												>{{ vehicle.city }}, {{ vehicle.uf }}</span
											>
										</div>
									</div>

									<div class="flex items-center justify-between text-sm">
										<div class="flex items-center space-x-2">
											<Icon name="heroicons:clock" class="w-4 h-4 text-gray-500" />
											<span class="text-gray-600">Anúncio:</span>
											<span class="font-semibold text-gray-900">{{
												formatDate(vehicle.createdAt)
											}}</span>
										</div>
										<div class="flex items-center space-x-1 text-gray-500">
											<Icon name="heroicons:eye" class="w-3 h-3" />
											<span class="text-xs">{{ getViewCount(vehicle.id) }}</span>
										</div>
									</div>
								</div>

								<div class="grid grid-cols-2 gap-2">
									<a
										:href="`https://wa.me/${vehicle.seller.whatsapp}?text=Olá! Tenho interesse no ${vehicle.title}%0A%0ALocalização: ${vehicle.city}/${vehicle.uf}%0APreço: ${formatCurrency(vehicle.price)}%0A%0APodemos conversar?`"
										target="_blank"
										class="flex items-center justify-center px-3 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-md transition-colors"
									>
										<Icon name="mdi:whatsapp" class="w-4 h-4 mr-1" />
										WhatsApp
									</a>

									<a
										:href="`tel:${vehicle.seller.phone}`"
										class="flex items-center justify-center px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md transition-colors"
									>
										<Icon name="heroicons:phone" class="w-4 h-4 mr-1" />
										Ligar
									</a>
								</div>

								<div class="grid grid-cols-2 gap-2">
									<button
										class="flex items-center justify-center px-3 py-1.5 border border-gray-300 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-50 transition-colors"
										@click="shareVehicle"
									>
										<Icon name="heroicons:share" class="w-4 h-4 mr-1" />
										Compartilhar
									</button>

									<button
										:class="[
											'flex items-center justify-center px-3 py-1.5 text-sm font-medium rounded-md transition-colors',
											isCurrentVehicleFavorite
												? 'bg-red-100 border border-red-300 text-red-700 hover:bg-red-200'
												: 'border border-gray-300 text-gray-700 hover:bg-gray-50'
										]"
										@click="saveVehicle"
										:disabled="favoritesLoading"
									>
										<Icon
											v-if="!favoritesLoading"
											:name="isCurrentVehicleFavorite ? 'heroicons:heart-solid' : 'heroicons:heart'"
											class="w-4 h-4 mr-1"
										/>
										<Icon v-else name="heroicons:arrow-path" class="w-4 h-4 mr-1 animate-spin" />
										{{
											favoritesLoading
												? 'Salvando...'
												: isCurrentVehicleFavorite
													? 'Salvo'
													: 'Salvar'
										}}
									</button>
								</div>
							</div>
						</div>

						<div class="bg-white rounded-lg shadow-lg overflow-hidden">
							<div
								class="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
								@click="toggleFinancingExpanded"
							>
								<div class="flex items-center justify-between">
									<div class="flex items-center space-x-2">
										<Icon name="heroicons:calculator" class="w-5 h-5 text-gray-600" />
										<h3 class="font-semibold text-gray-900">Financiamento</h3>
									</div>
									<Icon
										:name="financingExpanded ? 'heroicons:chevron-up' : 'heroicons:chevron-down'"
										class="w-4 h-4 text-gray-500"
									/>
								</div>

								<div v-if="!financingExpanded" class="mt-2">
									<div class="text-sm text-gray-600">Simule parcelas a partir de</div>
									<div class="text-lg font-semibold text-blue-600">
										R$ {{ Math.round((vehicle.price * 0.8) / 48).toLocaleString('pt-BR') }}
									</div>
								</div>
							</div>

							<div v-show="financingExpanded" class="p-4 pt-0">
								<SimpleFinancingSimulator :price="vehicle.price" />
							</div>
						</div>

						<div
							v-if="carData?.partners?.length > 0"
							class="bg-white rounded-lg shadow-lg overflow-hidden"
						>
							<div
								class="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
								@click="togglePriceExpanded"
							>
								<div class="flex items-center justify-between">
									<div class="flex items-center space-x-2">
										<Icon name="heroicons:chart-bar" class="w-5 h-5 text-gray-600" />
										<h3 class="font-semibold text-gray-900">Comparação de Preços</h3>
									</div>
									<Icon
										:name="priceExpanded ? 'heroicons:chevron-up' : 'heroicons:chevron-down'"
										class="w-4 h-4 text-gray-500"
									/>
								</div>

								<div v-if="!priceExpanded" class="mt-2">
									<div class="flex justify-between items-center text-sm">
										<span class="text-gray-600">Este anúncio</span>
										<span
											:class="[
												'font-semibold',
												priceComparison?.isGoodDeal
													? 'text-green-600'
													: priceComparison?.isExpensive
														? 'text-red-600'
														: 'text-gray-900'
											]"
										>
											{{ formatCurrency(vehicle.price) }}
										</span>
									</div>
									<div class="text-xs text-gray-500 mt-1">
										vs. média: {{ formatCurrency(averageMarketPrice) }}
									</div>
								</div>
							</div>

							<div v-show="priceExpanded" class="px-4 pb-4">
								<div class="space-y-3">
									<div class="flex justify-between items-center text-sm border-b pb-2">
										<span class="font-medium text-gray-900">Este anúncio</span>
										<span class="text-green-600 font-semibold">{{
											formatCurrency(vehicle.price)
										}}</span>
									</div>

									<div class="text-xs text-gray-600 mb-2">Média de mercado:</div>
									<div class="space-y-2">
										<div
											v-for="partner in carData.partners"
											:key="partner.name"
											class="flex justify-between items-center text-sm"
										>
											<span class="text-gray-600">{{ partner.name }}</span>
											<span class="text-gray-900">{{ formatCurrency(partner.value) }}</span>
										</div>
									</div>

									<div class="flex justify-between items-center text-sm font-medium pt-2 border-t">
										<span>Média geral</span>
										<span>{{ formatCurrency(averageMarketPrice) }}</span>
									</div>

									<div class="text-xs text-gray-500 pt-2 border-t">
										{{ priceComparison.dealText }}
									</div>
								</div>
							</div>
						</div>
					</div>

					<VehicleSpecs :vehicle="vehicle" />

					<div v-if="carData?.prices?.length > 0" class="bg-white rounded-lg shadow-lg p-6">
						<h2 class="text-xl font-semibold text-gray-900 mb-4">Histórico de Preços</h2>
						<div class="h-80">
							<Chart
								type="line"
								:data="{
									labels: priceLabels,
									datasets: priceDatasets
								}"
								:legend="true"
								:options="{
									responsive: true,
									maintainAspectRatio: false,
									elements: {
										line: {
											tension: 0.3
										}
									},
									scales: {
										y: {
											beginAtZero: false,
											ticks: {
												callback: function (value) {
													return 'R$ ' + new Intl.NumberFormat('pt-BR').format(value)
												}
											}
										}
									}
								}"
							/>
						</div>
						<p class="text-sm text-gray-600 mt-4">
							Dados baseados em pesquisas de mercado e anúncios similares
						</p>
					</div>
				</div>

				<div class="hidden lg:block lg:col-span-1">
					<div class="sticky transition-all duration-300 z-30" :style="{ top: stickyTop + 'px' }">
						<div class="space-y-4">
							<div class="bg-white rounded-lg shadow-lg overflow-hidden">
								<div class="p-4 bg-gradient-to-r from-blue-600 to-blue-700">
									<div class="flex items-center justify-between text-white">
										<div class="flex items-center space-x-3">
											<div
												class="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center"
											>
												<Icon name="heroicons:phone" class="w-5 h-5" />
											</div>
											<div>
												<p class="font-semibold text-sm">
													{{ formatSellerName(vehicle.seller.id) }}
												</p>
												<p class="text-xs opacity-90">{{ formatPhone(vehicle.seller.phone) }}</p>
											</div>
										</div>
										<button
											class="p-1 hover:bg-white/20 rounded transition-colors"
											@click="toggleContactExpanded"
										>
											<Icon
												:name="contactExpanded ? 'heroicons:chevron-up' : 'heroicons:chevron-down'"
												class="w-4 h-4"
											/>
										</button>
									</div>
								</div>

								<div v-show="contactExpanded" class="p-4 space-y-3">
									<div class="space-y-2">
										<div class="flex items-center justify-between text-sm">
											<div class="flex">
												<p class="text-2xl lg:text-2xl font-bold text-green-600">
													{{ formatCurrency(vehicle.price) }}
												</p>
											</div>

											<div class="flex items-center space-x-2">
												<Icon name="heroicons:map-pin" class="w-4 h-4 text-gray-500" />

												<span class="font-semibold text-gray-900"
													>{{ vehicle.city }}, {{ vehicle.uf }}</span
												>
											</div>
										</div>

										<div class="flex items-center space-x-2">
											<Icon name="heroicons:identification" class="w-4 h-4 text-gray-500" />
											<span class="text-gray-600">Placa:</span>
											<span class="font-mono font-semibold text-gray-900">{{
												formatPlate(vehicle.id)
											}}</span>
										</div>

										<div class="flex items-center justify-between text-sm">
											<div class="flex items-center space-x-2">
												<Icon name="heroicons:clock" class="w-4 h-4 text-gray-500" />
												<span class="text-gray-600">Anúncio:</span>
												<span class="font-semibold text-gray-900">{{
													formatDate(vehicle.createdAt)
												}}</span>
											</div>
											<div class="flex items-center space-x-1 text-gray-500">
												<Icon name="heroicons:eye" class="w-3 h-3" />
												<span class="text-xs">{{ getViewCount(vehicle.id) }}</span>
											</div>
										</div>
									</div>

									<div class="grid grid-cols-6 gap-2">
										<a
											:href="`https://wa.me/${vehicle.seller.whatsapp}?text=Olá! Tenho interesse no ${vehicle.title}%0A%0ALocalização: ${vehicle.city}/${vehicle.uf}%0APreço: ${formatCurrency(vehicle.price)}%0A%0APodemos conversar?`"
											target="_blank"
											class="flex col-span-2 items-center justify-center px-3 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-md transition-colors"
										>
											<Icon name="mdi:whatsapp" class="w-4 h-4 mr-1" />
											WhatsApp
										</a>

										<a
											:href="`tel:${vehicle.seller.phone}`"
											class="flex col-span-2 items-center justify-center px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md transition-colors"
										>
											<Icon name="heroicons:phone" class="w-4 h-4 mr-1" />
											Ligar
										</a>
										<div class="col-span-1 flex gap-2 justify-between">
											<button
												class="flex items-center justify-center px-3 py-1.5 border border-gray-300 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-50 transition-colors"
												@click="shareVehicle"
											>
												<Icon name="heroicons:share" class="w-4 h-4 mr-1" />
											</button>

											<button
												:class="[
													'flex items-center justify-center px-3 py-1.5 text-sm font-medium rounded-md transition-colors',
													isCurrentVehicleFavorite
														? 'bg-red-100 border border-red-300 text-red-700 hover:bg-red-200'
														: 'border border-gray-300 text-gray-700 hover:bg-gray-50'
												]"
												@click="saveVehicle"
												:disabled="favoritesLoading"
												:title="
													isCurrentVehicleFavorite
														? 'Remover dos favoritos'
														: 'Adicionar aos favoritos'
												"
											>
												<Icon
													v-if="!favoritesLoading"
													:name="
														isCurrentVehicleFavorite ? 'heroicons:heart-solid' : 'heroicons:heart'
													"
													class="w-4 h-4"
												/>
												<Icon v-else name="heroicons:arrow-path" class="w-4 h-4 animate-spin" />
											</button>
										</div>
									</div>
								</div>
							</div>

							<div
								v-if="carData?.partners?.length > 0"
								class="bg-white rounded-lg shadow-lg overflow-hidden"
							>
								<div
									class="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
									@click="togglePriceExpanded"
								>
									<div class="flex items-center justify-between">
										<div class="flex items-center space-x-2">
											<Icon name="heroicons:chart-bar" class="w-5 h-5 text-gray-600" />
											<h3 class="font-semibold text-gray-900">Comparação de Preços</h3>
										</div>
										<Icon
											:name="priceExpanded ? 'heroicons:chevron-up' : 'heroicons:chevron-down'"
											class="w-4 h-4 text-gray-500"
										/>
									</div>

									<div v-if="!priceExpanded" class="mt-2">
										<div class="flex justify-between items-center text-sm">
											<span class="text-gray-600">Este anúncio</span>
											<span
												:class="[
													'font-semibold',
													priceComparison?.isGoodDeal
														? 'text-green-600'
														: priceComparison?.isExpensive
															? 'text-red-600'
															: 'text-gray-900'
												]"
											>
												{{ formatCurrency(vehicle.price) }}
											</span>
										</div>
										<div class="text-xs text-gray-500 mt-1">
											vs. média: {{ formatCurrency(averageMarketPrice) }}
										</div>
									</div>
								</div>

								<div v-show="priceExpanded" class="px-4 pb-4">
									<div class="space-y-3">
										<div class="flex justify-between items-center text-sm border-b pb-2">
											<span class="font-medium text-gray-900">Este anúncio</span>
											<span class="text-green-600 font-semibold">{{
												formatCurrency(vehicle.price)
											}}</span>
										</div>

										<div class="text-xs text-gray-600 mb-2">Média de mercado:</div>
										<div class="space-y-2">
											<div
												v-for="partner in carData.partners"
												:key="partner.name"
												class="flex justify-between items-center text-sm"
											>
												<span class="text-gray-600">{{ partner.name }}</span>
												<span class="text-gray-900">{{ formatCurrency(partner.value) }}</span>
											</div>
										</div>

										<div
											class="flex justify-between items-center text-sm font-medium pt-2 border-t"
										>
											<span>Média geral</span>
											<span>{{ formatCurrency(averageMarketPrice) }}</span>
										</div>

										<div v-if="priceComparison" class="mt-2">
											<span
												:class="[
													'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium',
													priceComparison.isGoodDeal
														? 'bg-green-100 text-green-800'
														: priceComparison.isExpensive
															? 'bg-red-100 text-red-800'
															: 'bg-yellow-100 text-yellow-800'
												]"
											>
												{{ priceComparison.message }}
											</span>
										</div>
									</div>
								</div>
							</div>

							<div class="bg-white rounded-lg shadow-lg overflow-hidden">
								<div
									class="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
									@click="toggleFinancingExpanded"
								>
									<div class="flex items-center justify-between">
										<div class="flex items-center space-x-2">
											<Icon name="heroicons:calculator" class="w-5 h-5 text-gray-600" />
											<h3 class="font-semibold text-gray-900">Simulador</h3>
										</div>
										<Icon
											:name="financingExpanded ? 'heroicons:chevron-up' : 'heroicons:chevron-down'"
											class="w-4 h-4 text-gray-500"
										/>
									</div>

									<div v-if="!financingExpanded" class="mt-2">
										<div class="text-sm text-gray-600">Simule o financiamento</div>
										<div class="text-lg font-semibold text-blue-600">
											{{ previewMonthlyPayment }}
										</div>
										<div class="text-xs text-gray-500">
											entrada de {{ formatCurrency(vehicle.price * 0.2) }}
										</div>
									</div>
								</div>

								<div v-show="financingExpanded" class="px-4 pb-4">
									<SimpleFinancingSimulator class="w-full" :price="vehicle.price" />
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			<div v-if="relatedVehicles.length > 0" class="mt-12">
				<h2 class="text-xl font-semibold text-gray-900 mb-6">Anúncios Similares</h2>

				<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
					<VehicleCard
						v-for="related in relatedVehicles"
						:key="related.id"
						:href="`/anuncios/${related.slug}`"
						:title="related.title"
						:brand="related.brand"
						:model="related.model"
						:year="related.year"
						:price="related.price"
						:km="related.km"
						:city="related.city"
						:uf="related.uf"
						:cover-image-url="related.coverImageUrl"
						:slug="related.slug"
						:show-seller="false"
					/>
				</div>
			</div>
		</div>

		<div v-else-if="!pending && !vehicle" class="text-center py-12">
			<Icon name="heroicons:exclamation-triangle" class="w-16 h-16 text-gray-400 mx-auto mb-4" />
			<h2 class="text-xl font-semibold text-gray-900 mb-2">Veículo não encontrado</h2>
			<p class="text-gray-600 mb-4">Este anúncio pode ter sido removido ou não existe.</p>
			<UiButton @click="navigateTo('/')"> Voltar às buscas </UiButton>
		</div>
	</UiContainer>
</template>

<script setup lang="ts">
const route = useRoute()
const vehicleSlug = route.params.slug as string

const {
	data: vehicleData,
	pending,
	error,
	refresh
} = await useFetch('/api/vehicles', {
	query: { slug: vehicleSlug }
})

const vehicle = computed(() => {
	if (!vehicleData.value) return null
	if ('items' in vehicleData.value) return null
	return vehicleData.value
})

const { data: relatedData } = await useFetch('/api/vehicles', {
	query: { brand: computed(() => vehicle.value?.brand), pageSize: 4 },
	default: () => ({ items: [], page: 1, pageSize: 6, total: 0 })
})

const relatedVehicles = computed(() => {
	if (!relatedData.value || !('items' in relatedData.value)) return []
	return relatedData.value.items
})

const carData = computed(() => vehicle.value)

const contactExpanded = ref(false)
const priceExpanded = ref(false)
const financingExpanded = ref(false)

const stickyTop = ref(112)

const toggleContactExpanded = () => {
	contactExpanded.value = !contactExpanded.value
}

const togglePriceExpanded = () => {
	priceExpanded.value = !priceExpanded.value
}

const toggleFinancingExpanded = () => {
	financingExpanded.value = !financingExpanded.value
}

const formatPhone = (phone: string) => {
	if (phone.length === 11) {
		return phone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')
	}
	return phone
}

const formatPlate = (vehicleId: string) => {
	const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J']
	const nums = vehicleId.replace(/\D/g, '') + '000000'

	const letter1 = letters[parseInt(nums[0]) % letters.length]
	const letter2 = letters[parseInt(nums[1]) % letters.length]
	const digit1 = nums[2]
	const digit2 = nums[5]

	return `${letter1}${letter2}${digit1}****${digit2}`
}

const formatSellerName = (sellerId: string) => {
	const firstNames = [
		'João',
		'Maria',
		'Carlos',
		'Ana',
		'Pedro',
		'Julia',
		'Roberto',
		'Fernanda',
		'Ricardo',
		'Patricia'
	]
	const lastNames = [
		'Silva',
		'Santos',
		'Oliveira',
		'Pereira',
		'Costa',
		'Rodrigues',
		'Almeida',
		'Nascimento',
		'Lima',
		'Araújo'
	]

	const nameHash = sellerId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
	const firstName = firstNames[nameHash % firstNames.length]
	const lastName = lastNames[(nameHash * 3) % lastNames.length]

	return `${firstName} ${lastName}`
}

const getViewCount = (vehicleId: string) => {
	const hash = vehicleId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
	return (hash % 200) + 50
}

const formatDate = (dateString: string) => {
	const date = new Date(dateString)
	const now = new Date()
	const diffTime = Math.abs(now.getTime() - date.getTime())
	const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

	if (diffDays === 1) return 'Ontem'
	if (diffDays < 7) return `${diffDays} dias atrás`
	if (diffDays < 30) return `${Math.floor(diffDays / 7)} semanas atrás`

	return date.toLocaleDateString('pt-BR')
}

//Sistema de favoritos
const { isFavorite, toggleFavorite, isLoading: favoritesLoading } = useFavorites()

const isCurrentVehicleFavorite = computed(() =>
	vehicle.value ? isFavorite(vehicle.value.id) : false
)

const saveVehicle = async () => {
	if (!vehicle.value) return

	const wasLiked = isCurrentVehicleFavorite.value
	const vehicleName = vehicle.value.title

	try {
		const result = await toggleFavorite(vehicle.value.id)

		//Feedback visual de sucesso
		const message = wasLiked
			? `${vehicleName} removido dos favoritos!`
			: `${vehicleName} adicionado aos favoritos!`

		alert(message)
	} catch (error) {
		console.error('Erro ao alterar favorito:', error)
		alert('Erro ao processar favorito. Tente novamente.')
	}
}

const shareVehicle = async () => {
	const shareData = {
		title: vehicle.value?.title,
		text: `${vehicle.value?.title} por ${formatCurrency(vehicle.value?.price || 0)} em ${vehicle.value?.city}/${vehicle.value?.uf}`,
		url: window.location.href
	}

	try {
		if (navigator.share) {
			await navigator.share(shareData)
		} else {
			await navigator.clipboard.writeText(`${shareData.text}\n${window.location.href}`)
			alert('Link copiado para a área de transferência!')
		}
	} catch (error) {
		console.log('Erro ao compartilhar:', error)
		alert(`${shareData.text}\n\nLink: ${window.location.href}`)
	}
}

const handleScroll = () => {
	const scrollY = window.scrollY
	const headerHeight = 96

	if (scrollY > 50) {
		stickyTop.value = headerHeight + 8
	} else {
		stickyTop.value = headerHeight + 16
	}
}

onMounted(() => {
	window.addEventListener('scroll', handleScroll)

	if (import.meta.client && window.innerWidth >= 1024) {
		contactExpanded.value = true
	}
})

onUnmounted(() => {
	if (import.meta.client) {
		window.removeEventListener('scroll', handleScroll)
	}
})

const priceLabels = computed(() => {
	if (!carData.value?.prices?.length) return []
	return carData.value.prices
		.map((item: any) => {
			const date = new Date(item.referenceDate + 'T03:00:00')
			return `${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`
		})
		.reverse()
})

const priceDatasets = computed(() => {
	if (!carData.value?.prices?.length) return []
	return [
		{
			label: 'Preço de Mercado (R$)',
			data: carData.value.prices.map((item: any) => item.value).reverse(),
			backgroundColor: 'rgba(59, 130, 246, 0.1)',
			borderColor: 'rgba(59, 130, 246, 1)',
			pointStyle: 'circle',
			pointRadius: 4,
			pointHoverRadius: 6,
			fill: true
		}
	]
})

const averageMarketPrice = computed(() => {
	if (!carData.value?.partners?.length) return 0
	const total = carData.value.partners.reduce((sum: number, partner: any) => sum + partner.value, 0)
	return Math.round(total / carData.value.partners.length)
})

const priceComparison = computed(() => {
	if (!vehicle.value || !carData.value?.partners?.length) return null

	const vehiclePrice = vehicle.value.price
	const marketAverage = averageMarketPrice.value
	const difference = vehiclePrice - marketAverage

	if (difference < -2000) {
		return {
			isGoodDeal: true,
			isExpensive: false,
			message: `R$ ${Math.abs(difference).toLocaleString('pt-BR')} abaixo da média`
		}
	} else if (difference > 3000) {
		return {
			isGoodDeal: false,
			isExpensive: true,
			message: `R$ ${difference.toLocaleString('pt-BR')} acima da média`
		}
	} else {
		return {
			isGoodDeal: false,
			isExpensive: false,
			message: 'Preço próximo à média de mercado'
		}
	}
})

const previewMonthlyPayment = computed(() => {
	if (!vehicle.value) return formatCurrency(0)

	const vehiclePrice = vehicle.value.price
	const downPayment = vehiclePrice * 0.2
	const financedAmount = vehiclePrice - downPayment
	const months = 48
	const interestRate = 0.015

	const factor = Math.pow(1 + interestRate, months)
	const payment = (financedAmount * interestRate * factor) / (factor - 1)

	return formatCurrency(Math.round(payment))
})

const formatCurrency = (value: number) => {
	return new Intl.NumberFormat('pt-BR', {
		style: 'currency',
		currency: 'BRL'
	}).format(value)
}

useHead({
	title: computed(() => (vehicle.value ? `${vehicle.value.title} - Auto URBAN` : 'Carregando...')),
	meta: [
		{
			name: 'description',
			content: computed(() =>
				vehicle.value
					? `${vehicle.value.title} por ${formatCurrency(vehicle.value.price)} em ${vehicle.value.city}, ${vehicle.value.uf}. ${vehicle.value.km.toLocaleString('pt-BR')} km rodados.`
					: 'Carregando detalhes do veículo...'
			)
		},
		{
			property: 'og:title',
			content: computed(() =>
				vehicle.value ? `${vehicle.value.title} - Auto URBAN` : 'Auto URBAN'
			)
		},
		{
			property: 'og:description',
			content: computed(() =>
				vehicle.value
					? `${formatCurrency(vehicle.value.price)} • ${vehicle.value.km.toLocaleString('pt-BR')} km • ${vehicle.value.city}, ${vehicle.value.uf}`
					: 'Marketplace de carros'
			)
		},
		{
			property: 'og:image',
			content: computed(() => vehicle.value?.coverImageUrl || '/imgs/Logo.svg')
		},
		{
			property: 'og:type',
			content: 'product'
		},
		{
			name: 'twitter:card',
			content: 'summary_large_image'
		}
	]
})
</script>
