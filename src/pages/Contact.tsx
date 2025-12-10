import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Contact = () => {
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({ title: 'Message Sent!', description: 'We\'ll get back to you within 24 hours.' });
  };

  return (
    <Layout>
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="text-center mb-16">
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">Contact Us</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">Have questions? We'd love to hear from you.</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            <div className="space-y-8">
              {[
                { icon: Phone, title: 'Phone', content: '1-800-BEDMED-1' },
                { icon: Mail, title: 'Email', content: 'info@bedmed.com' },
                { icon: MapPin, title: 'Address', content: '123 Medical Drive, Healthcare City, HC 12345' },
                { icon: Clock, title: 'Hours', content: 'Mon-Fri: 8AM-6PM EST' },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-4 p-6 bg-card rounded-xl border card-hover">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center"><item.icon className="h-6 w-6 text-primary" /></div>
                  <div><h3 className="font-display font-bold">{item.title}</h3><p className="text-muted-foreground">{item.content}</p></div>
                </div>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="bg-card p-8 rounded-2xl border space-y-6">
              <div className="grid sm:grid-cols-2 gap-4">
                <div><label className="text-sm font-medium mb-2 block">Name</label><Input placeholder="Your name" required /></div>
                <div><label className="text-sm font-medium mb-2 block">Email</label><Input type="email" placeholder="your@email.com" required /></div>
              </div>
              <div><label className="text-sm font-medium mb-2 block">Subject</label><Input placeholder="How can we help?" required /></div>
              <div><label className="text-sm font-medium mb-2 block">Message</label><Textarea placeholder="Tell us more..." rows={5} required /></div>
              <Button type="submit" className="w-full btn-shine" size="lg">Send Message</Button>
            </form>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Contact;
