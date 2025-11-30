<template>
	<div class="min-h-screen bg-gradient-to-b from-gray-50 to-white">
		<!-- Hero Section com Calculadora -->
		<section
			class="relative bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900 text-white py-8 overflow-hidden"
		>
			<!-- Background Pattern -->
			<div
				class="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-600/20 backdrop-blur-3xl"
			/>
			<div
				class="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,_rgba(255,255,255,0.15)_1px,_transparent_0)] bg-[length:20px_20px] opacity-30"
			/>

			<UiContainer size="lg">
				<div class="relative z-10 grid lg:grid-cols-2 gap-6 lg:gap-12 items-center">
					<!-- Texto principal -->
					<div class="lg:max-w-xl mx-auto text-center lg:text-left">
						<div>
							<h1 class="text-2xl lg:text-5xl font-bold mb-0 lg:mb-6 leading-tight">
								<span class="lg:hidden">Financie Seu Carro</span>
								<span class="hidden lg:block"
									>Descubra o
									<span
										class="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-400"
										>custo real</span
									>
									de cada sonho</span
								>
							</h1>
							<p class="text-base lg:text-xl text-blue-100/90 mb-0 lg:mb-8 leading-relaxed">
								<span class="lg:hidden">Calcule com transparência total.</span>
								<span class="hidden lg:block"
									>Financiar um carro não precisa ser um mistério. Nosso cálculo é transparente e o
									objetivo é te ajudar a decidir.</span
								>
							</p>
						</div>

						<div class="hidden lg:grid grid-cols-1 gap-3 text-sm">
							<div
								class="flex items-center gap-3 p-3 bg-white/10 rounded-xl backdrop-blur-sm border border-white/20"
							>
								<div class="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
									<Icon name="heroicons:check" class="w-4 h-4 text-white" />
								</div>
								<span class="text-white font-medium">Taxas reais dos principais bancos</span>
							</div>
							<div
								class="flex items-center gap-3 p-3 bg-white/10 rounded-xl backdrop-blur-sm border border-white/20"
							>
								<div class="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
									<Icon name="heroicons:eye" class="w-4 h-4 text-white" />
								</div>
								<span class="text-white font-medium">Cálculo 100% transparente</span>
							</div>
							<div
								class="flex items-center gap-3 p-3 bg-white/10 rounded-xl backdrop-blur-sm border border-white/20"
							>
								<div class="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
									<Icon name="heroicons:shield-check" class="w-4 h-4 text-white" />
								</div>
								<span class="text-white font-medium">Zero pegadinhas ou taxas ocultas</span>
							</div>
						</div>
					</div>

					<!-- Calculadora em destaque -->
					<div class="w-full">
						<SimpleFinancingSimulator />
					</div>
				</div>
			</UiContainer>
		</section>

		<!-- Tipos de Financiamento -->
		<section class="py-16">
			<UiContainer size="lg">
				<div class="mx-auto">
					<h2 class="text-2xl lg:text-3xl font-bold text-gray-900 mb-6 lg:mb-8 text-center">
						<span class="lg:hidden">Como Financiar</span>
						<span class="hidden lg:block">Tipos de Financiamento</span>
					</h2>

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

		<!-- Tabela Comparativa -->
		<section class="py-16">
			<UiContainer size="lg">
				<div class="mx-auto">
					<h2 class="text-2xl lg:text-3xl font-bold text-gray-900 mb-6 lg:mb-8 text-center">
						<span class="lg:hidden">Taxas dos Bancos</span>
						<span class="hidden lg:block">Comparativo de Taxas (Exemplo)</span>
					</h2>

					<!-- Desktop Table -->
					<div class="hidden lg:block overflow-x-auto">
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
									<td class="px-6 py-4 font-medium">🟡 Banco do Brasil</td>
									<td class="px-6 py-4">1,49%</td>
									<td class="px-6 py-4">19,56%</td>
									<td class="px-6 py-4">60 meses</td>
									<td class="px-6 py-4 text-sm text-gray-600">Para correntistas</td>
								</tr>
								<tr class="hover:bg-gray-50">
									<td class="px-6 py-4 font-medium">🔴 Bradesco</td>
									<td class="px-6 py-4">1,55%</td>
									<td class="px-6 py-4">20,33%</td>
									<td class="px-6 py-4">60 meses</td>
									<td class="px-6 py-4 text-sm text-gray-600">Para clientes Prime</td>
								</tr>
								<tr class="hover:bg-gray-50">
									<td class="px-6 py-4 font-medium">🟠 Itaú</td>
									<td class="px-6 py-4">1,59%</td>
									<td class="px-6 py-4">20,89%</td>
									<td class="px-6 py-4">60 meses</td>
									<td class="px-6 py-4 text-sm text-gray-600">Análise de crédito</td>
								</tr>
								<tr class="hover:bg-gray-50">
									<td class="px-6 py-4 font-medium">🔴 Santander</td>
									<td class="px-6 py-4">1,69%</td>
									<td class="px-6 py-4">22,28%</td>
									<td class="px-6 py-4">60 meses</td>
									<td class="px-6 py-4 text-sm text-gray-600">Liberação rápida</td>
								</tr>
								<tr class="hover:bg-gray-50 bg-green-50">
									<td class="px-6 py-4 font-medium">👥 Consórcio</td>
									<td class="px-6 py-4 font-bold text-green-600">0%</td>
									<td class="px-6 py-4 font-bold text-green-600">0%</td>
									<td class="px-6 py-4">Até 100 meses</td>
									<td class="px-6 py-4 text-sm text-gray-600">Taxa administrativa ~10%</td>
								</tr>
							</tbody>
						</table>
					</div>

					<!-- Mobile Cards -->
					<div class="lg:hidden space-y-4">
						<UiCard class="p-4 border-l-4 border-l-yellow-400">
							<div class="flex justify-between items-start mb-2">
								<h3 class="font-bold text-gray-900">🟡 Banco do Brasil</h3>
								<span class="text-lg font-bold text-blue-600">1,49% a.m.</span>
							</div>
							<p class="text-sm text-gray-600 mb-2">Para correntistas • Até 60 meses</p>
							<p class="text-xs text-gray-500">19,56% ao ano</p>
						</UiCard>

						<UiCard class="p-4 border-l-4 border-l-red-400">
							<div class="flex justify-between items-start mb-2">
								<h3 class="font-bold text-gray-900">🔴 Bradesco</h3>
								<span class="text-lg font-bold text-blue-600">1,55% a.m.</span>
							</div>
							<p class="text-sm text-gray-600 mb-2">Para clientes Prime • Até 60 meses</p>
							<p class="text-xs text-gray-500">20,33% ao ano</p>
						</UiCard>

						<UiCard class="p-4 border-l-4 border-l-orange-400">
							<div class="flex justify-between items-start mb-2">
								<h3 class="font-bold text-gray-900">🟠 Itaú</h3>
								<span class="text-lg font-bold text-blue-600">1,59% a.m.</span>
							</div>
							<p class="text-sm text-gray-600 mb-2">Análise de crédito • Até 60 meses</p>
							<p class="text-xs text-gray-500">20,89% ao ano</p>
						</UiCard>

						<UiCard class="p-4 border-l-4 border-l-red-500">
							<div class="flex justify-between items-start mb-2">
								<h3 class="font-bold text-gray-900">🔴 Santander</h3>
								<span class="text-lg font-bold text-blue-600">1,69% a.m.</span>
							</div>
							<p class="text-sm text-gray-600 mb-2">Liberação rápida • Até 60 meses</p>
							<p class="text-xs text-gray-500">22,28% ao ano</p>
						</UiCard>

						<UiCard class="p-4 border-l-4 border-l-green-500 bg-green-50">
							<div class="flex justify-between items-start mb-2">
								<h3 class="font-bold text-gray-900">👥 Consórcio</h3>
								<span class="text-lg font-bold text-green-600">0% juros</span>
							</div>
							<p class="text-sm text-gray-600 mb-2">Taxa administrativa ~10% • Até 100 meses</p>
							<p class="text-xs text-green-700">Precisa aguardar contemplação</p>
						</UiCard>
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
					<h2 class="text-2xl lg:text-3xl font-bold mb-6 lg:mb-8 text-center">
						<span class="lg:hidden">Dicas Importantes</span>
						<span class="hidden lg:block">Dicas de Quem Entende</span>
					</h2>

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
					<h2 class="text-xl lg:text-3xl font-bold text-gray-900 mb-4 lg:mb-6">
						<span class="lg:hidden">Encontre Seu Carro</span>
						<span class="hidden lg:block">Pronto para encontrar seu próximo carro?</span>
					</h2>
					<p class="text-base lg:text-xl text-gray-600 mb-6 lg:mb-8">
						<span class="lg:hidden">Explore nossos anúncios com confiança.</span>
						<span class="hidden lg:block"
							>Agora que você entende como funciona o financiamento, explore nossos anúncios e
							encontre o modelo ideal.</span
						>
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
