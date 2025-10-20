<template>
	<div class="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
		<div class="mb-4 flex items-center gap-4 text-sm justify-between">
			<div class="flex items-center gap-4">
				<span class="text-gray-700 font-medium">Comparando {{ selectedVehicles.length }}/4:</span>
				<div class="flex flex-wrap gap-3">
					<label
						v-for="field in comparisonFields"
						:key="field.id"
						class="flex items-center gap-2 cursor-pointer"
					>
						<input
							v-model="field.enabled"
							type="checkbox"
							class="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
						/>
						<span class="text-gray-700 text-xs">{{ field.label }}</span>
					</label>
				</div>
			</div>

			<UiButton variant="outline" size="sm" @click="$emit('clear')">
				<Icon name="heroicons:x-mark-20-solid" class="w-4 h-4 mr-1" />
				Limpar
			</UiButton>
		</div>

		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
			<div
				v-for="vehicle in selectedVehicles"
				:key="vehicle.id"
				class="bg-white rounded-lg p-4 relative group border border-gray-200"
			>
				<button
					class="absolute top-2 right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 z-10"
					@click="$emit('remove', vehicle.id)"
				>
					<Icon name="heroicons:x-mark-20-solid" class="w-4 h-4 text-white" />
				</button>

				<div class="aspect-video overflow-hidden rounded-lg mb-3">
					<img
						:src="vehicle.coverImageUrl"
						:alt="vehicle.title"
						class="w-full h-full object-cover"
					/>
				</div>

				<p class="text-xs text-gray-500 font-medium mb-1">{{ vehicle.brand }}</p>
				<h4 class="text-sm font-bold text-gray-900 mb-2 truncate">
					{{ vehicle.model }}
				</h4>
				<p class="text-lg font-bold text-green-600 mb-3">
					{{ formatCurrency(vehicle.price) }}
				</p>

				<div class="space-y-2 text-xs">
					<div
						v-if="getFieldEnabled('horsepower')"
						class="flex items-center justify-between py-1.5 border-t border-gray-100"
					>
						<div class="flex items-center gap-1.5 text-gray-600">
							<Icon name="heroicons:bolt-20-solid" class="w-3.5 h-3.5 text-orange-500" />
							<span>Potência</span>
						</div>
						<span class="font-bold text-gray-900">{{ vehicle.horsepower }} cv</span>
					</div>
					<div
						v-if="getFieldEnabled('year')"
						class="flex items-center justify-between py-1.5 border-t border-gray-100"
					>
						<div class="flex items-center gap-1.5 text-gray-600">
							<Icon name="heroicons:calendar-20-solid" class="w-3.5 h-3.5 text-blue-500" />
							<span>Ano</span>
						</div>
						<span class="font-bold text-gray-900">{{ vehicle.year }}</span>
					</div>
					<div
						v-if="getFieldEnabled('km') && vehicle.km"
						class="flex items-center justify-between py-1.5 border-t border-gray-100"
					>
						<div class="flex items-center gap-1.5 text-gray-600">
							<Icon name="heroicons:map-pin-20-solid" class="w-3.5 h-3.5 text-purple-500" />
							<span>Km</span>
						</div>
						<span class="font-bold text-gray-900">{{ formatKm(vehicle.km) }}</span>
					</div>
					<div
						v-if="getFieldEnabled('uf') && vehicle.uf"
						class="flex items-center justify-between py-1.5 border-t border-gray-100"
					>
						<div class="flex items-center gap-1.5 text-gray-600">
							<Icon name="heroicons:map-20-solid" class="w-3.5 h-3.5 text-green-500" />
							<span>Estado</span>
						</div>
						<span class="font-bold text-gray-900">{{ vehicle.uf }}</span>
					</div>
					<div
						v-if="getFieldEnabled('maintenanceCost') && mode === 'models'"
						class="flex items-center justify-between py-1.5 border-t border-gray-100"
					>
						<div class="flex items-center gap-1.5 text-gray-600">
							<Icon
								name="heroicons:wrench-screwdriver-20-solid"
								class="w-3.5 h-3.5 text-yellow-600"
							/>
							<span>Manutenção</span>
						</div>
						<div class="flex items-center gap-1">
							<span class="font-bold text-gray-900">{{ getMaintenanceCost(vehicle) }}</span>
							<span class="text-gray-500">/10</span>
						</div>
					</div>
					<div
						v-if="getFieldEnabled('insuranceCost') && mode === 'models'"
						class="flex items-center justify-between py-1.5 border-t border-gray-100"
					>
						<div class="flex items-center gap-1.5 text-gray-600">
							<Icon name="heroicons:shield-check-20-solid" class="w-3.5 h-3.5 text-green-600" />
							<span>Seguro</span>
						</div>
						<span class="font-bold text-gray-900">{{
							formatCurrency(getInsuranceCost(vehicle))
						}}</span>
					</div>
					<div
						v-if="getFieldEnabled('depreciation') && mode === 'models'"
						class="border-t border-gray-100 pt-3 mt-2"
					>
						<div class="flex items-center gap-1.5 text-gray-600 mb-2">
							<Icon name="heroicons:chart-bar-20-solid" class="w-3.5 h-3.5 text-purple-600" />
							<span class="text-xs">Depreciação 5 Anos</span>
						</div>
						<div class="h-20">
							<Chart
								type="line"
								:data="getDepreciationData(vehicle)"
								:options="depreciationChartOptions"
								:height="80"
							/>
						</div>
					</div>
				</div>

				<NuxtLink :to="getLinkUrl(vehicle)" class="block mt-4">
					<UiButton variant="outline" size="sm" class="w-full hover:bg-gray-50">
						Ver Detalhes
					</UiButton>
				</NuxtLink>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import type { VehicleSummary } from '@/schemas/vehicle'

interface Props {
	selectedVehicles: VehicleSummary[]
	mode?: 'models' | 'vehicles'
}

const props = withDefaults(defineProps<Props>(), {
	mode: 'models'
})

defineEmits<{
	remove: [id: string]
	clear: []
}>()

const comparisonFields = ref([
	{ id: 'horsepower', label: 'Potência', enabled: true },
	{ id: 'year', label: 'Ano', enabled: true },
	{ id: 'km', label: 'Quilometragem', enabled: props.mode === 'vehicles' },
	{ id: 'uf', label: 'Estado', enabled: props.mode === 'vehicles' },
	{ id: 'maintenanceCost', label: 'Custo Manutenção', enabled: props.mode === 'models' },
	{ id: 'insuranceCost', label: 'Custo Seguro', enabled: props.mode === 'models' },
	{ id: 'depreciation', label: 'Depreciação 5 Anos', enabled: props.mode === 'models' }
])

function getFieldEnabled(fieldId: string): boolean {
	return comparisonFields.value.find(f => f.id === fieldId)?.enabled || false
}

function getMaintenanceCost(vehicle: VehicleSummary): number {
	const luxuryBrands = ['BMW', 'Mercedes-Benz', 'Porsche', 'Audi', 'Volvo', 'Land Rover']
	const popularBrands = ['Volkswagen', 'Chevrolet', 'Fiat', 'Renault', 'Ford', 'Toyota', 'Honda']

	let cost = 5

	if (luxuryBrands.includes(vehicle.brand)) {
		cost += 3
	} else if (popularBrands.includes(vehicle.brand)) {
		cost -= 1
	}

	if (vehicle.horsepower > 300) cost += 2
	else if (vehicle.horsepower > 200) cost += 1
	else if (vehicle.horsepower < 100) cost -= 1

	return Math.min(10, Math.max(1, cost))
}

function getInsuranceCost(vehicle: VehicleSummary): number {
	const baseRate = 0.04
	let multiplier = 1

	if (vehicle.horsepower > 250) multiplier = 1.5
	else if (vehicle.horsepower > 150) multiplier = 1.2
	else if (vehicle.horsepower < 100) multiplier = 0.8

	return vehicle.price * baseRate * multiplier
}

function getDepreciationData(vehicle: VehicleSummary) {
	const currentYear = new Date().getFullYear()
	const years = []
	const values = []

	const luxuryBrands = ['BMW', 'Mercedes-Benz', 'Porsche', 'Audi']
	const depreciationRate = luxuryBrands.includes(vehicle.brand) ? 0.15 : 0.12

	for (let i = 0; i <= 5; i++) {
		years.push((currentYear - 5 + i).toString())
		const value = vehicle.price * Math.pow(1 - depreciationRate, 5 - i)
		values.push(Math.round(value))
	}

	return {
		labels: years,
		datasets: [
			{
				data: values,
				borderColor: '#8b5cf6',
				backgroundColor: 'transparent',
				tension: 0.3,
				borderWidth: 2,
				pointRadius: 0
			}
		]
	}
}

const depreciationChartOptions = {
	responsive: true,
	maintainAspectRatio: false,
	plugins: {
		legend: {
			display: false
		},
		tooltip: {
			enabled: true,
			callbacks: {
				label: (context: { parsed: { y: number } }) => {
					return formatCurrency(context.parsed.y)
				}
			}
		}
	},
	scales: {
		x: {
			display: false
		},
		y: {
			display: false
		}
	}
}

function getLinkUrl(vehicle: VehicleSummary): string {
	if (props.mode === 'models') {
		return `/carros/${vehicle.slug}`
	}
	return `/anuncios/${vehicle.slug}`
}

function formatCurrency(value: number): string {
	return new Intl.NumberFormat('pt-BR', {
		style: 'currency',
		currency: 'BRL',
		maximumFractionDigits: 0
	}).format(value)
}

function formatKm(km: number): string {
	return `${km.toLocaleString('pt-BR')} km`
}
</script>
