<template>
	<div class="min-h-screen bg-gray-50 py-8">
		<UiContainer size="lg">
			<!-- Mensagem de Sucesso -->
			<div
				v-if="showSuccessMessage"
				class="mb-6 bg-green-50 border-l-4 border-green-500 p-6 rounded-lg shadow-sm animate-fade-in"
			>
				<div class="flex items-start">
					<div class="flex-shrink-0">
						<Icon name="heroicons:check-circle-20-solid" class="w-8 h-8 text-green-500" />
					</div>
					<div class="ml-4 flex-1">
						<h3 class="text-lg font-semibold text-green-900 mb-1">Anúncio enviado com sucesso!</h3>
						<p class="text-green-700 mb-2">
							Seu veículo foi enviado para análise. Nossa equipe irá revisar as informações e
							aprovar o anúncio em breve.
						</p>
						<p class="text-sm text-green-600">
							Você receberá uma notificação quando o anúncio for aprovado e publicado.
						</p>
					</div>
				</div>
			</div>

			<div class="mb-8">
				<button
					class="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
					@click="$router.push('/anuncios')"
				>
					<Icon name="heroicons:arrow-left-20-solid" class="w-5 h-5" />
					Voltar para anúncios
				</button>
			</div>

			<div class="bg-white rounded-xl shadow-sm overflow-hidden">
				<!-- Header com progresso -->
				<div class="bg-gradient-to-r from-blue-600 to-purple-600 p-6">
					<h1 class="text-2xl font-bold text-white mb-2">Anunciar Veículo</h1>
					<p class="text-blue-100 mb-4">Preencha as informações do seu veículo</p>

					<!-- Stepper -->
					<div class="flex items-center justify-between max-w-2xl">
						<div
							v-for="(step, index) in steps"
							:key="index"
							class="flex items-center"
							:class="{ 'flex-1': index < steps.length - 1 }"
						>
							<div class="flex flex-col items-center">
								<div
									:class="[
										'w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all',
										currentStep > index
											? 'bg-green-500 text-white'
											: currentStep === index
												? 'bg-white text-blue-600'
												: 'bg-blue-500/30 text-blue-200'
									]"
								>
									<Icon
										v-if="currentStep > index"
										name="heroicons:check-20-solid"
										class="w-6 h-6"
									/>
									<span v-else>{{ index + 1 }}</span>
								</div>
								<span
									:class="[
										'mt-2 text-xs font-medium',
										currentStep >= index ? 'text-white' : 'text-blue-200'
									]"
								>
									{{ step.title }}
								</span>
							</div>
							<div
								v-if="index < steps.length - 1"
								:class="[
									'flex-1 h-1 mx-2 rounded transition-all',
									currentStep > index ? 'bg-green-500' : 'bg-blue-500/30'
								]"
							/>
						</div>
					</div>
				</div>

				<!-- Formulário -->
				<div class="p-8">
					<!-- Etapa 1: Informações Básicas -->
					<div v-show="currentStep === 0" class="space-y-6">
						<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
							<div>
								<label class="block text-sm font-medium text-gray-700 mb-2">
									Marca <span class="text-red-500">*</span>
								</label>
								<select
									v-model="form.brand"
									class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
									required
								>
									<option value="">Selecione...</option>
									<option v-for="brand in brands" :key="brand.id" :value="brand.name">
										{{ brand.name }}
									</option>
								</select>
								<p v-if="errors.brand" class="mt-1 text-sm text-red-600">{{ errors.brand }}</p>
							</div>

							<div>
								<label class="block text-sm font-medium text-gray-700 mb-2">
									Modelo <span class="text-red-500">*</span>
								</label>
								<UiInput v-model="form.model" placeholder="Ex: Civic, Corolla, Golf" required />
								<p v-if="errors.model" class="mt-1 text-sm text-red-600">{{ errors.model }}</p>
							</div>
						</div>

						<div class="grid grid-cols-1 md:grid-cols-3 gap-6">
							<div>
								<label class="block text-sm font-medium text-gray-700 mb-2">
									Ano <span class="text-red-500">*</span>
								</label>
								<UiInput
									v-model="form.year"
									type="number"
									:min="1900"
									:max="new Date().getFullYear() + 1"
									placeholder="2020"
									required
								/>
								<p v-if="errors.year" class="mt-1 text-sm text-red-600">{{ errors.year }}</p>
							</div>

							<div>
								<label class="block text-sm font-medium text-gray-700 mb-2">
									Preço (R$) <span class="text-red-500">*</span>
								</label>
								<UiInput
									v-model="form.price"
									type="number"
									min="0"
									step="1000"
									placeholder="50000"
									required
								/>
								<p v-if="errors.price" class="mt-1 text-sm text-red-600">{{ errors.price }}</p>
								<p v-if="form.price" class="mt-1 text-sm text-gray-500">
									{{ formatCurrency(Number(form.price)) }}
								</p>
							</div>

							<div>
								<label class="block text-sm font-medium text-gray-700 mb-2">
									Quilometragem (km) <span class="text-red-500">*</span>
								</label>
								<UiInput v-model="form.km" type="number" min="0" placeholder="50000" required />
								<p v-if="errors.km" class="mt-1 text-sm text-red-600">{{ errors.km }}</p>
							</div>
						</div>

						<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
							<div>
								<label class="block text-sm font-medium text-gray-700 mb-2">
									Câmbio <span class="text-red-500">*</span>
								</label>
								<select
									v-model="form.gearbox"
									class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
									required
								>
									<option value="">Selecione...</option>
									<option value="MANUAL">Manual</option>
									<option value="AUTO">Automático</option>
								</select>
								<p v-if="errors.gearbox" class="mt-1 text-sm text-red-600">{{ errors.gearbox }}</p>
							</div>

							<div>
								<label class="block text-sm font-medium text-gray-700 mb-2">
									Combustível <span class="text-red-500">*</span>
								</label>
								<select
									v-model="form.fuel"
									class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
									required
								>
									<option value="">Selecione...</option>
									<option value="GASOLINA">Gasolina</option>
									<option value="ALCOOL">Álcool</option>
									<option value="DIESEL">Diesel</option>
									<option value="HIBRIDO">Híbrido</option>
									<option value="ELETRICO">Elétrico</option>
								</select>
								<p v-if="errors.fuel" class="mt-1 text-sm text-red-600">{{ errors.fuel }}</p>
							</div>
						</div>

						<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
							<div>
								<label class="block text-sm font-medium text-gray-700 mb-2">Cor</label>
								<UiInput v-model="form.color" placeholder="Ex: Preto, Branco, Prata" />
							</div>

							<div>
								<label class="block text-sm font-medium text-gray-700 mb-2"> Potência (cv) </label>
								<UiInput v-model="form.horsepower" type="number" min="0" placeholder="150" />
							</div>
						</div>
					</div>

					<!-- Etapa 2: Localização e Contato -->
					<div v-show="currentStep === 1" class="space-y-6">
						<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
							<div>
								<label class="block text-sm font-medium text-gray-700 mb-2">
									Estado (UF) <span class="text-red-500">*</span>
								</label>
								<select
									v-model="form.uf"
									class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
									required
								>
									<option value="">Selecione...</option>
									<option v-for="state in brazilianStates" :key="state.code" :value="state.code">
										{{ state.name }} ({{ state.code }})
									</option>
								</select>
								<p v-if="errors.uf" class="mt-1 text-sm text-red-600">{{ errors.uf }}</p>
							</div>

							<div>
								<label class="block text-sm font-medium text-gray-700 mb-2">
									Cidade <span class="text-red-500">*</span>
								</label>
								<UiInput v-model="form.city" placeholder="Ex: São Paulo" required />
								<p v-if="errors.city" class="mt-1 text-sm text-red-600">{{ errors.city }}</p>
							</div>
						</div>

						<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
							<div>
								<label class="block text-sm font-medium text-gray-700 mb-2">
									Telefone <span class="text-red-500">*</span>
								</label>
								<UiInput
									v-model="form.phone"
									v-maska
									data-maska="(##) #####-####"
									placeholder="(11) 99999-9999"
									required
								/>
								<p v-if="errors.phone" class="mt-1 text-sm text-red-600">{{ errors.phone }}</p>
							</div>

							<div>
								<label class="block text-sm font-medium text-gray-700 mb-2">
									WhatsApp <span class="text-red-500">*</span>
								</label>
								<UiInput
									v-model="form.whatsapp"
									v-maska
									data-maska="(##) #####-####"
									placeholder="(11) 99999-9999"
									required
								/>
								<p v-if="errors.whatsapp" class="mt-1 text-sm text-red-600">
									{{ errors.whatsapp }}
								</p>
							</div>
						</div>
					</div>

					<!-- Etapa 3: Fotos -->
					<div v-show="currentStep === 2" class="space-y-6">
						<div>
							<label class="block text-sm font-medium text-gray-700 mb-2">
								Fotos do Veículo <span class="text-red-500">*</span>
								<span class="text-gray-500 font-normal">(mínimo 3, máximo 10)</span>
							</label>

							<div
								class="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors cursor-pointer"
								:class="{ 'border-blue-500 bg-blue-50': isDragging }"
								@click="triggerFileInput"
								@dragover.prevent="isDragging = true"
								@dragleave.prevent="isDragging = false"
								@drop.prevent="handleDrop"
							>
								<Icon
									name="heroicons:photo-20-solid"
									class="w-12 h-12 text-gray-400 mx-auto mb-4"
								/>
								<input
									ref="fileInput"
									type="file"
									accept="image/*"
									multiple
									class="hidden"
									@change="handleFileSelect"
								/>
							</div>

							<p v-if="errors.images" class="mt-2 text-sm text-red-600">{{ errors.images }}</p>

							<!-- Preview das imagens -->
							<div v-if="form.images.length > 0" class="mt-6 grid grid-cols-2 md:grid-cols-5 gap-4">
								<div
									v-for="(image, index) in form.images"
									:key="index"
									class="relative group aspect-video rounded-lg overflow-hidden border border-gray-200"
								>
									<img :src="image" alt="Preview" class="w-full h-full object-cover" />
									<div
										class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
									>
										<button
											class="bg-red-600 text-white p-2 rounded-full hover:bg-red-700"
											@click="removeImage(index)"
										>
											<Icon name="heroicons:trash-20-solid" class="w-5 h-5" />
										</button>
									</div>
									<div
										v-if="index === 0"
										class="absolute top-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded"
									>
										Capa
									</div>
								</div>
							</div>
						</div>
					</div>

					<!-- Etapa 4: Descrição e Revisão -->
					<div v-show="currentStep === 3" class="space-y-6">
						<div>
							<label class="block text-sm font-medium text-gray-700 mb-2">
								Descrição do Veículo
								<span class="text-gray-500 font-normal">(opcional)</span>
							</label>
							<textarea
								v-model="form.description"
								rows="6"
								maxlength="1000"
								class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
								placeholder="Descreva as características, estado de conservação, opcionais, histórico de manutenção..."
							/>
							<p class="mt-1 text-sm text-gray-500 text-right">
								{{ form.description.length }}/1000 caracteres
							</p>
						</div>

						<!-- Preview do Anúncio -->
						<div class="bg-gray-50 rounded-lg p-6">
							<h3 class="text-lg font-semibold text-gray-900 mb-4">Preview do Anúncio</h3>

							<div class="bg-white rounded-lg border border-gray-200 overflow-hidden">
								<div v-if="form.images.length > 0" class="aspect-video bg-gray-100">
									<img :src="form.images[0]" alt="Preview" class="w-full h-full object-cover" />
								</div>
								<div v-else class="aspect-video bg-gray-100 flex items-center justify-center">
									<Icon name="heroicons:photo-20-solid" class="w-16 h-16 text-gray-300" />
								</div>

								<div class="p-6">
									<h4 class="text-xl font-bold text-gray-900 mb-2">
										{{ form.brand }} {{ form.model }} {{ form.year || '' }}
									</h4>
									<p class="text-2xl font-bold text-green-600 mb-4">
										{{ form.price ? formatCurrency(Number(form.price)) : 'R$ -' }}
									</p>
									<div class="grid grid-cols-2 gap-4 text-sm">
										<div class="flex items-center gap-2 text-gray-600">
											<Icon name="heroicons:calendar-20-solid" class="w-4 h-4" />
											<span>{{ form.year || '-' }}</span>
										</div>
										<div class="flex items-center gap-2 text-gray-600">
											<Icon name="heroicons:map-pin-20-solid" class="w-4 h-4" />
											<span>{{ formatKm(form.km) }}</span>
										</div>
										<div class="flex items-center gap-2 text-gray-600">
											<Icon name="heroicons:cog-6-tooth-20-solid" class="w-4 h-4" />
											<span>{{ form.gearbox === 'AUTO' ? 'Automático' : 'Manual' }}</span>
										</div>
										<div class="flex items-center gap-2 text-gray-600">
											<Icon name="heroicons:fire-20-solid" class="w-4 h-4" />
											<span>{{ form.fuel || '-' }}</span>
										</div>
									</div>

									<div class="mt-4 pt-4 border-t border-gray-200">
										<p class="text-sm text-gray-600">{{ form.city }}, {{ form.uf }}</p>
									</div>
								</div>
							</div>
						</div>
					</div>

					<!-- Botões de navegação -->
					<div class="mt-8 flex items-center justify-between pt-6 border-t border-gray-200">
						<UiButton v-if="currentStep > 0" variant="outline" @click="previousStep">
							<Icon name="heroicons:arrow-left-20-solid" class="w-4 h-4 mr-2" />
							Voltar
						</UiButton>
						<div v-else />

						<UiButton
							v-if="currentStep < steps.length - 1"
							:disabled="!canProceed"
							@click="nextStep"
						>
							Próximo
							<Icon name="heroicons:arrow-right-20-solid" class="w-4 h-4 ml-2" />
						</UiButton>

						<UiButton
							v-else
							:disabled="submitting || !canSubmit"
							class="bg-green-600 hover:bg-green-700"
							@click="submitForm"
						>
							<Icon
								v-if="submitting"
								name="heroicons:arrow-path-20-solid"
								class="w-4 h-4 mr-2 animate-spin"
							/>
							<Icon v-else name="heroicons:check-20-solid" class="w-4 h-4 mr-2" />
							{{ submitting ? 'Publicando...' : 'Publicar Anúncio' }}
						</UiButton>
					</div>
				</div>
			</div>
		</UiContainer>
	</div>
</template>

<script setup lang="ts">
import type { Gearbox, FuelType, BrazilianState } from '@/schemas/vehicle'
import type { Brand } from '@/schemas/brand'

definePageMeta({
	middleware: 'auth'
})

useHead({
	title: 'Anunciar Veículo - Auto URBAN'
})

const router = useRouter()
const fileInput = ref<HTMLInputElement | null>(null)
const isDragging = ref(false)
const submitting = ref(false)
const showSuccessMessage = ref(false)

const steps = [
	{ title: 'Básico', icon: 'heroicons:information-circle' },
	{ title: 'Localização', icon: 'heroicons:map-pin' },
	{ title: 'Fotos', icon: 'heroicons:photo' },
	{ title: 'Revisão', icon: 'heroicons:check-circle' }
]

const currentStep = ref(0)

interface VehicleForm {
	brand: string
	model: string
	year: string
	price: string
	km: string
	gearbox: Gearbox | ''
	fuel: FuelType | ''
	color: string
	horsepower: string
	uf: BrazilianState | ''
	city: string
	phone: string
	whatsapp: string
	images: string[]
	description: string
}

const form = ref<VehicleForm>({
	brand: '',
	model: '',
	year: '',
	price: '',
	km: '',
	gearbox: '',
	fuel: '',
	color: '',
	horsepower: '',
	uf: '',
	city: '',
	phone: '',
	whatsapp: '',
	images: [],
	description: ''
})

const errors = ref<Partial<Record<keyof VehicleForm, string>>>({})

const brands = ref<Brand[]>([])

const brazilianStates = [
	{ code: 'AC', name: 'Acre' },
	{ code: 'AL', name: 'Alagoas' },
	{ code: 'AP', name: 'Amapá' },
	{ code: 'AM', name: 'Amazonas' },
	{ code: 'BA', name: 'Bahia' },
	{ code: 'CE', name: 'Ceará' },
	{ code: 'DF', name: 'Distrito Federal' },
	{ code: 'ES', name: 'Espírito Santo' },
	{ code: 'GO', name: 'Goiás' },
	{ code: 'MA', name: 'Maranhão' },
	{ code: 'MT', name: 'Mato Grosso' },
	{ code: 'MS', name: 'Mato Grosso do Sul' },
	{ code: 'MG', name: 'Minas Gerais' },
	{ code: 'PA', name: 'Pará' },
	{ code: 'PB', name: 'Paraíba' },
	{ code: 'PR', name: 'Paraná' },
	{ code: 'PE', name: 'Pernambuco' },
	{ code: 'PI', name: 'Piauí' },
	{ code: 'RJ', name: 'Rio de Janeiro' },
	{ code: 'RN', name: 'Rio Grande do Norte' },
	{ code: 'RS', name: 'Rio Grande do Sul' },
	{ code: 'RO', name: 'Rondônia' },
	{ code: 'RR', name: 'Roraima' },
	{ code: 'SC', name: 'Santa Catarina' },
	{ code: 'SP', name: 'São Paulo' },
	{ code: 'SE', name: 'Sergipe' },
	{ code: 'TO', name: 'Tocantins' }
]

const canProceed = computed(() => {
	switch (currentStep.value) {
		case 0:
			return !!(
				form.value.brand &&
				form.value.model &&
				form.value.year &&
				form.value.price &&
				form.value.km &&
				form.value.gearbox &&
				form.value.fuel
			)
		case 1:
			return !!(form.value.uf && form.value.city && form.value.phone && form.value.whatsapp)
		case 2:
			return form.value.images.length >= 3
		case 3:
			return true
		default:
			return false
	}
})

const canSubmit = computed(() => {
	return canProceed.value && form.value.images.length >= 3
})

function validateStep() {
	errors.value = {}
	let isValid = true

	switch (currentStep.value) {
		case 0:
			if (!form.value.brand) {
				errors.value.brand = 'Marca é obrigatória'
				isValid = false
			}
			if (!form.value.model) {
				errors.value.model = 'Modelo é obrigatório'
				isValid = false
			}
			if (!form.value.year || Number(form.value.year) < 1900) {
				errors.value.year = 'Ano inválido'
				isValid = false
			}
			if (!form.value.price || Number(form.value.price) <= 0) {
				errors.value.price = 'Preço deve ser maior que zero'
				isValid = false
			}
			if (!form.value.km || Number(form.value.km) < 0) {
				errors.value.km = 'Quilometragem inválida'
				isValid = false
			}
			break

		case 1:
			if (!form.value.uf) {
				errors.value.uf = 'Estado é obrigatório'
				isValid = false
			}
			if (!form.value.city) {
				errors.value.city = 'Cidade é obrigatória'
				isValid = false
			}
			if (!form.value.phone) {
				errors.value.phone = 'Telefone é obrigatório'
				isValid = false
			}
			if (!form.value.whatsapp) {
				errors.value.whatsapp = 'WhatsApp é obrigatório'
				isValid = false
			}
			break

		case 2:
			if (form.value.images.length < 3) {
				errors.value.images = 'Envie pelo menos 3 fotos'
				isValid = false
			}
			break
	}

	return isValid
}

function nextStep() {
	if (validateStep()) {
		currentStep.value++
		window.scrollTo({ top: 0, behavior: 'smooth' })
	}
}

function previousStep() {
	currentStep.value--
	window.scrollTo({ top: 0, behavior: 'smooth' })
}

function triggerFileInput() {
	fileInput.value?.click()
}

function handleFileSelect(event: Event) {
	const target = event.target as HTMLInputElement
	if (target.files) {
		handleFiles(Array.from(target.files))
	}
}

function handleDrop(event: DragEvent) {
	isDragging.value = false
	if (event.dataTransfer?.files) {
		handleFiles(Array.from(event.dataTransfer.files))
	}
}

function handleFiles(files: File[]) {
	const remainingSlots = 10 - form.value.images.length

	if (files.length > remainingSlots) {
		errors.value.images = `Você pode adicionar no máximo ${remainingSlots} foto(s) adicional(is)`
		files = files.slice(0, remainingSlots)
	}

	files.forEach(file => {
		if (!file.type.startsWith('image/')) {
			errors.value.images = `${file.name} não é uma imagem válida`
			return
		}

		if (file.size > 5 * 1024 * 1024) {
			errors.value.images = `${file.name} é muito grande. Tamanho máximo: 5MB`
			return
		}

		const reader = new FileReader()
		reader.onload = e => {
			if (e.target?.result) {
				form.value.images.push(e.target.result as string)
			}
		}
		reader.readAsDataURL(file)
	})
}

function removeImage(index: number) {
	form.value.images.splice(index, 1)
}

async function submitForm() {
	if (!validateStep() || !canSubmit.value) return

	submitting.value = true

	try {
		//TODO: Implementar chamada real à API
		await new Promise(resolve => setTimeout(resolve, 2000))

		showSuccessMessage.value = true

		//Aguarda 3 segundos antes de redirecionar
		setTimeout(() => {
			router.push('/anuncios')
		}, 3000)
	} catch (error) {
		console.error('Erro ao publicar anúncio:', error)
		alert('Erro ao publicar anúncio. Tente novamente.')
	} finally {
		submitting.value = false
	}
}

function formatCurrency(value: number): string {
	return new Intl.NumberFormat('pt-BR', {
		style: 'currency',
		currency: 'BRL',
		maximumFractionDigits: 0
	}).format(value)
}

function formatKm(km: string): string {
	if (!km) return '-'
	return `${Number(km).toLocaleString('pt-BR')} km`
}

onMounted(async () => {
	try {
		const response = await $fetch<Brand[]>('/api/brands')
		brands.value = response
	} catch (error) {
		console.error('Erro ao carregar marcas:', error)
	}
})
</script>
