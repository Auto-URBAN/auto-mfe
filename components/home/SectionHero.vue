<template>
	<section class="relative overflow-hidden bg-[#0B0B0C] py-28 text-center">
		<div
			class="absolute inset-0 bg-repeat"
			style="
				background-image: url('/textures/honeycomb.svg');
				background-size: 60px 52px;
				opacity: 0.3;
			"
		/>

		<div
			class="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.08),transparent_70%)] pointer-events-none"
		/>

		<UiContainer size="xl" padding="md" class="relative z-10">
			<UiText
				as="h1"
				size="4xl"
				weight="extrabold"
				align="center"
				class="mb-6 text-white tracking-tight animate-slide-up"
			>
				Aqui você encontra o que o mercado respeita — e o coração entende.
			</UiText>

			<UiText
				as="p"
				size="lg"
				weight="light"
				align="center"
				class="mb-10 text-neutral-400 animate-fade-in-delayed max-w-2xl mx-auto"
			>
				Dados reais, histórias verdadeiras e máquinas que merecem respeito.
			</UiText>

			<div class="flex justify-center gap-4 flex-wrap animate-fade-in-delayed-2">
				<UiBadge
					class="bg-white/10 border border-white/20 text-white backdrop-blur-sm hover:bg-white/20 transition"
				>
					Feito por gearheads 🇩🇪
				</UiBadge>
				<UiBadge
					class="bg-white/10 border border-white/20 text-white backdrop-blur-sm hover:bg-white/20 transition"
				>
					Baseado em dados FIPE reais
				</UiBadge>
			</div>
		</UiContainer>

		<div
			class="absolute inset-x-0 bottom-0 h-[2px] bg-gradient-to-r from-[#0071C5] via-[#C30000] to-gray-500 blur-[1px] opacity-90 animate-pulse-slow"
		/>
	</section>
</template>

<script setup lang="ts"></script>

<style scoped>
@keyframes fade-in {
	from {
		opacity: 0;
	}
	to {
		opacity: 1;
	}
}
@keyframes slide-up {
	from {
		opacity: 0;
		transform: translateY(30px);
	}
	to {
		opacity: 1;
		transform: translateY(0);
	}
}
@keyframes pulse-slow {
	0%,
	100% {
		opacity: 0.8;
		filter: brightness(0.9);
	}
	50% {
		opacity: 1;
		filter: brightness(1.1);
	}
}
.animate-fade-in-delayed,
.animate-fade-in-delayed-2 {
	animation: fade-in 1s ease-out both;
}
.animate-fade-in-delayed {
	animation-delay: 0.4s;
}
.animate-fade-in-delayed-2 {
	animation-delay: 0.8s;
}
.animate-slide-up {
	animation: slide-up 0.8s ease-out both;
}
.animate-pulse-slow {
	animation: pulse-slow 4s ease-in-out infinite alternate;
}
</style>
