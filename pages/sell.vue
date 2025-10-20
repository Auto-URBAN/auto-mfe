<template>
	<div class="min-h-screen bg-gray-50">
		<div class="max-w-4xl mx-auto py-12 px-4">
			<div class="bg-white rounded-lg shadow-sm p-8">
				<h1 class="text-2xl font-bold text-gray-900 mb-6">Anunciar Veículo</h1>

				<div class="text-center py-12">
					<Icon name="heroicons:camera" class="w-16 h-16 text-gray-300 mx-auto mb-4" />
					<h3 class="text-lg font-medium text-gray-900 mb-2">Formulário de Anúncio</h3>
					<p class="text-gray-500 mb-6">Esta página será implementada em breve.</p>
					<UiButton @click="$router.push('/')" variant="outline"> Voltar ao Início </UiButton>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
definePageMeta({
	middleware: 'auth'
})

useHead({
	title: 'Anunciar Veículo - Auto URBAN'
})
</script>
