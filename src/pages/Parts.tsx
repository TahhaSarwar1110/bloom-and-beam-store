import { useEffect, useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { SEOHead } from '@/components/seo/SEOHead';

interface Part {
  id: string;
  name: string;
  description: string | null;
  price: number;
  category: string;
  image_urls: string[];
  in_stock: boolean;
}

const PartImageCarousel = ({ images, name }: { images: string[]; name: string }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div className="w-24 h-24 bg-muted rounded flex items-center justify-center text-muted-foreground text-xs">
        No image
      </div>
    );
  }

  const prev = () => setCurrentIndex((i) => (i === 0 ? images.length - 1 : i - 1));
  const next = () => setCurrentIndex((i) => (i === images.length - 1 ? 0 : i + 1));

  return (
    <div className="relative w-24 h-24 group">
      <img
        src={images[currentIndex]}
        alt={`${name} - Image ${currentIndex + 1}`}
        className="w-24 h-24 object-cover rounded"
      />
      {images.length > 1 && (
        <>
          <button
            onClick={(e) => { e.stopPropagation(); prev(); }}
            className="absolute left-0 top-1/2 -translate-y-1/2 bg-background/80 p-1 rounded-r opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <ChevronLeft className="h-3 w-3" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); next(); }}
            className="absolute right-0 top-1/2 -translate-y-1/2 bg-background/80 p-1 rounded-l opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <ChevronRight className="h-3 w-3" />
          </button>
          <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex gap-1">
            {images.map((_, i) => (
              <span
                key={i}
                className={`w-1.5 h-1.5 rounded-full ${i === currentIndex ? 'bg-primary' : 'bg-muted-foreground/50'}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

const Parts = () => {
  const [parts, setParts] = useState<Part[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchParts = async () => {
      const { data, error } = await supabase
        .from('parts')
        .select('*')
        .order('sort_order', { ascending: true });

      if (!error && data) {
        setParts(data);
      }
      setLoading(false);
    };

    fetchParts();
  }, []);

  // Group parts by category
  const categories = [...new Set(parts.map(p => p.category))];

  return (
    <Layout>
      <SEOHead
        title="Spare Parts - OEM Replacement Parts | BEDMED"
        description="OEM replacement parts for all BEDMED medical equipment. Caster wheels, side rails, mattress covers, and more."
        canonicalUrl={`${window.location.origin}/parts`}
      />

      <section className="py-16 md:py-24">
        <div className="container">
          <div className="text-center mb-16">
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">Spare Parts</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">OEM replacement parts for all BEDMED equipment.</p>
          </div>

          {loading ? (
            <div className="text-center py-8">Loading...</div>
          ) : parts.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No parts available yet.
            </div>
          ) : (
            <div className="space-y-12">
              {categories.map((category) => (
                <div key={category}>
                  <h2 className="text-2xl font-bold mb-6 text-primary">{category}</h2>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {parts
                      .filter((part) => part.category === category)
                      .map((part, i) => (
                        <div
                          key={part.id}
                          className="bg-card p-6 rounded-xl border card-hover flex gap-4 items-start opacity-0 animate-fade-in-up"
                          style={{ animationDelay: `${i * 100}ms`, animationFillMode: 'forwards' }}
                        >
                          <PartImageCarousel images={part.image_urls} name={part.name} />
                          <div className="flex-1">
                            <h3 className="font-display font-bold text-lg">{part.name}</h3>
                            {part.description && (
                              <p className="text-sm text-muted-foreground line-clamp-2">{part.description}</p>
                            )}
                            <p className="text-primary font-bold mt-2">${part.price}</p>
                            <div className="flex items-center gap-2 mt-2">
                              <span className={`text-xs px-2 py-0.5 rounded ${part.in_stock ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                {part.in_stock ? 'In Stock' : 'Out of Stock'}
                              </span>
                              <Button size="sm" className="btn-shine" disabled={!part.in_stock}>
                                Order
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Button asChild variant="outline" size="lg">
              <Link to="/contact">Request Custom Part</Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Parts;
