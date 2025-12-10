import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { ProductCard } from '@/components/products/ProductCard';
import { products, categories } from '@/data/products';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const Products = () => {
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredProducts = activeCategory === 'All' 
    ? products 
    : products.filter(p => p.category === activeCategory);

  return (
    <Layout>
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="text-center mb-12">
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">Our Products</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Explore our complete range of premium medical stretchers and hospital equipment.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {categories.map(cat => (
              <Button
                key={cat}
                variant={activeCategory === cat ? 'default' : 'outline'}
                onClick={() => setActiveCategory(cat)}
                className={cn('btn-shine', activeCategory === cat && 'shadow-lg')}
              >
                {cat}
              </Button>
            ))}
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Products;
