<template>
    <div class="bg-black h-screen bg-[url(/imgs/background.jpg)] bg-no-repeat">
        <Header variant="dark" />
        <Container>
            <Row class="flex-col justify-center items-center min-h-[300px] px-6 text-center">
                <Typo as="h1" class="mb-8 lg:mb-4 text-white">Encontre o valor real do seu veículo!</Typo>
                <SearchEngine />
            </Row>
            <Row class="flex-wrap bg-white px-12 py-4">
                <Typo as="h2" class="mb-8">Últimas buscas</Typo>
                <hr>
                <div class="grid grid-cols-1 lg:grid-cols-4 gap-4 w-full">
                    <router-link :to="`/valor-do-carro/${car.slug}`" v-for="(car, idx) in listLatestSearchCars" :key="idx" class="rounded-xl overflow-hidden bg-blue-600 flex flex-col hover:bg-blue-600/80 cursor-pointer">
                        <img :src="car.thumb" alt="Car" class="w-full">
                        <div class="p-4 text-white">
                            <Typo as="h3" class="mb-4">{{ car.name }}</Typo>
                            <Typo>Preço fipe: {{ new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(car.averageValue) }}</Typo>
                        </div>
                    </router-link>
                </div>
            </Row>
        </Container>
        <Footer />
    </div>
</template>
<script setup lang="ts">

definePageMeta({
    layout: false
})

const { data: listLatestSearchCars } = useAsyncData('cars-top-search', async () => await $fetch('/api/cars/top-search'))

</script>