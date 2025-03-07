<template>
    <div class="bg-black h-screen bg-[url(/imgs/background.jpg)] bg-no-repeat">
        <Header variant="dark" />
        <Container>
            <Row class="flex flex-col justify-center items-center min-h-[300px] px-6 text-center">
                <Typo as="h1" class="mb-8 lg:mb-4 text-white">Encontre o valor real do seu veículo!</Typo>
                <SearchEngine />
            </Row>
            <Row class="bg-white px-12 py-4">
                <Typo as="h2" class="mb-8">Últimas buscas</Typo>
                <hr>
                <div class="grid grid-cols-1 lg:grid-cols-4 gap-4 w-full">
                    <div v-for="(car, idx) in listLatestSearchCars" :key="idx" class="rounded-xl overflow-hidden bg-blue-600 flex flex-col hover:bg-blue-600/80 cursor-pointer">
                        <img :src="car.image" alt="Car" class="w-full">
                        <div class="p-4 text-white">
                            <Typo as="h3" class="mb-4">{{ car.name }}</Typo>
                            <Typo>A partir de : R${{ car.value }}</Typo>
                        </div>
                    </div>
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

const listLatestSearchCars = ref<{
    name: string,
    image: string,
    value: string,
    link: string
}[]>([
    {
        name: 'Honda Civic 2017/2018 - 1.5 16V TURBO GASOLINA TOURING 4P CVT',
        image: '/imgs/search-latest-example.jpg',
        value: 'R$ 100.000,00',
        link: 'https://www.google.com'
    },
    {
        name: 'Honda Civic 2017/2018 - 1.5 16V TURBO GASOLINA TOURING 4P CVT',
        image: '/imgs/search-latest-example.jpg',
        value: 'R$ 100.000,00',
        link: 'https://www.google.com'
    },
    {
        name: 'Honda Civic 2017/2018 - 1.5 16V TURBO GASOLINA TOURING 4P CVT',
        image: '/imgs/search-latest-example.jpg',
        value: 'R$ 100.000,00',
        link: 'https://www.google.com'
    },
    {
        name: 'Honda Civic 2017/2018 - 1.5 16V TURBO GASOLINA TOURING 4P CVT',
        image: '/imgs/search-latest-example.jpg',
        value: 'R$ 100.000,00',
        link: 'https://www.google.com'
    }
])
</script>