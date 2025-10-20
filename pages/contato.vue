<template>
	<div class="min-h-screen bg-gradient-to-b from-gray-50 to-white">
		<!-- Hero Section -->
		<section class="relative bg-gradient-to-r from-purple-600 to-purple-800 text-white py-20">
			<UiContainer>
				<div class="max-w-3xl">
					<h1 class="text-5xl font-bold mb-6">Fale com quem também entende de carro.</h1>
					<p class="text-xl text-purple-100">
						Não somos robôs — somos gearheads prontos pra conversar.
					</p>
				</div>
			</UiContainer>
		</section>

		<!-- Formulário de Contato -->
		<section class="py-16">
			<UiContainer>
				<div class="max-w-4xl mx-auto">
					<div class="grid md:grid-cols-2 gap-12">
						<!-- Formulário -->
						<div>
							<h2 class="text-3xl font-bold text-gray-900 mb-6">Envie sua mensagem</h2>

							<form class="space-y-6" @submit.prevent="submitForm">
								<div>
									<label for="name" class="block text-sm font-medium text-gray-700 mb-2">
										Nome
									</label>
									<Input
										id="name"
										v-model="form.name"
										type="text"
										placeholder="Seu nome completo"
										required
									/>
								</div>

								<div>
									<label for="email" class="block text-sm font-medium text-gray-700 mb-2">
										E-mail
									</label>
									<Input
										id="email"
										v-model="form.email"
										type="email"
										placeholder="seu@email.com"
										required
									/>
								</div>

								<div>
									<label for="subject" class="block text-sm font-medium text-gray-700 mb-2">
										Assunto
									</label>
									<Select id="subject" v-model="form.subject" required>
										<option value="">Selecione um assunto</option>
										<option value="support">Suporte técnico</option>
										<option value="listing">Dúvida sobre anúncio</option>
										<option value="partnership">Parceria</option>
										<option value="suggestion">Sugestão</option>
										<option value="other">Outro</option>
									</Select>
								</div>

								<div>
									<label for="message" class="block text-sm font-medium text-gray-700 mb-2">
										Mensagem
									</label>
									<textarea
										id="message"
										v-model="form.message"
										rows="6"
										class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
										placeholder="Conte pra gente o que você precisa..."
										required
									/>
								</div>

								<Button type="submit" size="lg" :disabled="isSubmitting" class="w-full">
									{{ isSubmitting ? 'Enviando...' : 'Enviar mensagem' }}
								</Button>

								<p v-if="submitSuccess" class="text-green-600 text-sm text-center">
									✓ Mensagem enviada com sucesso! Vamos responder em breve.
								</p>

								<p v-if="submitError" class="text-red-600 text-sm text-center">
									✗ Erro ao enviar. Tente novamente ou use nosso WhatsApp.
								</p>
							</form>
						</div>

						<!-- Informações de Contato -->
						<div>
							<h2 class="text-3xl font-bold text-gray-900 mb-6">Outras formas de contato</h2>

							<div class="space-y-6">
								<!-- WhatsApp -->
								<UiCard class="p-6 hover:shadow-lg transition-shadow">
									<div class="flex items-start gap-4">
										<div
											class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0"
										>
											<svg class="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 24 24">
												<path
													d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"
												/>
											</svg>
										</div>
										<div class="flex-1">
											<h3 class="text-lg font-bold text-gray-900 mb-2">WhatsApp</h3>
											<p class="text-gray-600 mb-3">Fale direto com nossa equipe pelo WhatsApp.</p>
											<a
												href="https://wa.me/5511999999999"
												target="_blank"
												class="text-purple-600 hover:text-purple-700 font-semibold"
											>
												(11) 99999-9999 →
											</a>
										</div>
									</div>
								</UiCard>

								<!-- E-mail -->
								<UiCard class="p-6 hover:shadow-lg transition-shadow">
									<div class="flex items-start gap-4">
										<div
											class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0"
										>
											<svg
												class="w-6 h-6 text-purple-600"
												fill="none"
												stroke="currentColor"
												viewBox="0 0 24 24"
											>
												<path
													stroke-linecap="round"
													stroke-linejoin="round"
													stroke-width="2"
													d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
												/>
											</svg>
										</div>
										<div class="flex-1">
											<h3 class="text-lg font-bold text-gray-900 mb-2">E-mail</h3>
											<p class="text-gray-600 mb-3">Envie um e-mail para nossa equipe.</p>
											<a
												href="mailto:contato@autourban.com.br"
												class="text-purple-600 hover:text-purple-700 font-semibold"
											>
												contato@autourban.com.br →
											</a>
										</div>
									</div>
								</UiCard>

								<!-- Redes Sociais -->
								<UiCard class="p-6 hover:shadow-lg transition-shadow">
									<div class="flex items-start gap-4">
										<div
											class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0"
										>
											<svg class="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
												<path
													d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
												/>
											</svg>
										</div>
										<div class="flex-1">
											<h3 class="text-lg font-bold text-gray-900 mb-2">Redes Sociais</h3>
											<p class="text-gray-600 mb-3">Acompanhe nosso conteúdo e novidades.</p>
											<div class="flex gap-3">
												<a href="#" class="text-purple-600 hover:text-purple-700 font-semibold"
													>Instagram</a
												>
												<span class="text-gray-400">•</span>
												<a href="#" class="text-purple-600 hover:text-purple-700 font-semibold"
													>Facebook</a
												>
												<span class="text-gray-400">•</span>
												<a href="#" class="text-purple-600 hover:text-purple-700 font-semibold"
													>YouTube</a
												>
											</div>
										</div>
									</div>
								</UiCard>

								<!-- Horário de Atendimento -->
								<UiCard class="p-6 bg-gradient-to-r from-purple-50 to-purple-100">
									<h3 class="text-lg font-bold text-gray-900 mb-3">⏰ Horário de Atendimento</h3>
									<div class="space-y-2 text-gray-700">
										<p><strong>Segunda a Sexta:</strong> 9h às 18h</p>
										<p><strong>Sábado:</strong> 9h às 13h</p>
										<p><strong>Domingo:</strong> Fechado</p>
									</div>
									<p class="text-sm text-gray-600 mt-4">
										* Respondemos mensagens fora do horário comercial com um pouco mais de calma.
										Mas pode mandar — a gente vê!
									</p>
								</UiCard>
							</div>
						</div>
					</div>
				</div>
			</UiContainer>
		</section>

		<!-- Texto Emocional -->
		<section class="py-16 bg-gradient-to-r from-purple-600 to-purple-800 text-white">
			<UiContainer>
				<div class="max-w-3xl mx-auto text-center">
					<h2 class="text-3xl font-bold mb-6">
						Não somos robôts — somos gearheads prontos pra conversar.
					</h2>
					<p class="text-xl text-purple-100">
						Cada mensagem é lida por gente de verdade que também ama carros. Manda a real: crítica,
						sugestão, dúvida ou só um "oi" mesmo. Estamos aqui.
					</p>
				</div>
			</UiContainer>
		</section>
	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

definePageMeta({
	layout: 'default',
	title: 'Contato | Auto Urban',
	description: 'Fale com quem também entende de carro.'
})

const form = ref({
	name: '',
	email: '',
	subject: '',
	message: ''
})

const isSubmitting = ref(false)
const submitSuccess = ref(false)
const submitError = ref(false)

async function submitForm() {
	isSubmitting.value = true
	submitSuccess.value = false
	submitError.value = false

	try {
		//Aqui você implementaria a lógica de envio real
		//Por exemplo: await $fetch('/api/contact', { method: 'POST', body: form.value })

		//Simulando envio
		await new Promise(resolve => setTimeout(resolve, 1500))

		submitSuccess.value = true
		form.value = {
			name: '',
			email: '',
			subject: '',
			message: ''
		}
	} catch {
		submitError.value = true
	} finally {
		isSubmitting.value = false
	}
}
</script>
