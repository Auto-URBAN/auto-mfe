export * from './user'

export * from './vehicle'

export * from './admin'

export * from './common'

export * from './bank'
export * from './brand'
export * from './installments'
export * from './ranking'

export const validateSchema = <T>(
	schema: any,
	data: unknown
): { success: true; data: T } | { success: false; error: string } => {
	try {
		const result = schema.parse(data)
		return { success: true, data: result }
	} catch (error: any) {
		return {
			success: false,
			error: error.errors?.[0]?.message || error.message || 'Validation failed'
		}
	}
}

export const safeParseSchema = <T>(schema: any, data: unknown) => {
	return schema.safeParse(data)
}
