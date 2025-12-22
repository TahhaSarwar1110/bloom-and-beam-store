import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Layout } from '@/components/layout/Layout';
import { SEOHead } from '@/components/seo/SEOHead';
import { hospitalBedCategories } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, ShoppingCart, Check } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { Product } from '@/data/products';

export default function CategoryDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { addToCart } = useCart();

  const category = hospitalBedCategories.find(cat => cat.slug === slug);

  const { data: products, isLoading } = useQuery({
    queryKey: ['category-products', slug],
    queryFn: async () => {
      // Map slug to category name for database query
      const categoryName = category?.name || '';
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('category', categoryName)
        .eq('in_stock', true);
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!category,
  });

  if (!category) {
    return (
      <Layout>
        <div className="container py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Category Not Found</h1>
          <p className="text-muted-foreground mb-8">The category you're looking for doesn't exist.</p>
          <Button asChild>
            <Link to="/products">View All Products</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  const categoryDetails: Record<string, { features: string[]; benefits: string[]; useCases: string[] }> = {
    'manual-hospital-beds': {
      features: ['Hand-crank height adjustment', 'Manual head and foot positioning', 'Durable steel frame construction', 'Locking caster wheels', 'Side rail compatibility'],
      benefits: ['Cost-effective solution', 'No electricity required', 'Simple operation', 'Low maintenance', 'Reliable performance'],
      useCases: ['Long-term care facilities', 'Rural healthcare settings', 'Backup beds for power outages', 'Budget-conscious facilities']
    },
    'semi-electric-hospital-beds': {
      features: ['Electric head and foot controls', 'Manual crank height adjustment', 'Pendant controller', 'Battery backup option', 'Quiet motor operation'],
      benefits: ['Balance of cost and convenience', 'Patient-controlled positioning', 'Reduced caregiver strain', 'Energy efficient'],
      useCases: ['Nursing homes', 'Rehabilitation centers', 'Home healthcare', 'Assisted living facilities']
    },
    'fully-electric-hospital-beds': {
      features: ['Full electric controls', 'Programmable positions', 'Trendelenburg capability', 'Low height function', 'Integrated scale option'],
      benefits: ['Maximum convenience', 'Reduced injury risk', 'Patient independence', 'Precise positioning'],
      useCases: ['Acute care hospitals', 'ICU settings', 'Post-surgical care', 'Specialty clinics']
    },
    'icu-critical-care-beds': {
      features: ['360° patient access', 'Integrated monitoring', 'CPR function', 'X-ray translucent deck', 'Lateral rotation therapy'],
      benefits: ['Enhanced patient care', 'Improved clinical outcomes', 'Caregiver efficiency', 'Infection control features'],
      useCases: ['Intensive Care Units', 'Cardiac Care Units', 'Trauma centers', 'Emergency departments']
    },
    'low-beds-fall-prevention': {
      features: ['Ultra-low deck height (7-8 inches)', 'Floor-level capability', 'Built-in alarm systems', 'Soft-touch bumpers', 'High-visibility side rails'],
      benefits: ['Reduced fall injuries', 'Patient safety', 'Peace of mind for caregivers', 'Regulatory compliance'],
      useCases: ['Dementia care units', 'Fall-risk patients', 'Psychiatric facilities', 'Senior care homes']
    },
    'bariatric-hospital-beds': {
      features: ['High weight capacity (600-1000 lbs)', 'Extra-wide sleep surface', 'Reinforced frame', 'Heavy-duty motors', 'Specialized mattress compatibility'],
      benefits: ['Patient dignity', 'Caregiver safety', 'Durability', 'Proper weight distribution'],
      useCases: ['Bariatric care units', 'General hospitals', 'Long-term care', 'Home healthcare']
    },
    'pediatric-hospital-beds': {
      features: ['Child-safe design', 'Colorful aesthetics', 'Enclosed sides', 'Parent accommodation', 'Growth-adaptable sizing'],
      benefits: ['Child-friendly environment', 'Parent peace of mind', 'Safety compliance', 'Therapeutic atmosphere'],
      useCases: ['Pediatric hospitals', 'Children\'s wards', 'Pediatric ICU', 'Specialty clinics']
    },
    'maternity-ob-gyn-beds': {
      features: ['Stirrup attachments', 'Quick positioning', 'Removable sections', 'Trendelenburg position', 'Easy cleaning surfaces'],
      benefits: ['Versatile positioning', 'Patient comfort', 'Efficient delivery support', 'Infection control'],
      useCases: ['Labor and delivery rooms', 'OB-GYN clinics', 'Birthing centers', 'Women\'s health facilities']
    },
    'fowler-beds': {
      features: ['Semi-upright positioning', 'Adjustable backrest angles', 'Knee gatch function', 'Cardiac chair position', 'Easy operation'],
      benefits: ['Respiratory support', 'Patient comfort', 'Reduced aspiration risk', 'Post-operative care'],
      useCases: ['Cardiac care', 'Respiratory therapy', 'Post-surgical recovery', 'General medical care']
    },
    'orthopedic-hospital-beds': {
      features: ['Traction frame compatibility', 'Overhead trapeze bar', 'Firm mattress platform', 'Split frame design', 'Weight-bearing support'],
      benefits: ['Proper alignment', 'Mobility assistance', 'Healing support', 'Patient independence'],
      useCases: ['Orthopedic surgery recovery', 'Fracture care', 'Joint replacement recovery', 'Physical therapy']
    },
    'adjustable-hospital-beds': {
      features: ['Multiple position presets', 'Memory settings', 'Massage function options', 'USB charging ports', 'Under-bed lighting'],
      benefits: ['Personalized comfort', 'Enhanced patient experience', 'Modern amenities', 'Flexibility'],
      useCases: ['Private rooms', 'VIP suites', 'Long-term stays', 'Rehabilitation']
    },
    'air-therapy-beds': {
      features: ['Alternating pressure system', 'Low air loss technology', 'Microclimate management', 'Zone control', 'Automatic adjustment'],
      benefits: ['Pressure ulcer prevention', 'Wound healing support', 'Patient comfort', 'Reduced turning needs'],
      useCases: ['Wound care units', 'Burn care', 'Long-term care', 'ICU settings']
    },
    'specialty-therapy-beds': {
      features: ['Specialized therapy modes', 'Pulmonary support', 'Percussion therapy', 'Rotation therapy', 'Custom configurations'],
      benefits: ['Targeted treatment', 'Improved outcomes', 'Reduced complications', 'Specialized care'],
      useCases: ['Pulmonary care', 'Neurological units', 'Spinal cord injury', 'Critical care']
    },
    'examination-beds': {
      features: ['Paper roll holder', 'Step stool storage', 'Easy cleaning surface', 'Height adjustment', 'Sturdy construction'],
      benefits: ['Efficient examinations', 'Patient accessibility', 'Hygienic design', 'Versatile use'],
      useCases: ['Doctor offices', 'Outpatient clinics', 'Urgent care', 'Physical therapy']
    },
    'recovery-beds': {
      features: ['Easy patient monitoring', 'Quick positioning', 'Side rail controls', 'Drainage bag hooks', 'IV pole mounts'],
      benefits: ['Safe recovery environment', 'Caregiver accessibility', 'Patient comfort', 'Efficient care'],
      useCases: ['Post-anesthesia care', 'Same-day surgery', 'Recovery rooms', 'Observation units']
    },
    'stretchers-trolleys': {
      features: ['Easy maneuverability', 'Emergency features', 'Compact storage', 'Quick-release rails', 'Radiolucent top'],
      benefits: ['Rapid patient transport', 'Emergency readiness', 'Space efficiency', 'Versatile use'],
      useCases: ['Emergency departments', 'Operating rooms', 'Radiology', 'Patient transport']
    },
    'homecare-hospital-beds': {
      features: ['Home-friendly design', 'Quiet operation', 'Wood grain aesthetics', 'Compact footprint', 'Easy assembly'],
      benefits: ['Home comfort', 'Independence', 'Caregiver support', 'Quality of life'],
      useCases: ['Home healthcare', 'Hospice care', 'Chronic illness management', 'Aging in place']
    },
    'isolation-beds': {
      features: ['Negative pressure compatibility', 'Easy decontamination', 'Sealed surfaces', 'Disposable components', 'Infection control features'],
      benefits: ['Infection prevention', 'Staff protection', 'Patient isolation', 'Regulatory compliance'],
      useCases: ['Infectious disease units', 'Quarantine rooms', 'Immunocompromised patients', 'Pandemic response']
    },
    'psychiatric-beds': {
      features: ['Tamper-resistant design', 'No ligature points', 'Soft edges', 'Weighted construction', 'Integrated safety features'],
      benefits: ['Patient safety', 'Self-harm prevention', 'Durable construction', 'Therapeutic environment'],
      useCases: ['Psychiatric hospitals', 'Mental health units', 'Crisis stabilization', 'Behavioral health']
    },
    'convertible-chair-beds': {
      features: ['Chair position capability', 'Cardiac chair mode', 'Easy transitions', 'Reclining options', 'Compact design'],
      benefits: ['Versatility', 'Patient mobility', 'Space efficiency', 'Respiratory support'],
      useCases: ['Dialysis centers', 'Outpatient procedures', 'Cardiac care', 'Rehabilitation']
    },
  };

  const details = categoryDetails[slug || ''] || {
    features: ['Premium quality materials', 'Advanced safety features', 'Easy maintenance', 'Long-lasting durability'],
    benefits: ['Enhanced patient care', 'Improved comfort', 'Reliable performance', 'Cost-effective solution'],
    useCases: ['Hospitals', 'Clinics', 'Healthcare facilities', 'Home care']
  };

  return (
    <Layout>
      <SEOHead 
        title={`${category.name} | BEDMED Hospital Beds`}
        description={category.description}
        keywords={`${category.name}, hospital beds, medical beds, healthcare equipment`}
      />
      
      <div className="min-h-screen bg-gradient-to-b from-background to-accent/20">
        {/* Hero Section */}
        <section className="py-16 md:py-24 bg-primary/5">
          <div className="container">
            <Button asChild variant="ghost" className="mb-6">
              <Link to="/products">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to All Products
              </Link>
            </Button>
            
            <div className="max-w-4xl">
              <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-4">
                {category.name}
              </h1>
              <p className="text-xl text-muted-foreground">
                {category.description}
              </p>
            </div>
          </div>
        </section>

        {/* Features & Benefits */}
        <section className="py-16">
          <div className="container">
            <div className="grid md:grid-cols-3 gap-8 mb-16">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-4 text-primary">Key Features</h3>
                  <ul className="space-y-3">
                    {details.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-4 text-primary">Benefits</h3>
                  <ul className="space-y-3">
                    {details.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-4 text-primary">Ideal For</h3>
                  <ul className="space-y-3">
                    {details.useCases.map((useCase, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                        <span>{useCase}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* Products in this Category */}
            <div>
              <h2 className="text-3xl font-bold mb-8">Products in {category.name}</h2>
              
              {isLoading ? (
                <div className="grid md:grid-cols-3 gap-6">
                  {[1, 2, 3].map(i => (
                    <Card key={i} className="animate-pulse">
                      <CardContent className="p-6">
                        <div className="h-48 bg-muted rounded-lg mb-4" />
                        <div className="h-4 bg-muted rounded w-3/4 mb-2" />
                        <div className="h-4 bg-muted rounded w-1/2" />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : products && products.length > 0 ? (
                <div className="grid md:grid-cols-3 gap-6">
                  {products.map((product) => (
                    <Card key={product.id} className="group hover:shadow-lg transition-shadow">
                      <CardContent className="p-6">
                        {product.image_url && (
                          <div className="aspect-square mb-4 overflow-hidden rounded-lg bg-muted">
                            <img 
                              src={product.image_url} 
                              alt={product.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                            />
                          </div>
                        )}
                        <h3 className="font-bold text-lg mb-2">{product.name}</h3>
                        <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                          {product.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-2xl font-bold text-primary">
                            ${product.price.toLocaleString()}
                          </span>
                          <Button 
                            size="sm"
                            onClick={() => {
                              const cartProduct: Product = {
                                id: product.id,
                                name: product.name,
                                description: product.description || '',
                                price: product.price,
                                image: product.image_url || '',
                                category: product.category,
                                features: product.features || [],
                                inStock: product.in_stock,
                                rating: 4.5,
                                reviews: 0
                              };
                              addToCart(cartProduct);
                            }}
                          >
                            <ShoppingCart className="h-4 w-4 mr-2" />
                            Add
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="py-12 text-center">
                    <p className="text-muted-foreground mb-4">
                      No products currently available in this category.
                    </p>
                    <p className="text-sm text-muted-foreground mb-6">
                      Contact us for custom orders or to inquire about upcoming inventory.
                    </p>
                    <Button asChild>
                      <Link to="/contact">Request a Quote</Link>
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-primary/5">
          <div className="container text-center">
            <h2 className="text-3xl font-bold mb-4">Need Help Choosing?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
              Our healthcare equipment specialists are ready to help you find the perfect {category.name.toLowerCase()} for your facility.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button asChild size="lg">
                <Link to="/contact">Contact Our Experts</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <a href="tel:1-800-BEDMED-1">Call 1-800-BEDMED-1</a>
              </Button>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}
