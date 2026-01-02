import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { services } from '@/data/services';

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
          {services.map((service, i) => (
            <Link 
              key={service.id}
              to={`/services/${service.slug}`}
              className="bg-card p-8 rounded-2xl border card-hover text-center opacity-0 animate-fade-in-up group" 
              style={{ animationDelay: `${i * 100}ms`, animationFillMode: 'forwards' }}
            >
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-primary/20 transition-colors">
                <service.icon className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-display font-bold text-xl mb-3 group-hover:text-primary transition-colors">
                {service.title}
              </h3>
              <p className="text-muted-foreground">{service.shortDesc}</p>
            </Link>
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
