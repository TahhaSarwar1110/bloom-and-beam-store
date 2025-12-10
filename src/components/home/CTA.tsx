import { Link } from 'react-router-dom';
import { ArrowRight, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function CTA() {
  return (
    <section className="py-20">
      <div className="container">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary to-primary/80 text-primary-foreground p-8 md:p-16">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
              backgroundSize: '30px 30px'
            }} />
          </div>

          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="text-center lg:text-left">
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
                Ready to Upgrade Your Medical Equipment?
              </h2>
              <p className="text-primary-foreground/80 text-lg max-w-xl">
                Get a personalized quote for your healthcare facility. 
                Our team is ready to help you find the perfect solutions.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" variant="secondary" className="btn-shine text-base">
                <Link to="/contact">
                  Get a Quote
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="bg-transparent border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 text-base">
                <Phone className="mr-2 h-5 w-5" />
                1-800-BEDMED-1
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
