import garageData from '~/server/data/garage.json'
import type { GarageHistoryCar, CarHistoryStatus } from '@/schemas/garage'

export default defineEventHandler(() => {
	const historyCars: GarageHistoryCar[] = garageData.historyCars.map(car => ({
		...car,
		purchaseDate: new Date(car.purchaseDate),
		sellDate: car.sellDate ? new Date(car.sellDate) : undefined,
		status: car.status as CarHistoryStatus,
		mods: car.mods.map(mod => ({
			...mod,
			date: mod.date ? new Date(mod.date) : undefined
		}))
	}))

	return historyCars
})
