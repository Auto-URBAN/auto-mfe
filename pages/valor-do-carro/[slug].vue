<template>
    <UiContainer>
        <UiRow class="flex-col mb-8">
            <UiText as="h1" class="mb-4">{{carData?.name}}</UiText>
            <div class="flex flex-wrap justify-between">
                <div class="flex flex-row gap-4">
                    <span class="flex items-center gap-2"><Icon name="uil:external-link-alt" size="16px" /><UiText>5.0</UiText></span>
                    <span class="flex items-center gap-2"><Icon name="uil:external-link-alt" size="16px" /><UiText>Venda rápido</UiText></span>
                    <span class="flex items-center gap-2"><Icon name="uil:external-link-alt" size="16px" /><UiText>Brasil</UiText></span>
                </div>
                <div class="flex flex-row gap-4">
                    <span class="flex items-center gap-2"><Icon name="uil:external-link-alt" size="16px" /><UiText>Compartilhar</UiText></span>
                    <span class="flex items-center gap-2"><Icon name="uil:external-link-alt" size="16px" /><UiText>Salvar</UiText></span>
                </div>
            </div>
        </UiRow>
        <UiRow type="grid" class="grid-cols-12 gap-4">
            <div class="col-span-12 lg:col-span-9">
                <div class="h-[540px]">
                    <Chart type="line" 
                        :data="{
                            labels: labels,
                            datasets: datasets
                        }" 
                        :legend="true"
                        :options="{
                            responsive: true,
                            elements: {
                                line:{
                                    tension: 0.3
                                }
                            }
                        }" 
                    />
                </div>
                <div v-if="false">
                    <hr class="my-4">
                    <UiText as="h2" class="mb-4">Ficha Técnica</UiText>
                    <UiRow type="grid" class="grid-cols-4 gap-4 mb-4">
                        <div class="flex flex-row gap-4" v-for="spec in data.specsList">
                            <Icon :name="spec.icon" size="24px" />
                            <UiText as="p">{{spec.type}}: <b>{{spec.value}}</b></UiText>
                        </div>
                    </UiRow>
                </div>
                <div v-if="false">
                    <hr class="my-4">
                    <UiText as="h2" class="mb-4">Informações Urban</UiText>
                    <UiRow class="flex-col gap-4 mb-4">
                        <div class="flex flex-row gap-4" v-for="spec in data.specsList">
                            <div>
                                <Icon :name="spec.icon" size="24px" />
                            </div>
                            <div>
                                <UiText as="h6"><b>{{spec.type}}</b></UiText>
                                <UiText as="p">{{spec.value}}</UiText>
                            </div>
                        </div>
                    </UiRow>
                </div>
                <div v-if="false">
                    <hr class="my-4">
                    <UiText as="h2" class="mb-4">Equipamentos</UiText>
                    <UiRow type="grid" class="grid-cols-4 gap-4 mb-4">
                        <div class="flex flex-row gap-4" v-for="spec in data.specsList">
                            <Icon :name="spec.icon" size="24px" />
                            <UiText as="p">{{spec.type}}: <b>{{spec.value}}</b></UiText>
                        </div>
                    </UiRow>
                </div>
                <div v-if="false">
                    <hr class="my-4">
                    <UiText as="h2" class="mb-4">Valor médio de Manutenção</UiText>
                    <UiRow class="flex-col gap-4 mb-4">
                        <div class="flex flex-row gap-4" v-for="spec in data.specsList">
                            <Icon :name="spec.icon" size="24px" />
                            <UiText as="p">{{spec.type}}: <b>{{spec.value}}</b></UiText>
                        </div>
                    </UiRow>
                </div>
            </div>
            <div class="col-span-12 lg:col-span-3">
                <img :src="carData?.thumb" alt="" class="mb-4">
                <div class="sidebar flex flex-col justify-center items-center shadow-lg rounded-lg p-4 mb-6">
                    <UiText as="h4" class="mb-4">Média de preços atual</UiText>
                    <div class="flex flex-row justify-between w-full" v-for="item in carData?.partners">
                        <UiText as="p">{{item.name}}</UiText>
                        <UiText as="p">{{ new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item?.value || 0) }}</UiText>
                    </div>
                    <hr class="my-4">
                    <UiText as="p" class="mb-4">
                        Gostaria de simular um financiamento?
                    </UiText>
                    <UiButton type="button" class="w-full" variant="primary" @click="showFinancial = !showFinancial" v-if="!showFinancial">
                        Quero simular
                    </UiButton>
                    <SimuladorFinanciamento 
                        v-if="showFinancial"
                        class="w-full mt-4" 
                        :price="carData?.averageValue || 0"
                     />
                </div>
            </div>
        </UiRow>
    </UiContainer>
</template>

<script setup lang="ts">
const showFinancial = ref(false)

const { params } = useRoute()
const { slug } = params
const { data: carData } = useAsyncData('car-data', async () => await $fetch('/api/cars', {
    query: {
        slug: slug
    }
}))

const labels = computed(() => carData?.value?.prices.map((item: any) => {
    const date = new Date(item.referenceDate + 'T03:00:00')
    return `${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`
}).reverse() || [])

const datasets = computed(() => ([{
    label: 'R$',
    data: (carData?.value?.prices || []).map((item: any) => item.value),
    backgroundColor: 'rgba(255, 99, 132, 0.2)',
    borderColor: 'rgba(255, 99, 132, 1)',
    pointStyle: 'circle',
    pointRadius: 10,
    pointHoverRadius: 15,
}]))


const data = computed(() => ({
    specsList: [
        {
            type: 'Potência',
            value: '520cv',
            icon: 'uil:search'
        },
        {
            type: 'Torque',
            value: '53kgfm',
            icon: 'uil:search'
        },
        {
            type: 'Velocidade Máxima',
            value: '280km/h',
            icon: 'uil:search'
        },
        {
            type: '0-100km/h',
            value: '3.5s',
            icon: 'uil:search'
        },
        {
            type: 'Consumo Urbano',
            value: '5.0km/l',
            icon: 'uil:search'
        },
        {
            type: 'Consumo Rodoviário',
            value: '8.0km/l',
            icon: 'uil:search'
        }
    ]
}))
</script>