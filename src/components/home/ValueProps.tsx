import { Shield, Award, Headphones, Truck, Wrench, FileCheck } from 'lucide-react';

const values = [
  {
    icon: Shield,
    title: '5-Year Warranty',
    description: 'Comprehensive coverage on all products with extended protection plans available.'
  },
  {
    icon: Award,
    title: 'FDA Certified',
    description: 'All equipment meets strict FDA regulations and healthcare industry standards.'
  },
  {
    icon: Headphones,
    title: '24/7 Support',
    description: 'Round-the-clock technical support and customer service for urgent needs.'
  },
  {
    icon: Truck,
    title: 'Fast Delivery',
    description: 'Free shipping on orders over $1,000 with expedited options available.'
  },
  {
    icon: Wrench,
    title: 'Expert Installation',
    description: 'Professional installation services by certified technicians nationwide.'
  },
  {
    icon: FileCheck,
    title: 'Compliance Ready',
    description: 'Documentation and certifications included for hospital accreditation.'
  }
];

export function ValueProps() {
  return (
    <section className="py-20 bg-foreground text-background">
      <div className="container">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-primary font-medium text-sm uppercase tracking-wider">
            Why Choose BEDMED
          </span>
          <h2 className="font-display text-3xl md:text-4xl font-bold mt-3">
            Healthcare Excellence, Delivered
          </h2>
          <p className="text-background/70 mt-4">
            We're committed to providing the highest quality medical equipment 
            backed by exceptional service and support.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {values.map((value, index) => (
            <div
              key={index}
              className="group p-6 rounded-2xl bg-background/5 border border-background/10 hover:bg-background/10 transition-all duration-300 opacity-0 animate-fade-in-up"
              style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'forwards' }}
            >
              <div className="w-14 h-14 bg-primary/20 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <value.icon className="h-7 w-7 text-primary" />
              </div>
              <h3 className="font-display font-bold text-xl mb-3">{value.title}</h3>
              <p className="text-background/70">{value.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
