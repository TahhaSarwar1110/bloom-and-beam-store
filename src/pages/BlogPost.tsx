import { useEffect, useState } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Calendar, Clock, User, ArrowLeft, Share2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { SEOHead } from '@/components/seo/SEOHead';
import { BlogArticleSchema } from '@/components/seo/BlogArticleSchema';

interface BlogPost {
  id: string;
  title: string;
  slug: string | null;
  excerpt: string | null;
  content: string;
  image_url: string | null;
  category: string;
  author: string;
  read_time: string | null;
  meta_title: string | null;
  meta_description: string | null;
  meta_keywords: string | null;
  canonical_url: string | null;
  created_at: string;
  updated_at: string;
  published: boolean;
}

const BlogPostPage = () => {
  const { id } = useParams();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      // Try to find by slug first, then by id
      let { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('slug', id)
        .eq('published', true)
        .maybeSingle();

      if (!data) {
        const result = await supabase
          .from('blog_posts')
          .select('*')
          .eq('id', id)
          .eq('published', true)
          .maybeSingle();
        data = result.data;
        error = result.error;
      }

      if (error || !data) {
        setNotFound(true);
      } else {
        setPost(data);
        
        // Fetch related posts
        const { data: related } = await supabase
          .from('blog_posts')
          .select('*')
          .eq('published', true)
          .neq('id', data.id)
          .limit(3);
        
        setRelatedPosts(related || []);
      }
      setLoading(false);
    };

    fetchPost();
  }, [id]);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Link copied to clipboard!');
  };

  if (loading) {
    return (
      <Layout>
        <div className="container py-24 text-center">Loading...</div>
      </Layout>
    );
  }

  if (notFound || !post) {
    return <Navigate to="/blog" replace />;
  }

  const canonicalUrl = post.canonical_url || `${window.location.origin}/blog/${post.slug || post.id}`;

  return (
    <Layout>
      <SEOHead
        title={post.meta_title || post.title}
        description={post.meta_description || post.excerpt || post.content.substring(0, 160)}
        keywords={post.meta_keywords || undefined}
        canonicalUrl={canonicalUrl}
        ogImage={post.image_url || undefined}
        ogType="article"
        article={{
          author: post.author,
          publishedTime: post.created_at,
          modifiedTime: post.updated_at
        }}
      />
      <BlogArticleSchema
        title={post.title}
        description={post.excerpt || post.content.substring(0, 160)}
        author={post.author}
        publishedTime={post.created_at}
        modifiedTime={post.updated_at}
        imageUrl={post.image_url || undefined}
        url={canonicalUrl}
      />

      {/* Hero */}
      <section className="relative">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-background" />
        <div className="container mx-auto px-4 py-12 relative">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Blog
          </Link>
          
          <div className="max-w-4xl">
            <Badge variant="secondary" className="mb-4">
              {post.category}
            </Badge>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
              {post.title}
            </h1>
            <div className="flex flex-wrap items-center gap-6 text-muted-foreground">
              <span className="flex items-center gap-2">
                <User className="w-4 h-4" />
                {post.author}
              </span>
              <span className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {new Date(post.created_at).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </span>
              <span className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                {post.read_time || '5 min read'}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Image */}
      {post.image_url && (
        <section className="container mx-auto px-4 -mt-4">
          <div className="max-w-4xl mx-auto">
            <img
              src={post.image_url}
              alt={post.title}
              title={post.title}
              loading="lazy"
              className="w-full aspect-video object-cover rounded-2xl shadow-xl"
            />
          </div>
        </section>
      )}

      {/* Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <article className="prose prose-lg max-w-none">
              {post.content.split('\n\n').map((paragraph, index) => {
                if (paragraph.startsWith('## ')) {
                  return (
                    <h2 key={index} className="text-2xl font-bold text-foreground mt-8 mb-4">
                      {paragraph.replace('## ', '')}
                    </h2>
                  );
                }
                if (paragraph.startsWith('### ')) {
                  return (
                    <h3 key={index} className="text-xl font-bold text-foreground mt-6 mb-3">
                      {paragraph.replace('### ', '')}
                    </h3>
                  );
                }
                if (paragraph.startsWith('- ')) {
                  const items = paragraph.split('\n').filter(item => item.startsWith('- '));
                  return (
                    <ul key={index} className="list-disc list-inside space-y-2 text-muted-foreground mb-4">
                      {items.map((item, i) => (
                        <li key={i}>{item.replace('- ', '')}</li>
                      ))}
                    </ul>
                  );
                }
                return (
                  <p key={index} className="text-muted-foreground mb-4 leading-relaxed">
                    {paragraph}
                  </p>
                );
              })}
            </article>

            {/* Share */}
            <div className="flex items-center justify-between border-t border-border pt-8 mt-12">
              <div className="text-muted-foreground">
                Written by <span className="font-semibold text-foreground">{post.author}</span>
              </div>
              <Button variant="outline" onClick={handleShare} className="gap-2">
                <Share2 className="w-4 h-4" />
                Share Article
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="py-12 bg-muted/30">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold text-foreground mb-8">Related Articles</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {relatedPosts.map((relatedPost) => (
                <Link
                  key={relatedPost.id}
                  to={`/blog/${relatedPost.slug || relatedPost.id}`}
                  className="group bg-card rounded-xl overflow-hidden border border-border shadow-md hover:shadow-lg transition-all"
                >
                  <div className="aspect-video overflow-hidden">
                    {relatedPost.image_url ? (
                      <img
                        src={relatedPost.image_url}
                        alt={relatedPost.title}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full bg-muted" />
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                      {relatedPost.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-2">
                      {relatedPost.read_time || '5 min read'}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </Layout>
  );
};

export default BlogPostPage;
