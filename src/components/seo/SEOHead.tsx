import { useEffect } from 'react';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  canonicalUrl?: string;
  ogImage?: string;
  ogType?: 'website' | 'article';
  article?: {
    author?: string;
    publishedTime?: string;
    modifiedTime?: string;
  };
}

export function SEOHead({
  title = 'BEDMED - Premium Medical Equipment',
  description = 'Quality hospital stretchers, medical beds, and healthcare equipment. Trusted by 500+ healthcare facilities.',
  keywords,
  canonicalUrl,
  ogImage,
  ogType = 'website',
  article
}: SEOHeadProps) {
  useEffect(() => {
    // Set title
    document.title = title;

    // Update or create meta tags
    const updateMeta = (name: string, content: string, property?: boolean) => {
      const attr = property ? 'property' : 'name';
      let meta = document.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement;
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute(attr, name);
        document.head.appendChild(meta);
      }
      meta.content = content;
    };

    updateMeta('description', description);
    if (keywords) updateMeta('keywords', keywords);

    // Open Graph
    updateMeta('og:title', title, true);
    updateMeta('og:description', description, true);
    updateMeta('og:type', ogType, true);
    if (ogImage) updateMeta('og:image', ogImage, true);
    if (canonicalUrl) updateMeta('og:url', canonicalUrl, true);

    // Twitter Card
    updateMeta('twitter:card', 'summary_large_image');
    updateMeta('twitter:title', title);
    updateMeta('twitter:description', description);
    if (ogImage) updateMeta('twitter:image', ogImage);

    // Article specific
    if (article) {
      if (article.author) updateMeta('article:author', article.author, true);
      if (article.publishedTime) updateMeta('article:published_time', article.publishedTime, true);
      if (article.modifiedTime) updateMeta('article:modified_time', article.modifiedTime, true);
    }

    // Canonical URL
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (canonicalUrl) {
      if (!canonical) {
        canonical = document.createElement('link');
        canonical.rel = 'canonical';
        document.head.appendChild(canonical);
      }
      canonical.href = canonicalUrl;
    } else if (canonical) {
      canonical.remove();
    }

    return () => {
      // Cleanup is optional since we're updating in place
    };
  }, [title, description, keywords, canonicalUrl, ogImage, ogType, article]);

  return null;
}
