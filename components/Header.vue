<template>
    <div>
        <Container class="px-6 lg:px-0">
            <Row class="grid grid-cols-12 py-4">
                <div class="col-span-3 cursor-pointer" @click="$router.push('/')">
                    <img src="/imgs/Logo.svg" alt="Logo" v-if="variant === 'dark'" />
                    <img src="/imgs/Logo-dark.svg" alt="Logo" v-else />
                </div>
                <div class="col-span-6">
                    <SearchEngine v-if="showSearch" />
                </div>
                <div class="col-span-3"></div>
            </Row>
        </Container>
    </div>
</template>
<script setup lang="ts">
const props = defineProps<{
    variant?: 'light' | 'dark' | 'transparent',
    showSearch?: boolean
}>()
</script>