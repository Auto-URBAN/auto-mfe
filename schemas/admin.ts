import { z } from 'zod'
import type { VehicleSummary, VehicleStatus } from './vehicle'
import type { UserWithAds } from './user'

export const AdminTotals = z.object({
	vehicles: z.number().int().min(0),
	approved: z.number().int().min(0),
	pending: z.number().int().min(0),
	rejected: z.number().int().min(0),
	users: z.number().int().min(0)
})
export type AdminTotals = z.infer<typeof AdminTotals>

export const BrandStats = z.object({
	brand: z.string().min(1),
	count: z.number().int().min(0)
})
export type BrandStats = z.infer<typeof BrandStats>

export const UFStats = z.object({
	uf: z.string().length(2),
	count: z.number().int().min(0)
})
export type UFStats = z.infer<typeof UFStats>

export const AdminMetrics = z.object({
	totals: AdminTotals,
	byBrand: z.array(BrandStats),
	byUF: z.array(UFStats)
})
export type AdminMetrics = z.infer<typeof AdminMetrics>

export const ApproveVehicleRequest = z.object({
	vehicleId: z.string().min(1)
})
export type ApproveVehicleRequest = z.infer<typeof ApproveVehicleRequest>

export const RejectVehicleRequest = z.object({
	vehicleId: z.string().min(1),
	reason: z
		.string()
		.min(10, 'Rejection reason must be at least 10 characters')
		.max(500, 'Reason too long')
})
export type RejectVehicleRequest = z.infer<typeof RejectVehicleRequest>

export const ModerationResponse = z.object({
	success: z.boolean(),
	message: z.string().optional()
})
export type ModerationResponse = z.infer<typeof ModerationResponse>

export const AdminState = z.object({
	metrics: AdminMetrics.nullable(),
	vehiclesByStatus: z.object({
		pending: z.array(z.custom<VehicleSummary>()),
		approved: z.array(z.custom<VehicleSummary>()),
		rejected: z.array(z.custom<VehicleSummary>())
	}),
	users: z.array(z.custom<UserWithAds>()),
	loading: z.object({
		metrics: z.boolean(),
		vehicles: z.boolean(),
		users: z.boolean(),
		moderating: z.boolean()
	})
})
export type AdminState = z.infer<typeof AdminState>

export const GetVehiclesByStatusQuery = z.object({
	status: z.custom<VehicleStatus>(),
	page: z.number().int().min(1).optional(),
	pageSize: z.number().int().min(1).max(100).optional()
})
export type GetVehiclesByStatusQuery = z.infer<typeof GetVehiclesByStatusQuery>

export const DashboardCard = z.object({
	title: z.string().min(1),
	value: z.union([z.string(), z.number()]),
	change: z
		.object({
			value: z.number(),
			type: z.enum(['increase', 'decrease', 'neutral']),
			period: z.string()
		})
		.optional(),
	icon: z.string().optional(),
	color: z.enum(['primary', 'success', 'warning', 'danger', 'info']).default('primary')
})
export type DashboardCard = z.infer<typeof DashboardCard>

export const DashboardData = z.object({
	cards: z.array(DashboardCard),
	topBrands: z.array(BrandStats).max(5),
	topStates: z.array(UFStats).max(10),
	recentActivity: z
		.array(
			z.object({
				id: z.string(),
				type: z.enum([
					'vehicle_created',
					'vehicle_approved',
					'vehicle_rejected',
					'user_registered'
				]),
				description: z.string(),
				timestamp: z.date(),
				userId: z.string().optional(),
				vehicleId: z.string().optional()
			})
		)
		.max(20)
})
export type DashboardData = z.infer<typeof DashboardData>
