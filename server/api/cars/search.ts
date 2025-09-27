export default defineEventHandler(async (event) => {
    const query = getQuery(event)
    
    const page = parseInt(query.page as string || '1')
    const pageSize = parseInt(query.pageSize as string || '20')
    
    // Mock data expandido para melhor teste
    const mockVehicles = [
        {
            id: '1',
            title: 'Honda Civic 2020/2021 - 1.5 VTEC TURBO',
            brand: 'Honda',
            model: 'Civic',
            year: 2021,
            price: 89000,
            km: 35000,
            city: 'São Paulo',
            uf: 'SP',
            coverImageUrl: '/imgs/search-example.jpg',
            status: 'APPROVED',
            createdAt: new Date('2024-01-15')
        },
        {
            id: '2',
            title: 'Toyota Corolla 2019/2020 - 2.0 VVT-IE FLEX',
            brand: 'Toyota',
            model: 'Corolla', 
            year: 2020,
            price: 82000,
            km: 42000,
            city: 'Rio de Janeiro',
            uf: 'RJ',
            coverImageUrl: '/imgs/search-example.jpg',
            status: 'APPROVED',
            createdAt: new Date('2024-02-10')
        },
        {
            id: '3',
            title: 'Volkswagen Jetta 2019/2020 - 1.4 TSI',
            brand: 'Volkswagen',
            model: 'Jetta',
            year: 2020,
            price: 75000,
            km: 28000,
            city: 'Belo Horizonte',
            uf: 'MG',
            coverImageUrl: '/imgs/search-example.jpg',
            status: 'APPROVED',
            createdAt: new Date('2024-03-05')
        },
        {
            id: '4',
            title: 'Hyundai HB20 2021/2022 - 1.0 TGDI FLEX',
            brand: 'Hyundai',
            model: 'HB20',
            year: 2022,
            price: 68000,
            km: 15000,
            city: 'Porto Alegre',
            uf: 'RS',
            coverImageUrl: '/imgs/search-example.jpg',
            status: 'APPROVED',
            createdAt: new Date('2024-04-20')
        },
        {
            id: '5',
            title: 'Chevrolet Onix 2020/2021 - 1.0 TURBO FLEX',
            brand: 'Chevrolet',
            model: 'Onix',
            year: 2021,
            price: 72000,
            km: 38000,
            city: 'Salvador',
            uf: 'BA',
            coverImageUrl: '/imgs/search-example.jpg',
            status: 'APPROVED',
            createdAt: new Date('2024-05-15')
        },
        {
            id: '6',
            title: 'Ford Ka 2019/2020 - 1.0 TI-VCT FLEX',
            brand: 'Ford',
            model: 'Ka',
            year: 2020,
            price: 48000,
            km: 51000,
            city: 'Recife',
            uf: 'PE',
            coverImageUrl: '/imgs/search-example.jpg',
            status: 'APPROVED',
            createdAt: new Date('2024-07-05')
        },
        {
            id: '7',
            title: 'Nissan Sentra 2021/2022 - 2.0 FLEX SV',
            brand: 'Nissan',
            model: 'Sentra',
            year: 2022,
            price: 89000,
            km: 22000,
            city: 'Fortaleza',
            uf: 'CE',
            coverImageUrl: '/imgs/search-example.jpg',
            status: 'APPROVED',
            createdAt: new Date('2024-06-10')
        },
        {
            id: '8',
            title: 'Renault Kwid 2021/2022 - 1.0 FLEX INTENSE',
            brand: 'Renault',
            model: 'Kwid',
            year: 2022,
            price: 52000,
            km: 18000,
            city: 'Brasília',
            uf: 'DF',
            coverImageUrl: '/imgs/search-example.jpg',
            status: 'APPROVED',
            createdAt: new Date('2024-08-12')
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