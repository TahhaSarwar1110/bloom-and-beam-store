import { useEffect } from 'react';

interface FAQ {
  question: string;
  answer: string;
}

interface FAQSchemaProps {
  faqs: FAQ[];
}

export function FAQSchema({ faqs }: FAQSchemaProps) {
  useEffect(() => {
    const schemaId = 'faq-schema';
    let script = document.getElementById(schemaId) as HTMLScriptElement;
    
    if (!script) {
      script = document.createElement('script');
      script.id = schemaId;
      script.type = 'application/ld+json';
      document.head.appendChild(script);
    }

    const schema = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqs.map(faq => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.answer
        }
      }))
    };

    script.textContent = JSON.stringify(schema);

    return () => {
      const existingScript = document.getElementById(schemaId);
      if (existingScript) existingScript.remove();
    };
  }, [faqs]);

  return null;
}
