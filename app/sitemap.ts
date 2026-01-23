import { MetadataRoute } from 'next'
import { connectToDatabase } from '@/lib/mongoose'
import Product from '@/database/product.model'

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'

// Helper function: Kiểm tra và trả về date hợp lệ
function getValidDate(date: any): Date {
  const parsed = new Date(date)
  // Nếu date không hợp lệ, trả về ngày hiện tại
  if (isNaN(parsed.getTime())) {
    return new Date()
  }
  return parsed
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  
  // 1. Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/product`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about-us`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
  ]

  // 2. Collections
  const collections = ['spring', 'summer', 'autumn', 'winter']
  const collectionPages: MetadataRoute.Sitemap = collections.map((name) => ({
    url: `${baseUrl}/collection/${name}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  }))

  // 3. Products (dynamic)
  let productPages: MetadataRoute.Sitemap = []

  try {
    await connectToDatabase()

    const products = await Product.find({})
      .select('slug updatedAt createdAt')
      .lean()

    productPages = products
      .filter((product: any) => product.slug) // Chỉ lấy product có slug
      .map((product: any) => ({
        url: `${baseUrl}/product/${product.slug}`,
        lastModified: getValidDate(product.updatedAt || product.createdAt),
        changeFrequency: 'weekly' as const,
        priority: 0.6,
      }))

  } catch (error) {
    console.error('Error fetching products for sitemap:', error)
  }

  return [...staticPages, ...collectionPages, ...productPages]
}