<template>
    <Container class="px-6 lg:p-0">
        <Row class="flex-col mb-8">
            <Typo as="h1" class="mb-4">{{carData?.name}}</Typo>
            <div class="flex flex-wrap justify-between">
                <div class="flex flex-row gap-4">
                    <span class="flex items-center gap-2"><Icon name="uil:external-link-alt" size="16px" /><Typo>5.0</Typo></span>
                    <span class="flex items-center gap-2"><Icon name="uil:external-link-alt" size="16px" /><Typo>Venda rápido</Typo></span>
                    <span class="flex items-center gap-2"><Icon name="uil:external-link-alt" size="16px" /><Typo>Brasil</Typo></span>
                </div>
                <div class="flex flex-row gap-4">
                    <span class="flex items-center gap-2"><Icon name="uil:external-link-alt" size="16px" /><Typo>Compartilhar</Typo></span>
                    <span class="flex items-center gap-2"><Icon name="uil:external-link-alt" size="16px" /><Typo>Salvar</Typo></span>
                </div>
            </div>
        </Row>
        <Row type="grid" class="grid-cols-12 gap-4">
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
                    <Typo as="h2" class="mb-4">Ficha Técnica</Typo>
                    <Row type="grid" class="grid-cols-4 gap-4 mb-4">
                        <div class="flex flex-row gap-4" v-for="spec in data.specsList">
                            <Icon :name="spec.icon" size="24px" />
                            <Typo as="p">{{spec.type}}: <b>{{spec.value}}</b></Typo>
                        </div>
                    </Row>
                </div>
                <div v-if="false">
                    <hr class="my-4">
                    <Typo as="h2" class="mb-4">Informações Urban</Typo>
                    <Row class="flex-col gap-4 mb-4">
                        <div class="flex flex-row gap-4" v-for="spec in data.specsList">
                            <div>
                                <Icon :name="spec.icon" size="24px" />
                            </div>
                            <div>
                                <Typo as="h6"><b>{{spec.type}}</b></Typo>
                                <Typo as="p">{{spec.value}}</Typo>
                            </div>
                        </div>
                    </Row>
                </div>
                <div v-if="false">
                    <hr class="my-4">
                    <Typo as="h2" class="mb-4">Equipamentos</Typo>
                    <Row type="grid" class="grid-cols-4 gap-4 mb-4">
                        <div class="flex flex-row gap-4" v-for="spec in data.specsList">
                            <Icon :name="spec.icon" size="24px" />
                            <Typo as="p">{{spec.type}}: <b>{{spec.value}}</b></Typo>
                        </div>
                    </Row>
                </div>
                <div v-if="false">
                    <hr class="my-4">
                    <Typo as="h2" class="mb-4">Valor médio de Manutenção</Typo>
                    <Row class="flex-col gap-4 mb-4">
                        <div class="flex flex-row gap-4" v-for="spec in data.specsList">
                            <Icon :name="spec.icon" size="24px" />
                            <Typo as="p">{{spec.type}}: <b>{{spec.value}}</b></Typo>
                        </div>
                    </Row>
                </div>
            </div>
            <div class="col-span-12 lg:col-span-3">
                <img :src="carData?.thumb" alt="" class="mb-4">
                <div class="sidebar flex flex-col justify-center items-center shadow-lg rounded-lg p-4 mb-6">
                    <Typo as="h4" class="mb-4">Média de preços atual</Typo>
                    <div class="flex flex-row justify-between w-full" v-for="item in carData?.partners">
                        <Typo as="p">{{item.name}}</Typo>
                        <Typo as="p">{{ new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item?.value || 0) }}</Typo>
                    </div>
                    <hr class="my-4">
                    <Typo as="p" class="mb-4">
                        Gostaria de simular um financiamento?
                    </Typo>
                    <Button type="button" class="w-full" variant="primary" @click="showFinancial = !showFinancial" v-if="!showFinancial">
                        Quero simular
                    </Button>
                    <SimuladorFinanciamento 
                        v-if="showFinancial"
                        class="w-full mt-4" 
                        :price="carData?.averageValue || 0"
                     />
                </div>
            </div>
        </Row>
    </Container>
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