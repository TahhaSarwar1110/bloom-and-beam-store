import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface ContactInfo {
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

export function useContactInfo() {
  const [contactInfo, setContactInfo] = useState<ContactInfo>(defaultContactInfo);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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

    fetchContactInfo();
  }, []);

  return { contactInfo, loading };
}
