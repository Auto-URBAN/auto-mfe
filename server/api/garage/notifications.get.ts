import garageData from '~/server/data/garage.json'
import type { GarageNotification, NotificationType } from '@/schemas/garage'

export default defineEventHandler(() => {
	const notifications: GarageNotification[] = garageData.notifications.map(notif => ({
		...notif,
		type: notif.type as NotificationType,
		createdAt: new Date(notif.createdAt)
	}))

	return notifications
})
