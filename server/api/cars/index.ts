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
    
    // Mock car data based on slug
    const mockCarData: Car = {
        id: carId,
        name: decodeURIComponent(slugStr)
            .split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' '),
        model: slugStr.split('-')[1] || 'Unknown',
        branch: {
            id: String(carId % 10 + 1),
            name: carId % 10 + 1 // Brand ID as number per schema
        },
        modelYear: 2020 + (carId % 5), // Years between 2020-2024
        fipeCode: `00${carId % 100}-${carId % 10}`,
        slug: slugStr,
        thumb: '/imgs/search-example.jpg',
        averageValue: Math.floor(Math.random() * 50000) + 50000,
        minValue: 0,
        maxValue: 0,
        prices: generateMockPrices(carId),
        partners: [
            { name: "Banco do Brasil", value: Math.floor(Math.random() * 5000) + 50000 },
            { name: "Santander", value: Math.floor(Math.random() * 5000) + 52000 },
            { name: "Itaú", value: Math.floor(Math.random() * 5000) + 51000 }
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

function generateMockPrices(carId: number) {
    const prices = []
    const basePrice = Math.floor(Math.random() * 50000) + 40000
    const months = [
        '2023-01', '2023-02', '2023-03', '2023-04', '2023-05', '2023-06',
        '2023-07', '2023-08', '2023-09', '2023-10', '2023-11', '2023-12',
        '2024-01', '2024-02', '2024-03', '2024-04', '2024-05', '2024-06',
        '2024-07', '2024-08', '2024-09', '2024-10', '2024-11', '2024-12'
    ]
    
    for (let i = 0; i < months.length; i++) {
        const variation = (Math.random() - 0.5) * 10000 // -5000 to +5000 variation
        prices.push({
            id: carId * 100 + i + 1, // Add 1 to avoid id 0
            carId: carId,
            referenceDate: months[i],
            value: Math.floor(basePrice + variation)
        })
    }
    
    return prices
}