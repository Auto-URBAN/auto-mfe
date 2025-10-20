export default defineEventHandler(async event => {
	const id = getRouterParam(event, 'id')

	if (!id) {
		throw createError({
			statusCode: 400,
			message: 'ID do carro é obrigatório'
		})
	}

	return {
		success: true,
		message: `Carro ${id} removido com sucesso`
	}
})
