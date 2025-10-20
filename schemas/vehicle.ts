import { z } from 'zod'

/**
 * Vehicle schemas for Auto URBAN marketplace
 */

// Vehicle status enum
export const VehicleStatus = z.enum(['PENDING', 'APPROVED', 'REJECTED'])
export type VehicleStatus = z.infer<typeof VehicleStatus>

// Gearbox enum
export const Gearbox = z.enum(['MANUAL', 'AUTO'])
export type Gearbox = z.infer<typeof Gearbox>

// Fuel type enum
export const FuelType = z.enum(['GASOLINA', 'ALCOOL', 'DIESEL', 'HIBRIDO', 'ELETRICO'])
export type FuelType = z.infer<typeof FuelType>

// Brazilian states (UF) enum
export const BrazilianState = z.enum([
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA',
  'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN',
  'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
])
export type BrazilianState = z.infer<typeof BrazilianState>

// Seller info schema
export const Seller = z.object({
  id: z.string().min(1),
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number format'),
  whatsapp: z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Invalid WhatsApp number format')
})
export type Seller = z.infer<typeof Seller>

// Base Vehicle Summary schema (for listings)
export const VehicleSummary = z.object({
  id: z.string().min(1),
  title: z.string().min(1), // "Marca Modelo Ano"
  brand: z.string().min(1),
  model: z.string().min(1),
  year: z.number().int().min(1900).max(new Date().getFullYear() + 1),
  price: z.number().positive('Price must be positive'),
  km: z.number().int().min(0, 'Mileage cannot be negative'),
  horsepower: z.number().int().min(0, ''),
  city: z.string().min(1),
  uf: BrazilianState,
  coverImageUrl: z.string().url('Invalid image URL'),
  status: VehicleStatus,
  createdAt: z.date().optional(),
  updatedAt: z.date().optional()
})
export type VehicleSummary = z.infer<typeof VehicleSummary>

// Extended Vehicle Detail schema (for individual vehicle pages)
export const VehicleDetail = VehicleSummary.extend({
  description: z.string().max(1000).optional(),
  gearbox: Gearbox.optional(),
  fuel: FuelType.optional(),
  color: z.string().min(1).optional(),
  images: z.array(z.string().url('Invalid image URL')),
  seller: Seller
})
export type VehicleDetail = z.infer<typeof VehicleDetail>

// Search filters schema
export const SearchFilters = z.object({
  q: z.string().optional(), // General text search
  make: z.string().optional(), // Brand filter
  uf: BrazilianState.optional(), // State filter
  priceMin: z.number().positive().optional(),
  priceMax: z.number().positive().optional(),
  yearMin: z.number().int().min(1900).optional(),
  yearMax: z.number().int().max(new Date().getFullYear() + 1).optional(),
  kmMax: z.number().int().min(0).optional(),
  fuel: FuelType.optional(),
  gearbox: Gearbox.optional()
}).refine((data) => {
  if (data.priceMin && data.priceMax) {
    return data.priceMin <= data.priceMax
  }
  return true
}, {
  message: "Minimum price cannot be greater than maximum price",
  path: ["priceMin"]
}).refine((data) => {
  if (data.yearMin && data.yearMax) {
    return data.yearMin <= data.yearMax
  }
  return true
}, {
  message: "Minimum year cannot be greater than maximum year",
  path: ["yearMin"]
})
export type SearchFilters = z.infer<typeof SearchFilters>

// Pagination schema
export const Pagination = z.object({
  page: z.number().int().min(1).default(1),
  pageSize: z.number().int().min(1).max(100).default(20),
  total: z.number().int().min(0).default(0),
  hasMore: z.boolean().default(true)
})
export type Pagination = z.infer<typeof Pagination>

// Search result schema
export const SearchResult = z.object({
  items: z.array(VehicleSummary),
  page: z.number().int().min(1),
  pageSize: z.number().int().min(1),
  total: z.number().int().min(0)
})
export type SearchResult = z.infer<typeof SearchResult>

// Vehicle creation/update schema (for forms)
export const VehicleForm = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters').max(100),
  brand: z.string().min(1, 'Brand is required'),
  model: z.string().min(1, 'Model is required'),
  year: z.number().int().min(1900).max(new Date().getFullYear() + 1, 'Invalid year'),
  price: z.number().positive('Price must be positive').max(10000000, 'Price seems too high'),
  km: z.number().int().min(0, 'Mileage cannot be negative').max(1000000, 'Mileage seems too high'),
  city: z.string().min(1, 'City is required').max(100),
  uf: BrazilianState,
  description: z.string().max(1000, 'Description too long').optional(),
  gearbox: Gearbox.optional(),
  fuel: FuelType.optional(),
  color: z.string().min(1).max(50).optional(),
  images: z.array(z.string().url('Invalid image URL')).min(1, 'At least one image is required').max(10, 'Maximum 10 images allowed'),
  whatsapp: z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Invalid WhatsApp number format')
})
export type VehicleForm = z.infer<typeof VehicleForm>

// Vehicle store state schema
export const VehiclesState = z.object({
  vehicles: z.array(VehicleSummary),
  currentVehicle: VehicleDetail.nullable(),
  myVehicles: z.array(VehicleSummary),
  searchFilters: SearchFilters,
  pagination: Pagination,
  loading: z.object({
    search: z.boolean(),
    detail: z.boolean(),
    myVehicles: z.boolean(),
    create: z.boolean(),
    update: z.boolean()
  })
})
export type VehiclesState = z.infer<typeof VehiclesState>