import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, FileText, ShoppingCart, DollarSign } from 'lucide-react';
import AdminLayout from './AdminLayout';

interface Stats {
  products: number;
  blogPosts: number;
  orders: number;
  revenue: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({ products: 0, blogPosts: 0, orders: 0, revenue: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [productsRes, blogRes, ordersRes] = await Promise.all([
        supabase.from('products').select('id', { count: 'exact', head: true }),
        supabase.from('blog_posts').select('id', { count: 'exact', head: true }),
        supabase.from('orders').select('id, total')
      ]);

      const revenue = ordersRes.data?.reduce((sum, order) => sum + Number(order.total), 0) || 0;

      setStats({
        products: productsRes.count || 0,
        blogPosts: blogRes.count || 0,
        orders: ordersRes.data?.length || 0,
        revenue
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { title: 'Total Products', value: stats.products, icon: Package, color: 'text-blue-500' },
    { title: 'Blog Posts', value: stats.blogPosts, icon: FileText, color: 'text-green-500' },
    { title: 'Total Orders', value: stats.orders, icon: ShoppingCart, color: 'text-purple-500' },
    { title: 'Revenue', value: `$${stats.revenue.toLocaleString()}`, icon: DollarSign, color: 'text-yellow-500' },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">Welcome to the BEDMED admin panel</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.title}>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </CardTitle>
                  <Icon className={`h-5 w-5 ${stat.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {loading ? '...' : stat.value}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <a
              href="/admin/products"
              className="p-4 border rounded-lg hover:bg-muted transition-colors"
            >
              <Package className="h-8 w-8 text-primary mb-2" />
              <h3 className="font-semibold">Manage Products</h3>
              <p className="text-sm text-muted-foreground">Add, edit, or remove products</p>
            </a>
            <a
              href="/admin/blog"
              className="p-4 border rounded-lg hover:bg-muted transition-colors"
            >
              <FileText className="h-8 w-8 text-primary mb-2" />
              <h3 className="font-semibold">Manage Blog</h3>
              <p className="text-sm text-muted-foreground">Create and publish articles</p>
            </a>
            <a
              href="/admin/orders"
              className="p-4 border rounded-lg hover:bg-muted transition-colors"
            >
              <ShoppingCart className="h-8 w-8 text-primary mb-2" />
              <h3 className="font-semibold">View Orders</h3>
              <p className="text-sm text-muted-foreground">Track customer orders</p>
            </a>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
