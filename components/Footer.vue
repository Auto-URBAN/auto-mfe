<template>
	<footer class="bg-gray-900 text-white py-6">
		<UiContainer size="lg" padding="lg">
			<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
				<!-- Brand section -->
				<div class="lg:col-span-2">
					<NuxtImg src="/imgs/Logo.svg" alt="Auto URBAN" class="h-8 w-auto mb-4" />
					<p class="text-gray-300 text-sm mb-6 max-w-md">
						O maior marketplace de veículos do Brasil. Encontre o carro dos seus sonhos com
						segurança e transparência.
					</p>
					<div class="flex space-x-4">
						<button
							class="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
							@click="openWhatsApp"
						>
							<Icon name="heroicons:phone-20-solid" class="w-4 h-4" />
							<span class="text-sm">(11) 99999-9999</span>
						</button>
					</div>
				</div>

				<!-- Links -->
				<div>
					<h4 class="font-semibold text-white mb-4">Comprar</h4>
					<ul class="space-y-2">
						<li>
							<NuxtLink to="/cars" class="text-gray-300 hover:text-white text-sm transition-colors"
								>Carros</NuxtLink
							>
						</li>
						<li>
							<NuxtLink to="/motos" class="text-gray-300 hover:text-white text-sm transition-colors"
								>Motos</NuxtLink
							>
						</li>
						<li>
							<NuxtLink
								to="/caminhoes"
								class="text-gray-300 hover:text-white text-sm transition-colors"
								>Caminhões</NuxtLink
							>
						</li>
						<li>
							<NuxtLink
								to="/financiamento"
								class="text-gray-300 hover:text-white text-sm transition-colors"
								>Financiamento</NuxtLink
							>
						</li>
					</ul>
				</div>

				<!-- Support -->
				<div>
					<h4 class="font-semibold text-white mb-4">Ajuda</h4>
					<ul class="space-y-2">
						<li>
							<NuxtLink
								to="/como-comprar"
								class="text-gray-300 hover:text-white text-sm transition-colors"
								>Como Comprar</NuxtLink
							>
						</li>
						<li>
							<NuxtLink
								to="/como-vender"
								class="text-gray-300 hover:text-white text-sm transition-colors"
								>Como Vender</NuxtLink
							>
						</li>
						<li>
							<NuxtLink to="/faq" class="text-gray-300 hover:text-white text-sm transition-colors"
								>FAQ</NuxtLink
							>
						</li>
						<li>
							<NuxtLink
								to="/contato"
								class="text-gray-300 hover:text-white text-sm transition-colors"
								>Contato</NuxtLink
							>
						</li>
					</ul>
				</div>
			</div>

			<!-- Bottom section -->
			<div class="border-t border-gray-800 pt-8 mt-8">
				<div class="flex flex-col md:flex-row justify-between items-center">
					<p class="text-gray-400 text-sm mb-4 md:mb-0">
						© 2025 Auto URBAN. Todos os direitos reservados.
					</p>

					<div class="flex items-center space-x-6">
						<NuxtLink to="/termos" class="text-gray-400 hover:text-white text-sm transition-colors">
							Termos de Uso
						</NuxtLink>
						<NuxtLink
							to="/privacidade"
							class="text-gray-400 hover:text-white text-sm transition-colors"
						>
							Privacidade
						</NuxtLink>

						<!-- Social links -->
						<div class="flex space-x-3 ml-6">
							<button
								class="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
								@click="openWhatsApp"
								title="WhatsApp"
							>
								<Icon name="heroicons:phone-20-solid" class="w-5 h-5" />
							</button>
							<button
								class="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
								@click="openInstagram"
								title="Instagram"
							>
								<Icon name="simple-icons:instagram" class="w-5 h-5" />
							</button>
							<button
								class="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
								@click="openFacebook"
								title="Facebook"
							>
								<Icon name="simple-icons:facebook" class="w-5 h-5" />
							</button>
						</div>
					</div>
				</div>
			</div>
		</UiContainer>
	</footer>
</template>

<script setup lang="ts">
// Social media methods
function openWhatsApp() {
	window.open('https://wa.me/5511999999999', '_blank')
}

function openInstagram() {
	window.open('https://instagram.com/autourban', '_blank')
}

function openFacebook() {
	window.open('https://facebook.com/autourban', '_blank')
}
</script>
