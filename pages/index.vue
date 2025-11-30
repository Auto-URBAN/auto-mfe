<template>
	<div class="min-h-screen bg-white">
		<HomeSectionHero />
		<HomeSectionFeatured />
		<HomeSectionFinancing />
		<HomeSectionMarket />
		<HomeSectionGarage />
	</div>
</template>

<script setup lang="ts">
useHead({
	title: 'Auto Urban — Carros com Alma',
	meta: [
		{
			name: 'description',
			content:
				'Conversa de quem ama carro, números de quem entende. Explore rankings de valorização, marcas premium e o que o mercado realmente respeita.'
		},
		{
			property: 'og:title',
			content: 'Auto Urban — Carros com Alma'
		},
		{
			property: 'og:description',
			content: 'Sem clickbait, sem leilões — só máquinas de verdade.'
		}
	]
})
</script>

<style scoped>
html {
	scroll-behavior: smooth;
}
</style>
