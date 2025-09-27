<template>
  <UiBadge
    :variant="badgeVariant"
    :color="badgeColor"
    size="xs"
  >
    {{ badgeLabel }}
  </UiBadge>
</template>

<script setup lang="ts">
import type { VehicleStatus } from '~/schemas/vehicle'

interface Props {
  status: VehicleStatus
}

const props = defineProps<Props>()

// Computed
const badgeConfig = computed(() => {
  const configs = {
    'PENDING': {
      color: 'yellow' as const,
      variant: 'solid' as const,
      label: 'Pendente'
    },
    'APPROVED': {
      color: 'green' as const,
      variant: 'solid' as const,
      label: 'Aprovado'
    },
    'REJECTED': {
      color: 'red' as const,
      variant: 'solid' as const,
      label: 'Rejeitado'
    }
  }

  return configs[props.status] || configs.PENDING
})

const badgeColor = computed(() => badgeConfig.value.color)
const badgeVariant = computed(() => badgeConfig.value.variant)
const badgeLabel = computed(() => badgeConfig.value.label)
</script>