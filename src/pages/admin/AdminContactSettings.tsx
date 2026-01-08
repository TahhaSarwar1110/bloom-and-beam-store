import { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Save, Phone, Facebook, Twitter, Linkedin, Instagram } from 'lucide-react';
import type { Json } from '@/integrations/supabase/types';

interface ContactInfo {
  phone: string;
  email: string;
  address_line1: string;
  address_line2: string;
  working_hours: string;
  social_links: {
    facebook: string;
    twitter: string;
    linkedin: string;
    instagram: string;
  };
}

const defaultContactInfo: ContactInfo = {
  phone: '+1 469 767 8853',
  email: 'service@mbmts.com',
  address_line1: '555 N. 5th St, Suite 109',
  address_line2: 'Garland, TX 75040',
  working_hours: 'Mon–Fri: 8 AM – 5 PM CST',
  social_links: {
    facebook: '',
    twitter: '',
    linkedin: '',
    instagram: ''
  }
};

export default function AdminContactSettings() {
  const { isAdmin } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [contactInfo, setContactInfo] = useState<ContactInfo>(defaultContactInfo);

  useEffect(() => {
    fetchContactInfo();
  }, []);

  const fetchContactInfo = async () => {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('value')
        .eq('key', 'contact_info')
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      if (data?.value) {
        setContactInfo(data.value as unknown as ContactInfo);
      }
    } catch (error) {
      console.error('Error fetching contact info:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveContactInfo = async () => {
    if (!isAdmin) {
      toast({ title: 'Unauthorized', variant: 'destructive' });
      return;
    }

    setSaving(true);
    try {
      // Check if record exists
      const { data: existing } = await supabase
        .from('site_settings')
        .select('id')
        .eq('key', 'contact_info')
        .single();

      let error;
      const valueAsJson = JSON.parse(JSON.stringify(contactInfo)) as Json;
      
      if (existing) {
        const result = await supabase
          .from('site_settings')
          .update({ value: valueAsJson, updated_at: new Date().toISOString() })
          .eq('key', 'contact_info');
        error = result.error;
      } else {
        const result = await supabase
          .from('site_settings')
          .insert([{ key: 'contact_info', value: valueAsJson }]);
        error = result.error;
      }

      if (error) throw error;
      toast({ title: 'Contact info saved successfully!' });
    } catch (error) {
      console.error('Error saving contact info:', error);
      toast({ title: 'Failed to save', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const updateField = (field: keyof ContactInfo, value: string) => {
    setContactInfo(prev => ({ ...prev, [field]: value }));
  };

  const updateSocialLink = (platform: keyof ContactInfo['social_links'], value: string) => {
    setContactInfo(prev => ({
      ...prev,
      social_links: { ...prev.social_links, [platform]: value }
    }));
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Contact Settings</h1>
          <Button onClick={saveContactInfo} disabled={saving}>
            {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            Save Changes
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="h-5 w-5" /> Contact Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  value={contactInfo.phone}
                  onChange={(e) => updateField('phone', e.target.value)}
                  placeholder="+1 234 567 8900"
                />
              </div>
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={contactInfo.email}
                  onChange={(e) => updateField('email', e.target.value)}
                  placeholder="contact@example.com"
                />
              </div>
              <div>
                <Label htmlFor="address1">Address Line 1</Label>
                <Input
                  id="address1"
                  value={contactInfo.address_line1}
                  onChange={(e) => updateField('address_line1', e.target.value)}
                  placeholder="123 Main St, Suite 100"
                />
              </div>
              <div>
                <Label htmlFor="address2">Address Line 2 (City, State, ZIP)</Label>
                <Input
                  id="address2"
                  value={contactInfo.address_line2}
                  onChange={(e) => updateField('address_line2', e.target.value)}
                  placeholder="City, State 12345"
                />
              </div>
              <div>
                <Label htmlFor="hours">Working Hours</Label>
                <Input
                  id="hours"
                  value={contactInfo.working_hours}
                  onChange={(e) => updateField('working_hours', e.target.value)}
                  placeholder="Mon–Fri: 9 AM – 5 PM"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Social Media Links
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="facebook" className="flex items-center gap-2">
                  <Facebook className="h-4 w-4" /> Facebook URL
                </Label>
                <Input
                  id="facebook"
                  value={contactInfo.social_links.facebook}
                  onChange={(e) => updateSocialLink('facebook', e.target.value)}
                  placeholder="https://facebook.com/yourpage"
                />
              </div>
              <div>
                <Label htmlFor="twitter" className="flex items-center gap-2">
                  <Twitter className="h-4 w-4" /> Twitter/X URL
                </Label>
                <Input
                  id="twitter"
                  value={contactInfo.social_links.twitter}
                  onChange={(e) => updateSocialLink('twitter', e.target.value)}
                  placeholder="https://twitter.com/yourhandle"
                />
              </div>
              <div>
                <Label htmlFor="linkedin" className="flex items-center gap-2">
                  <Linkedin className="h-4 w-4" /> LinkedIn URL
                </Label>
                <Input
                  id="linkedin"
                  value={contactInfo.social_links.linkedin}
                  onChange={(e) => updateSocialLink('linkedin', e.target.value)}
                  placeholder="https://linkedin.com/company/yourcompany"
                />
              </div>
              <div>
                <Label htmlFor="instagram" className="flex items-center gap-2">
                  <Instagram className="h-4 w-4" /> Instagram URL
                </Label>
                <Input
                  id="instagram"
                  value={contactInfo.social_links.instagram}
                  onChange={(e) => updateSocialLink('instagram', e.target.value)}
                  placeholder="https://instagram.com/yourhandle"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
