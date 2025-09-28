import { BrazilianState, VehicleStatus } from '~/schemas/vehicle'

export default defineEventHandler(async (event) => {
    const query = getQuery(event)
    
    const page = parseInt(query.page as string || '1')
    const pageSize = parseInt(query.pageSize as string || '20')
    
    // Mock data com carros premium esportivos para melhor alinhamento com a proposta da plataforma
    const mockVehicles = [
        {
            id: 'vh001',
            title: 'Porsche 911 Turbo Cabriolet 2023',
            brand: 'Porsche',
            model: '911',
            year: 2023,
            price: 1449000,
            km: 1725,
            city: 'Campo Grande',
            uf: 'MS' as const,
            coverImageUrl: 'https://s3.sa-east-1.amazonaws.com/revista.mobiauto/Porsche/911+Turbo+S/Porsche-911-Turbo-S-Traseira.jpg',
            status: 'APPROVED' as const,
            createdAt: new Date('2025-09-25')
        },
        {
            id: 'vh002', 
            title: 'BMW M3 Competition 2022',
            brand: 'BMW',
            model: 'M3',
            year: 2022,
            price: 685000,
            km: 8500,
            city: 'São Paulo',
            uf: 'SP' as const,
            coverImageUrl: 'https://s3.ecompletocarros.dev/images/lojas/108/veiculos/206897/veiculoInfoVeiculoImagesMobile/vehicle_image_1724358685_d41d8cd98f00b204e9800998ecf8427e.jpeg',
            status: 'APPROVED' as const,
            createdAt: new Date('2025-09-24')
        },
        {
            id: 'vh003',
            title: 'VW Golf GTI Performance 2024',
            brand: 'Volkswagen',
            model: 'Golf GTI',
            year: 2024,
            price: 185000,
            km: 3200,
            city: 'Porto Alegre',
            uf: 'RS' as const,
            coverImageUrl: 'https://cdn.motor1.com/images/mgl/0eeNl/s1/2022-volkswagen-golf-gti.jpg',
            status: 'APPROVED' as const,
            createdAt: new Date('2025-09-23')
        },
        {
            id: 'vh004',
            title: 'Nissan GT-R Premium 2020',
            brand: 'Nissan',
            model: 'GT-R',
            year: 2020,
            price: 950000,
            km: 12500,
            city: 'Rio de Janeiro',
            uf: 'RJ' as const,
            coverImageUrl: 'https://www.nissan-cdn.net/content/dam/Nissan/nissan_middle_east/vehicles/gt-r/product_code/product_version/overview/gtrnissan-gtr-2020-overview-gallery-06.jpg.ximg.l_12_m.smart.jpg',
            status: 'APPROVED' as const,
            createdAt: new Date('2025-09-22')
        },
        {
            id: 'vh005',
            title: 'VW Polo GTS 2023',
            brand: 'Volkswagen',
            model: 'Polo GTS',
            year: 2023,
            price: 98500,
            km: 5800,
            city: 'Curitiba',
            uf: 'PR' as const,
            coverImageUrl: 'https://cdn.motor1.com/images/mgl/QkkPK/s1/volkswagen-polo-gts-2018-fotos.jpg',
            status: 'APPROVED' as const,
            createdAt: new Date('2025-09-26')
        },
        {
            id: 'vh006',
            title: 'BMW M2 Competition 2021',
            brand: 'BMW',
            model: 'M2',
            year: 2021,
            price: 525000,
            km: 15000,
            city: 'Belo Horizonte',
            uf: 'MG' as const,
            coverImageUrl: 'https://www.bmw.com/content/dam/bmw/common/all-models/m-series/m2-coupe/2022/highlights/bmw-m2-coupe-ms-022.jpg',
            status: 'APPROVED' as const,
            createdAt: new Date('2025-09-21')
        },
        {
            id: 'vh007',
            title: 'Renault Sandero RS 2.0 2021',
            brand: 'Renault',
            model: 'Sandero RS',
            year: 2021,
            price: 85000,
            km: 22000,
            city: 'Brasília',
            uf: 'DF' as const,
            coverImageUrl: 'https://www.renault.com.br/content/dam/renault/br/vehicles/sandero-rs/hero-image/renault-sandero-rs-2021-hero.jpg',
            status: 'APPROVED' as const,
            createdAt: new Date('2025-09-27')
        },
        {
            id: 'vh008',
            title: 'Mercedes-AMG C63 S 2019',
            brand: 'Mercedes-Benz',
            model: 'AMG C63 S',
            year: 2019,
            price: 450000,
            km: 28500,
            city: 'Salvador',
            uf: 'BA' as const,
            coverImageUrl: 'https://www.mercedes-benz.com/content/dam/mb-com/global/current-cars/cars/c-class/c-class-sedan/amg/c-63-s/1920x1080-MB-AMG-C63-S.jpg',
            status: 'APPROVED' as const,
            createdAt: new Date('2025-09-20')
        },
        {
            id: 'vh009',
            title: 'Audi RS3 Sportback 2022',
            brand: 'Audi',
            model: 'RS3',
            year: 2022,
            price: 450000,
            km: 8200,
            city: 'Fortaleza',
            uf: 'CE' as const,
            coverImageUrl: 'https://www.audi.com/content/dam/gbp2/models/rs3/rs3-sportback/my-2022/1920x1080-audi-rs3-sportback-2022.jpg',
            status: 'APPROVED' as const,
            createdAt: new Date('2025-09-19')
        },
        {
            id: 'vh010',
            title: 'Ford Mustang GT 5.0 2020',
            brand: 'Ford',
            model: 'Mustang GT',
            year: 2020,
            price: 380000,
            km: 18500,
            city: 'Recife',
            uf: 'PE' as const,
            coverImageUrl: 'https://www.ford.com/content/dam/vdm_ford/live/en_us/ford/nameplate/mustang/2022/collections/3-2/22_FRD_MST_GT_RPP_19.jpg',
            status: 'APPROVED' as const,
            createdAt: new Date('2025-09-18')
        },
        {
            id: 'vh011',
            title: 'Chevrolet Camaro SS 6.2 V8 2019',
            brand: 'Chevrolet',
            model: 'Camaro SS',
            year: 2019,
            price: 320000,
            km: 25000,
            city: 'Goiânia',
            uf: 'GO' as const,
            coverImageUrl: 'https://image.webmotors.com.br/_fotos/anunciousados/gigante/2019/201908/20190815/chevrolet-camaro-6.2-v8-gasolina-ss-automatico-wmimagem08765432109.jpg',
            status: 'APPROVED' as const,
            createdAt: new Date('2025-09-17')
        },
        {
            id: 'vh012',
            title: 'Toyota Supra 3.0 2021',
            brand: 'Toyota',
            model: 'Supra',
            year: 2021,
            price: 420000,
            km: 9800,
            city: 'Florianópolis',
            uf: 'SC' as const,
            coverImageUrl: 'https://image.webmotors.com.br/_fotos/anunciousados/gigante/2021/202104/20210410/toyota-supra-3.0-24v-i6-gasolina-automatico-wmimagem10123456789.jpg',
            status: 'APPROVED' as const,
            createdAt: new Date('2025-09-16')
        },
        {
            id: 'vh013',
            title: 'Honda Civic Type R 2020',
            brand: 'Honda',
            model: 'Civic Type R',
            year: 2020,
            price: 295000,
            km: 12800,
            city: 'Belém',
            uf: 'PA' as const,
            coverImageUrl: 'https://image.webmotors.com.br/_fotos/anunciousados/gigante/2020/202003/20200315/honda-civic-2.0-vtec-turbo-gasolina-type-r-manual-wmimagem09234567891.jpg',
            status: 'APPROVED' as const,
            createdAt: new Date('2025-09-15')
        },
        {
            id: 'vh014',
            title: 'Subaru WRX STI 2019',
            brand: 'Subaru',
            model: 'WRX STI',
            year: 2019,
            price: 195000,
            km: 35000,
            city: 'João Pessoa',
            uf: 'PB' as const,
            coverImageUrl: 'https://image.webmotors.com.br/_fotos/anunciousados/gigante/2019/201907/20190720/subaru-impreza-2.5-wrx-sti-4x4-16v-turbo-gasolina-4p-manual-wmimagem08345678912.jpg',
            status: 'APPROVED' as const,
            createdAt: new Date('2025-09-14')
        },
        {
            id: 'vh015',
            title: 'Jaguar F-Type R 5.0 V8 2020',
            brand: 'Jaguar',
            model: 'F-Type R',
            year: 2020,
            price: 650000,
            km: 15200,
            city: 'Natal',
            uf: 'RN' as const,
            coverImageUrl: 'https://image.webmotors.com.br/_fotos/anunciousados/gigante/2020/202009/20200925/jaguar-f-type-5.0-v8-gasolina-r-automatico-wmimagem09456789123.jpg',
            status: 'APPROVED' as const,
            createdAt: new Date('2025-09-13')
        },
        {
            id: 'vh016',
            title: 'McLaren 570S 3.8 V8 2018',
            brand: 'McLaren',
            model: '570S',
            year: 2018,
            price: 1250000,
            km: 8900,
            city: 'Manaus',
            uf: 'AM' as const,
            coverImageUrl: 'https://image.webmotors.com.br/_fotos/anunciousados/gigante/2018/201806/20180615/mclaren-570s-3.8-v8-gasolina-automatico-wmimagem07567890234.jpg',
            status: 'APPROVED' as const,
            createdAt: new Date('2025-09-12')
        }
    ]
    
    // Basic filtering
    let filteredVehicles = mockVehicles
    
    // Text search
    if (query.q) {
        const searchTerm = (query.q as string).toLowerCase()
        filteredVehicles = filteredVehicles.filter(vehicle => 
            vehicle.title.toLowerCase().includes(searchTerm) ||
            vehicle.brand.toLowerCase().includes(searchTerm) ||
            vehicle.model.toLowerCase().includes(searchTerm)
        )
    }
    
    // Brand filter
    if (query.make) {
        filteredVehicles = filteredVehicles.filter(vehicle => 
            vehicle.brand.toLowerCase() === (query.make as string).toLowerCase()
        )
    }
    
    // State filter
    if (query.uf) {
        filteredVehicles = filteredVehicles.filter(vehicle => 
            vehicle.uf === query.uf
        )
    }
    
    // Price range filters
    if (query.priceMin) {
        const priceMin = parseInt(query.priceMin as string)
        filteredVehicles = filteredVehicles.filter(vehicle => 
            vehicle.price >= priceMin
        )
    }
    
    if (query.priceMax) {
        const priceMax = parseInt(query.priceMax as string)
        filteredVehicles = filteredVehicles.filter(vehicle => 
            vehicle.price <= priceMax
        )
    }
    
    // Year range filters
    if (query.yearMin) {
        const yearMin = parseInt(query.yearMin as string)
        filteredVehicles = filteredVehicles.filter(vehicle => 
            vehicle.year >= yearMin
        )
    }
    
    if (query.yearMax) {
        const yearMax = parseInt(query.yearMax as string)
        filteredVehicles = filteredVehicles.filter(vehicle => 
            vehicle.year <= yearMax
        )
    }
    
    // Sorting
    const sort = query.sort as string || 'recent'
    switch (sort) {
        case 'price_asc':
            filteredVehicles.sort((a, b) => a.price - b.price)
            break
        case 'price_desc':
            filteredVehicles.sort((a, b) => b.price - a.price)
            break
        case 'year_desc':
            filteredVehicles.sort((a, b) => b.year - a.year)
            break
        case 'km_asc':
            filteredVehicles.sort((a, b) => a.km - b.km)
            break
        case 'recent':
        default:
            filteredVehicles.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
            break
    }
    
    // Pagination
    const total = filteredVehicles.length
    const startIndex = (page - 1) * pageSize
    const items = filteredVehicles.slice(startIndex, startIndex + pageSize)
    
    await new Promise(resolve => setTimeout(resolve, 200))
    
    return {
        items,
        page,
        pageSize,
        total
    }
})