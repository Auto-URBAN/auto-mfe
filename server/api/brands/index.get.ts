import brandsData from '~/server/data/brands.json'

export default defineEventHandler(async () => {
  await new Promise(resolve => setTimeout(resolve, 100))
  return brandsData
})
