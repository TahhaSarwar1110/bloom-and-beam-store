import { Layout } from '@/components/layout/Layout';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Link } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

const Checkout = () => {
  const { items, getTotal, clearCart } = useCart();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({ title: 'Order Placed!', description: 'Thank you for your order. We\'ll contact you shortly.' });
    clearCart();
  };

  if (items.length === 0) {
    return (
      <Layout>
        <div className="container py-20 text-center">
          <h1 className="font-display text-3xl font-bold mb-4">Your cart is empty</h1>
          <Button asChild><Link to="/products">Browse Products</Link></Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="py-16">
        <div className="container max-w-4xl">
          <h1 className="font-display text-4xl font-bold mb-8">Checkout</h1>
          <div className="grid lg:grid-cols-2 gap-12">
            <form onSubmit={handleSubmit} className="space-y-6">
              <h2 className="font-display font-bold text-xl">Contact Information</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <Input placeholder="First Name" required />
                <Input placeholder="Last Name" required />
              </div>
              <Input type="email" placeholder="Email" required />
              <Input placeholder="Phone" required />
              <h2 className="font-display font-bold text-xl pt-4">Shipping Address</h2>
              <Input placeholder="Address" required />
              <div className="grid sm:grid-cols-3 gap-4">
                <Input placeholder="City" required />
                <Input placeholder="State" required />
                <Input placeholder="ZIP" required />
              </div>
              <Button type="submit" className="w-full btn-shine" size="lg">Place Order</Button>
            </form>
            <div className="bg-muted p-6 rounded-xl h-fit">
              <h2 className="font-display font-bold text-xl mb-4">Order Summary</h2>
              {items.map(item => (
                <div key={item.product.id} className="flex justify-between py-3 border-b">
                  <span>{item.product.name} × {item.quantity}</span>
                  <span className="font-bold">${(item.product.price * item.quantity).toLocaleString()}</span>
                </div>
              ))}
              <div className="flex justify-between py-4 font-display font-bold text-xl">
                <span>Total</span>
                <span className="text-primary">${getTotal().toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Checkout;
