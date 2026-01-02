import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Bed, Ambulance, Armchair } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ServiceItem {
  name: string;
  slug: string;
}

interface ServiceCategory {
  id: string;
  title: string;
  icon: React.ReactNode;
  items: ServiceItem[];
  color: string;
}

const serviceCategories: ServiceCategory[] = [
  {
    id: 'beds',
    title: 'Beds',
    icon: <Bed className="h-12 w-12" />,
    color: 'from-primary/20 to-primary/5',
    items: [
      { name: 'Fully Electric Bed', slug: 'fully-electric-bed' },
      { name: 'Semi Electric Bed', slug: 'semi-electric-bed' },
      { name: 'Bariatric Bed', slug: 'bariatric-bed' },
      { name: 'Burn Bed', slug: 'burn-bed' },
    ],
  },
  {
    id: 'stretchers',
    title: 'Stretchers',
    icon: <Ambulance className="h-12 w-12" />,
    color: 'from-secondary/20 to-secondary/5',
    items: [
      { name: 'EMS Stretcher', slug: 'ems-stretcher' },
      { name: 'ER Stretcher', slug: 'er-stretcher' },
      { name: 'Surgery Stretcher', slug: 'surgery-stretcher' },
      { name: 'Bariatric Stretcher', slug: 'bariatric-stretcher' },
      { name: 'EVAC Stretcher', slug: 'evac-stretcher' },
    ],
  },
  {
    id: 'accessories',
    title: 'Accessories',
    icon: <Armchair className="h-12 w-12" />,
    color: 'from-accent/40 to-accent/10',
    items: [
      { name: 'Bed Side Table', slug: 'bed-side-table' },
      { name: 'Bed Over Table', slug: 'bed-over-table' },
      { name: 'Wheel Chair', slug: 'wheel-chair' },
      { name: 'Patient Recliner', slug: 'patient-recliner' },
    ],
  },
];

export function ServicesCards() {
  const [activeCard, setActiveCard] = useState<string | null>(null);

  return (
    <section className="py-20 md:py-28 bg-muted/30">
      <div className="container">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="font-display text-3xl md:text-4xl font-bold">
            Medical Equipment Solutions
          </h2>
          <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
            Explore our comprehensive range of medical beds, stretchers, and accessories 
            designed for healthcare facilities.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {serviceCategories.map((category, index) => (
            <div
              key={category.id}
              className="relative opacity-0 animate-fade-in-up"
              style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'forwards' }}
              onMouseEnter={() => setActiveCard(category.id)}
              onMouseLeave={() => setActiveCard(null)}
            >
              <div
                className={cn(
                  'bg-card rounded-2xl border p-8 text-center transition-all duration-300 cursor-pointer',
                  'hover:shadow-xl hover:-translate-y-2 hover:border-primary/50',
                  activeCard === category.id && 'border-primary shadow-xl -translate-y-2'
                )}
              >
                {/* Icon */}
                <div
                  className={cn(
                    'inline-flex items-center justify-center w-24 h-24 rounded-2xl mb-6',
                    'bg-gradient-to-br',
                    category.color,
                    'text-primary transition-transform duration-300',
                    activeCard === category.id && 'scale-110'
                  )}
                >
                  {category.icon}
                </div>

                {/* Title */}
                <h3 className="font-display text-2xl font-bold mb-4">{category.title}</h3>

                {/* Dropdown Items */}
                <div
                  className={cn(
                    'overflow-hidden transition-all duration-300 ease-out',
                    activeCard === category.id ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'
                  )}
                >
                  <div className="pt-4 border-t mt-4 space-y-2">
                    {category.items.map((item) => (
                      <Link
                        key={item.slug}
                        to={`/gallery/${item.slug}`}
                        className="block py-2 px-4 rounded-lg text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors font-medium"
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Hint text when not hovered */}
                <p
                  className={cn(
                    'text-muted-foreground text-sm mt-4 transition-opacity duration-300',
                    activeCard === category.id ? 'opacity-0' : 'opacity-100'
                  )}
                >
                  Hover to explore options
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}