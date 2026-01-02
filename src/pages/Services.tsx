import { Layout } from '@/components/layout/Layout';
import { 
  ClipboardCheck, 
  Wrench, 
  Gauge, 
  Calendar, 
  RefreshCw, 
  ShoppingCart, 
  Package, 
  Trash2, 
  FileText 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const services = [
  { 
    icon: ClipboardCheck, 
    title: 'Biomedical Equipment Inspection', 
    desc: 'Comprehensive safety, functionality, and performance inspections to ensure compliance with medical standards.' 
  },
  { 
    icon: Wrench, 
    title: 'Medical Equipment Repair & Maintenance', 
    desc: 'Reliable on-site and in-house repair and maintenance services to keep equipment operating efficiently.' 
  },
  { 
    icon: Gauge, 
    title: 'Calibration Services', 
    desc: 'Precise calibration services to maintain accuracy and meet regulatory requirements.' 
  },
  { 
    icon: Calendar, 
    title: 'Preventive Maintenance (PM Services)', 
    desc: 'Scheduled maintenance programs designed to prevent equipment failure and reduce downtime.' 
  },
  { 
    icon: RefreshCw, 
    title: 'Refurbishing Services', 
    desc: 'Restoration of used medical equipment to like-new condition through thorough testing and servicing.' 
  },
  { 
    icon: ShoppingCart, 
    title: 'New & Pre-Owned Medical Equipment Sales', 
    desc: 'Supply of high-quality new and certified pre-owned medical equipment.' 
  },
  { 
    icon: Package, 
    title: 'Medical Equipment Rental', 
    desc: 'Flexible short-term and long-term rental solutions for healthcare facilities.' 
  },
  { 
    icon: Trash2, 
    title: 'Disposition & Asset Management', 
    desc: 'Compliant disposal and effective management of outdated or unused medical equipment assets.' 
  },
  { 
    icon: FileText, 
    title: 'Service Contracts (AMC / CMC)', 
    desc: 'Annual and comprehensive maintenance contracts for complete equipment support.' 
  },
];

const Services = () => (
  <Layout>
    <section className="py-16 md:py-24">
      <div className="container">
        <div className="text-center mb-16">
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">Our Services</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Comprehensive biomedical equipment support and services for healthcare facilities.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((s, i) => (
            <div 
              key={i} 
              className="bg-card p-8 rounded-2xl border card-hover text-center opacity-0 animate-fade-in-up" 
              style={{ animationDelay: `${i * 100}ms`, animationFillMode: 'forwards' }}
            >
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <s.icon className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-display font-bold text-xl mb-3">{s.title}</h3>
              <p className="text-muted-foreground">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* CTA Section */}
    <section className="py-16 md:py-24 bg-primary/5">
      <div className="container">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
            Need Professional Equipment Services?
          </h2>
          <p className="text-muted-foreground text-lg mb-8">
            Get in touch with our team of experts for reliable biomedical equipment services tailored to your healthcare facility's needs.
          </p>
          <Button asChild size="lg" className="btn-shine">
            <Link to="/contact">Request a Service / Contact Us</Link>
          </Button>
        </div>
      </div>
    </section>
  </Layout>
);

export default Services;
