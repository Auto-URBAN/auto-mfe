<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <!-- Header -->
      <div class="text-center">
        <NuxtImg src="/imgs/Logo.svg" alt="Auto URBAN" class="mx-auto h-12 w-auto" />
        <h2 class="mt-6 text-3xl font-bold text-gray-900">
          Verificar código
        </h2>
        <p class="mt-2 text-sm text-gray-600">
          Enviamos um código para <strong>{{ formatPhone(phone) }}</strong>
        </p>
      </div>

      <!-- Verification Form -->
      <UCard>
        <form @submit.prevent="handleVerification" class="space-y-6">
          <!-- OTP Input -->
          <UFormGroup label="Código de verificação" name="code">
            <UInput
              v-model="code"
              type="text"
              placeholder="123456"
              size="lg"
              maxlength="6"
              :disabled="loading"
              class="text-center text-2xl tracking-widest"
            />
            <template #help>
              <p class="text-xs text-gray-500">
                Digite o código de 6 dígitos recebido
              </p>
            </template>
          </UFormGroup>

          <!-- Submit Button -->
          <UButton
            type="submit"
            color="blue"
            size="lg"
            block
            :loading="loading"
            :disabled="code?.length !== 6"
          >
            {{ loading ? 'Verificando...' : 'Verificar código' }}
          </UButton>

          <!-- Resend -->
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
            <p v-else class="text-sm text-gray-500">
              Reenviar em {{ resendCountdown }}s
            </p>
          </div>

          <!-- Change Phone -->
          <div class="text-center">
            <NuxtLink 
              to="/auth/login" 
              class="text-sm text-gray-500 hover:text-gray-700"
            >
              Alterar telefone
            </NuxtLink>
          </div>
        </form>
      </UCard>

      <!-- Demo Codes -->
      <UAlert
        icon="i-heroicons-information-circle"
        color="blue"
        variant="soft"
        title="Códigos de demonstração"
        description="Use 123456 para simular login bem-sucedido ou 000000 para erro"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: false
})

const route = useRoute()
const router = useRouter()
const toast = useToast()

// Get phone from query or redirect
const phone = route.query.phone as string
if (!phone) {
  await router.push('/auth/login')
}

// Reactive data
const code = ref('')
const loading = ref(false)
const resendLoading = ref(false)
const resendCountdown = ref(60)
const canResend = ref(false)

// Start resend countdown
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

// Methods
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
    const response = await $fetch('/api/auth/verify-otp', {
      method: 'POST',
      body: {
        phone,
        code: code.value
      }
    })

    if (response.accessToken) {
      // Store tokens (in a real app, use secure storage)
      localStorage.setItem('accessToken', response.accessToken)
      localStorage.setItem('refreshToken', response.refreshToken)
      localStorage.setItem('user', JSON.stringify(response.user))

      toast.add({
        title: 'Login realizado!',
        description: 'Bem-vindo ao Auto URBAN',
        color: 'green'
      })

      // Redirect to intended page or home
      const redirectTo = route.query.redirect as string || '/'
      await router.push(redirectTo)
    }
  } catch (error: any) {
    console.error('Verification error:', error)
    
    toast.add({
      title: 'Código inválido',
      description: 'Verifique o código e tente novamente',
      color: 'red'
    })

    // Clear code on error
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

    toast.add({
      title: 'Código reenviado!',
      description: 'Verifique seu WhatsApp ou SMS',
      color: 'green'
    })

    startResendCountdown()
  } catch (error) {
    toast.add({
      title: 'Erro ao reenviar',
      description: 'Tente novamente em alguns instantes',
      color: 'red'
    })
  } finally {
    resendLoading.value = false
  }
}

// Auto-focus on code input
onMounted(() => {
  startResendCountdown()
  
  // Focus the input after a short delay
  setTimeout(() => {
    const input = document.querySelector('input[type="text"]') as HTMLInputElement
    input?.focus()
  }, 100)
})

// Meta
useHead({
  title: 'Verificar código - Auto URBAN'
})
</script>