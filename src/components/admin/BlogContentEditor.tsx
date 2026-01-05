import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Heading1, Heading2, Heading3, Link, List, ListOrdered, Bold, Italic, Quote } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface BlogPost {
  id: string;
  title: string;
  slug: string | null;
}

interface BlogContentEditorProps {
  value: string;
  onChange: (value: string) => void;
  rows?: number;
}

export default function BlogContentEditor({ value, onChange, rows = 10 }: BlogContentEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [linkPopoverOpen, setLinkPopoverOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [linkText, setLinkText] = useState('');
  const [selectedPostId, setSelectedPostId] = useState('');
  const [selectionStart, setSelectionStart] = useState(0);
  const [selectionEnd, setSelectionEnd] = useState(0);

  useEffect(() => {
    fetchBlogPosts();
  }, []);

  const fetchBlogPosts = async () => {
    const { data } = await supabase
      .from('blog_posts')
      .select('id, title, slug')
      .eq('published', true)
      .order('created_at', { ascending: false });
    
    if (data) {
      setBlogPosts(data);
    }
  };

  const getSelection = () => {
    if (textareaRef.current) {
      return {
        start: textareaRef.current.selectionStart,
        end: textareaRef.current.selectionEnd,
        text: value.substring(textareaRef.current.selectionStart, textareaRef.current.selectionEnd)
      };
    }
    return { start: 0, end: 0, text: '' };
  };

  const insertAtCursor = (prefix: string, suffix: string = '', placeholder: string = '') => {
    const { start, end, text } = getSelection();
    const selectedText = text || placeholder;
    const newValue = value.substring(0, start) + prefix + selectedText + suffix + value.substring(end);
    onChange(newValue);
    
    // Restore focus and cursor position
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        const newCursorPos = start + prefix.length + selectedText.length + suffix.length;
        textareaRef.current.setSelectionRange(newCursorPos, newCursorPos);
      }
    }, 0);
  };

  const insertHeading = (level: 1 | 2 | 3) => {
    const prefix = '#'.repeat(level) + ' ';
    const { start, text } = getSelection();
    
    // Find start of current line
    let lineStart = start;
    while (lineStart > 0 && value[lineStart - 1] !== '\n') {
      lineStart--;
    }
    
    // If there's selected text, wrap it
    if (text) {
      insertAtCursor(`\n${prefix}`, '\n');
    } else {
      // Insert at line start
      const placeholder = `Heading ${level}`;
      const newValue = value.substring(0, lineStart) + prefix + placeholder + '\n' + value.substring(start);
      onChange(newValue);
      
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.focus();
          textareaRef.current.setSelectionRange(lineStart + prefix.length, lineStart + prefix.length + placeholder.length);
        }
      }, 0);
    }
  };

  const handleLinkOpen = () => {
    const { start, end, text } = getSelection();
    setSelectionStart(start);
    setSelectionEnd(end);
    setLinkText(text);
    setLinkUrl('');
    setSelectedPostId('');
    setLinkPopoverOpen(true);
  };

  const handleInternalLinkSelect = (postId: string) => {
    setSelectedPostId(postId);
    const post = blogPosts.find(p => p.id === postId);
    if (post) {
      const slug = post.slug || post.id;
      setLinkUrl(`/blog/${slug}`);
      if (!linkText) {
        setLinkText(post.title);
      }
    }
  };

  const insertLink = () => {
    if (!linkUrl) return;
    
    const displayText = linkText || linkUrl;
    const markdownLink = `[${displayText}](${linkUrl})`;
    
    const newValue = value.substring(0, selectionStart) + markdownLink + value.substring(selectionEnd);
    onChange(newValue);
    setLinkPopoverOpen(false);
    
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        const newCursorPos = selectionStart + markdownLink.length;
        textareaRef.current.setSelectionRange(newCursorPos, newCursorPos);
      }
    }, 0);
  };

  const insertBold = () => insertAtCursor('**', '**', 'bold text');
  const insertItalic = () => insertAtCursor('*', '*', 'italic text');
  const insertQuote = () => insertAtCursor('\n> ', '\n', 'quote');
  const insertBulletList = () => insertAtCursor('\n- ', '\n', 'list item');
  const insertNumberedList = () => insertAtCursor('\n1. ', '\n', 'list item');

  return (
    <div className="space-y-2">
      <Label>Content</Label>
      
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-2 border rounded-t-md bg-muted/50">
        <div className="flex items-center gap-1 border-r pr-2 mr-1">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => insertHeading(1)}
            title="Heading 1 (H1)"
            className="h-8 w-8 p-0"
          >
            <Heading1 className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => insertHeading(2)}
            title="Heading 2 (H2)"
            className="h-8 w-8 p-0"
          >
            <Heading2 className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => insertHeading(3)}
            title="Heading 3 (H3)"
            className="h-8 w-8 p-0"
          >
            <Heading3 className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center gap-1 border-r pr-2 mr-1">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={insertBold}
            title="Bold"
            className="h-8 w-8 p-0"
          >
            <Bold className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={insertItalic}
            title="Italic"
            className="h-8 w-8 p-0"
          >
            <Italic className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center gap-1 border-r pr-2 mr-1">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={insertBulletList}
            title="Bullet List"
            className="h-8 w-8 p-0"
          >
            <List className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={insertNumberedList}
            title="Numbered List"
            className="h-8 w-8 p-0"
          >
            <ListOrdered className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={insertQuote}
            title="Block Quote"
            className="h-8 w-8 p-0"
          >
            <Quote className="h-4 w-4" />
          </Button>
        </div>

        <Popover open={linkPopoverOpen} onOpenChange={setLinkPopoverOpen}>
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleLinkOpen}
              title="Insert Link"
              className="h-8 w-8 p-0"
            >
              <Link className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80" align="start">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Link to Blog Post (Internal)</Label>
                <Select value={selectedPostId} onValueChange={handleInternalLinkSelect}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a blog post..." />
                  </SelectTrigger>
                  <SelectContent>
                    {blogPosts.map((post) => (
                      <SelectItem key={post.id} value={post.id}>
                        {post.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="text-center text-sm text-muted-foreground">— or —</div>
              
              <div className="space-y-2">
                <Label htmlFor="link-url">External URL</Label>
                <Input
                  id="link-url"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  placeholder="https://..."
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="link-text">Display Text</Label>
                <Input
                  id="link-text"
                  value={linkText}
                  onChange={(e) => setLinkText(e.target.value)}
                  placeholder="Link text"
                />
              </div>
              
              <Button type="button" onClick={insertLink} className="w-full" disabled={!linkUrl}>
                Insert Link
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {/* Textarea */}
      <Textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        className="rounded-t-none font-mono text-sm"
        placeholder="Write your blog content using Markdown...

# Heading 1
## Heading 2
### Heading 3

**Bold text** and *italic text*

- Bullet list item
1. Numbered list item

> Blockquote

[Link text](https://example.com)"
      />
      
      <p className="text-xs text-muted-foreground">
        Use the toolbar above or write Markdown directly. Headings: # H1, ## H2, ### H3
      </p>
    </div>
  );
}
