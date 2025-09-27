import type { CarList } from '@/schemas/car'

export default defineEventHandler(async (event): Promise<CarList> => {
    // Mock data for development - avoiding external API dependency
    const mockCars: CarList = [
        {
            id: 1,
            name: "Honda Civic 2018/2019 - 1.5 VTEC TURBO GASOLINA SEDAN 4P CVT",
            model: "Civic",
            branch: { id: "1", name: 1 }, // Honda
            modelYear: 2019,
            fipeCode: "001001-1",
            slug: "honda-civic-2018-2019-1-5-vtec-turbo-gasolina-sedan-4p-cvt",
            thumb: "/imgs/search-latest-example.jpg",
            averageValue: 85000,
            minValue: 78000,
            maxValue: 92000,
            prices: generateMockPrices(1, 85000),
            partners: [
                { name: "Banco do Brasil", value: 84500 },
                { name: "Santander", value: 85200 }
            ]
        },
        {
            id: 2,
            name: "Toyota Corolla 2020/2021 - 2.0 VVT-IE FLEX XEI DIRECT SHIFT",
            model: "Corolla",
            branch: { id: "2", name: 2 }, // Toyota
            modelYear: 2021,
            fipeCode: "001002-2",
            slug: "toyota-corolla-2020-2021-2-0-vvt-ie-flex-xei-direct-shift",
            thumb: "/imgs/search-latest-example.jpg",
            averageValue: 92000,
            minValue: 88000,
            maxValue: 96000,
            prices: generateMockPrices(2, 92000),
            partners: [
                { name: "Itaú", value: 91800 },
                { name: "Bradesco", value: 92300 }
            ]
        },
        {
            id: 3,
            name: "Volkswagen Jetta 2019/2020 - 1.4 250 TSI TOTAL FLEX TIPTRONIC",
            model: "Jetta",
            branch: { id: "3", name: 3 }, // Volkswagen
            modelYear: 2020,
            fipeCode: "001003-3",
            slug: "volkswagen-jetta-2019-2020-1-4-250-tsi-total-flex-tiptronic",
            thumb: "/imgs/search-latest-example.jpg",
            averageValue: 78000,
            minValue: 74000,
            maxValue: 82000,
            prices: generateMockPrices(3, 78000),
            partners: [
                { name: "Caixa", value: 77500 },
                { name: "Banco do Brasil", value: 78200 }
            ]
        },
        {
            id: 4,
            name: "Hyundai HB20 2021/2022 - 1.0 TGDI FLEX PLATINUM AUTOMÁTICO",
            model: "HB20",
            branch: { id: "4", name: 4 }, // Hyundai
            modelYear: 2022,
            fipeCode: "001004-4",
            slug: "hyundai-hb20-2021-2022-1-0-tgdi-flex-platinum-automatico",
            thumb: "/imgs/search-latest-example.jpg",
            averageValue: 68000,
            minValue: 65000,
            maxValue: 71000,
            prices: generateMockPrices(4, 68000),
            partners: [
                { name: "Santander", value: 67800 },
                { name: "Itaú", value: 68400 }
            ]
        }
    ]
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 100))
    
    return mockCars
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