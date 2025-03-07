<template>
    <div class="relative min-w-[350px] lg:min-w-[700px]">
        <div class="bg-white w-full p-4 rounded-full shadow-md flex justify-center items-center outline-4 outline-offset-2 relative z-10">
            <Icon name="uil:search" size="24px" class="me-4" />
            <input type="text" placeholder="Digite o veículo que você esta procurando..." class="w-full p-1 outline-none" v-model="search" />
        </div>
        <div class="bg-white rounded-xl shadow-md absolute top-[30px] w-full pt-12" v-if="searchListCars.length">
            <a :href="car.link" class="flex items-center p-6 hover:bg-black/10" v-for="(car, idx) in searchListCars" :key="car.name">
                <img :src="car.image" alt="Search Example" class="flex-none">
                <Typo as="h5" class="grow px-4">{{car.name}}</Typo>
                <Icon name="uil:external-link-alt" size="24px" class="flex-none" />
            </a>
        </div>
    </div>
</template>
<script setup lang="ts">
const listMock = [
    {
        name: 'Honda Civic 2017/2018 - 1.5 16V TURBO GASOLINA TOURING 4P CVT',
        image: '/imgs/search-example.jpg',
        link: 'https://www.google.com'
    },
    {
        name: 'Honda Civic 2017/2018 - 1.5 16V TURBO GASOLINA TOURING 4P CVT',
        image: '/imgs/search-example.jpg',
        link: 'https://www.google.com'
    },
    {
        name: 'Honda Civic 2017/2018 - 1.5 16V TURBO GASOLINA TOURING 4P CVT',
        image: '/imgs/search-example.jpg',
        link: 'https://www.google.com'
    }
]
const search = ref('')
const searchListCars = ref<{
    name: string,
    image: string,
    link: string
}[]>([])

watch(search, (value) => {
    if (value.length > 1) {
        searchListCars.value = listMock
    } else {
        searchListCars.value = []
    }
})
</script>