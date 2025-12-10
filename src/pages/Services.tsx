import { Layout } from '@/components/layout/Layout';
import { Wrench, Truck, Phone, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const services = [
  { icon: Wrench, title: 'Equipment Repair', desc: 'Expert repair services for all medical equipment brands.' },
  { icon: Truck, title: 'Installation', desc: 'Professional installation by certified technicians.' },
  { icon: Settings, title: 'Preventive Maintenance', desc: 'Regular maintenance plans to extend equipment life.' },
  { icon: Phone, title: 'Technical Support', desc: '24/7 phone and on-site technical assistance.' },
];

const Services = () => (
  <Layout>
    <section className="py-16 md:py-24">
      <div className="container">
        <div className="text-center mb-16">
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">Our Services</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">Comprehensive support for your medical equipment needs.</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((s, i) => (
            <div key={i} className="bg-card p-8 rounded-2xl border card-hover text-center opacity-0 animate-fade-in-up" style={{ animationDelay: `${i * 100}ms`, animationFillMode: 'forwards' }}>
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6"><s.icon className="h-8 w-8 text-primary" /></div>
              <h3 className="font-display font-bold text-xl mb-3">{s.title}</h3>
              <p className="text-muted-foreground">{s.desc}</p>
            </div>
          ))}
        </div>
        <div className="text-center mt-12"><Button asChild size="lg" className="btn-shine"><Link to="/contact">Request Service</Link></Button></div>
      </div>
    </section>
  </Layout>
);

export default Services;
