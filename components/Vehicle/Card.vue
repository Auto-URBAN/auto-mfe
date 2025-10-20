<template>
	<NuxtLink
		:to="href"
		:class="[
			'block bg-white rounded-lg overflow-hidden transition-all duration-200 cursor-pointer group',
			showSpecs
				? 'rounded-xl hover:shadow-2xl border border-gray-100'
				: 'rounded-lg hover:shadow-lg border border-gray-200 hover:border-gray-300'
		]"
	>
		<div
			:class="[
				'relative overflow-hidden',
				showSpecs ? 'aspect-video bg-gray-100' : 'aspect-[4/3] rounded-t-lg'
			]"
		>
			<img
				:src="coverImageUrl || '/imgs/search-example.jpg'"
				:alt="title"
				:class="[
					'w-full h-full object-cover transition-transform duration-200',
					showSpecs ? 'group-hover:scale-110 duration-500' : 'group-hover:scale-105'
				]"
				loading="lazy"
			/>
			<div v-if="status || featured" class="absolute top-3 right-3">
				<UiBadge v-if="featured" color="yellow" variant="solid" :size="showSpecs ? 'sm' : 'xs'">
					Destaque
				</UiBadge>
				<UiBadge v-else-if="status === 'PENDING'" color="yellow" variant="solid" size="xs">
					Aguardando
				</UiBadge>
				<UiBadge v-else-if="status === 'APPROVED'" color="green" variant="solid" size="xs">
					<Icon name="mdi:check-bold" class="w-4 h-4" />
				</UiBadge>
			</div>
		</div>

		<div v-if="!showSpecs" class="flex flex-col p-2 gap-2">
			<div class="flex gap-2 items-center">
				<div v-if="brand && showBrandLogo">
					<img
						:src="brandsData.find(b => b.name === brand)?.logo || '/logos/default-car-logo.webp'"
						:alt="brand"
						class="w-8 h-8 object-contain"
					/>
				</div>
				<div class="flex-1">
					<h3
						class="font-semibold text-gray-900 text-base line-clamp-2 group-hover:text-blue-600 transition-colors"
					>
						{{ title }}
					</h3>

					<div v-if="price !== undefined">
						<span class="text-xl font-bold text-green-600">
							{{ formatCurrency(price) }}
						</span>
					</div>
				</div>
			</div>

			<hr v-if="hasAnyBadge" />

			<div v-if="hasAnyBadge" class="flex flex-wrap gap-2">
				<UiBadge v-if="year" color="gray" variant="soft" size="sm">
					{{ year }}
				</UiBadge>
				<UiBadge v-if="km !== undefined" color="gray" variant="soft" size="sm">
					{{ formatKm(km) }}
				</UiBadge>
				<UiBadge v-if="uf" color="blue" variant="soft" size="sm">
					{{ uf }}
				</UiBadge>
				<UiBadge v-if="horsepower" color="red" variant="soft" size="sm">
					{{ horsepower }} HP
				</UiBadge>
			</div>
		</div>

		<div v-else class="p-6">
			<div v-if="brand && showBrandLogo" class="flex items-center gap-3 mb-3">
				<div class="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
					<img
						:src="brandsData.find(b => b.name === brand)?.logo || '/logos/default-car-logo.webp'"
						:alt="brand"
						class="w-6 h-6 object-contain"
					/>
				</div>
				<div>
					<p class="text-xs text-gray-500 font-medium">{{ brand }}</p>
					<h3 class="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
						{{ title.replace(brand, '').trim() }}
					</h3>
				</div>
			</div>

			<h3
				v-else
				class="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors mb-3"
			>
				{{ title }}
			</h3>

			<div class="grid grid-cols-2 gap-3 mb-4">
				<div v-if="horsepower" class="flex items-center gap-2 text-sm text-gray-600">
					<Icon name="heroicons:bolt-20-solid" class="w-4 h-4 text-orange-500" />
					<span>{{ horsepower }} cv</span>
				</div>
				<div v-if="year" class="flex items-center gap-2 text-sm text-gray-600">
					<Icon name="heroicons:calendar-20-solid" class="w-4 h-4 text-blue-500" />
					<span>{{ year }}</span>
				</div>
				<div v-if="km !== undefined" class="flex items-center gap-2 text-sm text-gray-600">
					<Icon name="heroicons:map-pin-20-solid" class="w-4 h-4 text-purple-500" />
					<span>{{ formatKm(km) }}</span>
				</div>
				<div v-if="uf" class="flex items-center gap-2 text-sm text-gray-600">
					<Icon name="heroicons:map-20-solid" class="w-4 h-4 text-green-500" />
					<span>{{ uf }}</span>
				</div>
			</div>

			<div v-if="price !== undefined" class="pt-4 border-t border-gray-100">
				<p v-if="priceLabel" class="text-sm text-gray-500 mb-1">{{ priceLabel }}</p>
				<p class="text-2xl font-bold text-green-600">
					{{ formatCurrency(price) }}
				</p>
			</div>
		</div>
	</NuxtLink>
</template>

<script setup lang="ts">
interface Props {
	title: string
	href: string
	coverImageUrl?: string
	brand?: string
	price?: number
	year?: number
	km?: number
	uf?: string
	horsepower?: number
	status?: 'PENDING' | 'APPROVED' | 'REJECTED'
	featured?: boolean
	showBrandLogo?: boolean
	showSpecs?: boolean
	priceLabel?: string
}

const props = withDefaults(defineProps<Props>(), {
	coverImageUrl: undefined,
	brand: undefined,
	price: undefined,
	year: undefined,
	km: undefined,
	uf: undefined,
	horsepower: undefined,
	status: undefined,
	featured: false,
	showBrandLogo: true,
	showSpecs: false,
	priceLabel: undefined
})

const hasAnyBadge = computed(
	() =>
		props.year !== undefined ||
		props.km !== undefined ||
		props.uf !== undefined ||
		props.horsepower !== undefined
)

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

const brandsData = [
	{ name: 'Audi', logo: '/logos/audi.webp' },
	{ name: 'BMW', logo: '/logos/bmw.webp' },
	{ name: 'Chevrolet', logo: '/logos/chevrolet.webp' },
	{ name: 'Ford', logo: '/logos/ford.webp' },
	{ name: 'Honda', logo: '/logos/honda.webp' },
	{ name: 'Hyundai', logo: '/logos/hyundai.webp' },
	{ name: 'Mercedes-Benz', logo: '/logos/mercedes-benz.webp' },
	{ name: 'Nissan', logo: '/logos/nissan.webp' },
	{ name: 'Porsche', logo: '/logos/porsche.webp' },
	{ name: 'Renault', logo: '/logos/renault.webp' },
	{ name: 'Toyota', logo: '/logos/toyota.webp' },
	{ name: 'Volkswagen', logo: '/logos/volkswagen.webp' }
]
</script>

<style scoped>
.line-clamp-2 {
	display: -webkit-box;
	line-clamp: 2;
	-webkit-line-clamp: 2;
	-webkit-box-orient: vertical;
	overflow: hidden;
}
</style>
