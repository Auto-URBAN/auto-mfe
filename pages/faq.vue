<template>
	<div class="min-h-screen bg-gradient-to-b from-gray-50 to-white">
		<!-- Hero Section -->
		<section class="relative bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-20">
			<UiContainer>
				<div class="max-w-3xl">
					<h1 class="text-5xl font-bold mb-6">Dúvidas frequentes de quem ama carros de verdade.</h1>
					<p class="text-xl text-blue-100">
						Encontre respostas rápidas e diretas para as perguntas mais comuns.
					</p>
				</div>
			</UiContainer>
		</section>

		<!-- FAQ Section -->
		<section class="py-16">
			<UiContainer>
				<div class="max-w-4xl mx-auto">
					<div class="space-y-4">
						<!-- FAQ 1 -->
						<div class="border border-gray-200 rounded-lg overflow-hidden">
							<button
								class="w-full px-6 py-4 text-left bg-white hover:bg-gray-50 flex justify-between items-center"
								@click="toggleFaq(1)"
							>
								<span class="text-lg font-semibold text-gray-900">
									🚗 Como funciona o Auto Urban?
								</span>
								<svg
									class="w-6 h-6 text-gray-600 transition-transform"
									:class="{ 'rotate-180': openFaq === 1 }"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M19 9l-7 7-7-7"
									/>
								</svg>
							</button>
							<div v-show="openFaq === 1" class="px-6 py-4 bg-gray-50">
								<p class="text-gray-700 mb-3">
									O Auto Urban é uma plataforma que conecta compradores e vendedores de carros, mas
									de um jeito diferente: com <strong>transparência</strong> e
									<strong>emoção</strong>.
								</p>
								<p class="text-gray-700 mb-3">Aqui você pode:</p>
								<ul class="list-disc ml-6 space-y-2 text-gray-700">
									<li>Pesquisar anúncios de carros usados</li>
									<li>Comparar modelos lado a lado</li>
									<li>Acompanhar variação de preço FIPE em tempo real</li>
									<li>Criar sua "Garagem Viva" para salvar carros favoritos</li>
									<li>Anunciar gratuitamente</li>
									<li>Simular financiamento de forma transparente</li>
								</ul>
								<p class="text-gray-700 mt-3">
									<strong>Não somos loja, não cobramos comissão.</strong>
									Conectamos gente que entende de carro.
								</p>
							</div>
						</div>

						<!-- FAQ 2 -->
						<div class="border border-gray-200 rounded-lg overflow-hidden">
							<button
								class="w-full px-6 py-4 text-left bg-white hover:bg-gray-50 flex justify-between items-center"
								@click="toggleFaq(2)"
							>
								<span class="text-lg font-semibold text-gray-900">
									💰 Posso anunciar de graça?
								</span>
								<svg
									class="w-6 h-6 text-gray-600 transition-transform"
									:class="{ 'rotate-180': openFaq === 2 }"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M19 9l-7 7-7-7"
									/>
								</svg>
							</button>
							<div v-show="openFaq === 2" class="px-6 py-4 bg-gray-50">
								<p class="text-gray-700 mb-3">
									<strong>Sim, 100% gratuito.</strong>
								</p>
								<p class="text-gray-700 mb-3">
									Não cobramos taxa de publicação, não cobramos comissão sobre a venda. Basta criar
									sua conta, adicionar o carro na sua garagem e clicar em "Anunciar".
								</p>
								<p class="text-gray-700">
									Nossa filosofia é simples:
									<em>conectar pessoas, não lucrar com intermediação.</em>
								</p>
							</div>
						</div>

						<!-- FAQ 3 -->
						<div class="border border-gray-200 rounded-lg overflow-hidden">
							<button
								class="w-full px-6 py-4 text-left bg-white hover:bg-gray-50 flex justify-between items-center"
								@click="toggleFaq(3)"
							>
								<span class="text-lg font-semibold text-gray-900">
									📊 De onde vêm os dados da FIPE?
								</span>
								<svg
									class="w-6 h-6 text-gray-600 transition-transform"
									:class="{ 'rotate-180': openFaq === 3 }"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M19 9l-7 7-7-7"
									/>
								</svg>
							</button>
							<div v-show="openFaq === 3" class="px-6 py-4 bg-gray-50">
								<p class="text-gray-700 mb-3">
									Usamos a <strong>API oficial da Tabela FIPE</strong>, mantida pela Fundação
									Instituto de Pesquisas Econômicas.
								</p>
								<p class="text-gray-700 mb-3">
									Os preços são atualizados mensalmente e refletem a média de mercado para cada
									modelo, versão e ano.
								</p>
								<p class="text-gray-700">
									<strong>Importante:</strong> A FIPE é uma referência, mas o valor real pode variar
									de acordo com estado de conservação, quilometragem, histórico e região.
								</p>
							</div>
						</div>

						<!-- FAQ 4 -->
						<div class="border border-gray-200 rounded-lg overflow-hidden">
							<button
								class="w-full px-6 py-4 text-left bg-white hover:bg-gray-50 flex justify-between items-center"
								@click="toggleFaq(4)"
							>
								<span class="text-lg font-semibold text-gray-900">
									🔒 É seguro negociar aqui?
								</span>
								<svg
									class="w-6 h-6 text-gray-600 transition-transform"
									:class="{ 'rotate-180': openFaq === 4 }"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M19 9l-7 7-7-7"
									/>
								</svg>
							</button>
							<div v-show="openFaq === 4" class="px-6 py-4 bg-gray-50">
								<p class="text-gray-700 mb-3">
									O Auto Urban é uma plataforma de <strong>conexão</strong>, não de transação. Ou
									seja: facilitamos o contato, mas <strong>não intermediamos o pagamento</strong>.
								</p>
								<p class="text-gray-700 mb-3">
									<strong>Dicas de segurança:</strong>
								</p>
								<ul class="list-disc ml-6 space-y-2 text-gray-700">
									<li>Marque encontros em locais públicos e movimentados</li>
									<li>Leve alguém junto no test-drive</li>
									<li>Verifique documentação antes de fechar negócio</li>
									<li>Prefira pagamentos via transferência bancária ou PIX rastreável</li>
									<li>Consulte débitos no Detran antes de comprar</li>
									<li>Faça vistoria cautelar</li>
								</ul>
								<p class="text-gray-700 mt-3">
									<strong>Desconfie de:</strong> preços muito abaixo da FIPE, propostas urgentes,
									vendedores que não querem mostrar o carro pessoalmente.
								</p>
							</div>
						</div>

						<!-- FAQ 5 -->
						<div class="border border-gray-200 rounded-lg overflow-hidden">
							<button
								class="w-full px-6 py-4 text-left bg-white hover:bg-gray-50 flex justify-between items-center"
								@click="toggleFaq(5)"
							>
								<span class="text-lg font-semibold text-gray-900">
									⚖️ Posso comparar carros de marcas diferentes?
								</span>
								<svg
									class="w-6 h-6 text-gray-600 transition-transform"
									:class="{ 'rotate-180': openFaq === 5 }"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M19 9l-7 7-7-7"
									/>
								</svg>
							</button>
							<div v-show="openFaq === 5" class="px-6 py-4 bg-gray-50">
								<p class="text-gray-700 mb-3">
									<strong>Sim!</strong> Nossa ferramenta de comparação permite colocar até 3 modelos
									lado a lado, independente da marca.
								</p>
								<p class="text-gray-700 mb-3">Você pode comparar:</p>
								<ul class="list-disc ml-6 space-y-2 text-gray-700">
									<li>Especificações técnicas (motor, potência, consumo)</li>
									<li>Itens de série e opcionais</li>
									<li>Preço FIPE histórico</li>
									<li>Curva de desvalorização</li>
									<li>Avaliações de usuários</li>
								</ul>
								<p class="text-gray-700 mt-3">
									Acesse: <strong>Anúncios → Comparar Veículos</strong>
								</p>
							</div>
						</div>

						<!-- FAQ 6 -->
						<div class="border border-gray-200 rounded-lg overflow-hidden">
							<button
								class="w-full px-6 py-4 text-left bg-white hover:bg-gray-50 flex justify-between items-center"
								@click="toggleFaq(6)"
							>
								<span class="text-lg font-semibold text-gray-900">
									🔔 Como recebo notificações de variação FIPE?
								</span>
								<svg
									class="w-6 h-6 text-gray-600 transition-transform"
									:class="{ 'rotate-180': openFaq === 6 }"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M19 9l-7 7-7-7"
									/>
								</svg>
							</button>
							<div v-show="openFaq === 6" class="px-6 py-4 bg-gray-50">
								<p class="text-gray-700 mb-3">
									Basta adicionar o carro na sua <strong>Garagem Viva</strong>.
								</p>
								<p class="text-gray-700 mb-3">
									Quando o preço FIPE do modelo for atualizado (todo mês), você recebe uma
									notificação por e-mail e no app mostrando:
								</p>
								<ul class="list-disc ml-6 space-y-2 text-gray-700">
									<li>Variação percentual (subiu/caiu)</li>
									<li>Valor anterior vs valor atual</li>
									<li>Gráfico histórico dos últimos 12 meses</li>
								</ul>
								<p class="text-gray-700 mt-3">
									<strong>Dica:</strong> Use isso para decidir o melhor momento de vender ou
									comprar.
								</p>
							</div>
						</div>

						<!-- FAQ 7 -->
						<div class="border border-gray-200 rounded-lg overflow-hidden">
							<button
								class="w-full px-6 py-4 text-left bg-white hover:bg-gray-50 flex justify-between items-center"
								@click="toggleFaq(7)"
							>
								<span class="text-lg font-semibold text-gray-900">
									🏁 O que é a "Garagem Viva"?
								</span>
								<svg
									class="w-6 h-6 text-gray-600 transition-transform"
									:class="{ 'rotate-180': openFaq === 7 }"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M19 9l-7 7-7-7"
									/>
								</svg>
							</button>
							<div v-show="openFaq === 7" class="px-6 py-4 bg-gray-50">
								<p class="text-gray-700 mb-3">
									A <strong>Garagem Viva</strong> é seu espaço pessoal para organizar sua relação
									com carros.
								</p>
								<p class="text-gray-700 mb-3">Você pode adicionar:</p>
								<ul class="list-disc ml-6 space-y-2 text-gray-700">
									<li><strong>Carros que você tem:</strong> acompanhe o valor de mercado</li>
									<li><strong>Carros que você quer:</strong> crie uma "wishlist" de sonhos</li>
									<li><strong>Carros que você teve:</strong> registre sua história automotiva</li>
								</ul>
								<p class="text-gray-700 mt-3">
									Para cada carro, você vê: gráfico de preço FIPE, notificações de variação,
									anúncios similares, e pode adicionar notas pessoais.
								</p>
								<p class="text-gray-700 mt-3 font-semibold">
									É como um "Spotify, mas para carros que significam algo pra você."
								</p>
							</div>
						</div>

						<!-- FAQ 8 -->
						<div class="border border-gray-200 rounded-lg overflow-hidden">
							<button
								class="w-full px-6 py-4 text-left bg-white hover:bg-gray-50 flex justify-between items-center"
								@click="toggleFaq(8)"
							>
								<span class="text-lg font-semibold text-gray-900">
									💳 Vocês intermediam pagamento?
								</span>
								<svg
									class="w-6 h-6 text-gray-600 transition-transform"
									:class="{ 'rotate-180': openFaq === 8 }"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M19 9l-7 7-7-7"
									/>
								</svg>
							</button>
							<div v-show="openFaq === 8" class="px-6 py-4 bg-gray-50">
								<p class="text-gray-700 mb-3">
									<strong>Não.</strong> Nós conectamos comprador e vendedor, mas a negociação e o
									pagamento acontecem diretamente entre vocês.
								</p>
								<p class="text-gray-700">
									Isso mantém a plataforma gratuita e transparente. Mas lembre-se: sempre use formas
									de pagamento seguras (PIX, transferência bancária) e faça vistoria antes de
									fechar.
								</p>
							</div>
						</div>
					</div>

					<!-- Ainda tem dúvidas -->
					<UiCard
						class="mt-12 p-8 bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200"
					>
						<div class="text-center">
							<h3 class="text-2xl font-bold text-gray-900 mb-4">Ainda tem dúvidas?</h3>
							<p class="text-gray-700 mb-6">
								Fale com a gente. Não somos robôs — somos gearheads prontos pra conversar.
							</p>
							<Button size="lg" @click="$router.push('/contato')"> Entrar em contato </Button>
						</div>
					</UiCard>
				</div>
			</UiContainer>
		</section>
	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

definePageMeta({
	layout: 'default',
	title: 'FAQ | Auto Urban',
	description: 'Dúvidas frequentes de quem ama carros de verdade.'
})

const openFaq = ref<number | null>(null)

function toggleFaq(id: number) {
	openFaq.value = openFaq.value === id ? null : id
}
</script>
