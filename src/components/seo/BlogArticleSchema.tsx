import { useEffect } from 'react';

interface BlogArticleSchemaProps {
  title: string;
  description: string;
  author: string;
  publishedTime: string;
  modifiedTime?: string;
  imageUrl?: string;
  url: string;
}

export function BlogArticleSchema({
  title,
  description,
  author,
  publishedTime,
  modifiedTime,
  imageUrl,
  url
}: BlogArticleSchemaProps) {
  useEffect(() => {
    const schemaId = 'article-schema';
    let script = document.getElementById(schemaId) as HTMLScriptElement;
    
    if (!script) {
      script = document.createElement('script');
      script.id = schemaId;
      script.type = 'application/ld+json';
      document.head.appendChild(script);
    }

    const schema = {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: title,
      description: description,
      author: {
        '@type': 'Person',
        name: author
      },
      datePublished: publishedTime,
      dateModified: modifiedTime || publishedTime,
      image: imageUrl,
      url: url,
      publisher: {
        '@type': 'Organization',
        name: 'BEDMED',
        logo: {
          '@type': 'ImageObject',
          url: `${window.location.origin}/favicon.ico`
        }
      }
    };

    script.textContent = JSON.stringify(schema);

    return () => {
      const existingScript = document.getElementById(schemaId);
      if (existingScript) existingScript.remove();
    };
  }, [title, description, author, publishedTime, modifiedTime, imageUrl, url]);

  return null;
}
