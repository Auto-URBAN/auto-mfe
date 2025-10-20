/**
 * Centralized export for all Zod schemas in Auto URBAN
 * This file provides a single import point for all schemas across the application
 */

// User schemas
export * from './user'

// Vehicle schemas  
export * from './vehicle'

// Admin schemas
export * from './admin'

// Common/API schemas
export * from './common'

// Re-export existing schemas for compatibility
export * from './bank'
export * from './brand'
export * from './installments'
export * from './ranking'

// Utility function to validate data against schema
export const validateSchema = <T>(schema: any, data: unknown): { success: true; data: T } | { success: false; error: string } => {
  try {
    const result = schema.parse(data)
    return { success: true, data: result }
  } catch (error: any) {
    return { 
      success: false, 
      error: error.errors?.[0]?.message || error.message || 'Validation failed' 
    }
  }
}

// Utility function to safely parse data
export const safeParseSchema = <T>(schema: any, data: unknown) => {
  return schema.safeParse(data)
}
