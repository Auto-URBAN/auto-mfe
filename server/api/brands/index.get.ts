import brandsData from '~/server/data/brands.json'

export default defineEventHandler(async () => {
	//Se não estiver usando mock, chamada real:
	//const config = useRuntimeConfig()
	//if (!useMockData()) {
	//return await $fetch(`${config.apiUrl}/brands`)
	//}

	//Usando dados mockados
	await mockDelay(100)
	return brandsData
})
