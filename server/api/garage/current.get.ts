import garageData from '~/server/data/garage.json'
import type { GarageCurrentCar } from '@/schemas/garage'

export default defineEventHandler(() => {
	const currentCars: GarageCurrentCar[] = garageData.currentCars.map(car => ({
		...car,
		lastUpdate: car.lastUpdate ? new Date(car.lastUpdate) : undefined,
		purchaseDate: car.purchaseDate ? new Date(car.purchaseDate) : undefined,
		mods: car.mods.map(mod => ({
			...mod,
			date: mod.date ? new Date(mod.date) : undefined
		}))
	}))

	return currentCars
})
