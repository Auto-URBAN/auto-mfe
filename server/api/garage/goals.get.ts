import garageData from '~/server/data/garage.json'
import type { GarageGoal } from '@/schemas/garage'

export default defineEventHandler(() => {
	const goals: GarageGoal[] = garageData.goals.map(goal => ({
		...goal,
		createdAt: new Date(goal.createdAt)
	}))

	return goals
})
