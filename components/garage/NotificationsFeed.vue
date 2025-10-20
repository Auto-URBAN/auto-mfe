<template>
	<div class="notifications-feed space-y-4">
		<div class="mb-4 flex items-center justify-between">
			<h3 class="text-xl font-bold text-white">Notificações</h3>
			<button
				v-if="hasUnread"
				class="text-sm text-blue-400 transition-colors hover:text-blue-300"
				@click="$emit('markAllRead')"
			>
				Marcar todas como lidas
			</button>
		</div>

		<div v-if="notifications.length === 0" class="rounded-lg bg-zinc-800/50 p-8 text-center">
			<Icon name="heroicons:bell-slash" class="mx-auto mb-2 h-12 w-12 text-zinc-600" />
			<p class="text-zinc-400">Nenhuma notificação no momento</p>
		</div>

		<div
			v-for="notification in sortedNotifications"
			:key="notification.id"
			class="notification-item group relative overflow-hidden rounded-lg transition-all duration-200 hover:shadow-lg"
			:class="[notification.read ? 'bg-zinc-800/30' : 'bg-zinc-800 shadow-md', 'border-l-2']"
			@click="markAsRead(notification.id)"
		>
			<div
				class="absolute left-0 top-0 h-full w-1"
				:class="notificationBorderColorClass(notification.type)"
			/>

			<div class="relative p-4 pl-6">
				<div class="mb-2 flex items-start justify-between gap-3">
					<div class="flex items-start gap-3">
						<div
							class="mt-0.5 flex-shrink-0"
							:class="notificationIconColorClass(notification.type)"
						>
							<Icon :name="notificationIcon(notification.type)" class="h-5 w-5" />
						</div>

						<div class="flex-1">
							<p
								class="text-sm"
								:class="notification.read ? 'text-zinc-400' : 'font-medium text-white'"
							>
								{{ notification.message }}
							</p>
						</div>
					</div>

					<div v-if="!notification.read" class="h-2 w-2 flex-shrink-0 rounded-full bg-blue-400" />
				</div>

				<div class="ml-8 flex items-center gap-3 text-xs text-zinc-500">
					<span>{{ formatTimeAgo(notification.createdAt) }}</span>
					<span v-if="notification.carModelSlug" class="capitalize"
						>• {{ notification.carModelSlug.replace(/-/g, ' ') }}</span
					>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import type { GarageNotification, NotificationType } from '@/schemas/garage'

const props = defineProps<{
	notifications: GarageNotification[]
}>()

const emit = defineEmits<{
	markAsRead: [id: string]
	markAllRead: []
}>()

const hasUnread = computed(() => props.notifications.some(n => !n.read))

const sortedNotifications = computed(() => {
	return [...props.notifications].sort((a, b) => {
		const dateA = new Date(a.createdAt)
		const dateB = new Date(b.createdAt)
		return dateB.getTime() - dateA.getTime()
	})
})

function markAsRead(id: string) {
	emit('markAsRead', id)
}

function notificationIcon(type: NotificationType): string {
	const icons: Record<NotificationType, string> = {
		APPRECIATION: 'heroicons:arrow-trending-up',
		DEPRECIATION: 'heroicons:arrow-trending-down',
		NEW_AD: 'heroicons:megaphone',
		PRICE_ALERT: 'heroicons:bell-alert',
		GOAL_MATCH: 'heroicons:check-circle',
		INSIGHT: 'heroicons:light-bulb'
	}
	return icons[type]
}

function notificationIconColorClass(type: NotificationType): string {
	const colors: Record<NotificationType, string> = {
		APPRECIATION: 'text-emerald-400',
		DEPRECIATION: 'text-red-400',
		NEW_AD: 'text-blue-400',
		PRICE_ALERT: 'text-amber-400',
		GOAL_MATCH: 'text-emerald-400',
		INSIGHT: 'text-purple-400'
	}
	return colors[type]
}

function notificationBorderColorClass(type: NotificationType): string {
	const colors: Record<NotificationType, string> = {
		APPRECIATION: 'bg-emerald-500',
		DEPRECIATION: 'bg-red-500',
		NEW_AD: 'bg-blue-500',
		PRICE_ALERT: 'bg-amber-500',
		GOAL_MATCH: 'bg-emerald-500',
		INSIGHT: 'bg-purple-500'
	}
	return colors[type]
}

function formatTimeAgo(date: Date | string): string {
	const d = typeof date === 'string' ? new Date(date) : date
	const now = new Date()
	const diffMs = now.getTime() - d.getTime()
	const diffMins = Math.floor(diffMs / 60000)
	const diffHours = Math.floor(diffMs / 3600000)
	const diffDays = Math.floor(diffMs / 86400000)

	if (diffMins < 1) return 'agora'
	if (diffMins < 60) return `${diffMins}min atrás`
	if (diffHours < 24) return `${diffHours}h atrás`
	if (diffDays < 7) return `${diffDays}d atrás`

	return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })
}
</script>
