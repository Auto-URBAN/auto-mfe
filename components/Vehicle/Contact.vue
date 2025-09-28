<template>
  <div class="bg-white border border-gray-200 rounded-lg p-6 sticky top-4 shadow-sm">
    <!-- Header -->
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-lg font-semibold text-gray-900">
        Contato
      </h3>
      <span v-if="isOnline" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
        Online
      </span>
    </div>

    <!-- Seller Info -->
    <div class="flex items-center space-x-3 mb-4">
      <div class="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
        <Icon name="heroicons:user" class="w-6 h-6 text-white" />
      </div>
      <div>
        <p class="font-medium text-gray-900">Vendedor</p>
        <p class="text-sm text-gray-600">{{ formatPhone(seller.phone) }}</p>
      </div>
    </div>

    <!-- Price Display -->
    <div class="mb-6 p-4 bg-green-50 rounded-lg">
      <p class="text-sm text-green-800 mb-1">Preço à vista</p>
      <p class="text-2xl font-bold text-green-600">
        {{ formatCurrency(vehicle.price) }}
      </p>
    </div>

    <!-- Contact Actions -->
    <div class="space-y-3">
      <!-- WhatsApp Button -->
      <button
        @click="contactWhatsApp"
        :disabled="sendingWhatsApp"
        class="w-full flex items-center justify-center px-4 py-3 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        <Icon v-if="!sendingWhatsApp" name="heroicons:chat-bubble-left-ellipsis" class="w-5 h-5 mr-2" />
        <div v-else class="w-5 h-5 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
        {{ sendingWhatsApp ? 'Abrindo...' : 'Conversar no WhatsApp' }}
      </button>

      <!-- Phone Button -->
      <button
        @click="callPhone"
        class="w-full flex items-center justify-center px-4 py-3 bg-white border border-blue-600 text-blue-600 text-sm font-medium rounded-lg hover:bg-blue-50 transition-colors"
      >
        <Icon name="heroicons:phone" class="w-5 h-5 mr-2" />
        {{ formatPhone(seller.phone) }}
      </button>

      <!-- Share Button -->
      <button
        @click="shareVehicle"
        class="w-full flex items-center justify-center px-4 py-3 bg-gray-50 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-100 transition-colors"
      >
        <Icon name="heroicons:share" class="w-5 h-5 mr-2" />
        Compartilhar Anúncio
      </button>
    </div>

    <!-- Interest Counter -->
    <div class="mt-4 pt-4 border-t border-gray-100">
      <div class="flex items-center justify-between text-sm text-gray-600">
        <span>{{ interestCount }} pessoas interessadas</span>
        <span>{{ viewsCount }} visualizações</span>
      </div>
    </div>

    <!-- Contact Tips -->
    <div class="mt-4 p-3 bg-blue-50 rounded-lg">
      <div class="flex items-start space-x-2">
        <Icon name="heroicons:light-bulb" class="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
        <div>
          <p class="text-xs font-medium text-blue-800">Dica de segurança</p>
          <p class="text-xs text-blue-700 mt-1">
            Prefira encontros em locais públicos e inspecione o veículo pessoalmente.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Seller {
  id: string
  phone: string
  whatsapp?: string
}

interface Props {
  vehicle: {
    id: string
    title: string
    price: number
    year: number
    km: number
    city: string
    uf: string
  }
  seller: Seller
}

const props = defineProps<Props>()

// Reactive data
const sendingWhatsApp = ref(false)
const isOnline = ref(Math.random() > 0.3) // Mock online status
const interestCount = ref(Math.floor(Math.random() * 15) + 1)
const viewsCount = ref(Math.floor(Math.random() * 200) + 50)

// Toast notification function
const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
  // Simple alert for now, can be replaced with a proper toast component
  if (type === 'success') {
    alert(`✅ ${message}`)
  } else {
    alert(`❌ ${message}`)
  }
}

// Methods
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value)
}

const formatPhone = (phone: string) => {
  // Format Brazilian phone number
  const cleaned = phone.replace(/\D/g, '')
  if (cleaned.length === 11) {
    return cleaned.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')
  }
  if (cleaned.length === 10) {
    return cleaned.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3')
  }
  return phone
}

const contactWhatsApp = async () => {
  sendingWhatsApp.value = true
  
  try {
    // Simulate loading delay
    await new Promise(resolve => setTimeout(resolve, 800))
    
    const message = createWhatsAppMessage()
    const whatsappNumber = props.seller.whatsapp || props.seller.phone
    const cleanNumber = whatsappNumber.replace(/\D/g, '')
    
    // Add Brazilian country code if not present
    const fullNumber = cleanNumber.startsWith('55') ? cleanNumber : `55${cleanNumber}`
    
    const whatsappUrl = `https://wa.me/${fullNumber}?text=${encodeURIComponent(message)}`
    
    // Track interaction (in a real app)
    console.log('WhatsApp contact initiated:', {
      vehicleId: props.vehicle.id,
      sellerId: props.seller.id
    })
    
    // Open WhatsApp
    window.open(whatsappUrl, '_blank')
    
    // Update interest counter
    interestCount.value++
    
    showNotification('WhatsApp aberto! Converse com o vendedor pelo WhatsApp')
    
  } catch (error) {
    showNotification('Não foi possível abrir o WhatsApp', 'error')
  } finally {
    sendingWhatsApp.value = false
  }
}

const callPhone = () => {
  const phoneUrl = `tel:${props.seller.phone}`
  window.location.href = phoneUrl
  
  // Track interaction
  console.log('Phone call initiated:', {
    vehicleId: props.vehicle.id,
    sellerId: props.seller.id
  })
}

const shareVehicle = async () => {
  const shareData = {
    title: props.vehicle.title,
    text: `${props.vehicle.title} - ${formatCurrency(props.vehicle.price)}`,
    url: window.location.href
  }
  
  try {
    if (navigator.share) {
      // Use native share API if available
      await navigator.share(shareData)
    } else {
      // Fallback to clipboard
      await navigator.clipboard.writeText(window.location.href)
      showNotification('Link copiado! Link do anúncio copiado para a área de transferência')
    }
  } catch (error) {
    console.error('Share error:', error)
    showNotification('Não foi possível compartilhar o anúncio', 'error')
  }
}

const createWhatsAppMessage = () => {
  return `Olá! Vi seu anúncio no Auto URBAN:

🚗 ${props.vehicle.title}
💰 ${formatCurrency(props.vehicle.price)}
📍 ${props.vehicle.city}, ${props.vehicle.uf}

Gostaria de saber mais informações sobre o veículo.

Link: ${window.location.href}`
}

// Simulate view tracking
onMounted(() => {
  // Track page view (in a real app)
  console.log('Vehicle detail viewed:', props.vehicle.id)
  
  // Simulate real-time interest updates
  const interval = setInterval(() => {
    if (Math.random() > 0.7) {
      viewsCount.value++
    }
  }, 10000)
  
  onUnmounted(() => {
    clearInterval(interval)
  })
})
</script>