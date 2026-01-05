import { useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Heading1, Heading2, Heading3, Link, List, ListOrdered, Bold, Italic, Quote } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';

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
  const [linkPopoverOpen, setLinkPopoverOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [linkText, setLinkText] = useState('');
  const [selectedPostId, setSelectedPostId] = useState('');
  const [savedSelection, setSavedSelection] = useState({ start: 0, end: 0, text: '' });

  const { data: blogPosts = [] } = useQuery({
    queryKey: ['blog-posts-for-linking'],
    queryFn: async () => {
      const { data } = await supabase
        .from('blog_posts')
        .select('id, title, slug')
        .eq('published', true)
        .order('created_at', { ascending: false });
      return data || [];
    },
  });

  const getSelection = useCallback(() => {
    if (textareaRef.current) {
      const start = textareaRef.current.selectionStart;
      const end = textareaRef.current.selectionEnd;
      return {
        start,
        end,
        text: value.substring(start, end)
      };
    }
    return { start: 0, end: 0, text: '' };
  }, [value]);

  const insertText = useCallback((newText: string, cursorOffset: number = 0) => {
    const { start, end } = getSelection();
    const newValue = value.substring(0, start) + newText + value.substring(end);
    onChange(newValue);
    
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        const newPos = start + newText.length + cursorOffset;
        textareaRef.current.setSelectionRange(newPos, newPos);
      }
    }, 10);
  }, [value, onChange, getSelection]);

  const wrapSelection = useCallback((prefix: string, suffix: string, placeholder: string) => {
    const { start, end, text } = getSelection();
    const selectedText = text || placeholder;
    const newText = prefix + selectedText + suffix;
    const newValue = value.substring(0, start) + newText + value.substring(end);
    onChange(newValue);
    
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        if (text) {
          // Move cursor after the inserted text
          const newPos = start + newText.length;
          textareaRef.current.setSelectionRange(newPos, newPos);
        } else {
          // Select the placeholder
          textareaRef.current.setSelectionRange(start + prefix.length, start + prefix.length + placeholder.length);
        }
      }
    }, 10);
  }, [value, onChange, getSelection]);

  const insertHeading = useCallback((level: 1 | 2 | 3) => {
    const prefix = '#'.repeat(level) + ' ';
    const { start, end, text } = getSelection();
    
    // Find start of current line
    let lineStart = start;
    while (lineStart > 0 && value[lineStart - 1] !== '\n') {
      lineStart--;
    }
    
    const placeholder = `Heading ${level}`;
    const insertedText = text || placeholder;
    
    // Add newline before if not at start and previous char isn't newline
    const needsNewlineBefore = lineStart > 0 && value[lineStart - 1] !== '\n' && lineStart === start;
    const prefixWithNewline = (needsNewlineBefore ? '\n' : '') + prefix;
    
    const newValue = value.substring(0, lineStart) + prefixWithNewline + insertedText + '\n' + value.substring(end);
    onChange(newValue);
    
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        const selectStart = lineStart + prefixWithNewline.length;
        const selectEnd = selectStart + insertedText.length;
        textareaRef.current.setSelectionRange(selectStart, selectEnd);
      }
    }, 10);
  }, [value, onChange, getSelection]);

  const handleLinkOpen = useCallback(() => {
    const selection = getSelection();
    setSavedSelection(selection);
    setLinkText(selection.text);
    setLinkUrl('');
    setSelectedPostId('');
    setLinkPopoverOpen(true);
  }, [getSelection]);

  const handleInternalLinkSelect = useCallback((postId: string) => {
    setSelectedPostId(postId);
    const post = blogPosts.find(p => p.id === postId);
    if (post) {
      const slug = post.slug || post.id;
      setLinkUrl(`/blog/${slug}`);
      if (!linkText) {
        setLinkText(post.title);
      }
    }
  }, [blogPosts, linkText]);

  const insertLink = useCallback(() => {
    if (!linkUrl) return;
    
    const displayText = linkText || linkUrl;
    const markdownLink = `[${displayText}](${linkUrl})`;
    
    const newValue = value.substring(0, savedSelection.start) + markdownLink + value.substring(savedSelection.end);
    onChange(newValue);
    setLinkPopoverOpen(false);
    
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        const newCursorPos = savedSelection.start + markdownLink.length;
        textareaRef.current.setSelectionRange(newCursorPos, newCursorPos);
      }
    }, 10);
  }, [linkUrl, linkText, savedSelection, value, onChange]);

  const insertBold = useCallback(() => wrapSelection('**', '**', 'bold text'), [wrapSelection]);
  const insertItalic = useCallback(() => wrapSelection('*', '*', 'italic text'), [wrapSelection]);
  
  const insertQuote = useCallback(() => {
    const { start, end, text } = getSelection();
    const quoteText = text || 'quote';
    const needsNewline = start > 0 && value[start - 1] !== '\n';
    const prefix = (needsNewline ? '\n' : '') + '> ';
    const newValue = value.substring(0, start) + prefix + quoteText + '\n' + value.substring(end);
    onChange(newValue);
    
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        const selectStart = start + prefix.length;
        textareaRef.current.setSelectionRange(selectStart, selectStart + quoteText.length);
      }
    }, 10);
  }, [value, onChange, getSelection]);

  const insertBulletList = useCallback(() => {
    const { start, end, text } = getSelection();
    const listText = text || 'list item';
    const needsNewline = start > 0 && value[start - 1] !== '\n';
    const prefix = (needsNewline ? '\n' : '') + '- ';
    const newValue = value.substring(0, start) + prefix + listText + '\n' + value.substring(end);
    onChange(newValue);
    
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        const selectStart = start + prefix.length;
        textareaRef.current.setSelectionRange(selectStart, selectStart + listText.length);
      }
    }, 10);
  }, [value, onChange, getSelection]);

  const insertNumberedList = useCallback(() => {
    const { start, end, text } = getSelection();
    const listText = text || 'list item';
    const needsNewline = start > 0 && value[start - 1] !== '\n';
    const prefix = (needsNewline ? '\n' : '') + '1. ';
    const newValue = value.substring(0, start) + prefix + listText + '\n' + value.substring(end);
    onChange(newValue);
    
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        const selectStart = start + prefix.length;
        textareaRef.current.setSelectionRange(selectStart, selectStart + listText.length);
      }
    }, 10);
  }, [value, onChange, getSelection]);

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
            title="Bold (**text**)"
            className="h-8 w-8 p-0"
          >
            <Bold className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={insertItalic}
            title="Italic (*text*)"
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
                  placeholder="https://example.com"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="link-text">Display Text</Label>
                <Input
                  id="link-text"
                  value={linkText}
                  onChange={(e) => setLinkText(e.target.value)}
                  placeholder="Click here"
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

[Link text](https://example.com)

- Bullet list item
1. Numbered list item

> Blockquote"
      />
      
      <p className="text-xs text-muted-foreground">
        Use the toolbar or write Markdown directly. Links: [text](url) | Bold: **text** | Italic: *text*
      </p>
    </div>
  );
}
