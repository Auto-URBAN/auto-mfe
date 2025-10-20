<template>
	<section class="relative py-24">
		<UiContainer size="xl" padding="md" class="relative z-10">
			<UiText as="h2" size="3xl" weight="semibold" align="center" class="mb-4 text-neutral-900">
				Sua garagem, do jeito que você sonha
			</UiText>

			<UiText
				as="p"
				size="lg"
				weight="normal"
				align="center"
				class="max-w-2xl mx-auto mb-12 text-neutral-600"
			>
				Salve os carros que já teve, os que deseja e os que está de olho — o Auto Urban acompanha
				tudo pra você.
			</UiText>

			<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
				<div
					class="group bg-white rounded-2xl border border-neutral-200 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 p-8"
				>
					<div
						class="flex items-center justify-center w-14 h-14 mx-auto mb-5 rounded-xl bg-gradient-to-br from-gray-800 to-gray-900 text-white"
					>
						<Icon name="mdi:garage" class="w-7 h-7" />
					</div>
					<UiText as="h3" size="lg" weight="bold" align="center" class="mb-2 text-neutral-900">
						Seus carros
					</UiText>
					<UiText as="p" size="sm" weight="normal" align="center" class="text-neutral-600">
						Organize seu histórico e acompanhe o valor de revenda em tempo real.
					</UiText>
				</div>

				<div
					class="group bg-white rounded-2xl border border-neutral-200 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 p-8"
				>
					<div
						class="flex items-center justify-center w-14 h-14 mx-auto mb-5 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white"
					>
						<Icon name="mdi:star" class="w-7 h-7" />
					</div>
					<UiText as="h3" size="lg" weight="bold" align="center" class="mb-2 text-neutral-900">
						Objetivos
					</UiText>
					<UiText as="p" size="sm" weight="normal" align="center" class="text-neutral-600">
						Monte sua lista dos sonhos e veja quando surgem novas oportunidades.
					</UiText>
				</div>

				<div
					class="group bg-white rounded-2xl border border-neutral-200 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 p-8"
				>
					<div
						class="flex items-center justify-center w-14 h-14 mx-auto mb-5 rounded-xl bg-gradient-to-br from-red-500 to-red-600 text-white"
					>
						<Icon name="mdi:bell-ring" class="w-7 h-7" />
					</div>
					<UiText as="h3" size="lg" weight="bold" align="center" class="mb-2 text-neutral-900">
						Alertas inteligentes
					</UiText>
					<UiText as="p" size="sm" weight="normal" align="center" class="text-neutral-600">
						Receba notificações quando os preços mudam ou aparecem novos anúncios.
					</UiText>
				</div>
			</div>

			<div class="mt-12 text-center">
				<NuxtLink
					to="/garagem"
					class="group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-neutral-900 to-neutral-800 text-white rounded-xl hover:from-neutral-800 hover:to-neutral-700 transition-all duration-300 font-bold shadow-lg hover:shadow-xl hover:scale-105"
				>
					<span>Acessar minha garagem</span>
					<Icon
						name="mdi:garage-variant"
						class="w-5 h-5 group-hover:rotate-12 transition-transform duration-300"
					/>
				</NuxtLink>
			</div>
		</UiContainer>
	</section>
</template>

<script setup lang="ts"></script>

<style scoped>
@keyframes fade-in-up {
	from {
		opacity: 0;
		transform: translateY(20px);
	}
	to {
		opacity: 1;
		transform: translateY(0);
	}
}

.animate-fade-in-up {
	animation: fade-in-up 0.8s ease-out both;
}
</style>
