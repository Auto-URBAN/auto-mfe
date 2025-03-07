<template>
    <Container>
        <Row class="flex justify-center mb-6">
            <div>
                <SearchEngine />
            </div>
        </Row>
        <Row class="flex-col">
            <Typo as="h1">Audi RS3 2018/2018 - 2.5 TFSI GASOLINA SPORTBACK QUATTRO S-TRONIC</Typo>
            <div class="flex flex-wrap justify-between">
                <div class="flex flex-row gap-4">
                    <span><Icon name="uil:external-link-alt" size="16px" /><Typo>5.0</Typo></span>
                    <span><Icon name="uil:external-link-alt" size="16px" /><Typo>Venda rápido</Typo></span>
                    <span><Icon name="uil:external-link-alt" size="16px" /><Typo>Brasil</Typo></span>
                </div>
                <div class="flex flex-row gap-4">
                    <span><Icon name="uil:external-link-alt" size="16px" /><Typo>Compartilhar</Typo></span>
                    <span><Icon name="uil:external-link-alt" size="16px" /><Typo>Salvar</Typo></span>
                </div>
            </div>
        </Row>
        <Row type="grid" class="grid-cols-12">
            <Col :desktop="8">
                <VChart :option="option" />
                Apiurl: {{ apiUrl }}
            </Col>
            <Col :desktop="4">
                sidebar
            </Col>
        </Row>
    </Container>
</template>

<script setup lang="ts">

const {apiUrl} = useRuntimeConfig()

const option = ref<any>({
  dataset: {
    dimensions: ['Product', '2015', '2016', '2017'],
    source: [
      {
        Product: 'Matcha Latte',
        2015: 54,
        2016: 42,
        2017: 23,
      },
    ],
  },
  xAxis: { type: 'category' },
  yAxis: {},
  series: [{ type: 'bar' }],
})
</script>