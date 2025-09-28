<template>
  <div>
    <Header />
    <main class="py-6">
      <UiContainer>
        <slot />
      </UiContainer>
    </main>
    <Footer />
  </div>
</template>

<script setup lang="ts">
const auth = useAuth()
</script>