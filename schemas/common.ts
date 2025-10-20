import { z } from 'zod'

export const ApiResponse = <T extends z.ZodType>(dataSchema: T) =>
	z.object({
		success: z.boolean(),
		data: dataSchema.optional(),
		message: z.string().optional(),
		error: z
			.object({
				code: z.string(),
				message: z.string(),
				details: z.any().optional()
			})
			.optional()
	})

export const ApiError = z.object({
	statusCode: z.number().int(),
	statusMessage: z.string(),
	message: z.string(),
	stack: z.string().optional()
})
export type ApiError = z.infer<typeof ApiError>

export const PaginationQuery = z.object({
	page: z.coerce.number().int().min(1).default(1),
	pageSize: z.coerce.number().int().min(1).max(100).default(20)
})
export type PaginationQuery = z.infer<typeof PaginationQuery>

export const PaginatedResponse = <T extends z.ZodType>(itemSchema: T) =>
	z.object({
		items: z.array(itemSchema),
		page: z.number().int().min(1),
		pageSize: z.number().int().min(1),
		total: z.number().int().min(0),
		totalPages: z.number().int().min(0),
		hasMore: z.boolean()
	})

export const UploadedFile = z.object({
	filename: z.string().min(1),
	originalName: z.string().min(1),
	mimetype: z.string().min(1),
	size: z.number().int().min(1),
	url: z.string().url()
})
export type UploadedFile = z.infer<typeof UploadedFile>

export const FileUploadResponse = ApiResponse(z.array(UploadedFile))
export type FileUploadResponse = z.infer<typeof FileUploadResponse>

export const SearchQuery = z.object({
	q: z.string().optional(),
	sortBy: z.string().optional(),
	sortOrder: z.enum(['asc', 'desc']).default('desc'),
	filters: z.record(z.any()).optional()
})
export type SearchQuery = z.infer<typeof SearchQuery>

export const ApiHeaders = z.object({
	authorization: z.string().optional(),
	'content-type': z.string().optional(),
	'x-api-key': z.string().optional(),
	'x-user-id': z.string().optional(),
	'x-request-id': z.string().optional()
})
export type ApiHeaders = z.infer<typeof ApiHeaders>

export const HealthCheck = z.object({
	status: z.enum(['ok', 'error']),
	timestamp: z.date(),
	version: z.string(),
	services: z
		.object({
			database: z.enum(['connected', 'disconnected', 'error']),
			cache: z.enum(['connected', 'disconnected', 'error']).optional(),
			storage: z.enum(['connected', 'disconnected', 'error']).optional()
		})
		.optional()
})
export type HealthCheck = z.infer<typeof HealthCheck>

export const RateLimit = z.object({
	limit: z.number().int(),
	remaining: z.number().int(),
	reset: z.date(),
	retryAfter: z.number().int().optional()
})
export type RateLimit = z.infer<typeof RateLimit>

export const WebSocketMessage = z.object({
	type: z.string().min(1),
	payload: z.any(),
	timestamp: z.date(),
	id: z.string().optional()
})
export type WebSocketMessage = z.infer<typeof WebSocketMessage>

export const Notification = z.object({
	id: z.string().min(1),
	type: z.enum(['info', 'success', 'warning', 'error']),
	title: z.string().min(1),
	message: z.string().min(1),
	timestamp: z.date(),
	read: z.boolean().default(false),
	actionUrl: z.string().url().optional(),
	metadata: z.record(z.any()).optional()
})
export type Notification = z.infer<typeof Notification>

export const ValidationError = z.object({
	field: z.string().min(1),
	message: z.string().min(1),
	code: z.string().optional()
})
export type ValidationError = z.infer<typeof ValidationError>

export const ValidationErrorResponse = z.object({
	success: z.literal(false),
	errors: z.array(ValidationError),
	message: z.string().default('Validation failed')
})
export type ValidationErrorResponse = z.infer<typeof ValidationErrorResponse>
