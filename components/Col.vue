<template>
  <div :class="classes">
    <slot />
  </div>
</template>

<script setup lang="ts">
interface Props {
  // Grid column span
  span?: number | 'auto' | 'full'
  // Responsive spans
  sm?: number | 'auto' | 'full'
  md?: number | 'auto' | 'full'
  lg?: number | 'auto' | 'full'
  xl?: number | 'auto' | 'full'
  // Grid column start/end
  start?: number | 'auto'
  end?: number | 'auto'
  // Responsive start/end
  startSm?: number | 'auto'
  startMd?: number | 'auto'
  startLg?: number | 'auto'
  endSm?: number | 'auto'
  endMd?: number | 'auto'
  endLg?: number | 'auto'
  // Legacy props for backward compatibility
  mobile?: number
  desktop?: number
}

const props = defineProps<Props>()

// Computed classes
const classes = computed(() => {
  const base = []

  // Main span (default)
  if (props.span) {
    if (props.span === 'auto') {
      base.push('col-auto')
    } else if (props.span === 'full') {
      base.push('col-span-full')
    } else {
      base.push(`col-span-${props.span}`)
    }
  }
  
  // Legacy desktop prop (maps to default)
  if (props.desktop && !props.span) {
    base.push(`col-span-${props.desktop}`)
  }

  // Responsive spans
  if (props.sm) {
    if (props.sm === 'auto') {
      base.push('sm:col-auto')
    } else if (props.sm === 'full') {
      base.push('sm:col-span-full')
    } else {
      base.push(`sm:col-span-${props.sm}`)
    }
  }
  
  // Legacy mobile prop (maps to sm)
  if (props.mobile && !props.sm) {
    base.push(`sm:col-span-${props.mobile}`)
  }

  if (props.md) {
    if (props.md === 'auto') {
      base.push('md:col-auto')
    } else if (props.md === 'full') {
      base.push('md:col-span-full')
    } else {
      base.push(`md:col-span-${props.md}`)
    }
  }

  if (props.lg) {
    if (props.lg === 'auto') {
      base.push('lg:col-auto')
    } else if (props.lg === 'full') {
      base.push('lg:col-span-full')
    } else {
      base.push(`lg:col-span-${props.lg}`)
    }
  }

  if (props.xl) {
    if (props.xl === 'auto') {
      base.push('xl:col-auto')
    } else if (props.xl === 'full') {
      base.push('xl:col-span-full')
    } else {
      base.push(`xl:col-span-${props.xl}`)
    }
  }

  // Column start positions
  if (props.start) {
    if (props.start === 'auto') {
      base.push('col-start-auto')
    } else {
      base.push(`col-start-${props.start}`)
    }
  }

  // Responsive starts
  if (props.startSm) base.push(props.startSm === 'auto' ? 'sm:col-start-auto' : `sm:col-start-${props.startSm}`)
  if (props.startMd) base.push(props.startMd === 'auto' ? 'md:col-start-auto' : `md:col-start-${props.startMd}`)
  if (props.startLg) base.push(props.startLg === 'auto' ? 'lg:col-start-auto' : `lg:col-start-${props.startLg}`)

  // Column end positions
  if (props.end) {
    if (props.end === 'auto') {
      base.push('col-end-auto')
    } else {
      base.push(`col-end-${props.end}`)
    }
  }

  // Responsive ends
  if (props.endSm) base.push(props.endSm === 'auto' ? 'sm:col-end-auto' : `sm:col-end-${props.endSm}`)
  if (props.endMd) base.push(props.endMd === 'auto' ? 'md:col-end-auto' : `md:col-end-${props.endMd}`)
  if (props.endLg) base.push(props.endLg === 'auto' ? 'lg:col-end-auto' : `lg:col-end-${props.endLg}`)

  return base.join(' ')
})
</script>