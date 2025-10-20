<template>
    <section class="relative bg-white text-neutral-900 py-24">
          <UiContainer size="xl" padding="lg">
            <UiText as="h2" size="3xl" weight="semibold" align="center" class="mb-3">
              Explore máquinas com alma
            </UiText>
            <UiText as="p" size="lg" variant="muted" align="center" class="max-w-2xl mx-auto mb-12">
              Selecionamos os modelos que marcaram gerações — dados reais, desempenho lendário e histórias únicas.
            </UiText>

            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <VehicleCard
                  v-for="(item, index) in featuredVehicles"
                  :key="index"
                  :vehicle="item"
                  class="h-full transition-all duration-300 hover:shadow-xl"
                />
            </div>
          </UiContainer>
        </section>
</template>
<script setup lang="ts">
import type { VehicleSummary } from '@/schemas/vehicle'

const { data: featuredVehicles } = await useFetch<VehicleSummary[]>('/api/cars/filters-v2')
</script>
