/**
 * Utilitário para verificar se deve usar dados mockados
 */
export function useMockData() {
	const config = useRuntimeConfig()
	const mockValue = config.public.useMockData as boolean | string | undefined

	//Aceita true, 'true', ou undefined como mock ativo
	return mockValue === true || mockValue === 'true' || mockValue === undefined
}

/**
 * Simula delay de rede para tornar o mock mais realista
 */
export async function mockDelay(ms: number = 300) {
	if (useMockData()) {
		await new Promise(resolve => setTimeout(resolve, ms))
	}
}
