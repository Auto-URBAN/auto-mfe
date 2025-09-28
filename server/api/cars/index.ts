import type { Car } from '@/schemas/car'

export default defineEventHandler(async (event): Promise<Car> => {
    const slug = getQuery(event).slug
    
    if (!slug) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Bad Request',
            message: 'Slug is required'
        })
    }
    
    // Extract car info from slug for mock
    const slugStr = slug as string
    const carId = Math.abs(slugStr.split('').reduce((a, b) => {
        a = ((a << 5) - a) + b.charCodeAt(0)
        return a & a
    }, 0)) % 1000 + 1
    
    // Premium sports car data mapping
    const premiumCarData = {
        'porsche-911': { brand: 'Porsche', model: '911', basePrice: 1400000, thumb: 'https://s3.sa-east-1.amazonaws.com/revista.mobiauto/Porsche/911+Turbo+S/Porsche-911-Turbo-S-Traseira.jpg' },
        'bmw-m3': { brand: 'BMW', model: 'M3', basePrice: 680000, thumb: 'https://s3.ecompletocarros.dev/images/lojas/108/veiculos/206897/veiculoInfoVeiculoImagesMobile/vehicle_image_1724358685_d41d8cd98f00b204e9800998ecf8427e.jpeg' },
        'bmw-m2': { brand: 'BMW', model: 'M2', basePrice: 520000, thumb: 'https://image.webmotors.com.br/_fotos/anunciousados/gigante/2025/202507/20250718/bmw-m2-3.0-i6-twinturbo-gasolina-coupe-m-steptronic-wmimagem15234356261.jpg' },
        'volkswagen-golf-gti': { brand: 'Volkswagen', model: 'Golf GTI', basePrice: 180000, thumb: 'https://cdn.motor1.com/images/mgl/40KWAA/s1/vw-golf-gti-clubsport-2024.jpg' },
        'volkswagen-polo-gts': { brand: 'Volkswagen', model: 'Polo GTS', basePrice: 95000, thumb: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgjkZwZZnZ0OJZmcTiREAytERFUXlLPMgm1-a6WfWJ-wDvfRRu6pL4-CTYQaoqy-8GyP6yHQF4VcpN3SRNzoGDSnezFBe8HPUqcF9Bdhf7gGMwfp3AT5bS30vFxIQKYFjvO1bjpnbDYCtDXN8YmKka_0aagiJiEzPu2k8t7753taSIZCCynovTtBgEH7BM/s1280/volkswagen-polo-gts-01.jpg' },
        'nissan-gt-r': { brand: 'Nissan', model: 'GT-R', basePrice: 950000, thumb: 'https://bringatrailer.com/wp-content/uploads/2022/09/2020_nissan_gt-r_f8e4ca0c-0d74-4a1e-b272-74c158057b14-73286.jpeg?fit=940%2C627' },
        'mercedes-amg-c63': { brand: 'Mercedes-Benz', model: 'AMG C63 S', basePrice: 450000, thumb: 'https://www.cnet.com/a/img/resize/1f48abe6116fb1467ca90b0585de44205b1e4f38/hub/2018/07/23/54caf845-a70d-47d5-bfb9-1a7a6a873dcc/010-2019-mercedes-amg-c63-coupe.jpg?auto=webp&width=1200' },
        'renault-sandero-rs': { brand: 'Renault', model: 'Sandero RS', basePrice: 85000, thumb: 'https://s3.ecompletocarros.dev/images/lojas/558/veiculos/218494/veiculoInfoVeiculoImagesMobile/vehicle_image_1735271875_d41d8cd98f00b204e9800998ecf8427e.jpeg' },
        'honda-civic-type-r': { brand: 'Honda', model: 'Civic Type R', basePrice: 295000, thumb: 'https://image.webmotors.com.br/_fotos/anunciousados/gigante/2020/202003/20200315/honda-civic-2.0-vtec-turbo-gasolina-type-r-manual-wmimagem09234567891.jpg' },
        'ford-mustang-gt': { brand: 'Ford', model: 'Mustang GT', basePrice: 380000, thumb: 'https://image.webmotors.com.br/_fotos/anunciousados/gigante/2020/202005/20200520/ford-mustang-5.0-v8-gasolina-gt-premium-selectshift-wmimagem09876543210.jpg' },
        'chevrolet-camaro-ss': { brand: 'Chevrolet', model: 'Camaro SS', basePrice: 320000, thumb: 'https://image.webmotors.com.br/_fotos/anunciousados/gigante/2019/201908/20190815/chevrolet-camaro-6.2-v8-gasolina-ss-automatico-wmimagem08765432109.jpg' },
        'toyota-supra': { brand: 'Toyota', model: 'Supra', basePrice: 420000, thumb: 'https://image.webmotors.com.br/_fotos/anunciousados/gigante/2021/202104/20210410/toyota-supra-3.0-24v-i6-gasolina-automatico-wmimagem10123456789.jpg' }
    }
    
    // Find matching premium car or generate default
    let carData = null
    for (const [key, data] of Object.entries(premiumCarData)) {
        if (slugStr.includes(key.replace('-', '-').toLowerCase())) {
            carData = data
            break
        }
    }
    
    // Default fallback for unknown slugs
    if (!carData) {
        carData = {
            brand: decodeURIComponent(slugStr).split('-')[0]?.charAt(0).toUpperCase() + decodeURIComponent(slugStr).split('-')[0]?.slice(1) || 'Unknown',
            model: decodeURIComponent(slugStr).split('-')[1]?.charAt(0).toUpperCase() + decodeURIComponent(slugStr).split('-')[1]?.slice(1) || 'Unknown',
            basePrice: Math.floor(Math.random() * 200000) + 80000,
            thumb: '/imgs/search-example.jpg'
        }
    }
    
    // Mock car data based on slug using premium data
    const mockCarData: Car = {
        id: carId,
        name: decodeURIComponent(slugStr)
            .split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' '),
        model: carData.model,
        branch: {
            id: String(carId % 10 + 1),
            name: carId % 10 + 1 // Brand ID as number per schema
        },
        modelYear: 2020 + (carId % 5), // Years between 2020-2024
        fipeCode: `00${carId % 100}-${carId % 10}`,
        slug: slugStr,
        thumb: carData.thumb,
        averageValue: carData.basePrice,
        minValue: 0,
        maxValue: 0,
        prices: generateMockPrices(carId, carData.basePrice),
        partners: [
            { name: "Banco do Brasil", value: Math.floor(carData.basePrice * 0.98) },
            { name: "Santander", value: Math.floor(carData.basePrice * 1.02) },
            { name: "Itaú", value: Math.floor(carData.basePrice * 1.01) }
        ]
    }
    
    // Calculate min/max from prices
    const prices = mockCarData.prices.map(p => p.value)
    mockCarData.minValue = Math.min(...prices)
    mockCarData.maxValue = Math.max(...prices)
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 150))
    
    return mockCarData
})

function generateMockPrices(carId: number, basePrice: number) {
    const prices = []
    const months = [
        '2023-01', '2023-02', '2023-03', '2023-04', '2023-05', '2023-06',
        '2023-07', '2023-08', '2023-09', '2023-10', '2023-11', '2023-12',
        '2024-01', '2024-02', '2024-03', '2024-04', '2024-05', '2024-06',
        '2024-07', '2024-08', '2024-09', '2024-10', '2024-11', '2024-12'
    ]
    
    for (let i = 0; i < months.length; i++) {
        const variation = (Math.random() - 0.5) * (basePrice * 0.2) // 10% variation up or down
        prices.push({
            id: carId * 100 + i + 1, // Add 1 to avoid id 0
            carId: carId,
            referenceDate: months[i],
            value: Math.floor(basePrice + variation)
        })
    }
    
    return prices
}