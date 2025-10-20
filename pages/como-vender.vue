<template>
	<div class="min-h-screen bg-gradient-to-b from-gray-50 to-white">
		<!-- Hero Section -->
		<section class="relative bg-gradient-to-r from-amber-600 to-amber-800 text-white py-20">
			<UiContainer>
				<div class="max-w-3xl">
					<h1 class="text-5xl font-bold mb-6">Transforme sua história em oportunidade.</h1>
					<p class="text-xl text-amber-100">
						Cada carro conta uma história. Deixe claro o que o seu representa e encontre alguém que
						valorize essa jornada.
					</p>
				</div>
			</UiContainer>
		</section>

		<!-- Passos para Vender -->
		<section class="py-16">
			<UiContainer>
				<div class="max-w-4xl mx-auto">
					<h2 class="text-3xl font-bold text-gray-900 mb-12 text-center">
						Como vender seu carro aqui
					</h2>

					<!-- Passo 1 -->
					<div class="mb-12 flex gap-8 items-start">
						<div class="flex-shrink-0">
							<div
								class="w-16 h-16 bg-amber-600 text-white rounded-full flex items-center justify-center text-2xl font-bold"
							>
								1
							</div>
						</div>
						<div class="flex-1">
							<h3 class="text-2xl font-bold text-gray-900 mb-4">
								🏁 Adicione o carro na sua garagem
							</h3>
							<p class="text-gray-600 mb-4 text-lg">
								Primeiro, cadastre seu veículo na Garagem Viva. É lá que você vai acompanhar o valor
								FIPE e decidir quando é a hora certa de vender.
							</p>
							<div class="bg-amber-50 border-l-4 border-amber-600 p-4 mb-4">
								<p class="font-semibold text-gray-900 mb-2">💡 Dica:</p>
								<p class="text-gray-700">
									"A Garagem Viva mostra como seu carro está se valorizando (ou desvalorizando). Use
									isso para escolher o melhor momento de vender."
								</p>
							</div>
							<Button class="mt-4" @click="$router.push('/garagem')">
								Ir para minha garagem
							</Button>
						</div>
					</div>

					<!-- Passo 2 -->
					<div class="mb-12 flex gap-8 items-start">
						<div class="flex-shrink-0">
							<div
								class="w-16 h-16 bg-amber-600 text-white rounded-full flex items-center justify-center text-2xl font-bold"
							>
								2
							</div>
						</div>
						<div class="flex-1">
							<h3 class="text-2xl font-bold text-gray-900 mb-4">📢 Clique em 'Anunciar'</h3>
							<p class="text-gray-600 mb-4 text-lg">
								Dentro da sua garagem, selecione o carro que quer vender e clique em "Anunciar". É
								gratuito e leva poucos minutos.
							</p>
							<UiCard class="bg-gradient-to-r from-amber-50 to-amber-100 p-6">
								<h4 class="font-bold text-gray-900 mb-3">🆓 Anunciar é grátis</h4>
								<p class="text-gray-700">
									Aqui você não paga comissão, não paga taxa de publicação. O Auto Urban conecta
									pessoas — não intermediários.
								</p>
							</UiCard>
						</div>
					</div>

					<!-- Passo 3 -->
					<div class="mb-12 flex gap-8 items-start">
						<div class="flex-shrink-0">
							<div
								class="w-16 h-16 bg-amber-600 text-white rounded-full flex items-center justify-center text-2xl font-bold"
							>
								3
							</div>
						</div>
						<div class="flex-1">
							<h3 class="text-2xl font-bold text-gray-900 mb-4">
								📸 Adicione fotos e descrição real
							</h3>
							<p class="text-gray-600 mb-4 text-lg">
								Fotos de qualidade e uma descrição honesta fazem toda a diferença. Conte a história
								do carro: onde você foi, o que fez, como cuidou.
							</p>

							<div class="bg-amber-50 border-l-4 border-amber-600 p-4 mb-6">
								<p class="font-semibold text-gray-900 mb-2">💡 Dica emocional:</p>
								<p class="text-gray-700 italic">
									"Cada carro conta uma história. Deixe claro o que o seu representa. Quem compra
									não quer só lata e motor — quer um companheiro de estrada."
								</p>
							</div>

							<div class="space-y-4">
								<div>
									<h4 class="font-bold text-gray-900 mb-2">📷 Dicas para fotos:</h4>
									<ul class="space-y-2 text-gray-700 ml-4">
										<li class="flex items-start">
											<span class="text-amber-600 mr-2">✓</span>
											<span>Tire em dia claro, evite sombras</span>
										</li>
										<li class="flex items-start">
											<span class="text-amber-600 mr-2">✓</span>
											<span>Mostre todos os ângulos: frente, traseira, laterais, interior</span>
										</li>
										<li class="flex items-start">
											<span class="text-amber-600 mr-2">✓</span>
											<span>Inclua detalhes: painel, porta-malas, motor (se estiver limpo)</span>
										</li>
										<li class="flex items-start">
											<span class="text-amber-600 mr-2">✓</span>
											<span>Lave o carro antes — primeira impressão conta</span>
										</li>
										<li class="flex items-start">
											<span class="text-amber-600 mr-2">✓</span>
											<span>Se tiver arranhões ou defeitos, mostre também (transparência)</span>
										</li>
									</ul>
								</div>

								<div>
									<h4 class="font-bold text-gray-900 mb-2">✍️ Dicas para descrição:</h4>
									<ul class="space-y-2 text-gray-700 ml-4">
										<li class="flex items-start">
											<span class="text-amber-600 mr-2">✓</span>
											<span>Seja honesto sobre estado e histórico</span>
										</li>
										<li class="flex items-start">
											<span class="text-amber-600 mr-2">✓</span>
											<span>Mencione manutenções feitas recentemente</span>
										</li>
										<li class="flex items-start">
											<span class="text-amber-600 mr-2">✓</span>
											<span>Liste opcionais e itens de série</span>
										</li>
										<li class="flex items-start">
											<span class="text-amber-600 mr-2">✓</span>
											<span>Conte uma história: "comprei em 2020, sempre garagem..."</span>
										</li>
										<li class="flex items-start">
											<span class="text-amber-600 mr-2">✓</span>
											<span>Explique o motivo da venda (cria confiança)</span>
										</li>
									</ul>
								</div>
							</div>
						</div>
					</div>

					<!-- Passo 4 -->
					<div class="mb-12 flex gap-8 items-start">
						<div class="flex-shrink-0">
							<div
								class="w-16 h-16 bg-amber-600 text-white rounded-full flex items-center justify-center text-2xl font-bold"
							>
								4
							</div>
						</div>
						<div class="flex-1">
							<h3 class="text-2xl font-bold text-gray-900 mb-4">
								🚀 Publique e acompanhe os contatos
							</h3>
							<p class="text-gray-600 mb-4 text-lg">
								Após publicar, você receberá notificações sempre que alguém demonstrar interesse.
								Responda rápido e seja transparente nas negociações.
							</p>

							<UiCard class="p-6 mb-4">
								<h4 class="font-bold text-gray-900 mb-3">💬 Dicas para negociar:</h4>
								<ul class="space-y-2 text-gray-700">
									<li class="flex items-start">
										<span class="text-amber-600 mr-2">✓</span>
										<span>Responda todas as perguntas com sinceridade</span>
									</li>
									<li class="flex items-start">
										<span class="text-amber-600 mr-2">✓</span>
										<span>Marque test-drive em local seguro e durante o dia</span>
									</li>
									<li class="flex items-start">
										<span class="text-amber-600 mr-2">✓</span>
										<span>Esteja preparado para negociar (mas saiba seu preço mínimo)</span>
									</li>
									<li class="flex items-start">
										<span class="text-amber-600 mr-2">✓</span>
										<span>Tenha documentação organizada: CRLV, manual, notas de manutenção</span>
									</li>
									<li class="flex items-start">
										<span class="text-amber-600 mr-2">✓</span>
										<span>Não aceite formas de pagamento duvidosas</span>
									</li>
								</ul>
							</UiCard>

							<Alert variant="warning">
								<p class="font-semibold mb-2">⚠️ Segurança em primeiro lugar</p>
								<p class="text-sm">
									Nunca envie documentos originais antes de receber o pagamento. Desconfie de
									propostas muito acima do valor FIPE. Prefira pagamentos via transferência bancária
									ou PIX.
								</p>
							</Alert>
						</div>
					</div>
				</div>
			</UiContainer>
		</section>

		<!-- Precificação Inteligente -->
		<section class="py-16 bg-gray-50">
			<UiContainer>
				<div class="max-w-4xl mx-auto">
					<h2 class="text-3xl font-bold text-gray-900 mb-8 text-center">
						Como precificar seu carro
					</h2>

					<div class="grid md:grid-cols-2 gap-8 mb-8">
						<UiCard class="p-6">
							<h3 class="text-xl font-bold text-gray-900 mb-4">📊 Use a FIPE como base</h3>
							<p class="text-gray-600 mb-4">
								A Tabela FIPE é a referência do mercado. Mas lembre-se: ela mostra a média — seu
								carro pode valer mais ou menos.
							</p>
							<ul class="space-y-2 text-sm text-gray-700">
								<li class="flex items-start">
									<span class="text-green-600 mr-2">↑</span>
									<span
										><strong>Vale mais:</strong> único dono, baixa km, revisões em dia, sem
										sinistro</span
									>
								</li>
								<li class="flex items-start">
									<span class="text-red-600 mr-2">↓</span>
									<span
										><strong>Vale menos:</strong> muitos donos, alta km, pintura refazida, sem
										manual</span
									>
								</li>
							</ul>
						</UiCard>

						<UiCard class="p-6">
							<h3 class="text-xl font-bold text-gray-900 mb-4">🎯 Estratégia de preço</h3>
							<p class="text-gray-600 mb-4">
								Anuncie um pouco acima do que aceita receber. As pessoas gostam de negociar — deixe
								margem.
							</p>
							<div class="bg-amber-50 rounded p-4">
								<p class="text-sm text-gray-800">
									<strong>Exemplo:</strong><br />
									FIPE: R$ 50.000<br />
									Seu preço: R$ 52.000<br />
									Aceita: R$ 49.000<br />
									<br />
									<span class="text-amber-700 font-semibold">
										Deixe espaço para o comprador "ganhar" a negociação.
									</span>
								</p>
							</div>
						</UiCard>
					</div>

					<Alert variant="info">
						<p class="font-semibold mb-2">💡 Nossa ferramenta te ajuda</p>
						<p>
							Na Garagem Viva, você vê o histórico de preço FIPE do seu carro. Se ele está em alta,
							aproveite. Se está caindo, pode ser hora de vender antes.
						</p>
					</Alert>
				</div>
			</UiContainer>
		</section>

		<!-- Documentação Necessária -->
		<section class="py-16">
			<UiContainer>
				<div class="max-w-4xl mx-auto">
					<h2 class="text-3xl font-bold text-gray-900 mb-8 text-center">Documentação necessária</h2>

					<UiCard class="p-8">
						<div class="grid md:grid-cols-2 gap-8">
							<div>
								<h3 class="font-bold text-lg mb-4 text-gray-900">📄 Documentos do veículo</h3>
								<ul class="space-y-3">
									<li class="flex items-start">
										<span class="text-amber-600 mr-2">✓</span>
										<span class="text-gray-700">CRLV (Documento do Veículo)</span>
									</li>
									<li class="flex items-start">
										<span class="text-amber-600 mr-2">✓</span>
										<span class="text-gray-700"
											>CRV (Certificado de Registro, se for transferir)</span
										>
									</li>
									<li class="flex items-start">
										<span class="text-amber-600 mr-2">✓</span>
										<span class="text-gray-700">Comprovante de quitação (se financiado)</span>
									</li>
									<li class="flex items-start">
										<span class="text-amber-600 mr-2">✓</span>
										<span class="text-gray-700">Manual do proprietário</span>
									</li>
									<li class="flex items-start">
										<span class="text-amber-600 mr-2">✓</span>
										<span class="text-gray-700">Chave reserva (se tiver)</span>
									</li>
								</ul>
							</div>

							<div>
								<h3 class="font-bold text-lg mb-4 text-gray-900">👤 Documentos pessoais</h3>
								<ul class="space-y-3">
									<li class="flex items-start">
										<span class="text-amber-600 mr-2">✓</span>
										<span class="text-gray-700">RG e CPF (cópia e original)</span>
									</li>
									<li class="flex items-start">
										<span class="text-amber-600 mr-2">✓</span>
										<span class="text-gray-700">Comprovante de residência</span>
									</li>
									<li class="flex items-start">
										<span class="text-amber-600 mr-2">✓</span>
										<span class="text-gray-700">Certidão de nada consta (Detran)</span>
									</li>
									<li class="flex items-start">
										<span class="text-amber-600 mr-2">✓</span>
										<span class="text-gray-700">Recibo de venda assinado</span>
									</li>
								</ul>
							</div>
						</div>

						<div class="mt-6 p-4 bg-amber-50 rounded">
							<p class="text-sm text-gray-800">
								<strong>💡 Dica:</strong> Organize tudo isso antes de anunciar. Quem tem
								documentação em ordem passa mais confiança e vende mais rápido.
							</p>
						</div>
					</UiCard>
				</div>
			</UiContainer>
		</section>

		<!-- CTA -->
		<section class="py-16 bg-gradient-to-r from-amber-600 to-amber-800 text-white">
			<UiContainer>
				<div class="max-w-3xl mx-auto text-center">
					<h2 class="text-3xl font-bold mb-6">Pronto para vender?</h2>
					<p class="text-xl text-amber-100 mb-8">
						Vá para sua garagem, selecione o carro e clique em "Anunciar". É rápido, gratuito e
						transparente.
					</p>
					<Button size="lg" variant="secondary" @click="$router.push('/garagem')">
						Ir para minha garagem →
					</Button>
				</div>
			</UiContainer>
		</section>
	</div>
</template>

<script setup lang="ts">
definePageMeta({
	layout: 'default',
	title: 'Como Vender | Auto Urban',
	description: 'Transforme sua história em oportunidade. Anuncie grátis no Auto Urban.'
})
</script>
