<template>
	<div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
		<div class="max-w-md w-full space-y-8">
			<!-- Header -->
			<div class="text-center">
				<NuxtImg src="/imgs/Logo.svg" alt="Auto URBAN" class="mx-auto h-12 w-auto" />
				<h2 class="mt-6 text-3xl font-bold text-gray-900">Entre na sua conta</h2>
				<p class="mt-2 text-sm text-gray-600">Digite seu telefone para continuar</p>
			</div>

			<!-- Login Form -->
			<UiCard>
				<form @submit.prevent="handleLogin" class="space-y-6">
					<!-- Phone Input -->
					<div class="space-y-2">
						<label class="block text-sm font-medium text-gray-700">Telefone</label>
						<UiInput
							v-model="phone"
							type="tel"
							placeholder="(11) 99999-9999"
							icon-left="heroicons:phone-20-solid"
							size="lg"
							:disabled="loading"
							@input="formatPhone"
						/>
					</div>

					<!-- Terms -->
					<div class="flex items-start">
						<div class="flex items-center h-5">
							<input
								v-model="acceptTerms"
								type="checkbox"
								:disabled="loading"
								class="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500 focus:ring-2 disabled:opacity-50"
							/>
						</div>
						<div class="ml-3 text-sm">
							<span class="text-gray-600">
								Aceito os
								<NuxtLink to="/terms" class="text-blue-600 hover:text-blue-500">
									Termos de Uso
								</NuxtLink>
								e
								<NuxtLink to="/privacy" class="text-blue-600 hover:text-blue-500">
									Política de Privacidade
								</NuxtLink>
							</span>
						</div>
					</div>

					<!-- Submit Button -->
					<UiButton
						type="submit"
						size="lg"
						class="w-full"
						:loading="loading"
						:disabled="!isFormValid"
					>
						{{ loading ? 'Enviando código...' : 'Continuar' }}
					</UiButton>

					<!-- Or Divider -->
					<div class="relative">
						<div class="absolute inset-0 flex items-center">
							<div class="w-full border-t border-gray-300" />
						</div>
						<div class="relative flex justify-center text-sm">
							<span class="px-2 bg-white text-gray-500">ou</span>
						</div>
					</div>

					<!-- Register Link -->
					<div class="text-center">
						<NuxtLink to="/auth/register" class="text-sm text-blue-600 hover:text-blue-500">
							Primeira vez aqui? Criar conta
						</NuxtLink>
					</div>
				</form>
			</UiCard>

			<!-- Back to Home -->
			<div class="text-center">
				<NuxtLink to="/" class="text-sm text-gray-500 hover:text-gray-700">
					← Voltar para o início
				</NuxtLink>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
definePageMeta({
	layout: false
})

const router = useRouter()
const route = useRoute()

// Reactive data
const phone = ref('')
const acceptTerms = ref(false)
const loading = ref(false)

// Computed
const isFormValid = computed(() => {
	const cleanPhone = phone.value.replace(/\D/g, '')
	return cleanPhone.length >= 10 && acceptTerms.value
})

// Methods
const formatPhone = (event: Event) => {
	const input = event.target as HTMLInputElement
	let value = input.value.replace(/\D/g, '')

	if (value.length <= 11) {
		if (value.length <= 10) {
			value = value.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3')
		} else {
			value = value.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')
		}
		phone.value = value
	}
}

const handleLogin = async () => {
	if (!isFormValid.value) return

	loading.value = true

	try {
		const cleanPhone = phone.value.replace(/\D/g, '')

		const response = await $fetch('/api/auth/login', {
			method: 'POST',
			body: { phone: cleanPhone }
		})

		if (response.otpSent) {
			console.log('Código enviado com sucesso!')

			// Navigate to OTP verification with phone in query
			await router.push({
				path: '/auth/verify',
				query: {
					phone: cleanPhone,
					redirect: route.query.redirect as string
				}
			})
		}
	} catch (error: any) {
		console.error('Login error:', error)
		alert('Erro no login. Tente novamente em alguns instantes.')
	} finally {
		loading.value = false
	}
}

// Meta
useHead({
	title: 'Login - Auto URBAN'
})
</script>
