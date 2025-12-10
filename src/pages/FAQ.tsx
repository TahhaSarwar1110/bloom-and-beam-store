import { Layout } from '@/components/layout/Layout';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const faqs = [
  { q: 'What warranty do you offer?', a: 'All BEDMED products come with a comprehensive 5-year warranty covering parts and labor.' },
  { q: 'Do you offer installation services?', a: 'Yes! We provide professional installation by certified technicians nationwide.' },
  { q: 'What are your shipping options?', a: 'We offer free shipping on orders over $1,000. Expedited shipping is available.' },
  { q: 'Can I request a custom quote?', a: 'Absolutely! Contact us for bulk orders or custom specifications.' },
  { q: 'Do you offer financing?', a: 'Yes, we partner with healthcare financing providers for flexible payment options.' },
];

const FAQ = () => (
  <Layout>
    <section className="py-16 md:py-24">
      <div className="container max-w-3xl">
        <div className="text-center mb-12">
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">FAQ</h1>
          <p className="text-muted-foreground">Find answers to common questions</p>
        </div>
        <Accordion type="single" collapsible className="space-y-4">
          {faqs.map((faq, i) => (
            <AccordionItem key={i} value={`item-${i}`} className="bg-card border rounded-xl px-6">
              <AccordionTrigger className="font-display font-bold hover:no-underline">{faq.q}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">{faq.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  </Layout>
);

export default FAQ;
