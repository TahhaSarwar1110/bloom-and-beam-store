import { useParams, Link } from 'react-router-dom';
import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { products } from '@/data/products';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/hooks/use-toast';
import { ShoppingCart, Minus, Plus, Check, ArrowLeft, Star } from 'lucide-react';
import { cn } from '@/lib/utils';

const ProductDetail = () => {
  const { id } = useParams();
  const product = products.find(p => p.id === id);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const { toast } = useToast();

  if (!product) {
    return <Layout><div className="container py-20 text-center">Product not found</div></Layout>;
  }

  const handleAddToCart = () => {
    addToCart(product, quantity);
    toast({ title: 'Added to cart', description: `${quantity}x ${product.name} added.` });
  };

  return (
    <Layout>
      <section className="py-12 md:py-20">
        <div className="container">
          <Link to="/products" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary mb-8">
            <ArrowLeft className="h-4 w-4" /> Back to Products
          </Link>

          <div className="grid lg:grid-cols-2 gap-12">
            <div className="bg-muted rounded-2xl p-8 perspective-1000">
              <img src={product.image} alt={product.name} className="w-full rotate-360-hover preserve-3d" />
            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className={cn('h-5 w-5', i < Math.floor(product.rating) ? 'text-gold fill-gold' : 'text-muted')} />
                ))}
                <span className="text-muted-foreground">({product.reviews} reviews)</span>
              </div>

              <span className="text-primary font-medium uppercase text-sm">{product.category}</span>
              <h1 className="font-display text-3xl md:text-4xl font-bold">{product.name}</h1>
              
              <div className="flex items-center gap-4">
                <span className="font-display text-3xl font-bold text-primary">${product.price.toLocaleString()}</span>
                {product.originalPrice && <span className="text-xl text-muted-foreground line-through">${product.originalPrice.toLocaleString()}</span>}
              </div>

              <p className="text-muted-foreground text-lg">{product.description}</p>

              <div className="space-y-3">
                <h3 className="font-display font-bold">Features:</h3>
                <ul className="space-y-2">
                  {product.features.map((f, i) => (
                    <li key={i} className="flex items-center gap-2"><Check className="h-5 w-5 text-success" />{f}</li>
                  ))}
                </ul>
              </div>

              <div className="flex items-center gap-4 pt-6 border-t">
                <div className="flex items-center gap-3 bg-muted rounded-lg p-2">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-10 h-10 flex items-center justify-center rounded hover:bg-background"><Minus className="h-4 w-4" /></button>
                  <span className="w-10 text-center font-bold">{quantity}</span>
                  <button onClick={() => setQuantity(quantity + 1)} className="w-10 h-10 flex items-center justify-center rounded hover:bg-background"><Plus className="h-4 w-4" /></button>
                </div>
                <Button onClick={handleAddToCart} size="lg" className="flex-1 btn-shine"><ShoppingCart className="mr-2 h-5 w-5" />Add to Cart</Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ProductDetail;
