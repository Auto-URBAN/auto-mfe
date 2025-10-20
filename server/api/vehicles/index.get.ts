import type { SearchResult, VehicleDetail } from '~/schemas/vehicle'
import vehiclesData from '~/server/data/vehicles.json'

export default defineEventHandler(async (event): Promise<SearchResult | VehicleDetail> => {
  const query = getQuery(event)
  
  const id = query.id as string | undefined
  const page = parseInt(query.page as string || '1')
  const pageSize = parseInt(query.pageSize as string || '20')
  const featured = query.featured === 'true'
  const ranking = query.ranking as 'valorizados' | 'depreciados' | undefined

  const allVehicles = vehiclesData as any as VehicleDetail[]

  if (id) {
    const vehicle = allVehicles.find(v => v.id === id)
    if (!vehicle) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Vehicle not found'
      })
    }
    await new Promise(resolve => setTimeout(resolve, 300))
    return vehicle
  }

  let filteredVehicles = [...allVehicles]

  if (query.q) {
    const searchTerm = (query.q as string).toLowerCase()
    filteredVehicles = filteredVehicles.filter(v =>
      v.title.toLowerCase().includes(searchTerm) ||
      v.brand.toLowerCase().includes(searchTerm) ||
      v.model.toLowerCase().includes(searchTerm)
    )
  }

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

  if (query.uf) {
    filteredVehicles = filteredVehicles.filter(v => v.uf === query.uf)
  }

  if (query.priceMin) {
    const priceMin = parseInt(query.priceMin as string)
    filteredVehicles = filteredVehicles.filter(v => v.price >= priceMin)
  }

  if (query.priceMax) {
    const priceMax = parseInt(query.priceMax as string)
    filteredVehicles = filteredVehicles.filter(v => v.price <= priceMax)
  }

  if (query.yearMin) {
    const yearMin = parseInt(query.yearMin as string)
    filteredVehicles = filteredVehicles.filter(v => v.year >= yearMin)
  }

  if (query.yearMax) {
    const yearMax = parseInt(query.yearMax as string)
    filteredVehicles = filteredVehicles.filter(v => v.year <= yearMax)
  }

  if (query.kmMax) {
    const kmMax = parseInt(query.kmMax as string)
    filteredVehicles = filteredVehicles.filter(v => v.km <= kmMax)
  }

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
      filteredVehicles.sort((a, b) => 
        new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
      )
      break
  }

  if (featured) {
    filteredVehicles = filteredVehicles.slice(0, 4)
  }

  if (ranking === 'valorizados') {
    filteredVehicles = filteredVehicles
      .filter(v => v.prices && v.prices.length > 0)
      .sort((a, b) => {
        const aPrices = a.prices || []
        const bPrices = b.prices || []
        const aGrowth = aPrices.length > 1 
          ? (aPrices[aPrices.length - 1].value - aPrices[0].value) / aPrices[0].value 
          : 0
        const bGrowth = bPrices.length > 1 
          ? (bPrices[bPrices.length - 1].value - bPrices[0].value) / bPrices[0].value 
          : 0
        return bGrowth - aGrowth
      })
      .slice(0, 4)
  }

  if (ranking === 'depreciados') {
    filteredVehicles = filteredVehicles
      .filter(v => v.prices && v.prices.length > 0)
      .sort((a, b) => {
        const aPrices = a.prices || []
        const bPrices = b.prices || []
        const aGrowth = aPrices.length > 1 
          ? (aPrices[aPrices.length - 1].value - aPrices[0].value) / aPrices[0].value 
          : 0
        const bGrowth = bPrices.length > 1 
          ? (bPrices[bPrices.length - 1].value - bPrices[0].value) / bPrices[0].value 
          : 0
        return aGrowth - bGrowth
      })
      .slice(0, 4)
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
