<template>
	<div class="min-h-screen bg-gray-50">
		<div class="max-w-4xl mx-auto py-12 px-4">
			<div class="bg-white rounded-lg shadow-sm p-8">
				<h1 class="text-2xl font-bold text-gray-900 mb-6">Área do Usuário</h1>

				<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
					<div class="space-y-4">
						<h2 class="text-lg font-semibold text-gray-800">Informações do Usuário</h2>

						<div class="bg-gray-50 rounded-lg p-4">
							<div class="flex items-center space-x-4">
								<div
									class="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-white text-xl font-bold"
								>
									{{ userInitials }}
								</div>
								<div>
									<p class="font-medium text-gray-900">{{ userName }}</p>
									<p class="text-sm text-gray-500">{{ user?.phone }}</p>
									<span
										class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
										:class="isAdmin ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'"
									>
										{{ isAdmin ? 'Admin' : 'Usuário' }}
									</span>
								</div>
							</div>
						</div>
					</div>

					<div class="space-y-4">
						<h2 class="text-lg font-semibold text-gray-800">Ações Disponíveis</h2>

						<div class="space-y-3">
							<button
								v-if="!isAdmin"
								class="w-full flex items-center justify-center px-4 py-3 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
								@click="router.push('/anuncios/criar')"
							>
								<Icon name="heroicons:plus" class="w-4 h-4 mr-2" />
								Anunciar Veículo
							</button>

							<button
								v-if="!isAdmin"
								class="w-full flex items-center justify-center px-4 py-3 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
								@click="router.push('/anuncios/me')"
							>
								<Icon name="heroicons:document-text" class="w-4 h-4 mr-2" />
								Meus Anúncios
							</button>

							<button
								v-if="isAdmin"
								class="w-full flex items-center justify-center px-4 py-3 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 transition-colors"
								@click="router.push('/admin')"
							>
								<Icon name="heroicons:shield-check" class="w-4 h-4 mr-2" />
								Área Administrativa
							</button>

							<button
								class="w-full flex items-center justify-center px-4 py-3 border border-red-300 text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50 transition-colors"
								@click="handleLogout"
							>
								<Icon name="heroicons:arrow-left-on-rectangle" class="w-4 h-4 mr-2" />
								Sair
							</button>
						</div>
					</div>
				</div>

				<div class="mt-8 p-4 bg-green-50 border border-green-200 rounded-lg">
					<div class="flex items-center">
						<Icon name="heroicons:check-circle" class="w-5 h-5 text-green-500 mr-2" />
						<span class="text-green-800 font-medium"> Login persistido com sucesso! </span>
					</div>
					<p class="text-green-700 text-sm mt-1">
						Suas informações de login foram salvas e você permanecerá logado mesmo após recarregar a
						página.
					</p>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
definePageMeta({
	middleware: 'auth'
})

const router = useRouter()

const { user, userName, userInitials, isAdmin, logout } = useAuth()

const handleLogout = async () => {
	try {
		await logout()
		await router.push('/')
	} catch (error) {
		console.error('Logout error:', error)
	}
}

useHead({
	title: 'Área do Usuário - Auto URBAN'
})
</script>
