import { useParams, Link } from 'react-router-dom';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/hooks/use-toast';
import { ShoppingCart, Minus, Plus, Check, ArrowLeft, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  original_price: number | null;
  image_url: string | null;
  image_urls: string[] | null;
  category: string;
  features: string[] | null;
  in_stock: boolean;
}

const ProductDetail = () => {
  const { id } = useParams();
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { addToCart } = useCart();
  const { toast } = useToast();

  const { data: product, isLoading } = useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .maybeSingle();
      
      if (error) throw error;
      return data as Product | null;
    },
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <Layout>
        <div className="container py-20 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  if (!product) {
    return (
      <Layout>
        <div className="container py-20 text-center">
          <h2 className="text-2xl font-bold mb-4">Product not found</h2>
          <Link to="/" className="text-primary hover:underline">Return to Home</Link>
        </div>
      </Layout>
    );
  }

  // Combine main image with additional images
  const allImages = [
    product.image_url,
    ...(product.image_urls || [])
  ].filter(Boolean) as string[];

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image_url || '/placeholder.svg',
      category: product.category,
      description: product.description || '',
      features: product.features || [],
      rating: 4.5,
      reviews: 0,
      inStock: product.in_stock,
    }, quantity);
    toast({ title: 'Added to cart', description: `${quantity}x ${product.name} added.` });
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  };

  return (
    <Layout>
      <section className="py-12 md:py-20">
        <div className="container">
          <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary mb-8 transition-colors">
            <ArrowLeft className="h-4 w-4" /> Back to Home
          </Link>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Image Carousel */}
            <div className="space-y-4">
              <div className="relative bg-muted rounded-2xl p-8 aspect-square overflow-hidden group">
                {allImages.length > 0 ? (
                  <img 
                    src={allImages[currentImageIndex]} 
                    alt={product.name} 
                    className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105" 
                  />
                ) : (
                  <img 
                    src="/placeholder.svg" 
                    alt={product.name} 
                    className="w-full h-full object-contain" 
                  />
                )}
                
                {/* Navigation Arrows */}
                {allImages.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-background/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-background transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <ChevronLeft className="h-6 w-6" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-background/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-background transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <ChevronRight className="h-6 w-6" />
                    </button>
                  </>
                )}

                {/* Image Counter */}
                {allImages.length > 1 && (
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-background/80 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium">
                    {currentImageIndex + 1} / {allImages.length}
                  </div>
                )}
              </div>

              {/* Thumbnail Strip */}
              {allImages.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {allImages.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={cn(
                        "flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all",
                        currentImageIndex === index 
                          ? "border-primary ring-2 ring-primary/30" 
                          : "border-transparent hover:border-muted-foreground/30"
                      )}
                    >
                      <img 
                        src={img} 
                        alt={`${product.name} view ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <span className="text-primary font-medium uppercase text-sm">{product.category}</span>
              <h1 className="font-display text-3xl md:text-4xl font-bold">{product.name}</h1>
              
              <div className="flex items-center gap-4">
                <span className="font-display text-3xl font-bold text-primary">${product.price.toLocaleString()}</span>
                {product.original_price && (
                  <span className="text-xl text-muted-foreground line-through">
                    ${product.original_price.toLocaleString()}
                  </span>
                )}
              </div>

              <div className={cn(
                "inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium",
                product.in_stock ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
              )}>
                {product.in_stock ? "In Stock" : "Out of Stock"}
              </div>

              {product.description && (
                <p className="text-muted-foreground text-lg">{product.description}</p>
              )}

              {product.features && product.features.length > 0 && (
                <div className="space-y-3">
                  <h3 className="font-display font-bold">Features:</h3>
                  <ul className="space-y-2">
                    {product.features.map((f, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <Check className="h-5 w-5 text-green-600 flex-shrink-0" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="flex items-center gap-4 pt-6 border-t">
                <div className="flex items-center gap-3 bg-muted rounded-lg p-2">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))} 
                    className="w-10 h-10 flex items-center justify-center rounded hover:bg-background transition-colors"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-10 text-center font-bold">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(quantity + 1)} 
                    className="w-10 h-10 flex items-center justify-center rounded hover:bg-background transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                <Button 
                  onClick={handleAddToCart} 
                  size="lg" 
                  className="flex-1 btn-shine"
                  disabled={!product.in_stock}
                >
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  Add to Cart
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ProductDetail;