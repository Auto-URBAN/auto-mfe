<template>
  <section class="py-16 bg-gradient-to-br from-gray-900 via-gray-800 to-black relative overflow-hidden animate-fade-in-up">
    <!-- Metallic Texture Background -->
    <div class="absolute inset-0 opacity-5" style="background-image: linear-gradient(45deg, #BFBFBF 25%, transparent 25%, transparent 75%, #BFBFBF 75%, #BFBFBF), linear-gradient(45deg, #BFBFBF 25%, transparent 25%, transparent 75%, #BFBFBF 75%, #BFBFBF); background-size: 60px 60px; background-position: 0 0, 30px 30px;"/>
    
    <!-- Gradient Orbs -->
    <div class="absolute top-0 left-1/4 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl"/>
    <div class="absolute bottom-0 right-1/4 w-64 h-64 bg-red-600/10 rounded-full blur-3xl"/>

    <UiContainer size="lg">
      <!-- Divisor Superior -->
      <div class="flex items-center justify-center mb-12">
        <div class="h-px flex-1 bg-gradient-to-r from-transparent via-gray-600 to-transparent max-w-xs"/>
        <Icon name="mdi:rhombus-split" class="mx-3 w-5 h-5 text-gray-600" />
        <div class="h-px flex-1 bg-gradient-to-l from-transparent via-gray-600 to-transparent max-w-xs"/>
      </div>

      <!-- Header -->
      <div class="text-center mb-12 relative z-10 px-4">
        <div class="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-sm border border-blue-500/30 rounded-full text-sm font-bold text-blue-400 mb-4 shadow-lg">
          <Icon name="mdi:chart-line" class="w-4 h-4" />
          Inteligência de mercado
        </div>
        <h2 class="text-3xl lg:text-5xl font-black text-white mb-4 tracking-tight leading-tight">
          A linha que separa <span class="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600">investimento</span> de <span class="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-red-600">paixão</span>
        </h2>
        <p class="text-gray-300 text-lg lg:text-xl max-w-2xl mx-auto leading-relaxed">
          Quer saber por que o mercado voltou a olhar pra esse modelo?
        </p>
      </div>

      <!-- Stats Grid com Animação de Gauge -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10 px-4">
        <!-- Stat Card 1 - Valorização -->
        <div class="group bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-2xl border-2 border-gray-700 hover:border-green-500/50 transition-all duration-500 hover:shadow-xl hover:shadow-green-500/20 hover:scale-105">
          <div class="flex items-center gap-3 mb-4">
            <div class="relative p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg group-hover:shadow-green-500/50 transition-shadow">
              <Icon name="mdi:trending-up" class="w-6 h-6 text-white" />
              <!-- Pulse Effect -->
              <div class="absolute inset-0 bg-green-400 rounded-xl animate-ping opacity-20"/>
            </div>
            <div>
              <p class="text-4xl font-black text-white tabular-nums group-hover:text-green-400 transition-colors">
                +18<span class="text-2xl">%</span>
              </p>
            </div>
          </div>
          <h3 class="text-lg font-bold text-white mb-2">
            Valorização Média
          </h3>
          <p class="text-sm text-gray-400 leading-relaxed">
            Carros premium valorizaram em média <span class="text-green-400 font-semibold">18%</span> nos últimos 12 meses. <span class="text-white font-medium">O mercado sabe o que quer.</span>
          </p>
          
          <!-- Progress Bar -->
          <div class="mt-4 h-2 bg-gray-700 rounded-full overflow-hidden">
            <div class="h-full bg-gradient-to-r from-green-500 to-green-400 rounded-full animate-progress-bar" style="width: 75%;"/>
          </div>
        </div>

        <!-- Stat Card 2 - Potência -->
        <div class="group bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-2xl border-2 border-gray-700 hover:border-blue-500/50 transition-all duration-500 hover:shadow-xl hover:shadow-blue-500/20 hover:scale-105">
          <div class="flex items-center gap-3 mb-4">
            <div class="relative p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg group-hover:shadow-blue-500/50 transition-shadow">
              <Icon name="mdi:speedometer" class="w-6 h-6 text-white" />
              <div class="absolute inset-0 bg-blue-400 rounded-xl animate-ping opacity-20"/>
            </div>
            <div>
              <p class="text-4xl font-black text-white tabular-nums group-hover:text-blue-400 transition-colors">
                300<span class="text-2xl">+</span>
              </p>
            </div>
          </div>
          <h3 class="text-lg font-bold text-white mb-2">
            HP Médio
          </h3>
          <p class="text-sm text-gray-400 leading-relaxed">
            Potência média dos veículos mais procurados. <span class="text-white font-medium">Porque performance importa.</span>
          </p>
          
          <!-- Speedometer Effect -->
          <div class="mt-4 flex items-center gap-2">
            <div class="flex-1 h-2 bg-gray-700 rounded-full overflow-hidden">
              <div class="h-full bg-gradient-to-r from-blue-500 to-blue-400 rounded-full animate-progress-bar-delayed" style="width: 85%;"/>
            </div>
            <Icon name="mdi:fire" class="w-4 h-4 text-orange-500" />
          </div>
        </div>

        <!-- Stat Card 3 - Velocidade de Venda -->
        <div class="group bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-2xl border-2 border-gray-700 hover:border-purple-500/50 transition-all duration-500 hover:shadow-xl hover:shadow-purple-500/20 hover:scale-105">
          <div class="flex items-center gap-3 mb-4">
            <div class="relative p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg group-hover:shadow-purple-500/50 transition-shadow">
              <Icon name="mdi:clock-fast" class="w-6 h-6 text-white" />
              <div class="absolute inset-0 bg-purple-400 rounded-xl animate-ping opacity-20"/>
            </div>
            <div>
              <p class="text-4xl font-black text-white tabular-nums group-hover:text-purple-400 transition-colors">
                48<span class="text-2xl">h</span>
              </p>
            </div>
          </div>
          <h3 class="text-lg font-bold text-white mb-2">
            Tempo Médio de Venda
          </h3>
          <p class="text-sm text-gray-400 leading-relaxed">
            Carros bem avaliados saem em menos de 2 dias. <span class="text-white font-medium">A qualidade vende sozinha.</span>
          </p>
          
          <!-- Timer Effect -->
          <div class="mt-4 flex items-center gap-2">
            <Icon name="mdi:timer-sand" class="w-4 h-4 text-purple-400 animate-spin-slow" />
            <div class="flex-1 h-2 bg-gray-700 rounded-full overflow-hidden">
              <div class="h-full bg-gradient-to-r from-purple-500 to-purple-400 rounded-full animate-progress-bar-delayed-2" style="width: 60%;"/>
            </div>
          </div>
        </div>
      </div>

      <!-- CTA com Brilho -->
      <div class="mt-12 text-center relative z-10 px-4">
        <NuxtLink
          to="/anuncios"
          class="group relative inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-500 hover:to-blue-600 transition-all duration-300 font-bold text-base shadow-xl hover:shadow-blue-500/50 hover:scale-105 overflow-hidden"
        >
          <!-- Animated Shine -->
          <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"/>
          
          <span class="relative z-10">Explorar inteligência de mercado</span>
          <Icon 
            name="mdi:chart-box-outline" 
            class="relative z-10 w-5 h-5 group-hover:rotate-12 transition-transform duration-300"
          />
        </NuxtLink>
      </div>

      <!-- Divisor Inferior -->
      <div class="flex items-center justify-center mt-12">
        <div class="h-px flex-1 bg-gradient-to-r from-transparent via-gray-600 to-transparent max-w-xs"/>
        <Icon name="mdi:rhombus-split" class="mx-3 w-5 h-5 text-gray-600" />
        <div class="h-px flex-1 bg-gradient-to-l from-transparent via-gray-600 to-transparent max-w-xs"/>
      </div>
    </UiContainer>
  </section>
</template>

<script setup lang="ts">
</script>

<style scoped>
@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes progress-bar {
  from {
    width: 0;
  }
}

@keyframes spin-slow {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.animate-fade-in-up {
  animation: fade-in-up 0.8s ease-out;
}

.animate-progress-bar {
  animation: progress-bar 2s ease-out 0.5s both;
}

.animate-progress-bar-delayed {
  animation: progress-bar 2s ease-out 0.8s both;
}

.animate-progress-bar-delayed-2 {
  animation: progress-bar 2s ease-out 1.1s both;
}

.animate-spin-slow {
  animation: spin-slow 3s linear infinite;
}

.tabular-nums {
  font-variant-numeric: tabular-nums;
}
</style>
