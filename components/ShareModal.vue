<template>
	<UiModal
		:model-value="modelValue"
		title="Compartilhar"
		size="sm"
		@update:model-value="$emit('update:modelValue', $event)"
	>
		<div class="space-y-6">
			<!-- Preview do conteúdo -->
			<div class="bg-gray-50 rounded-lg p-4">
				<h3 class="font-semibold text-gray-900 mb-1">{{ shareData.title }}</h3>
				<p class="text-sm text-gray-600 mb-2">{{ shareData.text }}</p>
				<p class="text-xs text-gray-500 break-all">{{ shareData.url }}</p>
			</div>

			<!-- Opções de compartilhamento -->
			<div class="space-y-3">
				<h4 class="font-medium text-gray-900">Escolha onde compartilhar:</h4>

				<div class="grid grid-cols-2 gap-3">
					<!-- WhatsApp -->
					<button
						class="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-green-50 hover:border-green-300 transition-colors group"
						@click="handleWhatsApp"
					>
						<div class="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
							<Icon name="mdi:whatsapp" class="w-5 h-5 text-white" />
						</div>
						<span class="font-medium text-gray-700 group-hover:text-green-700">WhatsApp</span>
					</button>

					<!-- Facebook -->
					<button
						class="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors group"
						@click="handleFacebook"
					>
						<div class="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
							<Icon name="mdi:facebook" class="w-5 h-5 text-white" />
						</div>
						<span class="font-medium text-gray-700 group-hover:text-blue-700">Facebook</span>
					</button>

					<!-- Twitter/X -->
					<button
						class="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-black hover:border-gray-600 transition-colors group"
						@click="handleTwitter"
					>
						<div class="w-8 h-8 bg-black rounded-full flex items-center justify-center">
							<Icon name="mdi:twitter" class="w-5 h-5 text-white" />
						</div>
						<span class="font-medium text-gray-700 group-hover:text-white">Twitter</span>
					</button>

					<!-- LinkedIn -->
					<button
						class="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-600 transition-colors group"
						@click="handleLinkedIn"
					>
						<div class="w-8 h-8 bg-blue-700 rounded-full flex items-center justify-center">
							<Icon name="mdi:linkedin" class="w-5 h-5 text-white" />
						</div>
						<span class="font-medium text-gray-700 group-hover:text-blue-700">LinkedIn</span>
					</button>

					<!-- Telegram -->
					<button
						class="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-400 transition-colors group"
						@click="handleTelegram"
					>
						<div class="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
							<Icon name="mdi:telegram" class="w-5 h-5 text-white" />
						</div>
						<span class="font-medium text-gray-700 group-hover:text-blue-700">Telegram</span>
					</button>

					<!-- Copiar Link -->
					<button
						class="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-colors group"
						:class="{ 'bg-green-50 border-green-300': linkCopied }"
						@click="handleCopyLink"
					>
						<div
							class="w-8 h-8 rounded-full flex items-center justify-center transition-colors"
							:class="linkCopied ? 'bg-green-500' : 'bg-gray-500'"
						>
							<Icon
								:name="linkCopied ? 'heroicons:check-20-solid' : 'heroicons:link-20-solid'"
								class="w-5 h-5 text-white"
							/>
						</div>
						<span
							class="font-medium transition-colors"
							:class="linkCopied ? 'text-green-700' : 'text-gray-700 group-hover:text-gray-900'"
						>
							{{ linkCopied ? 'Link Copiado!' : 'Copiar Link' }}
						</span>
					</button>
				</div>
			</div>

			<!-- QR Code (opcional) -->
			<div v-if="showQrCode" class="text-center border-t pt-6">
				<h4 class="font-medium text-gray-900 mb-3">Ou escaneie o QR Code:</h4>
				<div class="inline-block p-4 bg-white border rounded-lg">
					<!-- Aqui você pode usar uma biblioteca de QR Code -->
					<div class="w-32 h-32 bg-gray-100 rounded flex items-center justify-center">
						<Icon name="heroicons:qr-code-20-solid" class="w-16 h-16 text-gray-400" />
					</div>
				</div>
				<p class="text-xs text-gray-500 mt-2">Aponte a câmera do celular para o código</p>
			</div>
		</div>

		<template #footer>
			<div class="flex justify-between">
				<UiButton variant="outline" size="sm" @click="toggleQrCode">
					<Icon name="heroicons:qr-code-20-solid" class="w-4 h-4 mr-2" />
					{{ showQrCode ? 'Ocultar' : 'Mostrar' }} QR Code
				</UiButton>

				<UiButton variant="outline" @click="$emit('update:modelValue', false)"> Fechar </UiButton>
			</div>
		</template>
	</UiModal>
</template>

<script setup lang="ts">
interface ShareData {
	title: string
	text: string
	url: string
}

interface Props {
	modelValue: boolean
	shareData: ShareData
}

interface Emits {
	(e: 'update:modelValue', value: boolean): void
	(e: 'shared', platform: string): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const {
	shareWhatsApp,
	shareFacebook,
	shareTwitter,
	shareLinkedIn,
	shareTelegram,
	copyToClipboard
} = useShare()

const linkCopied = ref(false)
const showQrCode = ref(false)

//Resetar estado quando modal for fechado
watch(
	() => props.modelValue,
	newValue => {
		if (!newValue) {
			linkCopied.value = false
			showQrCode.value = false
		}
	}
)

//Handlers para cada plataforma
const handleWhatsApp = () => {
	shareWhatsApp(props.shareData)
	emit('shared', 'whatsapp')
}

const handleFacebook = () => {
	shareFacebook(props.shareData)
	emit('shared', 'facebook')
}

const handleTwitter = () => {
	shareTwitter(props.shareData)
	emit('shared', 'twitter')
}

const handleLinkedIn = () => {
	shareLinkedIn(props.shareData)
	emit('shared', 'linkedin')
}

const handleTelegram = () => {
	shareTelegram(props.shareData)
	emit('shared', 'telegram')
}

const handleCopyLink = async () => {
	const success = await copyToClipboard(props.shareData.url)
	if (success) {
		linkCopied.value = true
		emit('shared', 'copy')

		//Resetar estado após 3 segundos
		setTimeout(() => {
			linkCopied.value = false
		}, 3000)
	}
}

const toggleQrCode = () => {
	showQrCode.value = !showQrCode.value
}
</script>
