import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Plus, Pencil, Trash2, GripVertical } from 'lucide-react';
import AdminLayout from './AdminLayout';
import { useAuth } from '@/hooks/useAuth';

const iconOptions = [
  { value: 'ClipboardCheck', label: 'Clipboard Check' },
  { value: 'Wrench', label: 'Wrench' },
  { value: 'Gauge', label: 'Gauge' },
  { value: 'Calendar', label: 'Calendar' },
  { value: 'RefreshCw', label: 'Refresh' },
  { value: 'ShoppingCart', label: 'Shopping Cart' },
  { value: 'Package', label: 'Package' },
  { value: 'Trash2', label: 'Trash' },
  { value: 'FileText', label: 'File Text' },
  { value: 'Settings', label: 'Settings' },
  { value: 'Shield', label: 'Shield' },
  { value: 'Heart', label: 'Heart' },
];

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
  sort_order: number;
  published: boolean;
  created_at: string;
}

export default function AdminServices() {
  const { isAdmin } = useAuth();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [formData, setFormData] = useState({
    slug: '',
    icon: 'ClipboardCheck',
    title: '',
    short_desc: '',
    hero_title: '',
    overview: '',
    why_choose_title: 'Why Choose Our Services?',
    features: '',
    sort_order: 0,
    published: true
  });

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .order('sort_order', { ascending: true });

    if (error) {
      toast.error('Failed to fetch services');
    } else {
      setServices(data || []);
    }
    setLoading(false);
  };

  const resetForm = () => {
    setFormData({
      slug: '',
      icon: 'ClipboardCheck',
      title: '',
      short_desc: '',
      hero_title: '',
      overview: '',
      why_choose_title: 'Why Choose Our Services?',
      features: '',
      sort_order: services.length + 1,
      published: true
    });
    setEditingService(null);
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleEdit = (service: Service) => {
    setEditingService(service);
    setFormData({
      slug: service.slug,
      icon: service.icon,
      title: service.title,
      short_desc: service.short_desc,
      hero_title: service.hero_title,
      overview: service.overview.join('\n\n'),
      why_choose_title: service.why_choose_title,
      features: service.features.join(', '),
      sort_order: service.sort_order,
      published: service.published
    });
    setDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAdmin) {
      toast.error('You need admin privileges to manage services');
      return;
    }

    const serviceData = {
      slug: formData.slug || generateSlug(formData.title),
      icon: formData.icon,
      title: formData.title,
      short_desc: formData.short_desc,
      hero_title: formData.hero_title || formData.title,
      overview: formData.overview.split('\n\n').filter(Boolean),
      why_choose_title: formData.why_choose_title,
      features: formData.features.split(',').map(f => f.trim()).filter(Boolean),
      sort_order: formData.sort_order,
      published: formData.published
    };

    if (editingService) {
      const { error } = await supabase
        .from('services')
        .update(serviceData)
        .eq('id', editingService.id);

      if (error) {
        toast.error('Failed to update service');
      } else {
        toast.success('Service updated successfully');
        fetchServices();
        setDialogOpen(false);
        resetForm();
      }
    } else {
      const { error } = await supabase
        .from('services')
        .insert([serviceData]);

      if (error) {
        toast.error('Failed to create service');
        console.error(error);
      } else {
        toast.success('Service created successfully');
        fetchServices();
        setDialogOpen(false);
        resetForm();
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (!isAdmin) {
      toast.error('You need admin privileges to delete services');
      return;
    }

    if (!confirm('Are you sure you want to delete this service?')) return;

    const { error } = await supabase
      .from('services')
      .delete()
      .eq('id', id);

    if (error) {
      toast.error('Failed to delete service');
    } else {
      toast.success('Service deleted successfully');
      fetchServices();
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Services</h1>
            <p className="text-muted-foreground">Manage your service offerings</p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) resetForm(); }}>
            <DialogTrigger asChild>
              <Button disabled={!isAdmin}>
                <Plus className="h-4 w-4 mr-2" />
                Add Service
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingService ? 'Edit Service' : 'Add New Service'}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Service Title</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="slug">URL Slug</Label>
                    <Input
                      id="slug"
                      value={formData.slug}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                      placeholder="auto-generated-from-title"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="icon">Icon</Label>
                    <Select
                      value={formData.icon}
                      onValueChange={(value) => setFormData({ ...formData, icon: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select an icon" />
                      </SelectTrigger>
                      <SelectContent>
                        {iconOptions.map((icon) => (
                          <SelectItem key={icon.value} value={icon.value}>
                            {icon.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sort_order">Sort Order</Label>
                    <Input
                      id="sort_order"
                      type="number"
                      value={formData.sort_order}
                      onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) || 0 })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="short_desc">Short Description (for cards)</Label>
                  <Textarea
                    id="short_desc"
                    value={formData.short_desc}
                    onChange={(e) => setFormData({ ...formData, short_desc: e.target.value })}
                    rows={2}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="hero_title">Hero Title (for detail page)</Label>
                  <Input
                    id="hero_title"
                    value={formData.hero_title}
                    onChange={(e) => setFormData({ ...formData, hero_title: e.target.value })}
                    placeholder="Defaults to service title"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="overview">Overview (separate paragraphs with blank lines)</Label>
                  <Textarea
                    id="overview"
                    value={formData.overview}
                    onChange={(e) => setFormData({ ...formData, overview: e.target.value })}
                    rows={5}
                    placeholder="First paragraph...

Second paragraph..."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="why_choose_title">Why Choose Section Title</Label>
                  <Input
                    id="why_choose_title"
                    value={formData.why_choose_title}
                    onChange={(e) => setFormData({ ...formData, why_choose_title: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="features">Features (comma separated)</Label>
                  <Textarea
                    id="features"
                    value={formData.features}
                    onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                    rows={2}
                    placeholder="Feature 1, Feature 2, Feature 3"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <Switch
                    id="published"
                    checked={formData.published}
                    onCheckedChange={(checked) => setFormData({ ...formData, published: checked })}
                  />
                  <Label htmlFor="published">Published</Label>
                </div>

                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => { setDialogOpen(false); resetForm(); }}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    {editingService ? 'Update Service' : 'Create Service'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {loading ? (
          <div className="text-center py-8">Loading...</div>
        ) : services.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">No services yet. Add your first service to get started.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {services.map((service) => (
              <Card key={service.id}>
                <CardContent className="flex items-center gap-4 p-4">
                  <GripVertical className="h-5 w-5 text-muted-foreground" />
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <span className="text-primary text-lg font-bold">{service.sort_order}</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold">{service.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-1">{service.short_desc}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 text-xs rounded ${service.published ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                      {service.published ? 'Published' : 'Draft'}
                    </span>
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(service)} disabled={!isAdmin}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(service.id)} disabled={!isAdmin}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
