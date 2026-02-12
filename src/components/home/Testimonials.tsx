import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    name: 'Dr. Sarah Chen',
    role: 'Chief of Emergency Medicine',
    hospital: 'Metro General Hospital',
    image: '👩‍⚕️',
    rating: 5,
    text: 'Mr.Bedmed stretchers have significantly improved our patient transport efficiency. The build quality is exceptional, and the 24/7 support team is incredibly responsive.'
  },
  {
    name: 'Michael Rodriguez',
    role: 'Director of Operations',
    hospital: 'Valley Medical Center',
    image: '👨‍💼',
    rating: 5,
    text: 'We\'ve outfitted our entire facility with Mr.Bedmed equipment. The durability and ease of maintenance have reduced our operating costs substantially.'
  },
  {
    name: 'Dr. Emily Watson',
    role: 'ICU Unit Manager',
    hospital: 'Coastal Health System',
    image: '👩‍⚕️',
    rating: 5,
    text: 'The ICU Premium Care Beds are game-changers. Patient comfort has improved, and our nursing staff loves the ergonomic design features.'
  }
];

export function Testimonials() {
  return (
    <section className="py-20 md:py-28 bg-accent/30">
      <div className="container">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-primary font-medium text-sm uppercase tracking-wider">
            Testimonials
          </span>
          <h2 className="font-display text-3xl md:text-4xl font-bold mt-3">
            Trusted by Healthcare Professionals
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-card p-8 rounded-2xl border relative card-hover opacity-0 animate-fade-in-up"
              style={{ animationDelay: `${index * 150}ms`, animationFillMode: 'forwards' }}
            >
              <Quote className="absolute top-6 right-6 h-10 w-10 text-primary/10" />
              
              <div className="flex items-center gap-1 mb-4">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-gold fill-gold" />
                ))}
              </div>

              <p className="text-muted-foreground mb-6 relative z-10">
                "{testimonial.text}"
              </p>

              <div className="flex items-center gap-4 pt-6 border-t">
                <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center text-2xl">
                  {testimonial.image}
                </div>
                <div>
                  <div className="font-display font-bold">{testimonial.name}</div>
                  <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                  <div className="text-sm text-primary">{testimonial.hospital}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
