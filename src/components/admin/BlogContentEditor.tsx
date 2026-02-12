import { useState, useRef, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Heading1, Heading2, Heading3, Link2, List, ListOrdered, Bold, Italic, Quote, Search, Pilcrow, RemoveFormatting } from 'lucide-react';
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

  // Persistent selection that survives blur
  const selectionRef = useRef({ start: 0, end: 0 });

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

  const saveSelection = useCallback(() => {
    if (textareaRef.current) {
      selectionRef.current = {
        start: textareaRef.current.selectionStart,
        end: textareaRef.current.selectionEnd,
      };
    }
  }, []);

  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    const handler = () => saveSelection();
    ta.addEventListener('select', handler);
    ta.addEventListener('keyup', handler);
    ta.addEventListener('mouseup', handler);
    ta.addEventListener('click', handler);
    return () => {
      ta.removeEventListener('select', handler);
      ta.removeEventListener('keyup', handler);
      ta.removeEventListener('mouseup', handler);
      ta.removeEventListener('click', handler);
    };
  }, [saveSelection]);

  const filteredPosts = blogPosts.filter(post =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // --- helpers ---
  const getLineRange = useCallback((pos: number) => {
    let lineStart = pos;
    while (lineStart > 0 && value[lineStart - 1] !== '\n') lineStart--;
    let lineEnd = pos;
    while (lineEnd < value.length && value[lineEnd] !== '\n') lineEnd++;
    return { lineStart, lineEnd };
  }, [value]);

  const focusAndSelect = useCallback((start: number, end: number) => {
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        textareaRef.current.setSelectionRange(start, end);
        selectionRef.current = { start, end };
      }
    }, 0);
  }, []);

  // --- formatting actions ---

  /** Toggle or set a heading level on the current line(s). Removes any existing heading prefix first. */
  const insertHeading = useCallback((level: 1 | 2 | 3) => {
    const { start, end } = selectionRef.current;
    const { lineStart, lineEnd } = getLineRange(start);

    // Get full line text
    const lineText = value.substring(lineStart, lineEnd);

    // Strip existing heading prefix (e.g. "## " or "### ")
    const stripped = lineText.replace(/^#{1,6}\s*/, '');
    const prefix = '#'.repeat(level) + ' ';

    // If the line already has this exact heading level, toggle it off (make paragraph)
    const existingMatch = lineText.match(/^(#{1,6})\s/);
    const isAlreadySameLevel = existingMatch && existingMatch[1].length === level;

    const newLineText = isAlreadySameLevel ? stripped : prefix + stripped;
    const newValue = value.substring(0, lineStart) + newLineText + value.substring(lineEnd);
    onChange(newValue);

    const cursorEnd = lineStart + newLineText.length;
    focusAndSelect(cursorEnd, cursorEnd);
  }, [value, onChange, getLineRange, focusAndSelect]);

  /** Convert current line to a plain paragraph (remove any heading/quote/list prefix) */
  const makeParagraph = useCallback(() => {
    const { start } = selectionRef.current;
    const { lineStart, lineEnd } = getLineRange(start);
    const lineText = value.substring(lineStart, lineEnd);

    // Remove heading, blockquote, or list prefixes
    const stripped = lineText
      .replace(/^#{1,6}\s*/, '')
      .replace(/^>\s*/, '')
      .replace(/^[-*]\s+/, '')
      .replace(/^\d+\.\s+/, '');

    const newValue = value.substring(0, lineStart) + stripped + value.substring(lineEnd);
    onChange(newValue);

    const cursorEnd = lineStart + stripped.length;
    focusAndSelect(cursorEnd, cursorEnd);
  }, [value, onChange, getLineRange, focusAndSelect]);

  /** Wrap selected text with inline markers (bold / italic). Toggles off if already wrapped. */
  const toggleInlineWrap = useCallback((marker: string, placeholder: string) => {
    const { start, end } = selectionRef.current;
    const selected = value.substring(start, end);
    const mLen = marker.length;

    // Check if selection is already wrapped with the marker
    if (
      selected.length >= mLen * 2 &&
      selected.startsWith(marker) &&
      selected.endsWith(marker)
    ) {
      // Unwrap
      const unwrapped = selected.slice(mLen, -mLen);
      const newValue = value.substring(0, start) + unwrapped + value.substring(end);
      onChange(newValue);
      focusAndSelect(start, start + unwrapped.length);
      return;
    }

    // Also check if the surrounding text already has the markers
    const before = value.substring(Math.max(0, start - mLen), start);
    const after = value.substring(end, end + mLen);
    if (before === marker && after === marker) {
      const newValue = value.substring(0, start - mLen) + selected + value.substring(end + mLen);
      onChange(newValue);
      focusAndSelect(start - mLen, start - mLen + selected.length);
      return;
    }

    // Wrap
    const textToWrap = selected || placeholder;
    const wrapped = marker + textToWrap + marker;
    const newValue = value.substring(0, start) + wrapped + value.substring(end);
    onChange(newValue);
    // Select just the inner text (not the markers)
    focusAndSelect(start + mLen, start + mLen + textToWrap.length);
  }, [value, onChange, focusAndSelect]);

  const insertBold = useCallback(() => toggleInlineWrap('**', 'bold text'), [toggleInlineWrap]);
  const insertItalic = useCallback(() => toggleInlineWrap('*', 'italic text'), [toggleInlineWrap]);

  /** Insert a line-level prefix (quote, bullet, numbered) */
  const insertLinePrefix = useCallback((prefix: string, placeholder: string) => {
    const { start, end } = selectionRef.current;
    const selected = value.substring(start, end);
    const text = selected || placeholder;

    // Ensure we start on a new line
    const needsNewline = start > 0 && value[start - 1] !== '\n';
    const insertion = (needsNewline ? '\n' : '') + prefix + text + '\n';

    const newValue = value.substring(0, start) + insertion + value.substring(end);
    onChange(newValue);

    const textStart = start + (needsNewline ? 1 : 0) + prefix.length;
    focusAndSelect(textStart, textStart + text.length);
  }, [value, onChange, focusAndSelect]);

  const insertQuote = useCallback(() => insertLinePrefix('> ', 'quote text'), [insertLinePrefix]);
  const insertBulletList = useCallback(() => insertLinePrefix('- ', 'list item'), [insertLinePrefix]);
  const insertNumberedList = useCallback(() => insertLinePrefix('1. ', 'list item'), [insertLinePrefix]);

  // --- link ---
  const handleLinkClick = useCallback(() => {
    const { start, end } = selectionRef.current;
    setLinkText(value.substring(start, end));
    setLinkUrl('');
    setSearchQuery('');
    setLinkDialogOpen(true);
  }, [value]);

  const handleSelectPost = useCallback((post: BlogPost) => {
    const slug = post.slug || post.id;
    setLinkUrl(`/blog/${slug}`);
    if (!linkText) setLinkText(post.title);
  }, [linkText]);

  const applyLink = useCallback(() => {
    if (!linkUrl) return;
    const displayText = linkText.trim() || linkUrl;
    const markdownLink = `[${displayText}](${linkUrl})`;
    const { start, end } = selectionRef.current;

    const newValue = value.substring(0, start) + markdownLink + value.substring(end);
    onChange(newValue);
    setLinkDialogOpen(false);

    const newEnd = start + markdownLink.length;
    focusAndSelect(newEnd, newEnd);
  }, [linkUrl, linkText, value, onChange, focusAndSelect]);

  // Prevent toolbar buttons from stealing focus
  const tb = (e: React.MouseEvent) => {
    e.preventDefault();
    saveSelection();
  };

  return (
    <div className="space-y-2">
      <Label>Content</Label>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-2 border rounded-t-md bg-muted/50">
        {/* Headings + Paragraph */}
        <div className="flex items-center gap-1 border-r pr-2 mr-1">
          <Button type="button" variant="ghost" size="sm" onMouseDown={tb} onClick={() => insertHeading(1)} title="Heading 1 (toggle)" className="h-8 w-8 p-0">
            <Heading1 className="h-4 w-4" />
          </Button>
          <Button type="button" variant="ghost" size="sm" onMouseDown={tb} onClick={() => insertHeading(2)} title="Heading 2 (toggle)" className="h-8 w-8 p-0">
            <Heading2 className="h-4 w-4" />
          </Button>
          <Button type="button" variant="ghost" size="sm" onMouseDown={tb} onClick={() => insertHeading(3)} title="Heading 3 (toggle)" className="h-8 w-8 p-0">
            <Heading3 className="h-4 w-4" />
          </Button>
          <Button type="button" variant="ghost" size="sm" onMouseDown={tb} onClick={makeParagraph} title="Paragraph (remove formatting)" className="h-8 w-8 p-0">
            <Pilcrow className="h-4 w-4" />
          </Button>
        </div>

        {/* Inline formatting */}
        <div className="flex items-center gap-1 border-r pr-2 mr-1">
          <Button type="button" variant="ghost" size="sm" onMouseDown={tb} onClick={insertBold} title="Bold (Ctrl+B) — toggle" className="h-8 w-8 p-0">
            <Bold className="h-4 w-4" />
          </Button>
          <Button type="button" variant="ghost" size="sm" onMouseDown={tb} onClick={insertItalic} title="Italic (Ctrl+I) — toggle" className="h-8 w-8 p-0">
            <Italic className="h-4 w-4" />
          </Button>
          <Button type="button" variant="ghost" size="sm" onMouseDown={tb} onClick={makeParagraph} title="Clear formatting" className="h-8 w-8 p-0">
            <RemoveFormatting className="h-4 w-4" />
          </Button>
        </div>

        {/* Block-level */}
        <div className="flex items-center gap-1 border-r pr-2 mr-1">
          <Button type="button" variant="ghost" size="sm" onMouseDown={tb} onClick={insertBulletList} title="Bullet List" className="h-8 w-8 p-0">
            <List className="h-4 w-4" />
          </Button>
          <Button type="button" variant="ghost" size="sm" onMouseDown={tb} onClick={insertNumberedList} title="Numbered List" className="h-8 w-8 p-0">
            <ListOrdered className="h-4 w-4" />
          </Button>
          <Button type="button" variant="ghost" size="sm" onMouseDown={tb} onClick={insertQuote} title="Block Quote" className="h-8 w-8 p-0">
            <Quote className="h-4 w-4" />
          </Button>
        </div>

        {/* Link */}
        <Button type="button" variant="ghost" size="sm" onMouseDown={tb} onClick={handleLinkClick} title="Insert Link (Ctrl+K)" className="h-8 w-8 p-0">
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
          if ((e.ctrlKey || e.metaKey) && e.key === 'k') { e.preventDefault(); saveSelection(); handleLinkClick(); }
          if ((e.ctrlKey || e.metaKey) && e.key === 'b') { e.preventDefault(); saveSelection(); insertBold(); }
          if ((e.ctrlKey || e.metaKey) && e.key === 'i') { e.preventDefault(); saveSelection(); insertItalic(); }
        }}
        placeholder={`Write your blog content using Markdown...

# Heading 1
## Heading 2
### Heading 3

**Bold text** and *italic text*

Regular paragraph text — use the ¶ button to convert any heading/quote back to a paragraph.

[Link text](https://example.com)

- Bullet list item
1. Numbered list item

> Blockquote`}
      />

      <p className="text-xs text-muted-foreground">
        Tip: Select text then click toolbar buttons to toggle formatting. Use ¶ (Pilcrow) to convert to paragraph. Ctrl+K for links, Ctrl+B for bold, Ctrl+I for italic.
      </p>

      {/* Link Dialog */}
      <Dialog open={linkDialogOpen} onOpenChange={setLinkDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Insert Link</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="display-text">Text to display</Label>
              <Input id="display-text" value={linkText} onChange={(e) => setLinkText(e.target.value)} placeholder="Enter display text" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="link-url">Link URL</Label>
              <Input id="link-url" value={linkUrl} onChange={(e) => setLinkUrl(e.target.value)} placeholder="https://example.com or /blog/post-slug" />
            </div>

            <div className="space-y-2">
              <Label>Or link to a blog post</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search blog posts..." className="pl-9" />
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
                          linkUrl === `/blog/${post.slug || post.id}` ? 'bg-primary/10 text-primary font-medium' : 'text-foreground'
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
            <Button type="button" variant="outline" onClick={() => setLinkDialogOpen(false)}>Cancel</Button>
            <Button type="button" onClick={applyLink} disabled={!linkUrl}>Apply</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
