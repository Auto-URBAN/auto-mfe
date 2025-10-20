import type { MoveCarPayload } from '@/schemas/garage'

export default defineEventHandler(async event => {
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

	return {
		success: true,
		message: `Carro movido de ${payload.from} para ${payload.to}`,
		data: payload
	}
})
