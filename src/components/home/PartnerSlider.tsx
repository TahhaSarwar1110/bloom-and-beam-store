const partners = [
  { name: 'Mayo Clinic', logo: '🏥' },
  { name: 'Johns Hopkins', logo: '🏨' },
  { name: 'Cleveland Clinic', logo: '⚕️' },
  { name: 'Mass General', logo: '🩺' },
  { name: 'UCLA Health', logo: '🏛️' },
  { name: 'Stanford Health', logo: '🏥' },
  { name: 'Northwestern', logo: '🏨' },
  { name: 'Duke Health', logo: '⚕️' },
  { name: 'UCSF Medical', logo: '🩺' },
  { name: 'NYU Langone', logo: '🏛️' },
];

export function PartnerSlider() {
  return (
    <section className="py-16 bg-muted/50 overflow-hidden">
      <div className="container mb-8">
        <h2 className="text-center font-display font-bold text-2xl md:text-3xl">
          Trusted by Leading Healthcare Institutions
        </h2>
      </div>

      <div className="relative">
        {/* Gradient Overlays */}
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-muted/50 to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-muted/50 to-transparent z-10" />

        {/* Scrolling Container */}
        <div className="flex partner-scroll">
          {/* First Set */}
          <div className="flex gap-8 pr-8">
            {partners.map((partner, i) => (
              <div
                key={`first-${i}`}
                className="flex items-center gap-3 bg-card px-8 py-4 rounded-xl border whitespace-nowrap hover:shadow-lg transition-shadow"
              >
                <span className="text-3xl">{partner.logo}</span>
                <span className="font-medium text-foreground">{partner.name}</span>
              </div>
            ))}
          </div>
          {/* Duplicate Set for Seamless Loop */}
          <div className="flex gap-8 pr-8">
            {partners.map((partner, i) => (
              <div
                key={`second-${i}`}
                className="flex items-center gap-3 bg-card px-8 py-4 rounded-xl border whitespace-nowrap hover:shadow-lg transition-shadow"
              >
                <span className="text-3xl">{partner.logo}</span>
                <span className="font-medium text-foreground">{partner.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
