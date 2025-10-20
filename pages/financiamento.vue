<template>
	<div class="min-h-screen bg-gradient-to-b from-gray-50 to-white">
		<!-- Hero Section -->
		<section class="relative bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
			<UiContainer>
				<div class="max-w-3xl">
					<h1 class="text-5xl font-bold mb-6">Entenda o custo real de cada sonho.</h1>
					<p class="text-xl text-blue-100">
						Financiar um carro não precisa ser um mistério. Aqui, o cálculo é transparente e o
						objetivo é te ajudar a decidir — não empurrar uma taxa.
					</p>
				</div>
			</UiContainer>
		</section>

		<!-- Tipos de Financiamento -->
		<section class="py-16">
			<UiContainer>
				<div class="max-w-4xl mx-auto">
					<h2 class="text-3xl font-bold text-gray-900 mb-8 text-center">Tipos de Financiamento</h2>

					<div class="grid md:grid-cols-3 gap-8 mb-12">
						<!-- CDC -->
						<UiCard class="hover:shadow-xl transition-shadow">
							<div class="p-6">
								<div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
									<svg
										class="w-6 h-6 text-blue-600"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
										/>
									</svg>
								</div>
								<h3 class="text-xl font-bold text-gray-900 mb-3">CDC</h3>
								<p class="text-gray-600 mb-4">
									Crédito Direto ao Consumidor. O mais comum no Brasil. Você financia direto com o
									banco e o carro fica alienado até quitar.
								</p>
								<div class="space-y-2 text-sm">
									<div class="flex items-start">
										<span class="text-green-600 mr-2">✓</span>
										<span class="text-gray-700">Liberação rápida</span>
									</div>
									<div class="flex items-start">
										<span class="text-green-600 mr-2">✓</span>
										<span class="text-gray-700">Pode quitar antecipado</span>
									</div>
									<div class="flex items-start">
										<span class="text-red-600 mr-2">✗</span>
										<span class="text-gray-700">Juros mais altos</span>
									</div>
								</div>
							</div>
						</UiCard>

						<!-- Leasing -->
						<UiCard class="hover:shadow-xl transition-shadow">
							<div class="p-6">
								<div
									class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4"
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
											d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
										/>
									</svg>
								</div>
								<h3 class="text-xl font-bold text-gray-900 mb-3">Leasing</h3>
								<p class="text-gray-600 mb-4">
									Arrendamento mercantil. Você "aluga" o carro com opção de compra no final. Popular
									para PJ.
								</p>
								<div class="space-y-2 text-sm">
									<div class="flex items-start">
										<span class="text-green-600 mr-2">✓</span>
										<span class="text-gray-700">Vantagens fiscais (PJ)</span>
									</div>
									<div class="flex items-start">
										<span class="text-green-600 mr-2">✓</span>
										<span class="text-gray-700">Taxas menores</span>
									</div>
									<div class="flex items-start">
										<span class="text-red-600 mr-2">✗</span>
										<span class="text-gray-700">Menos flexível</span>
									</div>
								</div>
							</div>
						</UiCard>

						<!-- Consórcio -->
						<UiCard class="hover:shadow-xl transition-shadow">
							<div class="p-6">
								<div
									class="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center mb-4"
								>
									<svg
										class="w-6 h-6 text-amber-600"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
										/>
									</svg>
								</div>
								<h3 class="text-xl font-bold text-gray-900 mb-3">Consórcio</h3>
								<p class="text-gray-600 mb-4">
									Grupos de pessoas que se juntam para comprar. Sem juros, mas depende de sorteio ou
									lance.
								</p>
								<div class="space-y-2 text-sm">
									<div class="flex items-start">
										<span class="text-green-600 mr-2">✓</span>
										<span class="text-gray-700">Sem juros</span>
									</div>
									<div class="flex items-start">
										<span class="text-green-600 mr-2">✓</span>
										<span class="text-gray-700">Melhor custo total</span>
									</div>
									<div class="flex items-start">
										<span class="text-red-600 mr-2">✗</span>
										<span class="text-gray-700">Precisa esperar contemplação</span>
									</div>
								</div>
							</div>
						</UiCard>
					</div>

					<!-- Trust Message -->
					<Alert variant="info" class="mb-12">
						<p class="text-lg">
							<strong>Aqui o cálculo é feito de forma transparente.</strong><br />
							O objetivo é te ajudar a decidir — não empurrar uma taxa.
						</p>
					</Alert>
				</div>
			</UiContainer>
		</section>

		<!-- Simulador Section -->
		<section class="py-16 bg-gray-50">
			<UiContainer>
				<div class="max-w-4xl mx-auto">
					<h2 class="text-3xl font-bold text-gray-900 mb-8 text-center">
						Simulador de Financiamento
					</h2>

					<UiCard class="p-8">
						<SimpleFinancingSimulator :price="50000" />
					</UiCard>
				</div>
			</UiContainer>
		</section>

		<!-- Tabela Comparativa -->
		<section class="py-16">
			<UiContainer>
				<div class="max-w-5xl mx-auto">
					<h2 class="text-3xl font-bold text-gray-900 mb-8 text-center">
						Comparativo de Taxas (Exemplo)
					</h2>

					<div class="overflow-x-auto">
						<table class="w-full border-collapse bg-white shadow-lg rounded-lg overflow-hidden">
							<thead class="bg-gray-900 text-white">
								<tr>
									<th class="px-6 py-4 text-left">Banco</th>
									<th class="px-6 py-4 text-left">Taxa (a.m.)</th>
									<th class="px-6 py-4 text-left">Taxa (a.a.)</th>
									<th class="px-6 py-4 text-left">Prazo Máx.</th>
									<th class="px-6 py-4 text-left">Observação</th>
								</tr>
							</thead>
							<tbody class="divide-y divide-gray-200">
								<tr class="hover:bg-gray-50">
									<td class="px-6 py-4 font-medium">Banco do Brasil</td>
									<td class="px-6 py-4">1,49%</td>
									<td class="px-6 py-4">19,56%</td>
									<td class="px-6 py-4">60 meses</td>
									<td class="px-6 py-4 text-sm text-gray-600">Para correntistas</td>
								</tr>
								<tr class="hover:bg-gray-50">
									<td class="px-6 py-4 font-medium">Itaú</td>
									<td class="px-6 py-4">1,59%</td>
									<td class="px-6 py-4">20,89%</td>
									<td class="px-6 py-4">60 meses</td>
									<td class="px-6 py-4 text-sm text-gray-600">Análise de crédito</td>
								</tr>
								<tr class="hover:bg-gray-50">
									<td class="px-6 py-4 font-medium">Santander</td>
									<td class="px-6 py-4">1,69%</td>
									<td class="px-6 py-4">22,28%</td>
									<td class="px-6 py-4">60 meses</td>
									<td class="px-6 py-4 text-sm text-gray-600">Liberação rápida</td>
								</tr>
								<tr class="hover:bg-gray-50">
									<td class="px-6 py-4 font-medium">Bradesco</td>
									<td class="px-6 py-4">1,55%</td>
									<td class="px-6 py-4">20,33%</td>
									<td class="px-6 py-4">60 meses</td>
									<td class="px-6 py-4 text-sm text-gray-600">Para clientes Prime</td>
								</tr>
								<tr class="hover:bg-gray-50 bg-blue-50">
									<td class="px-6 py-4 font-medium">Consórcio</td>
									<td class="px-6 py-4 font-bold text-green-600">0%</td>
									<td class="px-6 py-4 font-bold text-green-600">0%</td>
									<td class="px-6 py-4">Até 100 meses</td>
									<td class="px-6 py-4 text-sm text-gray-600">Taxa administrativa ~10%</td>
								</tr>
							</tbody>
						</table>
					</div>

					<p class="text-sm text-gray-600 mt-4 text-center">
						* Taxas ilustrativas de janeiro/2025. Consulte as instituições para valores atualizados.
					</p>
				</div>
			</UiContainer>
		</section>

		<!-- Dicas Práticas -->
		<section class="py-16 bg-gradient-to-r from-gray-900 to-gray-800 text-white">
			<UiContainer>
				<div class="max-w-4xl mx-auto">
					<h2 class="text-3xl font-bold mb-8 text-center">Dicas de Quem Entende</h2>

					<div class="grid md:grid-cols-2 gap-6">
						<div class="bg-white/10 backdrop-blur-sm rounded-lg p-6">
							<h3 class="text-xl font-bold mb-3">💰 Dê a maior entrada possível</h3>
							<p class="text-gray-200">
								Quanto mais você paga na entrada, menos juros vai pagar no total. Tente dar pelo
								menos 30% do valor.
							</p>
						</div>

						<div class="bg-white/10 backdrop-blur-sm rounded-lg p-6">
							<h3 class="text-xl font-bold mb-3">📅 Escolha o prazo certo</h3>
							<p class="text-gray-200">
								Prazos longos = parcelas menores, mas muito mais juros. Equilibre com o que cabe no
								seu bolso.
							</p>
						</div>

						<div class="bg-white/10 backdrop-blur-sm rounded-lg p-6">
							<h3 class="text-xl font-bold mb-3">🔍 Compare as taxas</h3>
							<p class="text-gray-200">
								Não aceite a primeira proposta. Consulte pelo menos 3 bancos diferentes antes de
								fechar.
							</p>
						</div>

						<div class="bg-white/10 backdrop-blur-sm rounded-lg p-6">
							<h3 class="text-xl font-bold mb-3">⚡ Leia o contrato todo</h3>
							<p class="text-gray-200">
								Preste atenção em seguro obrigatório, TAC, IOF e outras taxas. Tudo isso aumenta o
								custo final.
							</p>
						</div>
					</div>
				</div>
			</UiContainer>
		</section>

		<!-- CTA Final -->
		<section class="py-16">
			<UiContainer>
				<div class="max-w-3xl mx-auto text-center">
					<h2 class="text-3xl font-bold text-gray-900 mb-6">
						Pronto para encontrar seu próximo carro?
					</h2>
					<p class="text-xl text-gray-600 mb-8">
						Agora que você entende como funciona o financiamento, explore nossos anúncios e encontre
						o modelo ideal.
					</p>
					<div class="flex gap-4 justify-center">
						<Button size="lg" @click="$router.push('/anuncios')"> Ver Anúncios </Button>
						<Button size="lg" variant="outline" @click="$router.push('/garagem')">
							Minha Garagem
						</Button>
					</div>
				</div>
			</UiContainer>
		</section>
	</div>
</template>

<script setup lang="ts">
definePageMeta({
	layout: 'default',
	title: 'Financiamento | Auto Urban',
	description: 'Entenda o custo real de cada sonho. Simule seu financiamento com transparência.'
})
</script>
