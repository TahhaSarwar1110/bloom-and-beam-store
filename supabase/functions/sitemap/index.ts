import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Content-Type': 'application/xml',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const baseUrl = req.headers.get('origin') || 'https://bedmed.com'

    // Fetch published blog posts
    const { data: posts } = await supabase
      .from('blog_posts')
      .select('slug, id, updated_at')
      .eq('published', true)

    // Fetch products
    const { data: products } = await supabase
      .from('products')
      .select('id, slug, updated_at')

    // Static pages
    const staticPages = [
      { loc: '/', priority: '1.0', changefreq: 'weekly' },
      { loc: '/products', priority: '0.9', changefreq: 'daily' },
      { loc: '/parts', priority: '0.8', changefreq: 'weekly' },
      { loc: '/services', priority: '0.7', changefreq: 'monthly' },
      { loc: '/about', priority: '0.6', changefreq: 'monthly' },
      { loc: '/contact', priority: '0.6', changefreq: 'monthly' },
      { loc: '/faq', priority: '0.7', changefreq: 'weekly' },
      { loc: '/blog', priority: '0.8', changefreq: 'daily' },
    ]

    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`

    // Add static pages
    for (const page of staticPages) {
      xml += `
  <url>
    <loc>${baseUrl}${page.loc}</loc>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`
    }

    // Add blog posts
    if (posts) {
      for (const post of posts) {
        xml += `
  <url>
    <loc>${baseUrl}/blog/${post.slug || post.id}</loc>
    <lastmod>${new Date(post.updated_at).toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`
      }
    }

    // Add products
    if (products) {
      for (const product of products) {
        xml += `
  <url>
    <loc>${baseUrl}/products/${product.slug || product.id}</loc>
    <lastmod>${new Date(product.updated_at).toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`
      }
    }

    xml += `
</urlset>`

    console.log('Sitemap generated successfully')

    return new Response(xml, { headers: corsHeaders })
  } catch (error) {
    console.error('Error generating sitemap:', error)
    return new Response('Error generating sitemap', { status: 500 })
  }
})
