import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const parts = [
  { name: 'Caster Wheels', price: 89, category: 'Mobility' },
  { name: 'Side Rails', price: 149, category: 'Safety' },
  { name: 'Mattress Covers', price: 199, category: 'Comfort' },
  { name: 'IV Pole Mounts', price: 129, category: 'Accessories' },
  { name: 'Brake Systems', price: 249, category: 'Mobility' },
  { name: 'Push Handles', price: 79, category: 'Ergonomics' },
];

const Parts = () => (
  <Layout>
    <section className="py-16 md:py-24">
      <div className="container">
        <div className="text-center mb-16">
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">Spare Parts</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">OEM replacement parts for all BEDMED equipment.</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {parts.map((part, i) => (
            <div key={i} className="bg-card p-6 rounded-xl border card-hover flex justify-between items-center opacity-0 animate-fade-in-up" style={{ animationDelay: `${i * 100}ms`, animationFillMode: 'forwards' }}>
              <div>
                <span className="text-xs text-primary font-medium uppercase">{part.category}</span>
                <h3 className="font-display font-bold text-lg">{part.name}</h3>
                <p className="text-primary font-bold">${part.price}</p>
              </div>
              <Button size="sm" className="btn-shine">Order</Button>
            </div>
          ))}
        </div>
        <div className="text-center mt-12"><Button asChild variant="outline" size="lg"><Link to="/contact">Request Custom Part</Link></Button></div>
      </div>
    </section>
  </Layout>
);

export default Parts;
