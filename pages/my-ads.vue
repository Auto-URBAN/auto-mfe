<template>
	<div class="min-h-screen bg-gray-50">
		<div class="max-w-4xl mx-auto py-12 px-4">
			<div class="bg-white rounded-lg shadow-sm p-8">
				<h1 class="text-2xl font-bold text-gray-900 mb-6">Meus Anúncios</h1>

				<!-- Empty State -->
				<div class="text-center py-12">
					<Icon name="heroicons:document-text" class="w-16 h-16 text-gray-300 mx-auto mb-4" />
					<h3 class="text-lg font-medium text-gray-900 mb-2">Nenhum anúncio encontrado</h3>
					<p class="text-gray-500 mb-6">Você ainda não possui anúncios publicados.</p>
					<UiButton @click="$router.push('/sell')">
						<Icon name="heroicons:plus" class="w-4 h-4 mr-2" />
						Criar Primeiro Anúncio
					</UiButton>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
// Middleware de autenticação
definePageMeta({
	middleware: 'auth'
})

// Meta
useHead({
	title: 'Meus Anúncios - Auto URBAN'
})
</script>
