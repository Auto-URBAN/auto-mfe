import type { MoveCarPayload } from '@/schemas/garage'

export default defineEventHandler(async event => {
	const config = useRuntimeConfig()
	const id = getRouterParam(event, 'id')
	const body = await readBody(event)

	if (!id) {
		throw createError({
			statusCode: 400,
			message: 'ID do carro é obrigatório'
		})
	}

	const payload: MoveCarPayload = {
		carId: id,
		from: body.from,
		to: body.to,
		additionalData: body.additionalData
	}

	try {
		// Use the new unified backend API
		if (payload.to === 'history' && payload.from === 'current') {
			// Selling a car - move from garage to history
			const response = await $fetch(`${config.apiUrl}/api/v1/user-vehicles/garage/${id}/sell`, {
				method: 'POST',
				body: {
					sellPrice: payload.additionalData?.sellPrice || 0,
					sellDate: new Date().toISOString(),
					exitReason: payload.additionalData?.exitReason || 'Vendido'
				}
			})

			return {
				success: true,
				message: `Carro vendido e movido para histórico`,
				data: response
			}
		}

		// For other operations, return mock response for now
		return {
			success: true,
			message: `Carro movido de ${payload.from} para ${payload.to}`,
			data: payload
		}
	} catch (error: unknown) {
		const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido'
		throw createError({
			statusCode: 500,
			statusMessage: errorMessage
		})
	}
})
