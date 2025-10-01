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
            coverImageUrl: 'https://revistacarro.com.br/wp-content/uploads/2024/09/Golf4-1173x768.jpg',
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
            coverImageUrl: 'https://image.webmotors.com.br/_fotos/anunciousados/gigante/2025/202509/20250921/nissan-gtr-3-8-premium-v6-24v-biturbo-gasolina-2p-automatico-wmimagem23532117213.webp',
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
            coverImageUrl: 'https://cdn.motor1.com/images/mgl/jl9zy6/s3/vw-polo-gts-250tsi-2024.jpg',
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
            coverImageUrl: 'https://i.ytimg.com/vi/7AqMTC0C_XQ/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLDmGdWf9iTnO5E0Vpjpg5pP30hK1w',
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
            coverImageUrl: 'https://s3.ecompletocarros.dev/images/lojas/108/veiculos/85187/veiculoInfoVeiculoImagesMobile/vehicle_image_1639770375_d41d8cd98f00b204e9800998ecf8427e.jpeg',
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
            coverImageUrl: 'https://editorial.pxcrush.net/carsales/general/editorial/2019-mercedes-c63-sandown-034.jpg?width=1024&height=682',
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
            coverImageUrl: 'https://media.autoexpress.co.uk/image/private/s--X-WVjvBW--/f_auto,t_content-image-full-desktop@1/v1669306751/autoexpress/2022/11/Audi%20RS%203%20Sportback%20Performance%20Edition.jpg',
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
            coverImageUrl: 'https://cdn.jdpower.com/JDPA_2020%20Ford%20Mustang%20Bullitt%20Green%20Front%20View.jpg',
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
            coverImageUrl: 'https://www.autocerto.com/fotos/5451/3444492/1.jpg',
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
            coverImageUrl: 'https://blog.consumerguide.com/wp-content/uploads/sites/2/2021/05/20200605_182030-1110x577.jpg',
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
            coverImageUrl: 'https://hips.hearstapps.com/hmg-prod/images/103-2020-honda-civic-type-r-140-1590038142.jpg?crop=0.637xw:0.538xh;0.0684xw,0.438xh&resize=2048:*',
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
            coverImageUrl: 'https://media.ed.edmunds-media.com/subaru/sti-s209/2019/oem/2019_subaru_sti-s209_sedan_base_fq_oem_1_1600.jpg',
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
            coverImageUrl: 'https://img.olx.com.br/thumbs700x500/81/812582325150563.webp',
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
            coverImageUrl: 'https://quatrorodas.abril.com.br/wp-content/uploads/2017/10/20171009_1150211.jpg?quality=70&strip=info&w=720&crop=1',
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
    
    // Model filter
    if (query.model) {
        filteredVehicles = filteredVehicles.filter(vehicle => 
            vehicle.model.toLowerCase().includes((query.model as string).toLowerCase())
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

    // KM range filters
    if (query.kmMin) {
        const kmMin = parseInt(query.kmMin as string)
        filteredVehicles = filteredVehicles.filter(vehicle => 
            vehicle.km >= kmMin
        )
    }
    
    if (query.kmMax) {
        const kmMax = parseInt(query.kmMax as string)
        filteredVehicles = filteredVehicles.filter(vehicle => 
            vehicle.km <= kmMax
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