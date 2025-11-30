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
						<UiCard
							v-for="type in financingTypes"
							:key="type.id"
							class="hover:shadow-xl transition-shadow"
						>
							<div class="p-6">
								<div
									:class="[
										type.iconBg,
										'w-12 h-12 rounded-lg flex items-center justify-center mb-4'
									]"
								>
									<Icon :name="type.icon" :class="[type.iconColor, 'w-6 h-6']" />
								</div>
								<h3 class="text-xl font-bold text-gray-900 mb-3">{{ type.title }}</h3>
								<p class="text-gray-600 mb-4">{{ type.description }}</p>
								<div class="space-y-2 text-sm">
									<div v-for="pro in type.pros" :key="pro" class="flex items-start">
										<span class="text-green-600 mr-2">✓</span>
										<span class="text-gray-700">{{ pro }}</span>
									</div>
									<div v-for="con in type.cons" :key="con" class="flex items-start">
										<span class="text-red-600 mr-2">✗</span>
										<span class="text-gray-700">{{ con }}</span>
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
								<tr
									v-for="bank in bankComparison"
									:key="bank.id"
									:class="['hover:bg-gray-50', bank.highlight ? 'bg-green-50' : '']"
								>
									<td class="px-6 py-4 font-medium">{{ bank.name }}</td>
									<td :class="['px-6 py-4', bank.highlight ? 'font-bold text-green-600' : '']">
										{{ bank.rateMonthly.toFixed(2).replace('.', ',') }}%
									</td>
									<td :class="['px-6 py-4', bank.highlight ? 'font-bold text-green-600' : '']">
										{{ bank.rateYearly.toFixed(2).replace('.', ',') }}%
									</td>
									<td class="px-6 py-4">{{ bank.maxTerm }} meses</td>
									<td class="px-6 py-4 text-sm text-gray-600">{{ bank.observation }}</td>
								</tr>
							</tbody>
						</table>
					</div>

					<!-- Mobile Cards -->
					<div class="lg:hidden space-y-4">
						<UiCard
							v-for="bank in bankComparison"
							:key="bank.id"
							:class="[
								'p-4 border-l-4',
								getBorderColor(bank.color),
								bank.highlight ? 'bg-green-50' : ''
							]"
						>
							<div class="flex justify-between items-start mb-2">
								<h3 class="font-bold text-gray-900">{{ bank.name }}</h3>
								<span
									:class="[
										'text-lg font-bold',
										bank.highlight ? 'text-green-600' : 'text-blue-600'
									]"
								>
									{{
										bank.rateMonthly === 0
											? '0% juros'
											: `${bank.rateMonthly.toFixed(2).replace('.', ',')}% a.m.`
									}}
								</span>
							</div>
							<p class="text-sm text-gray-600 mb-2">
								{{ bank.observation }} • Até {{ bank.maxTerm }} meses
							</p>
							<p :class="['text-xs', bank.highlight ? 'text-green-700' : 'text-gray-500']">
								{{ bank.rateYearly.toFixed(2).replace('.', ',') }}% ao ano
							</p>
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
						<div
							v-for="tip in tips"
							:key="tip.id"
							class="bg-white/10 backdrop-blur-sm rounded-lg p-6"
						>
							<h3 class="text-xl font-bold mb-3">{{ tip.emoji }} {{ tip.title }}</h3>
							<p class="text-gray-200">{{ tip.description }}</p>
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

//Busca dados dinâmicos via SSR
const { data: financingTypes } = await useFetch('/api/financing/types')
const { data: tips } = await useFetch('/api/financing/tips')
const { data: bankComparison } = await useFetch('/api/financing/bank-comparison')

//Helper para cor do border
const getBorderColor = (color: string) => {
	const colors: Record<string, string> = {
		yellow: 'border-l-yellow-400',
		red: 'border-l-red-400',
		orange: 'border-l-orange-400',
		blue: 'border-l-blue-400',
		green: 'border-l-green-500',
		purple: 'border-l-purple-400'
	}
	return colors[color] || 'border-l-gray-400'
}
</script>
