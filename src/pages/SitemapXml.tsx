import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export default function SitemapXml() {
  const [xml, setXml] = useState<string | null>(null);

  useEffect(() => {
    const fetchSitemap = async () => {
      const { data, error } = await supabase.functions.invoke('sitemap');
      if (!error && data) {
        // data may be a string or need text extraction
        const text = typeof data === 'string' ? data : await new Response(data).text();
        setXml(text);
        // Set content type for the page
        document.title = 'Sitemap';
      }
    };
    fetchSitemap();
  }, []);

  if (!xml) return <pre>Loading sitemap...</pre>;

  return (
    <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', fontFamily: 'monospace', padding: '1rem' }}>
      {xml}
    </pre>
  );
}
