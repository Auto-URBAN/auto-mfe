<template>
	<section class="py-16 bg-gradient-to-b from-gray-50 to-white">
		<UiContainer size="xl" padding="md">
			<!-- Header da Seção -->
			<div class="text-center mb-10">
				<UiText as="h2" size="3xl" weight="bold" align="center" class="text-gray-900 mb-3">
					Simule seu Financiamento
				</UiText>
				<UiText
					as="p"
					size="lg"
					weight="normal"
					align="center"
					class="text-gray-600 max-w-2xl mx-auto"
				>
					Descubra quanto você pagaria por mês. Sem surpresas, sem letras miúdas.
				</UiText>
			</div>

			<!-- Calculadora -->
			<div class="max-w-xl mx-auto">
				<SimpleFinancingSimulator />
			</div>

			<!-- CTA -->
			<div class="text-center mt-8">
				<NuxtLink
					to="/financiamento"
					class="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold transition-colors"
				>
					Ver simulação completa
					<Icon name="heroicons:arrow-right" class="w-4 h-4" />
				</NuxtLink>
			</div>
		</UiContainer>
	</section>
</template>

<script setup lang="ts"></script>
