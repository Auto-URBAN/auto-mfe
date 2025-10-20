<template>
	<div>
		<!-- Page Header -->
		<div class="mb-8">
			<h1 class="text-2xl font-bold text-gray-900">Gerenciamento de Usuários</h1>
			<p class="mt-2 text-sm text-gray-600">Gerencie usuários e administradores da plataforma</p>
		</div>

		<!-- Stats Cards -->
		<div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
			<BigNumberCard
				title="Total de Usuários"
				:value="totalUsers"
				icon="heroicons:users"
				color="blue"
			/>

			<BigNumberCard
				title="Usuários Regulares"
				:value="regularUsersCount"
				icon="heroicons:user"
				color="green"
			/>

			<BigNumberCard
				title="Administradores"
				:value="adminUsersCount"
				icon="heroicons:shield-check"
				color="purple"
			/>
		</div>

		<!-- Loading State -->
		<div v-if="adminLoading" class="space-y-4">
			<div v-for="i in 5" :key="i" class="h-16 bg-gray-200 rounded-lg animate-pulse" />
		</div>

		<!-- Error State -->
		<div
			v-else-if="adminError"
			class="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded"
		>
			<div class="flex">
				<Icon name="heroicons:exclamation-triangle" class="h-5 w-5 text-red-400 mr-2" />
				<p class="text-sm">{{ adminError }}</p>
			</div>
		</div>

		<!-- Users Table -->
		<div v-else class="bg-white rounded-lg shadow">
			<div class="px-6 py-4 border-b border-gray-200">
				<div class="flex justify-between items-center">
					<h3 class="text-lg font-semibold text-gray-900">Lista de Usuários</h3>

					<!-- Filter Dropdown -->
					<select
						v-model="selectedFilter"
						class="w-48 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
					>
						<option value="all">Todos os usuários</option>
						<option value="user">Usuários regulares</option>
						<option value="admin">Administradores</option>
					</select>
				</div>
			</div>

			<div class="overflow-x-auto">
				<table class="min-w-full divide-y divide-gray-200">
					<thead class="bg-gray-50">
						<tr>
							<th
								class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
							>
								Usuário
							</th>
							<th
								class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
							>
								Telefone
							</th>
							<th
								class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
							>
								Tipo
							</th>
							<th
								class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
							>
								Anúncios
							</th>
							<th
								class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
							>
								Cadastro
							</th>
							<th
								class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
							>
								Ações
							</th>
						</tr>
					</thead>
					<tbody class="bg-white divide-y divide-gray-200">
						<tr v-for="user in filteredUsers" :key="user.id" class="hover:bg-gray-50">
							<!-- User Info -->
							<td class="px-6 py-4 whitespace-nowrap">
								<div class="flex items-center">
									<div class="flex-shrink-0 h-10 w-10">
										<div
											class="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center"
										>
											<span class="text-white font-medium text-sm">
												{{ getUserInitials(user) }}
											</span>
										</div>
									</div>
									<div class="ml-4">
										<div class="text-sm font-medium text-gray-900">ID: {{ user.id }}</div>
									</div>
								</div>
							</td>

							<!-- Phone -->
							<td class="px-6 py-4 whitespace-nowrap">
								<div class="text-sm text-gray-900">{{ formatPhone(user.phone) }}</div>
							</td>

							<!-- Role -->
							<td class="px-6 py-4 whitespace-nowrap">
								<span
									:class="[
										'inline-flex px-2 py-1 text-xs font-semibold rounded-full',
										user.role === 'ADMIN'
											? 'bg-purple-100 text-purple-800'
											: 'bg-gray-100 text-gray-800'
									]"
								>
									{{ user.role === 'ADMIN' ? 'Admin' : 'Usuário' }}
								</span>
							</td>

							<!-- Ads Count -->
							<td class="px-6 py-4 whitespace-nowrap">
								<div class="text-sm text-gray-900">{{ user.ads?.total || 0 }} anúncios</div>
								<div v-if="user.ads?.byStatus" class="text-xs text-gray-500">
									{{ user.ads.byStatus.approved || 0 }} aprovados,
									{{ user.ads.byStatus.pending || 0 }} pendentes
								</div>
							</td>

							<!-- Created Date -->
							<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
								{{ formatDate(user.createdAt) }}
							</td>

							<!-- Actions -->
							<td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
								<div class="flex justify-end space-x-2">
									<button
										@click="viewUserAds(user.id)"
										class="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-blue-600 hover:text-blue-900 hover:bg-blue-50 transition-colors"
									>
										<Icon name="heroicons:eye" class="mr-1 w-4 h-4" />
										Ver Anúncios
									</button>

									<div class="relative">
										<button
											@click="toggleDropdown(user.id)"
											class="inline-flex items-center px-2 py-1 border border-transparent text-sm font-medium rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors"
										>
											<Icon name="heroicons:ellipsis-horizontal" class="w-4 h-4" />
										</button>

										<div
											v-show="openDropdowns[user.id]"
											class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-50"
										>
											<div class="p-2 space-y-1">
												<button
													v-if="user.role !== 'ADMIN'"
													@click="
														promoteToAdmin(user.id)
														closeDropdown(user.id)
													"
													class="flex items-center w-full px-3 py-1 text-sm text-gray-700 hover:bg-gray-100 transition-colors rounded"
												>
													<Icon name="heroicons:shield-check" class="mr-2 w-4 h-4" />
													Promover a Admin
												</button>

												<button
													disabled
													class="flex items-center w-full px-3 py-1 text-sm text-gray-400 cursor-not-allowed rounded"
												>
													<Icon name="heroicons:no-symbol" class="mr-2 w-4 h-4" />
													Suspender (Em Breve)
												</button>
											</div>
										</div>
									</div>
								</div>
							</td>
						</tr>

						<!-- Empty State -->
						<tr v-if="filteredUsers.length === 0">
							<td colspan="6" class="px-6 py-12 text-center">
								<Icon name="heroicons:users" class="mx-auto h-12 w-12 text-gray-400 mb-4" />
								<h3 class="text-sm font-medium text-gray-900 mb-1">Nenhum usuário encontrado</h3>
								<p class="text-sm text-gray-500">Não há usuários {{ filterText }} no momento.</p>
							</td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import BigNumberCard from '~/components/BigNumberCard.vue'

definePageMeta({
	layout: 'admin',
	middleware: 'admin-auth'
})

const auth = useAuth()

// Reactive data
const selectedFilter = ref('all')
const openDropdowns = ref<Record<string, boolean>>({})

// Admin users data
const adminUsers = ref([])
const adminLoading = ref(false)
const adminError = ref<string | null>(null)

// Load admin users function
const loadAdminUsers = async () => {
	adminLoading.value = true
	adminError.value = null

	try {
		const users = await $fetch('/api/admin/users')
		adminUsers.value = users
	} catch (error: any) {
		adminError.value = error.message || 'Erro ao carregar usuários'
		console.error('Error loading admin users:', error)
	} finally {
		adminLoading.value = false
	}
}

// Computed
const totalUsers = computed(() => adminUsers.value.length)
const regularUsersCount = computed(() => adminUsers.value.filter(u => u.role === 'USER').length)
const adminUsersCount = computed(() => adminUsers.value.filter(u => u.role === 'ADMIN').length)

const filteredUsers = computed(() => {
	const allUsers = adminUsers.value

	if (selectedFilter.value === 'user') {
		return allUsers.filter(u => u.role === 'USER')
	}

	if (selectedFilter.value === 'admin') {
		return allUsers.filter(u => u.role === 'ADMIN')
	}

	return allUsers
})

const filterText = computed(() => {
	const texts = {
		all: 'cadastrados',
		user: 'regulares',
		admin: 'administradores'
	}
	return texts[selectedFilter.value as keyof typeof texts] || 'cadastrados'
})

// Methods
const formatPhone = (phone: string) => {
	// Format Brazilian phone number
	if (phone.length === 11) {
		return phone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')
	}
	return phone
}

const formatDate = (date: string) => {
	return new Intl.DateTimeFormat('pt-BR').format(new Date(date))
}

const getUserInitials = (user: any) => {
	// Generate initials from user ID (since we don't have names)
	return user.id.substring(0, 2).toUpperCase()
}

const viewUserAds = (userId: string) => {
	// Navigate to vehicles page filtered by user
	navigateTo(`/admin/vehicles?user=${userId}`)
}

const promoteToAdmin = async (userId: string) => {
	// TODO: Implement promote to admin functionality
	console.log('Promote to admin:', userId)
	alert('Funcionalidade em desenvolvimento')
}

// Dropdown management
const toggleDropdown = (userId: string) => {
	openDropdowns.value[userId] = !openDropdowns.value[userId]
}

const closeDropdown = (userId: string) => {
	openDropdowns.value[userId] = false
}

// Close all dropdowns when clicking outside
const handleClickOutside = (event: Event) => {
	const target = event.target as Element
	if (!target.closest('.relative')) {
		openDropdowns.value = {}
	}
}

// Lifecycle
onMounted(async () => {
	try {
		await loadAdminUsers()
		document.addEventListener('click', handleClickOutside)
	} catch (err) {
		console.error('Failed to load users:', err)
	}
})

onUnmounted(() => {
	document.removeEventListener('click', handleClickOutside)
})

// Meta
useHead({
	title: 'Gerenciamento de Usuários - Admin Auto URBAN'
})
</script>
