<template>
  <footer class="bg-gray-900 text-white">
    <Container class="py-12 px-6 lg:px-8">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <!-- Brand section -->
        <div class="lg:col-span-2">
          <NuxtImg src="/imgs/Logo.svg" alt="Auto URBAN" class="h-8 w-auto mb-4" />
          <p class="text-gray-300 text-sm mb-6 max-w-md">
            O maior marketplace de veículos do Brasil. Encontre o carro dos seus sonhos 
            com segurança e transparência.
          </p>
          <div class="flex space-x-4">
            <UButton
              variant="ghost"
              size="sm"
              icon="i-heroicons-phone"
              color="white"
              @click="openWhatsApp"
            >
              (11) 99999-9999
            </UButton>
          </div>
        </div>

        <!-- Links -->
        <div>
          <h4 class="font-semibold text-white mb-4">Comprar</h4>
          <ul class="space-y-2">
            <li><NuxtLink to="/cars" class="text-gray-300 hover:text-white text-sm transition-colors">Carros</NuxtLink></li>
            <li><NuxtLink to="/motos" class="text-gray-300 hover:text-white text-sm transition-colors">Motos</NuxtLink></li>
            <li><NuxtLink to="/caminhoes" class="text-gray-300 hover:text-white text-sm transition-colors">Caminhões</NuxtLink></li>
            <li><NuxtLink to="/financiamento" class="text-gray-300 hover:text-white text-sm transition-colors">Financiamento</NuxtLink></li>
          </ul>
        </div>

        <!-- Support -->
        <div>
          <h4 class="font-semibold text-white mb-4">Ajuda</h4>
          <ul class="space-y-2">
            <li><NuxtLink to="/como-comprar" class="text-gray-300 hover:text-white text-sm transition-colors">Como Comprar</NuxtLink></li>
            <li><NuxtLink to="/como-vender" class="text-gray-300 hover:text-white text-sm transition-colors">Como Vender</NuxtLink></li>
            <li><NuxtLink to="/faq" class="text-gray-300 hover:text-white text-sm transition-colors">FAQ</NuxtLink></li>
            <li><NuxtLink to="/contato" class="text-gray-300 hover:text-white text-sm transition-colors">Contato</NuxtLink></li>
          </ul>
        </div>
      </div>

      <!-- Bottom section -->
      <div class="border-t border-gray-800 pt-8 mt-8">
        <div class="flex flex-col md:flex-row justify-between items-center">
          <p class="text-gray-400 text-sm mb-4 md:mb-0">
            © 2025 Auto URBAN. Todos os direitos reservados.
          </p>
          
          <div class="flex items-center space-x-6">
            <NuxtLink to="/termos" class="text-gray-400 hover:text-white text-sm transition-colors">
              Termos de Uso
            </NuxtLink>
            <NuxtLink to="/privacidade" class="text-gray-400 hover:text-white text-sm transition-colors">
              Privacidade
            </NuxtLink>
            
            <!-- Social links -->
            <div class="flex space-x-3 ml-6">
              <UButton
                variant="ghost"
                size="sm"
                icon="i-heroicons-phone"
                color="white"
                square
                @click="openWhatsApp"
              />
              <UButton
                variant="ghost"
                size="sm"
                icon="i-simple-icons-instagram"
                color="white"
                square
                @click="openInstagram"
              />
              <UButton
                variant="ghost"
                size="sm"
                icon="i-simple-icons-facebook"
                color="white"
                square
                @click="openFacebook"
              />
            </div>
          </div>
        </div>
      </div>
    </Container>
  </footer>
</template>

<script setup lang="ts">
// Social media methods
function openWhatsApp() {
  window.open('https://wa.me/5511999999999', '_blank')
}

function openInstagram() {
  window.open('https://instagram.com/autourban', '_blank')
}

function openFacebook() {
  window.open('https://facebook.com/autourban', '_blank')
}
</script>