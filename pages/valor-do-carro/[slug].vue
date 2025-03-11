<template>
    <Container class="px-6 lg:p-0">
        <Row class="flex justify-center mb-6">
            <div>
                <SearchEngine />
            </div>
        </Row>
        <Row class="flex-col mb-8">
            <Typo as="h1" class="mb-4">Audi RS3 2018/2018 - 2.5 TFSI GASOLINA SPORTBACK QUATTRO S-TRONIC</Typo>
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
                <div class="h-[300px]">
                    <Chart type="line" 
                    :data="{
                    labels: ['2019', '2020', '2021', '2022', '2023', '2024', '2025'],
                    datasets: [{
                        data: [125.000, 130.000, 135.000, 145.000, 137.000, 140.000, 130.000, 125.000],
                        backgroundColor: 'rgba(255, 99, 132, 0.2)',
                        borderColor: 'rgba(255, 99, 132, 1)',
                        borderWidth: 1,
                        fill: true
                    }]
                }" 
                :options="{
                    responsive: true,
                    elements: {
                        line:{
                            tension: 0.4
                        }
                    },
                    scales: {
                        y: {
                            display: true,
                            suggestedMin: 120.000,
                            suggestedMax: 160.000
                        }
                    }            
                }" 
                />
                </div>
                <hr class="my-4">
                <Typo as="h2" class="mb-4">Ficha Técnica</Typo>
                <Row type="grid" class="grid-cols-4 gap-4 mb-4">
                    <div class="flex flex-row gap-4" v-for="spec in data.specsList">
                        <Icon :name="spec.icon" size="24px" />
                        <Typo as="p">{{spec.type}}: <b>{{spec.value}}</b></Typo>
                    </div>
                </Row>
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
                <hr class="my-4">
                <Typo as="h2" class="mb-4">Equipamentos</Typo>
                <Row type="grid" class="grid-cols-4 gap-4 mb-4">
                    <div class="flex flex-row gap-4" v-for="spec in data.specsList">
                        <Icon :name="spec.icon" size="24px" />
                        <Typo as="p">{{spec.type}}: <b>{{spec.value}}</b></Typo>
                    </div>
                </Row>
                <hr class="my-4">
                <Typo as="h2" class="mb-4">Valor médio de Manutenção</Typo>
                <Row class="flex-col gap-4 mb-4">
                    <div class="flex flex-row gap-4" v-for="spec in data.specsList">
                        <Icon :name="spec.icon" size="24px" />
                        <Typo as="p">{{spec.type}}: <b>{{spec.value}}</b></Typo>
                    </div>
                </Row>
                <hr class="my-4">
            </div>
            <div class="col-span-12 lg:col-span-3">
                <div class="sidebar flex flex-col justify-center items-center shadow-lg rounded-lg p-4 mb-6">
                    <Typo as="h4" class="mb-4">Média de preços atual</Typo>
                    <div v-for="price in data.pricing" class="flex flex-row justify-between w-full">
                        <Typo as="p">{{price.name}}</Typo>
                        <Typo as="p">{{price.value}}</Typo>
                    </div>
                    <hr class="my-4">
                    <Typo as="p" class="mb-4">
                        Gostaria de simular um financiamento?
                    </Typo>
                    <Button type="button" class="w-full" variant="primary">
                        Simular
                    </Button>
                </div>
            </div>
        </Row>
    </Container>
</template>

<script setup lang="ts">
const data = ref<{
    specsList: {
        type: string
        value: string
        icon: string
    }[],
    pricing: {
        name: string
        value: string
    }[]
}>({
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
    ],
    pricing: [
        {
            name: 'Tabela fipe',
            value: 'R$ 250.000,00'
        },
        {
            name: 'Webmotors',
            value: 'R$ 250.000,00'
        },
        {
            name: 'Média de preços atual',
            value: 'R$ 250.000,00'
        }
    ]
})
</script>