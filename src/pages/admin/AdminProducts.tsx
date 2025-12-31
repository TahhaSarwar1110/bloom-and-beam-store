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
import { Plus, Pencil, Trash2 } from 'lucide-react';
import AdminLayout from './AdminLayout';
import { useAuth } from '@/hooks/useAuth';
import ImageUpload from '@/components/admin/ImageUpload';
import MultiImageUpload from '@/components/admin/MultiImageUpload';

interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  original_price: number | null;
  image_url: string | null;
  image_urls: string[] | null;
  category: string;
  features: string[];
  in_stock: boolean;
  created_at: string;
}

export default function AdminProducts() {
  const { isAdmin } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    original_price: '',
    image_url: '',
    image_urls: [] as string[],
    category: 'Stretchers',
    features: '',
    in_stock: true
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast.error('Failed to fetch products');
    } else {
      setProducts(data || []);
    }
    setLoading(false);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      original_price: '',
      image_url: '',
      image_urls: [],
      category: 'Stretchers',
      features: '',
      in_stock: true
    });
    setEditingProduct(null);
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description || '',
      price: product.price.toString(),
      original_price: product.original_price?.toString() || '',
      image_url: product.image_url || '',
      image_urls: product.image_urls || [],
      category: product.category,
      features: product.features?.join(', ') || '',
      in_stock: product.in_stock
    });
    setDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAdmin) {
      toast.error('You need admin privileges to manage products');
      return;
    }

    const productData = {
      name: formData.name,
      description: formData.description || null,
      price: parseFloat(formData.price) || 0,
      original_price: formData.original_price ? parseFloat(formData.original_price) : null,
      image_url: formData.image_url || null,
      image_urls: formData.image_urls,
      category: formData.category,
      features: formData.features.split(',').map(f => f.trim()).filter(Boolean),
      in_stock: formData.in_stock
    };

    if (editingProduct) {
      const { error } = await supabase
        .from('products')
        .update(productData)
        .eq('id', editingProduct.id);

      if (error) {
        toast.error('Failed to update product');
      } else {
        toast.success('Product updated successfully');
        fetchProducts();
        setDialogOpen(false);
        resetForm();
      }
    } else {
      const { error } = await supabase
        .from('products')
        .insert([productData]);

      if (error) {
        toast.error('Failed to create product');
      } else {
        toast.success('Product created successfully');
        fetchProducts();
        setDialogOpen(false);
        resetForm();
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (!isAdmin) {
      toast.error('You need admin privileges to delete products');
      return;
    }

    if (!confirm('Are you sure you want to delete this product?')) return;

    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (error) {
      toast.error('Failed to delete product');
    } else {
      toast.success('Product deleted successfully');
      fetchProducts();
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Products</h1>
            <p className="text-muted-foreground">Manage your product catalog</p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) resetForm(); }}>
            <DialogTrigger asChild>
              <Button disabled={!isAdmin}>
                <Plus className="h-4 w-4 mr-2" />
                Add Product
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingProduct ? 'Edit Product' : 'Add New Product'}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Product Name</Label>
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
                    <Label htmlFor="original_price">Original Price ($)</Label>
                    <Input
                      id="original_price"
                      type="number"
                      step="0.01"
                      value={formData.original_price}
                      onChange={(e) => setFormData({ ...formData, original_price: e.target.value })}
                    />
                  </div>
                </div>
                <ImageUpload
                  bucket="product-images"
                  currentUrl={formData.image_url}
                  onImageChange={(url) => setFormData({ ...formData, image_url: url })}
                  label="Main Product Image"
                />
                <MultiImageUpload
                  bucket="product-images"
                  currentUrls={formData.image_urls}
                  onImagesChange={(urls) => setFormData({ ...formData, image_urls: urls })}
                  label="Additional Images (Gallery)"
                  maxImages={10}
                />
                <div className="space-y-2">
                  <Label htmlFor="features">Features (comma separated)</Label>
                  <Input
                    id="features"
                    value={formData.features}
                    onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                    placeholder="Feature 1, Feature 2, Feature 3"
                  />
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
                    {editingProduct ? 'Update Product' : 'Create Product'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {loading ? (
          <div className="text-center py-8">Loading...</div>
        ) : products.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">No products yet. Add your first product to get started.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {products.map((product) => (
              <Card key={product.id}>
                <CardContent className="flex items-center gap-4 p-4">
                  {product.image_url && (
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                  )}
                  <div className="flex-1">
                    <h3 className="font-semibold">{product.name}</h3>
                    <p className="text-sm text-muted-foreground">{product.category}</p>
                    <p className="text-primary font-medium">${product.price}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 text-xs rounded ${product.in_stock ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {product.in_stock ? 'In Stock' : 'Out of Stock'}
                    </span>
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(product)} disabled={!isAdmin}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(product.id)} disabled={!isAdmin}>
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
