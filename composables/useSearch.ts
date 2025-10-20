/**
 * Composable for vehicle search with SWR cache using IndexedDB
 */

import { openDB, type IDBPDatabase } from 'idb'
import type { SearchFilters, VehicleSummary } from '~/stores/vehicles'

interface SearchCache {
	key: string
	data: {
		items: VehicleSummary[]
		total: number
		timestamp: number
	}
}

interface SearchResult {
	items: VehicleSummary[]
	page: number
	pageSize: number
	total: number
}

const DB_NAME = 'auto-urban-cache'
const DB_VERSION = 1
const SEARCH_STORE = 'searches'
const CACHE_DURATION = 3600000 // 1 hour in milliseconds

let db: IDBPDatabase | null = null

async function initDB() {
	if (!db && import.meta.client) {
		db = await openDB(DB_NAME, DB_VERSION, {
			upgrade(db) {
				if (!db.objectStoreNames.contains(SEARCH_STORE)) {
					db.createObjectStore(SEARCH_STORE, { keyPath: 'key' })
				}
			}
		})
	}
	return db
}

function getCacheKey(filters: SearchFilters, page: number = 1): string {
	const sortedFilters = Object.keys(filters)
		.sort()
		.reduce((result, key) => {
			result[key] = filters[key as keyof SearchFilters]
			return result
		}, {} as SearchFilters)

	return `search-${btoa(JSON.stringify({ ...sortedFilters, page }))}`
}

async function getCachedSearch(key: string): Promise<SearchResult | null> {
	if (!import.meta.client) return null

	try {
		const db = await initDB()
		if (!db) return null

		const cached: SearchCache = await db.get(SEARCH_STORE, key)

		if (cached && Date.now() - cached.data.timestamp < CACHE_DURATION) {
			return {
				items: cached.data.items,
				page: 1, // Will be overridden by actual request
				pageSize: 20,
				total: cached.data.total
			}
		}
	} catch (error) {
		console.warn('Error getting cached search:', error)
	}

	return null
}

async function setCachedSearch(key: string, data: SearchResult): Promise<void> {
	if (!import.meta.client) return

	try {
		const db = await initDB()
		if (!db) return

		await db.put(SEARCH_STORE, {
			key,
			data: {
				items: data.items,
				total: data.total,
				timestamp: Date.now()
			}
		})
	} catch (error) {
		console.warn('Error setting cached search:', error)
	}
}

async function clearExpiredCache(): Promise<void> {
	if (!import.meta.client) return

	try {
		const db = await initDB()
		if (!db) return

		const tx = db.transaction(SEARCH_STORE, 'readwrite')
		const store = tx.objectStore(SEARCH_STORE)
		const allKeys = await store.getAllKeys()

		for (const key of allKeys) {
			const cached: SearchCache = await store.get(key)
			if (cached && Date.now() - cached.data.timestamp >= CACHE_DURATION) {
				await store.delete(key)
			}
		}
	} catch (error) {
		console.warn('Error clearing expired cache:', error)
	}
}

export const useSearch = () => {
	const vehiclesStore = useVehiclesStore()

	const searchWithCache = async (
		filters: SearchFilters = {},
		loadMore = false
	): Promise<SearchResult> => {
		const page = loadMore ? vehiclesStore.pagination.page + 1 : 1
		const cacheKey = getCacheKey(filters, page)

		// Try cache first (only for fresh searches, not load more)
		if (!loadMore) {
			const cached = await getCachedSearch(cacheKey)
			if (cached) {
				// Use cached data but still make background request to update
				vehiclesStore.vehicles = cached.items
				vehiclesStore.searchFilters = filters
				vehiclesStore.pagination = {
					page: 1,
					pageSize: 20,
					total: cached.total,
					hasMore: cached.items.length === 20
				}

				// Background update
				searchFromAPI(filters, page, cacheKey).catch(console.error)

				return cached
			}
		}

		// No cache or load more - fetch from API
		return searchFromAPI(filters, page, cacheKey)
	}

	const searchFromAPI = async (
		filters: SearchFilters,
		page: number,
		cacheKey: string
	): Promise<SearchResult> => {
		try {
			const response = await $fetch<SearchResult>('/api/vehicles/search', {
				query: {
					...filters,
					page,
					pageSize: 20
				}
			})

			// Cache the result (only for page 1)
			if (page === 1) {
				await setCachedSearch(cacheKey, response)
			}

			return response
		} catch (error) {
			console.error('API search error:', error)
			throw error
		}
	}

	const clearSearchCache = async (): Promise<void> => {
		if (!import.meta.client) return

		try {
			const db = await initDB()
			if (!db) return

			await db.clear(SEARCH_STORE)
		} catch (error) {
			console.warn('Error clearing search cache:', error)
		}
	}

	// Initialize and setup cleanup
	onMounted(() => {
		clearExpiredCache()
	})

	return {
		searchWithCache,
		clearSearchCache
	}
}
