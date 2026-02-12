import { useParams, Link, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { SEOHead } from '@/components/seo/SEOHead';
import { Button } from '@/components/ui/button';
import { Phone, CheckCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface Service {
  id: string;
  slug: string;
  icon: string;
  title: string;
  short_desc: string;
  hero_title: string;
  overview: string[];
  why_choose_title: string;
  features: string[];
}

const ServiceDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const fetchService = async () => {
      if (!slug) {
        setNotFound(true);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('slug', slug)
        .eq('published', true)
        .maybeSingle();

      if (error || !data) {
        setNotFound(true);
      } else {
        setService(data);
      }
      setLoading(false);
    };

    fetchService();
  }, [slug]);

  if (loading) {
    return (
      <Layout>
        <section className="py-16 md:py-24">
          <div className="container text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          </div>
        </section>
      </Layout>
    );
  }

  if (notFound || !service) {
    return <Navigate to="/services" replace />;
  }

  return (
    <Layout>
      <SEOHead
        title={`${service.title} | Mr.Bedmed Services`}
        description={service.short_desc}
        canonicalUrl={`${window.location.origin}/services/${service.slug}`}
      />

      {/* Hero Section */}
      <section className="relative h-[300px] md:h-[400px] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-primary/70">
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-40"
            style={{ 
              backgroundImage: `url('https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1920&q=80')` 
            }}
          />
        </div>
        <div className="container relative h-full flex items-center">
          <div className="max-w-2xl">
            <h1 className="font-display text-3xl md:text-5xl font-bold text-white leading-tight">
              {service.hero_title}
            </h1>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-12 md:py-16">
        <div className="container">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <h2 className="font-display text-2xl md:text-3xl font-bold mb-6">
                Service Overview
              </h2>
              <div className="space-y-4 text-muted-foreground">
                {service.overview.map((paragraph, index) => (
                  <p key={index} className="leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>

              {/* Why Choose Section */}
              <div className="mt-12">
                <h3 className="font-display text-xl md:text-2xl font-bold mb-6">
                  {service.why_choose_title}
                </h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  {service.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                      <span className="text-muted-foreground">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-card border rounded-2xl p-6 sticky top-24">
                <h3 className="font-display text-xl font-bold text-center mb-6">
                  Service Summary
                </h3>
                <Button asChild size="lg" className="w-full btn-shine mb-4">
                  <Link to={`/contact-us?service=${encodeURIComponent(service.title)}`}>
                    Request a Quote
                  </Link>
                </Button>
                <div className="flex items-center justify-center gap-2 text-muted-foreground">
                  <Phone className="h-4 w-4" />
                  <span>+1 469 767 8853</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-16 bg-primary/5">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="font-display text-2xl md:text-3xl font-bold mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-muted-foreground mb-6">
              Contact our team today to discuss your {service.title.toLowerCase()} needs.
            </p>
            <Button asChild size="lg" className="btn-shine">
              <Link to={`/contact-us?service=${encodeURIComponent(service.title)}`}>
                Contact Us Today
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ServiceDetail;
