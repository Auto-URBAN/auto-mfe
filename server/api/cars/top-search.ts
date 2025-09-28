import type { CarList } from '@/schemas/car'

export default defineEventHandler(async (event): Promise<CarList> => {
    // Mock data com carros esportivos premium mais buscados
    const mockCars: CarList = [
        {
            id: 1,
            name: "Porsche 911 Turbo Cabriolet 2023 - 3.8 24V H6 GASOLINA PDK",
            model: "911",
            branch: { id: "1", name: 1 }, // Porsche
            modelYear: 2023,
            fipeCode: "001001-1",
            slug: "porsche-911-turbo-cabriolet-2023-3-8-24v-h6-gasolina-pdk",
            thumb: "https://s3.sa-east-1.amazonaws.com/revista.mobiauto/Porsche/911+Turbo+S/Porsche-911-Turbo-S-Traseira.jpg",
            averageValue: 1449000,
            minValue: 1380000,
            maxValue: 1520000,
            prices: generateMockPrices(1, 1449000),
            partners: [
                { name: "Banco do Brasil", value: 1445000 },
                { name: "Santander", value: 1450000 }
            ]
        },
        {
            id: 2,
            name: "BMW M3 Competition 2022 - 3.0 24V I6 GASOLINA M XDRIVE AUTOMÁTICO",
            model: "M3",
            branch: { id: "2", name: 2 }, // BMW
            modelYear: 2022,
            fipeCode: "001002-2",
            slug: "bmw-m3-competition-2022-3-0-24v-i6-gasolina-m-xdrive-automatico",
            thumb: "https://s3.ecompletocarros.dev/images/lojas/108/veiculos/206897/veiculoInfoVeiculoImagesMobile/vehicle_image_1724358685_d41d8cd98f00b204e9800998ecf8427e.jpeg",
            averageValue: 685000,
            minValue: 650000,
            maxValue: 720000,
            prices: generateMockPrices(2, 685000),
            partners: [
                { name: "Itaú", value: 682000 },
                { name: "Bradesco", value: 688000 }
            ]
        },
        {
            id: 3,
            name: "Volkswagen Golf GTI Performance 2024 - 2.0 350 TSI GASOLINA DSG",
            model: "Golf GTI",
            branch: { id: "3", name: 3 }, // Volkswagen
            modelYear: 2024,
            fipeCode: "001003-3",
            slug: "volkswagen-golf-gti-performance-2024-2-0-350-tsi-gasolina-dsg",
            thumb: "https://cdn.motor1.com/images/mgl/0eeNl/s1/2022-volkswagen-golf-gti.jpg",
            averageValue: 185000,
            minValue: 175000,
            maxValue: 195000,
            prices: generateMockPrices(3, 185000),
            partners: [
                { name: "Caixa", value: 183000 },
                { name: "Banco do Brasil", value: 186000 }
            ]
        },
        {
            id: 4,
            name: "Nissan GT-R Premium 2020 - 3.8 24V V6 GASOLINA 4WD AUTOMÁTICO",
            model: "GT-R",
            branch: { id: "4", name: 4 }, // Nissan
            modelYear: 2020,
            fipeCode: "001004-4",
            slug: "nissan-gt-r-premium-2020-3-8-24v-v6-gasolina-4wd-automatico",
            thumb: "https://bringatrailer.com/wp-content/uploads/2022/09/2020_nissan_gt-r_f8e4ca0c-0d74-4a1e-b272-74c158057b14-73286.jpeg?fit=940%2C627",
            averageValue: 950000,
            minValue: 900000,
            maxValue: 1000000,
            prices: generateMockPrices(4, 950000),
            partners: [
                { name: "Santander", value: 945000 },
                { name: "Itaú", value: 952000 }
            ]
        },
        {
            id: 5,
            name: "BMW M2 Competition 2021 - 3.0 24V I6 GASOLINA M DCT",
            model: "M2",
            branch: { id: "5", name: 5 }, // BMW
            modelYear: 2021,
            fipeCode: "001005-5",
            slug: "bmw-m2-competition-2021-3-0-24v-i6-gasolina-m-dct",
            thumb: "https://image.webmotors.com.br/_fotos/anunciousados/gigante/2025/202507/20250718/bmw-m2-3.0-i6-twinturbo-gasolina-coupe-m-steptronic-wmimagem15234356261.jpg",
            averageValue: 525000,
            minValue: 500000,
            maxValue: 550000,
            prices: generateMockPrices(5, 525000),
            partners: [
                { name: "Bradesco", value: 522000 },
                { name: "Santander", value: 527000 }
            ]
        },
        {
            id: 6,
            name: "Mercedes-AMG C63 S 2019 - 4.0 V8 BI-TURBO GASOLINA SPEEDSHIFT MCT 9G",
            model: "AMG C63 S",
            branch: { id: "6", name: 6 }, // Mercedes-Benz
            modelYear: 2019,
            fipeCode: "001006-6",
            slug: "mercedes-amg-c63-s-2019-4-0-v8-bi-turbo-gasolina-speedshift-mct-9g",
            thumb: "https://www.cnet.com/a/img/resize/1f48abe6116fb1467ca90b0585de44205b1e4f38/hub/2018/07/23/54caf845-a70d-47d5-bfb9-1a7a6a873dcc/010-2019-mercedes-amg-c63-coupe.jpg?auto=webp&width=1200",
            averageValue: 450000,
            minValue: 420000,
            maxValue: 480000,
            prices: generateMockPrices(6, 450000),
            partners: [
                { name: "Itaú", value: 448000 },
                { name: "Banco do Brasil", value: 452000 }
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