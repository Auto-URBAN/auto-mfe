import { FiltersOptionsV2Schema, type FiltersOptionsV2 } from '~/schemas/filters'

export default defineEventHandler(async () => {
    // Dados estruturados com relacionamentos
    const brandsData = [
        {
            id: 'audi',
            name: 'Audi',
            logo: '/logos/audi.webp',
            models: ['A3', 'A4', 'A6', 'Q3', 'Q5', 'RS3', 'RS4', 'RS6'],
            years: [2018, 2019, 2020, 2021, 2022, 2023, 2024],
            count: 15
        },
        {
            id: 'bmw',
            name: 'BMW',
            logo: '/logos/bmw.webp',
            models: ['Serie 1', 'Serie 3', 'Serie 5', 'X1', 'X3', 'X5', 'M2', 'M3', 'M4', 'M5'],
            years: [2018, 2019, 2020, 2021, 2022, 2023, 2024],
            count: 25
        },
        {
            id: 'chevrolet',
            name: 'Chevrolet',
            logo: '/logos/chevrolet.webp',
            models: ['Onix', 'Prisma', 'Cruze', 'Equinox', 'Camaro', 'Corvette'],
            years: [2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
            count: 18
        },
        {
            id: 'ford',
            name: 'Ford',
            logo: '/logos/ford.webp',
            models: ['Ka', 'Fiesta', 'Focus', 'Fusion', 'EcoSport', 'Edge', 'Mustang', 'F-150'],
            years: [2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
            count: 22
        },
        {
            id: 'honda',
            name: 'Honda',
            logo: '/logos/honda.webp',
            models: ['Fit', 'City', 'Civic', 'Accord', 'CR-V', 'HR-V', 'Civic Type R'],
            years: [2018, 2019, 2020, 2021, 2022, 2023, 2024],
            count: 20
        },
        {
            id: 'hyundai',
            name: 'Hyundai',
            logo: '/logos/hyundai.webp',
            models: ['HB20', 'Creta', 'Tucson', 'Santa Fe', 'Azera', 'Veloster', 'i30'],
            years: [2018, 2019, 2020, 2021, 2022, 2023, 2024],
            count: 16
        },
        {
            id: 'mercedes',
            name: 'Mercedes',
            logo: '/logos/mercedes-benz.webp',
            models: ['Classe A', 'Classe C', 'Classe E', 'Classe S', 'GLA', 'GLC', 'GLE', 'AMG GT', 'AMG C63'],
            years: [2018, 2019, 2020, 2021, 2022, 2023, 2024],
            count: 19
        },
        {
            id: 'nissan',
            name: 'Nissan',
            logo: '/logos/nissan.webp',
            models: ['March', 'Versa', 'Sentra', 'Altima', 'Kicks', 'X-Trail', 'GT-R', '370Z'],
            years: [2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
            count: 14
        },
        {
            id: 'porsche',
            name: 'Porsche',
            logo: '/logos/porsche.webp',
            models: ['911', 'Boxster', 'Cayman', 'Panamera', 'Cayenne', 'Macan', 'Taycan'],
            years: [2018, 2019, 2020, 2021, 2022, 2023, 2024],
            count: 12
        },
        {
            id: 'renault',
            name: 'Renault',
            logo: '/logos/renault.webp',
            models: ['Kwid', 'Logan', 'Sandero', 'Duster', 'Captur', 'Koleos', 'Sandero RS'],
            years: [2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
            count: 13
        },
        {
            id: 'toyota',
            name: 'Toyota',
            logo: '/logos/toyota.webp',
            models: ['Etios', 'Yaris', 'Corolla', 'Camry', 'RAV4', 'Hilux', 'SW4', 'Prius', 'Supra'],
            years: [2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
            count: 24
        },
        {
            id: 'volkswagen',
            name: 'Volkswagen',
            logo: '/logos/volkswagen.webp',
            models: ['Gol', 'Polo', 'Virtus', 'T-Cross', 'Tiguan', 'Amarok', 'Golf', 'Golf GTI'],
            years: [2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
            count: 26
        }
    ]

    // Modelos com relacionamento de marca
    const modelsData = brandsData.flatMap(brand => 
        brand.models.map(model => ({
            id: `${brand.id}-${model.toLowerCase().replace(/\s+/g, '-')}`,
            name: model,
            brandId: brand.id,
            years: brand.years,
            count: Math.floor(Math.random() * 8) + 1
        }))
    )

    // Cores com hex reais
    const colorsData = [
        {
            id: 'preto',
            name: 'Preto',
            hex: '#1a1a1a',
            count: 45
        },
        {
            id: 'branco',
            name: 'Branco',
            hex: '#ffffff',
            count: 38
        },
        {
            id: 'prata',
            name: 'Prata',
            hex: '#c0c0c0',
            count: 32
        },
        {
            id: 'cinza',
            name: 'Cinza',
            hex: '#6b7280',
            count: 28
        },
        {
            id: 'azul',
            name: 'Azul',
            hex: '#1e40af',
            count: 22
        },
        {
            id: 'vermelho',
            name: 'Vermelho',
            hex: '#dc2626',
            count: 18
        },
        {
            id: 'verde',
            name: 'Verde',
            hex: '#16a34a',
            count: 12
        },
        {
            id: 'amarelo',
            name: 'Amarelo',
            hex: '#eab308',
            count: 8
        },
        {
            id: 'laranja',
            name: 'Laranja',
            hex: '#ea580c',
            count: 6
        },
        {
            id: 'roxo',
            name: 'Roxo',
            hex: '#9333ea',
            count: 4
        }
    ]

    // Estados brasileiros
    const statesData = [
        { id: 'SP', name: 'São Paulo', uf: 'SP', count: 89 },
        { id: 'RJ', name: 'Rio de Janeiro', uf: 'RJ', count: 67 },
        { id: 'MG', name: 'Minas Gerais', uf: 'MG', count: 54 },
        { id: 'PR', name: 'Paraná', uf: 'PR', count: 43 },
        { id: 'RS', name: 'Rio Grande do Sul', uf: 'RS', count: 38 },
        { id: 'SC', name: 'Santa Catarina', uf: 'SC', count: 29 },
        { id: 'BA', name: 'Bahia', uf: 'BA', count: 31 },
        { id: 'GO', name: 'Goiás', uf: 'GO', count: 25 },
        { id: 'PE', name: 'Pernambuco', uf: 'PE', count: 22 },
        { id: 'CE', name: 'Ceará', uf: 'CE', count: 19 }
    ]

    // Anos disponíveis
    const currentYear = new Date().getFullYear()
    const years = Array.from({ length: 15 }, (_, i) => currentYear - i)

    // Opções de ordenação
    const sortOptions = [
        { value: 'recent', label: 'Mais recentes' },
        { value: 'price_asc', label: 'Menor preço' },
        { value: 'price_desc', label: 'Maior preço' },
        { value: 'year_desc', label: 'Mais novos' },
        { value: 'km_asc', label: 'Menor quilometragem' },
        { value: 'brand_asc', label: 'Marca A-Z' }
    ]

    // Faixas de preço
    const priceRanges = [
        { value: '0-50000', label: 'Até R$ 50.000', min: 0, max: 50000 },
        { value: '50000-100000', label: 'R$ 50.000 - R$ 100.000', min: 50000, max: 100000 },
        { value: '100000-200000', label: 'R$ 100.000 - R$ 200.000', min: 100000, max: 200000 },
        { value: '200000-500000', label: 'R$ 200.000 - R$ 500.000', min: 200000, max: 500000 },
        { value: '500000-1000000', label: 'R$ 500.000 - R$ 1.000.000', min: 500000, max: 1000000 },
        { value: '1000000-999999999', label: 'Acima de R$ 1.000.000', min: 1000000, max: 999999999 }
    ]

    // Faixas de quilometragem
    const kmRanges = [
        { value: '0-10000', label: 'Até 10.000 km', min: 0, max: 10000 },
        { value: '10000-30000', label: '10.000 - 30.000 km', min: 10000, max: 30000 },
        { value: '30000-50000', label: '30.000 - 50.000 km', min: 30000, max: 50000 },
        { value: '50000-100000', label: '50.000 - 100.000 km', min: 50000, max: 100000 },
        { value: '100000-999999999', label: 'Acima de 100.000 km', min: 100000, max: 999999999 }
    ]

    const response: FiltersOptionsV2 = {
        brands: brandsData,
        models: modelsData,
        colors: colorsData,
        states: statesData,
        years,
        sortOptions,
        priceRanges,
        kmRanges
    }

    // Validação com Zod
    return FiltersOptionsV2Schema.parse(response)
})