<template>
    <div class="relative min-w-[350px] lg:min-w-[700px]">
        <div class="bg-white w-full py-2 px-4 rounded-full shadow-lg border flex justify-center items-center outline-4 outline-offset-2 relative z-10">
            <Icon name="uil:search" size="24px" class="me-4 text-gray-500 dark:text-gray-400" />
            <input 
              type="text" 
              placeholder="Busca inteligente de carros" 
              class="w-full p-1 outline-none text-gray-900   bg-transparent" 
              v-model="search" 
            />
        </div>
        <div class="bg-white border rounded-xl shadow-xl absolute top-[30px] w-full pt-12" v-if="searchListCars.length">
            <router-link 
              :to="`/valor-do-carro/${car.slug}`" 
              class="flex items-center p-4 text-gray-900  hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors" 
              v-for="(car, idx) in searchListCars" 
              :key="car.name"
            >
                <img :src="car.image" alt="Search Example" class="flex-none">
                <UiText as="h5" class="grow px-4">{{car.name}}</UiText>
                <Icon name="uil:external-link-alt" size="24px" class="flex-none text-gray-500 dark:text-gray-400" />
            </router-link>
        </div>
    </div>
</template>
<script setup lang="ts">
const listMock = [
    {
        name: 'Honda Civic 2017/2018 - 1.5 16V TURBO GASOLINA TOURING 4P CVT',
        image: '/imgs/search-example.jpg',
        slug: 'honda-civic-2017-2018-1-5-16v-turbo-gasolina-touring-4p-cvt'
    },
    {
        name: 'Honda Civic 2017/2018 - 1.5 16V TURBO GASOLINA TOURING 4P CVT',
        image: '/imgs/search-example.jpg',
        slug: 'honda-civic-2017-2018-1-5-16v-turbo-gasolina-touring-4p-cvt'
    },
    {
        name: 'Honda Civic 2017/2018 - 1.5 16V TURBO GASOLINA TOURING 4P CVT',
        image: '/imgs/search-example.jpg',
        slug: 'honda-civic-2017-2018-1-5-16v-turbo-gasolina-touring-4p-cvt'
    }
]
const search = ref('')
const searchListCars = ref<{
    name: string,
    image: string,
    slug: string
}[]>([])

watch(search, (value) => {
    if (value.length > 1) {
        searchListCars.value = listMock
    } else {
        searchListCars.value = []
    }
})
</script>