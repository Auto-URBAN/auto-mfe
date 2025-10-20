import garageData from '~/server/data/garage.json'
import type { GarageStats } from '@/schemas/garage'

export default defineEventHandler(() => {
	const stats: GarageStats = {
		...garageData.stats,
		insights: garageData.stats.insights.map(insight => ({
			...insight,
			type: insight.type as 'positive' | 'negative' | 'neutral'
		}))
	}

	return stats
})
