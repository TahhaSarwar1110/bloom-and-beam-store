import { useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Heading1, Heading2, Heading3, Link2, List, ListOrdered, Bold, Italic, Quote, Search } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { ScrollArea } from '@/components/ui/scroll-area';

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
  const [linkDialogOpen, setLinkDialogOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [linkText, setLinkText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
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

  // Filter posts based on search query
  const filteredPosts = blogPosts.filter(post =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
          const newPos = start + newText.length;
          textareaRef.current.setSelectionRange(newPos, newPos);
        } else {
          textareaRef.current.setSelectionRange(start + prefix.length, start + prefix.length + placeholder.length);
        }
      }
    }, 10);
  }, [value, onChange, getSelection]);

  const insertHeading = useCallback((level: 1 | 2 | 3) => {
    const prefix = '#'.repeat(level) + ' ';
    const { start, end, text } = getSelection();
    
    let lineStart = start;
    while (lineStart > 0 && value[lineStart - 1] !== '\n') {
      lineStart--;
    }
    
    const placeholder = `Heading ${level}`;
    const insertedText = text || placeholder;
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

  // Google Docs style: Open link dialog
  const handleLinkClick = useCallback(() => {
    const selection = getSelection();
    setSavedSelection(selection);
    setLinkText(selection.text);
    setLinkUrl('');
    setSearchQuery('');
    setLinkDialogOpen(true);
  }, [getSelection]);

  // Select an internal blog post
  const handleSelectPost = useCallback((post: BlogPost) => {
    const slug = post.slug || post.id;
    setLinkUrl(`/blog/${slug}`);
    if (!linkText) {
      setLinkText(post.title);
    }
  }, [linkText]);

  // Apply the link
  const applyLink = useCallback(() => {
    if (!linkUrl) return;
    
    const displayText = linkText.trim() || linkUrl;
    const markdownLink = `[${displayText}](${linkUrl})`;
    
    const newValue = value.substring(0, savedSelection.start) + markdownLink + value.substring(savedSelection.end);
    onChange(newValue);
    setLinkDialogOpen(false);
    
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
            title="Heading 1"
            className="h-8 w-8 p-0"
          >
            <Heading1 className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => insertHeading(2)}
            title="Heading 2"
            className="h-8 w-8 p-0"
          >
            <Heading2 className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => insertHeading(3)}
            title="Heading 3"
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

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleLinkClick}
          title="Insert Link (Ctrl+K)"
          className="h-8 w-8 p-0"
        >
          <Link2 className="h-4 w-4" />
        </Button>
      </div>

      {/* Textarea */}
      <Textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        className="rounded-t-none font-mono text-sm"
        onKeyDown={(e) => {
          if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            handleLinkClick();
          }
        }}
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
        Tip: Select text and press Ctrl+K to insert a link. Use toolbar buttons for formatting.
      </p>

      {/* Link Dialog - Google Docs Style */}
      <Dialog open={linkDialogOpen} onOpenChange={setLinkDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Insert Link</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            {/* Display text */}
            <div className="space-y-2">
              <Label htmlFor="display-text">Text to display</Label>
              <Input
                id="display-text"
                value={linkText}
                onChange={(e) => setLinkText(e.target.value)}
                placeholder="Enter display text"
              />
            </div>

            {/* URL input */}
            <div className="space-y-2">
              <Label htmlFor="link-url">Link URL</Label>
              <Input
                id="link-url"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                placeholder="https://example.com or paste URL"
              />
            </div>

            {/* Internal posts search */}
            <div className="space-y-2">
              <Label>Or link to a blog post</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search blog posts..."
                  className="pl-9"
                />
              </div>
              
              {filteredPosts.length > 0 && (
                <ScrollArea className="h-40 border rounded-md">
                  <div className="p-2 space-y-1">
                    {filteredPosts.map((post) => (
                      <button
                        key={post.id}
                        type="button"
                        onClick={() => handleSelectPost(post)}
                        className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors hover:bg-accent ${
                          linkUrl === `/blog/${post.slug || post.id}` 
                            ? 'bg-primary/10 text-primary font-medium' 
                            : 'text-foreground'
                        }`}
                      >
                        {post.title}
                      </button>
                    ))}
                  </div>
                </ScrollArea>
              )}
              
              {blogPosts.length === 0 && (
                <p className="text-sm text-muted-foreground py-2">No published blog posts available</p>
              )}
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button type="button" variant="outline" onClick={() => setLinkDialogOpen(false)}>
              Cancel
            </Button>
            <Button type="button" onClick={applyLink} disabled={!linkUrl}>
              Apply
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
