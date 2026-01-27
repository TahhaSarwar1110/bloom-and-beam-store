import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { Plus, Pencil, Trash2, X, Upload } from 'lucide-react';
import AdminLayout from './AdminLayout';
import { useAuth } from '@/hooks/useAuth';

interface Part {
  id: string;
  name: string;
  description: string | null;
  price: number;
  category: string;
  image_urls: string[];
  in_stock: boolean;
  sort_order: number;
  make: string | null;
  model: string | null;
  sku: string | null;
  condition: string;
  part_no: string | null;
  asset_no: string | null;
  oem_no: string | null;
}

export default function AdminParts() {
  const { isAdmin } = useAuth();
  const [parts, setParts] = useState<Part[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPart, setEditingPart] = useState<Part | null>(null);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'General',
    image_urls: [] as string[],
    in_stock: true,
    sort_order: 0,
    make: '',
    model: '',
    sku: '',
    condition: 'new',
    part_no: '',
    asset_no: '',
    oem_no: ''
  });

  useEffect(() => {
    fetchParts();
  }, []);

  const fetchParts = async () => {
    const { data, error } = await supabase
      .from('parts')
      .select('*')
      .order('sort_order', { ascending: true });

    if (error) {
      toast.error('Failed to fetch parts');
    } else {
      setParts(data || []);
    }
    setLoading(false);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      category: 'General',
      image_urls: [],
      in_stock: true,
      sort_order: parts.length,
      make: '',
      model: '',
      sku: '',
      condition: 'new',
      part_no: '',
      asset_no: '',
      oem_no: ''
    });
    setEditingPart(null);
  };

  const handleEdit = (part: Part) => {
    setEditingPart(part);
    setFormData({
      name: part.name,
      description: part.description || '',
      price: part.price.toString(),
      category: part.category,
      image_urls: part.image_urls || [],
      in_stock: part.in_stock,
      sort_order: part.sort_order,
      make: part.make || '',
      model: part.model || '',
      sku: part.sku || '',
      condition: part.condition || 'new',
      part_no: part.part_no || '',
      asset_no: part.asset_no || '',
      oem_no: part.oem_no || ''
    });
    setDialogOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = `parts/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('parts-images')
      .upload(filePath, file);

    if (uploadError) {
      toast.error('Failed to upload image');
      setUploading(false);
      return;
    }

    const { data: urlData } = supabase.storage
      .from('parts-images')
      .getPublicUrl(filePath);

    setFormData({
      ...formData,
      image_urls: [...formData.image_urls, urlData.publicUrl]
    });
    setUploading(false);
    toast.success('Image uploaded');
  };

  const removeImage = (index: number) => {
    setFormData({
      ...formData,
      image_urls: formData.image_urls.filter((_, i) => i !== index)
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAdmin) {
      toast.error('Admin privileges required');
      return;
    }

    const partData = {
      name: formData.name,
      description: formData.description || null,
      price: parseFloat(formData.price) || 0,
      category: formData.category,
      image_urls: formData.image_urls,
      in_stock: formData.in_stock,
      sort_order: formData.sort_order,
      make: formData.make || null,
      model: formData.model || null,
      sku: formData.sku || null,
      condition: formData.condition,
      part_no: formData.part_no || null,
      asset_no: formData.asset_no || null,
      oem_no: formData.oem_no || null
    };

    if (editingPart) {
      const { error } = await supabase
        .from('parts')
        .update(partData)
        .eq('id', editingPart.id);

      if (error) {
        toast.error('Failed to update part');
      } else {
        toast.success('Part updated');
        fetchParts();
        setDialogOpen(false);
        resetForm();
      }
    } else {
      const { error } = await supabase
        .from('parts')
        .insert([partData]);

      if (error) {
        toast.error('Failed to create part');
      } else {
        toast.success('Part created');
        fetchParts();
        setDialogOpen(false);
        resetForm();
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (!isAdmin) {
      toast.error('Admin privileges required');
      return;
    }

    if (!confirm('Delete this part?')) return;

    const { error } = await supabase
      .from('parts')
      .delete()
      .eq('id', id);

    if (error) {
      toast.error('Failed to delete part');
    } else {
      toast.success('Part deleted');
      fetchParts();
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Parts</h1>
            <p className="text-muted-foreground">Manage spare parts with image carousels</p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) resetForm(); }}>
            <DialogTrigger asChild>
              <Button disabled={!isAdmin}>
                <Plus className="h-4 w-4 mr-2" />
                Add Part
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingPart ? 'Edit Part' : 'Add New Part'}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Part Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Input
                      id="category"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    />
                  </div>
                </div>
                
                {/* Condition Dropdown */}
                <div className="space-y-2">
                  <Label htmlFor="condition">Condition</Label>
                  <select
                    id="condition"
                    value={formData.condition}
                    onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    <option value="new">New</option>
                    <option value="used">Used</option>
                    <option value="refurbished">Refurbished</option>
                  </select>
                </div>

                {/* Part Numbers Row */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="part_no">Part No.</Label>
                    <Input
                      id="part_no"
                      value={formData.part_no}
                      onChange={(e) => setFormData({ ...formData, part_no: e.target.value })}
                      placeholder="e.g., P-12345"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="asset_no">Asset No.</Label>
                    <Input
                      id="asset_no"
                      value={formData.asset_no}
                      onChange={(e) => setFormData({ ...formData, asset_no: e.target.value })}
                      placeholder="e.g., A-67890"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="oem_no">OEM No.</Label>
                    <Input
                      id="oem_no"
                      value={formData.oem_no}
                      onChange={(e) => setFormData({ ...formData, oem_no: e.target.value })}
                      placeholder="e.g., OEM-11111"
                    />
                  </div>
                </div>

                {/* Make, Model, SKU Fields */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="make">Manufacturer</Label>
                    <Input
                      id="make"
                      value={formData.make}
                      onChange={(e) => setFormData({ ...formData, make: e.target.value })}
                      placeholder="e.g., Stryker"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="model">Model</Label>
                    <Input
                      id="model"
                      value={formData.model}
                      onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                      placeholder="e.g., InTouch"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sku">SKU</Label>
                    <Input
                      id="sku"
                      value={formData.sku}
                      onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                      placeholder="e.g., STR-001"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="price">Price ($)</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      required
                    />
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
                
                {/* Image Carousel Upload */}
                <div className="space-y-2">
                  <Label>Images (Carousel)</Label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {formData.image_urls.map((url, index) => (
                      <div key={index} className="relative group">
                        <img src={url} alt={`Part ${index + 1}`} className="w-20 h-20 object-cover rounded" />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                  <label className="flex items-center justify-center w-full h-20 border-2 border-dashed border-border rounded cursor-pointer hover:bg-muted/50">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      disabled={uploading}
                    />
                    {uploading ? (
                      <span className="text-muted-foreground">Uploading...</span>
                    ) : (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Upload className="h-4 w-4" />
                        <span>Add Image</span>
                      </div>
                    )}
                  </label>
                </div>

                <div className="flex items-center gap-2">
                  <Switch
                    id="in_stock"
                    checked={formData.in_stock}
                    onCheckedChange={(checked) => setFormData({ ...formData, in_stock: checked })}
                  />
                  <Label htmlFor="in_stock">In Stock</Label>
                </div>
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => { setDialogOpen(false); resetForm(); }}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    {editingPart ? 'Update Part' : 'Create Part'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {loading ? (
          <div className="text-center py-8">Loading...</div>
        ) : parts.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">No parts yet. Add your first part to get started.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {parts.map((part) => (
              <Card key={part.id}>
                <CardContent className="flex items-center gap-4 p-4">
                  {part.image_urls && part.image_urls.length > 0 && (
                    <img
                      src={part.image_urls[0]}
                      alt={part.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                  )}
                  <div className="flex-1">
                    <h3 className="font-semibold">{part.name}</h3>
                    <p className="text-sm text-muted-foreground">{part.category} • {part.image_urls?.length || 0} images</p>
                    <p className="text-primary font-medium">${part.price}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 text-xs rounded ${part.in_stock ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {part.in_stock ? 'In Stock' : 'Out of Stock'}
                    </span>
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(part)} disabled={!isAdmin}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(part.id)} disabled={!isAdmin}>
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
