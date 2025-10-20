<template>
  <section class="relative bg-white text-neutral-900 py-12">
    <UiContainer size="xl" padding="md">
      <UiText as="h2" size="3xl" weight="semibold" align="center" class="mb-3">
        Explore máquinas com alma
      </UiText>
      <UiText as="p" size="lg" weight="normal" align="center" class="max-w-2xl mx-auto mb-12 text-neutral-600">
        Selecionamos os modelos que marcaram gerações — dados reais, desempenho lendário e histórias únicas.
      </UiText>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <VehicleCard
          v-for="item in featuredVehicles"
          :key="item.id"
          :title="item.title"
          :href="`/carro/${item.id}`"
          :cover-image-url="item.coverImageUrl"
          :brand="item.brand"
          class="h-full transition-all duration-300 hover:shadow-xl"
        />
      </div>
    </UiContainer>
  </section>
</template>

<script setup lang="ts">
import type { SearchResult } from '@/schemas/vehicle'

const { data } = await useFetch<SearchResult>('/api/vehicles', {
  query: { featured: true, pageSize: 4 }
})
const featuredVehicles = data.value?.items || []
</script>
