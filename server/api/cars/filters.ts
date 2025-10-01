import { BrazilianState } from '~/schemas/vehicle'

export default defineEventHandler(async () => {
    // Mock data - em um cenário real, isso viria do banco de dados
    const brands = [
        'Audi',
        'BMW', 
        'Chevrolet',
        'Ford',
        'Honda',
        'Jaguar',
        'McLaren',
        'Mercedes-Benz',
        'Nissan',
        'Porsche',
        'Renault',
        'Subaru',
        'Toyota',
        'Volkswagen'
    ].sort()

    const models = [
        '570S',
        '911',
        'AMG C63 S',
        'Camaro SS',
        'Civic Type R',
        'F-Type R',
        'Golf GTI',
        'GT-R',
        'M2',
        'M3',
        'Mustang GT',
        'Polo GTS',
        'RS3',
        'Sandero RS',
        'Supra',
        'WRX STI'
    ].sort()

    const colors = [
        'Azul',
        'Branco',
        'Cinza',
        'Prata',
        'Preto',
        'Vermelho'
    ].sort()

    const states = [
        { value: 'AC', label: 'Acre' },
        { value: 'AL', label: 'Alagoas' },
        { value: 'AP', label: 'Amapá' },
        { value: 'AM', label: 'Amazonas' },
        { value: 'BA', label: 'Bahia' },
        { value: 'CE', label: 'Ceará' },
        { value: 'DF', label: 'Distrito Federal' },
        { value: 'ES', label: 'Espírito Santo' },
        { value: 'GO', label: 'Goiás' },
        { value: 'MA', label: 'Maranhão' },
        { value: 'MT', label: 'Mato Grosso' },
        { value: 'MS', label: 'Mato Grosso do Sul' },
        { value: 'MG', label: 'Minas Gerais' },
        { value: 'PA', label: 'Pará' },
        { value: 'PB', label: 'Paraíba' },
        { value: 'PR', label: 'Paraná' },
        { value: 'PE', label: 'Pernambuco' },
        { value: 'PI', label: 'Piauí' },
        { value: 'RJ', label: 'Rio de Janeiro' },
        { value: 'RN', label: 'Rio Grande do Norte' },
        { value: 'RS', label: 'Rio Grande do Sul' },
        { value: 'RO', label: 'Rondônia' },
        { value: 'RR', label: 'Roraima' },
        { value: 'SC', label: 'Santa Catarina' },
        { value: 'SP', label: 'São Paulo' },
        { value: 'SE', label: 'Sergipe' },
        { value: 'TO', label: 'Tocantins' }
    ]

    const sortOptions = [
        { value: 'recent', label: 'Mais recentes' },
        { value: 'price_asc', label: 'Menor preço' },
        { value: 'price_desc', label: 'Maior preço' },
        { value: 'year_desc', label: 'Mais novos' },
        { value: 'km_asc', label: 'Menor quilometragem' }
    ]

    // Anos disponíveis (últimos 25 anos)
    const currentYear = new Date().getFullYear()
    const years = Array.from({ length: 25 }, (_, i) => currentYear - i)

    return {
        brands,
        models,
        colors,
        states,
        years,
        sortOptions,
        priceRanges: [
            { value: '0-50000', label: 'Até R$ 50.000' },
            { value: '50000-100000', label: 'R$ 50.000 - R$ 100.000' },
            { value: '100000-200000', label: 'R$ 100.000 - R$ 200.000' },
            { value: '200000-500000', label: 'R$ 200.000 - R$ 500.000' },
            { value: '500000-1000000', label: 'R$ 500.000 - R$ 1.000.000' },
            { value: '1000000-999999999', label: 'Acima de R$ 1.000.000' }
        ],
        kmRanges: [
            { value: '0-10000', label: 'Até 10.000 km' },
            { value: '10000-30000', label: '10.000 - 30.000 km' },
            { value: '30000-50000', label: '30.000 - 50.000 km' },
            { value: '50000-100000', label: '50.000 - 100.000 km' },
            { value: '100000-999999999', label: 'Acima de 100.000 km' }
        ]
    }
})