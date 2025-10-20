<template>
	<div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
		<div class="max-w-md w-full space-y-8">
			<div class="text-center">
				<NuxtImg src="/imgs/Logo.svg" alt="Auto URBAN" class="mx-auto h-12 w-auto" />
				<h2 class="mt-6 text-3xl font-bold text-gray-900">Verificar código</h2>
				<p class="mt-2 text-sm text-gray-600">
					Enviamos um código para <strong>{{ formatPhone(phone) }}</strong>
				</p>
			</div>

			<UiCard>
				<form @submit.prevent="handleVerification" class="space-y-6">
					<div class="space-y-2">
						<label class="block text-sm font-medium text-gray-700">Código de verificação</label>
						<UiInput
							v-model="code"
							type="text"
							placeholder="123456"
							size="lg"
							maxlength="6"
							:disabled="loading"
							class="text-center text-2xl tracking-widest"
						/>
						<p class="text-xs text-gray-500">Digite o código de 6 dígitos recebido</p>
					</div>

					<UiButton
						type="submit"
						size="lg"
						class="w-full"
						:loading="loading"
						:disabled="code?.length !== 6"
					>
						{{ loading ? 'Verificando...' : 'Verificar código' }}
					</UiButton>

					<div class="text-center">
						<button
							v-if="canResend"
							type="button"
							@click="resendCode"
							:disabled="resendLoading"
							class="text-sm text-blue-600 hover:text-blue-500 disabled:text-gray-400"
						>
							{{ resendLoading ? 'Reenviando...' : 'Reenviar código' }}
						</button>
						<p v-else class="text-sm text-gray-500">Reenviar em {{ resendCountdown }}s</p>
					</div>

					<div class="text-center">
						<NuxtLink to="/auth/login" class="text-sm text-gray-500 hover:text-gray-700">
							Alterar telefone
						</NuxtLink>
					</div>
				</form>
			</UiCard>

			<UiAlert variant="info" title="Códigos de demonstração">
				<div class="text-sm space-y-1">
					<p><strong>123456:</strong> Usuário normal</p>
					<p><strong>654321:</strong> Usuário admin</p>
					<p><strong>000000:</strong> Código inválido (teste de erro)</p>
				</div>
			</UiAlert>
		</div>
	</div>
</template>

<script setup lang="ts">
definePageMeta({
	layout: false
})

const route = useRoute()
const router = useRouter()

const phone = route.query.phone as string
if (!phone) {
	await router.push('/auth/login')
}

const code = ref('')
const loading = ref(false)
const resendLoading = ref(false)
const resendCountdown = ref(60)
const canResend = ref(false)

const startResendCountdown = () => {
	canResend.value = false
	resendCountdown.value = 60

	const interval = setInterval(() => {
		resendCountdown.value--

		if (resendCountdown.value <= 0) {
			canResend.value = true
			clearInterval(interval)
		}
	}, 1000)
}

const formatPhone = (phoneNumber: string) => {
	if (phoneNumber?.length === 11) {
		return phoneNumber.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')
	}
	return phoneNumber
}

const handleVerification = async () => {
	if (code.value?.length !== 6) return

	loading.value = true

	try {
		const { verifyOTP } = useAuth()

		const response = await verifyOTP(phone, code.value)

		if (response.accessToken) {
			console.log('Login realizado com sucesso!')

			const redirectTo = (route.query.redirect as string) || '/'
			await router.push(redirectTo)
		}
	} catch (error: any) {
		console.error('Verification error:', error)

		let errorMessage = 'Código inválido. Verifique o código e tente novamente.'

		if (error?.statusCode === 401) {
			errorMessage = 'Código OTP inválido. Tente novamente.'
		} else if (error?.message?.includes('Invalid phone')) {
			errorMessage = 'Número de telefone inválido.'
		} else if (error?.message?.includes('must be 6 digits')) {
			errorMessage = 'O código deve ter 6 dígitos.'
		}

		alert(errorMessage)

		code.value = ''
	} finally {
		loading.value = false
	}
}

const resendCode = async () => {
	resendLoading.value = true

	try {
		await $fetch('/api/auth/login', {
			method: 'POST',
			body: { phone }
		})

		console.log('Código reenviado com sucesso!')

		startResendCountdown()
	} catch (error) {
		alert('Erro ao reenviar código. Tente novamente em alguns instantes.')
	} finally {
		resendLoading.value = false
	}
}

onMounted(() => {
	startResendCountdown()

	setTimeout(() => {
		const input = document.querySelector('input[type="text"]') as HTMLInputElement
		input?.focus()
	}, 100)
})

useHead({
	title: 'Verificar código - Auto URBAN'
})
</script>
