import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Layout } from '@/components/layout/Layout';
import { SEOHead } from '@/components/seo/SEOHead';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Product {
  id: string;
  name: string;
  image_url: string | null;
  image_urls: string[] | null;
  price: number;
  category: string;
  slug: string | null;
}

// Mapping from URL slug to display name and category filter
const categoryMapping: Record<string, { name: string; categoryFilter: string }> = {
  // Beds
  'fully-electric-bed': { name: 'Fully Electric Bed', categoryFilter: 'Fully Electric Bed' },
  'semi-electric-bed': { name: 'Semi Electric Beds', categoryFilter: 'Semi Electric Beds' },
  'bariatric-bed': { name: 'Bariatric Bed', categoryFilter: 'Bariatric Bed' },
  'burn-bed': { name: 'Burn Bed', categoryFilter: 'Burn Bed' },
  // Stretchers
  'ems-stretcher': { name: 'EMS Stretcher', categoryFilter: 'EMS Stretcher' },
  'er-stretcher': { name: 'ER Stretcher', categoryFilter: 'ER Stretcher' },
  'surgery-stretcher': { name: 'Surgery Stretcher', categoryFilter: 'Surgery Stretcher' },
  'bariatric-stretcher': { name: 'Bariatric Stretcher', categoryFilter: 'Bariatric Stretcher' },
  'evac-stretcher': { name: 'EVAC Stretcher', categoryFilter: 'EVAC Stretcher' },
  // Accessories
  'bedside-table': { name: 'Bed Side Table', categoryFilter: 'Bed Side Table' },
  'bed-over-table': { name: 'Bed Over Table', categoryFilter: 'Bed Over Table' },
  'wheelchair': { name: 'Wheel Chair', categoryFilter: 'Wheel Chair' },
  'patient-recliner': { name: 'Patient Recliner', categoryFilter: 'Patient Recliner' },
};

const ProductGallery = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  
  const categoryInfo = slug ? categoryMapping[slug] : null;
  const categoryName = categoryInfo?.name || 'Products';
  const categoryFilter = categoryInfo?.categoryFilter || '';

  const { data: products, isLoading } = useQuery({
    queryKey: ['products-gallery', categoryFilter],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('id, name, image_url, image_urls, price, category, slug')
        .eq('category', categoryFilter);
      
      if (error) throw error;
      return data as Product[];
    },
    enabled: !!categoryFilter && categoryFilter.length > 0,
    staleTime: 0,
  });

  const handleImageClick = (product: Product) => {
    // Navigate to product detail page
    navigate(`/products/${product.id}`);
  };

  return (
    <Layout>
      <SEOHead
        title={`${categoryName} Gallery | BEDMED`}
        description={`Browse our collection of ${categoryName}. Click on any image to view detailed product information.`}
      />
      
      <section className="py-12 md:py-20">
        <div className="container">
          {/* Back Button */}
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary mb-8 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Home
          </Link>

          {/* Header */}
          <div className="text-center mb-12">
            <span className="text-primary font-medium text-sm uppercase tracking-wider">
              Product Gallery
            </span>
            <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold mt-2">
              {categoryName}
            </h1>
            <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
              Click on any image to view detailed product information
            </p>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          )}

          {/* Products Grid - Show all images from all products */}
          {!isLoading && products && products.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.flatMap((product) => {
                // Combine main image with additional images
                const allImages = [
                  product.image_url,
                  ...(product.image_urls || [])
                ].filter(Boolean) as string[];
                
                // If no images, show placeholder
                if (allImages.length === 0) {
                  allImages.push('/placeholder.svg');
                }

                return allImages.map((imageUrl, imgIndex) => (
                  <div
                    key={`${product.id}-${imgIndex}`}
                    onClick={() => handleImageClick(product)}
                    className={cn(
                      "group cursor-pointer bg-card rounded-xl border overflow-hidden",
                      "transition-all duration-300 hover:shadow-xl hover:-translate-y-2 hover:border-primary/50",
                      "opacity-0 animate-fade-in"
                    )}
                    style={{ 
                      animationDelay: `${imgIndex * 50}ms`, 
                      animationFillMode: 'forwards' 
                    }}
                  >
                    {/* Image Container */}
                    <div className="aspect-square bg-muted overflow-hidden">
                      <img
                        src={imageUrl}
                        alt={`${product.name} - View ${imgIndex + 1}`}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>
                    
                    {/* Product Info */}
                    <div className="p-4">
                      <h3 className="font-display font-semibold text-sm md:text-base line-clamp-2 group-hover:text-primary transition-colors">
                        {product.name}
                      </h3>
                      <p className="text-primary font-bold mt-2">
                        ${product.price.toLocaleString()}
                      </p>
                      {allImages.length > 1 && (
                        <p className="text-xs text-muted-foreground mt-1">
                          View {imgIndex + 1} of {allImages.length}
                        </p>
                      )}
                    </div>
                  </div>
                ));
              })}
            </div>
          )}

          {/* Empty State */}
          {!isLoading && (!products || products.length === 0) && (
            <div className="text-center py-20">
              <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                <ArrowLeft className="h-12 w-12 text-muted-foreground" />
              </div>
              <h3 className="font-display text-xl font-bold mb-2">No Products Found</h3>
              <p className="text-muted-foreground mb-6">
                We're adding products to this category soon. Check back later!
              </p>
              <Link 
                to="/" 
                className="inline-flex items-center gap-2 text-primary hover:underline"
              >
                <ArrowLeft className="h-4 w-4" /> Return to Home
              </Link>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default ProductGallery;