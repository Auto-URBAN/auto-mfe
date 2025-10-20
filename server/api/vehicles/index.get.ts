import type { SearchResult, VehicleDetail } from '~/schemas/vehicle'

export default defineEventHandler(async (event): Promise<SearchResult | VehicleDetail> => {
  const query = getQuery(event)
  
  const id = query.id as string | undefined
  const page = parseInt(query.page as string || '1')
  const pageSize = parseInt(query.pageSize as string || '20')
  const featured = query.featured === 'true'
  const ranking = query.ranking as 'valorizados' | 'depreciados' | undefined

  const mockVehicles: VehicleDetail[] = [
    {
      id: 'vh001',
      title: 'Porsche 911 Turbo Cabriolet',
      brand: 'Porsche',
      model: '911',
      year: 2023,
      price: 1449000,
      km: 1725,
      horsepower: 650,
      city: 'Campo Grande',
      uf: 'MS',
      coverImageUrl: 'https://s3.sa-east-1.amazonaws.com/revista.mobiauto/Porsche/911+Turbo+S/Porsche-911-Turbo-S-Traseira.jpg',
      status: 'APPROVED',
      slug: 'porsche-911-turbo-2023',
      fipeCode: '001-1',
      description: 'Porsche 911 Turbo Cabriolet 2023 em estado impecável.',
      gearbox: 'AUTO',
      fuel: 'GASOLINA',
      color: 'Prata',
      images: [
        'https://s3.sa-east-1.amazonaws.com/revista.mobiauto/Porsche/911+Turbo+S/Porsche-911-Turbo-S-Traseira.jpg'
      ],
      averageValue: 1449000,
      minValue: 1400000,
      maxValue: 1500000,
      prices: [
        { month: '2024-01', value: 1400000 },
        { month: '2024-06', value: 1449000 }
      ],
      partners: [
        { name: 'Banco do Brasil', value: 1420000 },
        { name: 'Santander', value: 1450000 }
      ],
      seller: {
        id: 'seller_001',
        phone: '11987654321',
        whatsapp: '5511987654321'
      },
      createdAt: new Date('2025-09-25')
    },
    {
      id: 'vh002',
      title: 'BMW M3 Competition',
      brand: 'BMW',
      model: 'M3',
      year: 2022,
      price: 685000,
      km: 8500,
      horsepower: 510,
      city: 'São Paulo',
      uf: 'SP',
      coverImageUrl: 'https://s3.ecompletocarros.dev/images/lojas/108/veiculos/206897/veiculoInfoVeiculoImagesMobile/vehicle_image_1724358685_d41d8cd98f00b204e9800998ecf8427e.jpeg',
      status: 'APPROVED',
      slug: 'bmw-m3-competition-2022',
      fipeCode: '002-1',
      description: 'BMW M3 Competition 2022 único dono.',
      gearbox: 'AUTO',
      fuel: 'GASOLINA',
      color: 'Azul',
      images: [
        'https://s3.ecompletocarros.dev/images/lojas/108/veiculos/206897/veiculoInfoVeiculoImagesMobile/vehicle_image_1724358685_d41d8cd98f00b204e9800998ecf8427e.jpeg'
      ],
      averageValue: 685000,
      minValue: 650000,
      maxValue: 700000,
      prices: [
        { month: '2024-01', value: 650000 },
        { month: '2024-06', value: 685000 }
      ],
      partners: [
        { name: 'Itaú', value: 670000 },
        { name: 'Bradesco', value: 690000 }
      ],
      seller: {
        id: 'seller_002',
        phone: '11987654322',
        whatsapp: '5511987654322'
      },
      createdAt: new Date('2025-09-24')
    },
    {
      id: 'vh003',
      title: 'VW Golf GTI Performance',
      brand: 'Volkswagen',
      model: 'Golf GTI',
      year: 2024,
      price: 185000,
      km: 3200,
      horsepower: 245,
      city: 'Porto Alegre',
      uf: 'RS',
      coverImageUrl: 'https://revistacarro.com.br/wp-content/uploads/2024/09/Golf4-1173x768.jpg',
      status: 'APPROVED',
      slug: 'vw-golf-gti-2024',
      fipeCode: '003-1',
      description: 'VW Golf GTI Performance 2024 zero km.',
      gearbox: 'AUTO',
      fuel: 'GASOLINA',
      color: 'Vermelho',
      images: [
        'https://revistacarro.com.br/wp-content/uploads/2024/09/Golf4-1173x768.jpg'
      ],
      averageValue: 185000,
      minValue: 180000,
      maxValue: 190000,
      prices: [
        { month: '2024-01', value: 180000 },
        { month: '2024-06', value: 185000 }
      ],
      partners: [
        { name: 'Banco do Brasil', value: 182000 },
        { name: 'Caixa', value: 188000 }
      ],
      seller: {
        id: 'seller_003',
        phone: '11987654323',
        whatsapp: '5511987654323'
      },
      createdAt: new Date('2025-09-23')
    },
    {
      id: 'vh004',
      title: 'Nissan GT-R Premium',
      brand: 'Nissan',
      model: 'GT-R',
      year: 2020,
      price: 950000,
      km: 12500,
      horsepower: 565,
      city: 'Rio de Janeiro',
      uf: 'RJ',
      coverImageUrl: 'https://image.webmotors.com.br/_fotos/anunciousados/gigante/2025/202509/20250921/nissan-gtr-3-8-premium-v6-24v-biturbo-gasolina-2p-automatico-wmimagem23532117213.webp',
      status: 'APPROVED',
      slug: 'nissan-gt-r-2020',
      fipeCode: '004-1',
      description: 'Nissan GT-R Premium 2020 impecável.',
      gearbox: 'AUTO',
      fuel: 'GASOLINA',
      color: 'Preto',
      images: [
        'https://image.webmotors.com.br/_fotos/anunciousados/gigante/2025/202509/20250921/nissan-gtr-3-8-premium-v6-24v-biturbo-gasolina-2p-automatico-wmimagem23532117213.webp'
      ],
      averageValue: 950000,
      minValue: 920000,
      maxValue: 980000,
      prices: [
        { month: '2024-01', value: 920000 },
        { month: '2024-06', value: 950000 }
      ],
      partners: [
        { name: 'Santander', value: 935000 },
        { name: 'Itaú', value: 965000 }
      ],
      seller: {
        id: 'seller_004',
        phone: '11987654324',
        whatsapp: '5511987654324'
      },
      createdAt: new Date('2025-09-22')
    },
    {
      id: 'vh005',
      title: 'VW Polo GTS',
      brand: 'Volkswagen',
      model: 'Polo GTS',
      year: 2023,
      price: 98500,
      km: 5800,
      horsepower: 250,
      city: 'Curitiba',
      uf: 'PR',
      coverImageUrl: 'https://cdn.motor1.com/images/mgl/jl9zy6/s3/vw-polo-gts-250tsi-2024.jpg',
      status: 'APPROVED',
      slug: 'vw-polo-gts-2023',
      fipeCode: '005-1',
      description: 'VW Polo GTS 2023 revisado.',
      gearbox: 'AUTO',
      fuel: 'GASOLINA',
      color: 'Branco',
      images: [
        'https://cdn.motor1.com/images/mgl/jl9zy6/s3/vw-polo-gts-250tsi-2024.jpg'
      ],
      averageValue: 98500,
      minValue: 95000,
      maxValue: 102000,
      prices: [
        { month: '2024-01', value: 95000 },
        { month: '2024-06', value: 98500 }
      ],
      partners: [
        { name: 'Banco do Brasil', value: 96500 },
        { name: 'Bradesco', value: 100000 }
      ],
      seller: {
        id: 'seller_005',
        phone: '11987654325',
        whatsapp: '5511987654325'
      },
      createdAt: new Date('2025-09-26')
    },
    {
      id: 'vh006',
      title: 'BMW M2 Competition',
      brand: 'BMW',
      model: 'M2',
      year: 2021,
      price: 525000,
      km: 15000,
      horsepower: 410,
      city: 'Belo Horizonte',
      uf: 'MG',
      coverImageUrl: 'https://i.ytimg.com/vi/7AqMTC0C_XQ/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLDmGdWf9iTnO5E0Vpjpg5pP30hK1w',
      status: 'APPROVED',
      slug: 'bmw-m2-competition-2021',
      fipeCode: '006-1',
      description: 'BMW M2 Competition 2021.',
      gearbox: 'AUTO',
      fuel: 'GASOLINA',
      color: 'Cinza',
      images: [
        'https://i.ytimg.com/vi/7AqMTC0C_XQ/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLDmGdWf9iTnO5E0Vpjpg5pP30hK1w'
      ],
      averageValue: 525000,
      minValue: 510000,
      maxValue: 540000,
      prices: [
        { month: '2024-01', value: 510000 },
        { month: '2024-06', value: 525000 }
      ],
      partners: [
        { name: 'Santander', value: 515000 },
        { name: 'Itaú', value: 535000 }
      ],
      seller: {
        id: 'seller_006',
        phone: '11987654326',
        whatsapp: '5511987654326'
      },
      createdAt: new Date('2025-09-21')
    }
  ]

  if (id) {
    const vehicle = mockVehicles.find(v => v.id === id)
    if (!vehicle) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Vehicle not found'
      })
    }
    await new Promise(resolve => setTimeout(resolve, 300))
    return vehicle
  }

  let filteredVehicles = [...mockVehicles]

  if (query.brand) {
    filteredVehicles = filteredVehicles.filter(v => 
      v.brand.toLowerCase() === (query.brand as string).toLowerCase()
    )
  }

  if (query.model) {
    filteredVehicles = filteredVehicles.filter(v => 
      v.model.toLowerCase().includes((query.model as string).toLowerCase())
    )
  }

  if (featured) {
    filteredVehicles = filteredVehicles.slice(0, 4)
  }

  if (ranking === 'valorizados') {
    filteredVehicles = filteredVehicles.slice(0, 4)
  }

  if (ranking === 'depreciados') {
    filteredVehicles = filteredVehicles.slice(2, 6)
  }

  const start = (page - 1) * pageSize
  const end = start + pageSize
  const paginatedVehicles = filteredVehicles.slice(start, end)

  await new Promise(resolve => setTimeout(resolve, 150))

  return {
    items: paginatedVehicles,
    page,
    pageSize,
    total: filteredVehicles.length
  }
})
