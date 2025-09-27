<template>
  <div>
    <Header />
    <main>
      <UiContainer size="lg" padding="md">
        <slot />
      </UiContainer>
    </main>
    <Footer />
  </div>
</template>

<script setup lang="ts">
const auth = useAuth()
</script>