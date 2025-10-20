import vehiclesData from '~/server/data/vehicles.json'
import brandsData from '~/server/data/brands.json'

export default defineEventHandler(() => {
	const years = [...new Set(vehiclesData.map(v => v.year))].sort((a, b) => b - a)

	const commonColors = [
		{ id: 'preto', name: 'Preto', hex: '#000000' },
		{ id: 'branco', name: 'Branco', hex: '#FFFFFF' },
		{ id: 'prata', name: 'Prata', hex: '#C0C0C0' },
		{ id: 'cinza', name: 'Cinza', hex: '#808080' },
		{ id: 'vermelho', name: 'Vermelho', hex: '#DC2626' },
		{ id: 'azul', name: 'Azul', hex: '#2563EB' },
		{ id: 'verde', name: 'Verde', hex: '#16A34A' },
		{ id: 'amarelo', name: 'Amarelo', hex: '#EAB308' }
	]

	const ufs = [...new Set(vehiclesData.map(v => v.uf))].sort()

	const brands = brandsData.map(brand => {
		const brandVehicles = vehiclesData.filter(v => v.brand === brand.name)
		const brandYears = [...new Set(brandVehicles.map(v => v.year))].sort((a, b) => b - a)

		return {
			id: brand.name,
			name: brand.name,
			logo: brand.logo,
			years: brandYears,
			count: brandVehicles.length
		}
	})

	const modelsMap = new Map()
	vehiclesData.forEach(v => {
		const key = `${v.brand}-${v.model}`
		if (!modelsMap.has(key)) {
			modelsMap.set(key, {
				id: v.model,
				name: v.model,
				brandId: v.brand,
				years: []
			})
		}
		const model = modelsMap.get(key)
		if (!model.years.includes(v.year)) {
			model.years.push(v.year)
		}
	})

	const models = Array.from(modelsMap.values()).map(model => ({
		...model,
		years: model.years.sort((a: number, b: number) => b - a)
	}))

	return {
		brands,
		models,
		years,
		colors: commonColors,
		ufs,
		priceRange: {
			min: Math.min(...vehiclesData.map(v => v.price)),
			max: Math.max(...vehiclesData.map(v => v.price))
		},
		kmRange: {
			min: 0,
			max: Math.max(...vehiclesData.map(v => v.km))
		}
	}
})
