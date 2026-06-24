import React from 'react';
import { Link } from 'react-router-dom';

// Parse inline markdown (bold, italic, links)
const parseInlineMarkdown = (text: string): React.ReactNode[] => {
  const parts: React.ReactNode[] = [];
  let remaining = text;
  let key = 0;

  while (remaining.length > 0) {
    const linkMatch = remaining.match(/^\[([^\]]+)\]\(([^)]+)\)/);
    if (linkMatch) {
      const [fullMatch, linkText, url] = linkMatch;
      const isInternal = url.startsWith('/') || url.startsWith('#');
      if (isInternal) {
        parts.push(
          <Link key={key++} to={url} className="text-primary hover:underline font-medium">
            {linkText}
          </Link>
        );
      } else {
        parts.push(
          <a key={key++} href={url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium">
            {linkText}
          </a>
        );
      }
      remaining = remaining.slice(fullMatch.length);
      continue;
    }

    const boldMatch = remaining.match(/^\*\*([^*]+)\*\*/);
    if (boldMatch) {
      parts.push(<strong key={key++} className="font-bold text-foreground">{boldMatch[1]}</strong>);
      remaining = remaining.slice(boldMatch[0].length);
      continue;
    }

    const italicMatch = remaining.match(/^\*([^*]+)\*/);
    if (italicMatch) {
      parts.push(<em key={key++} className="italic">{italicMatch[1]}</em>);
      remaining = remaining.slice(italicMatch[0].length);
      continue;
    }

    const nextSpecial = remaining.search(/[\[*]/);
    if (nextSpecial === -1) {
      parts.push(remaining);
      break;
    } else if (nextSpecial === 0) {
      parts.push(remaining[0]);
      remaining = remaining.slice(1);
    } else {
      parts.push(remaining.slice(0, nextSpecial));
      remaining = remaining.slice(nextSpecial);
    }
  }

  return parts;
};

export const renderMarkdownContent = (content: string): React.ReactNode[] => {
  const blocks = content.split(/\n{2,}/);
  const elements: React.ReactNode[] = [];
  let key = 0;

  blocks.forEach((block) => {
    const trimmedBlock = block.trim();
    if (!trimmedBlock) return;

    if (trimmedBlock.startsWith('# ')) {
      elements.push(
        <h2 key={key++} className="text-3xl font-bold text-foreground mt-10 mb-6">
          {parseInlineMarkdown(trimmedBlock.replace(/^# /, ''))}
        </h2>
      );
      return;
    }

    if (trimmedBlock.startsWith('## ')) {
      elements.push(
        <h2 key={key++} className="text-2xl font-bold text-foreground mt-8 mb-4">
          {parseInlineMarkdown(trimmedBlock.replace(/^## /, ''))}
        </h2>
      );
      return;
    }

    if (trimmedBlock.startsWith('### ')) {
      elements.push(
        <h3 key={key++} className="text-xl font-bold text-foreground mt-6 mb-3">
          {parseInlineMarkdown(trimmedBlock.replace(/^### /, ''))}
        </h3>
      );
      return;
    }

    if (trimmedBlock.startsWith('> ')) {
      elements.push(
        <blockquote key={key++} className="border-l-4 border-primary pl-4 py-2 my-4 text-muted-foreground italic bg-muted/30 rounded-r">
          {parseInlineMarkdown(trimmedBlock.replace(/^> /, ''))}
        </blockquote>
      );
      return;
    }

    if (trimmedBlock.startsWith('- ')) {
      const items = trimmedBlock.split('\n').filter(item => item.trim().startsWith('- '));
      elements.push(
        <ul key={key++} className="list-disc list-inside space-y-2 text-muted-foreground mb-4 pl-4">
          {items.map((item, i) => (
            <li key={i}>{parseInlineMarkdown(item.replace(/^- /, ''))}</li>
          ))}
        </ul>
      );
      return;
    }

    if (/^\d+\. /.test(trimmedBlock)) {
      const items = trimmedBlock.split('\n').filter(item => /^\d+\. /.test(item.trim()));
      elements.push(
        <ol key={key++} className="list-decimal list-inside space-y-2 text-muted-foreground mb-4 pl-4">
          {items.map((item, i) => (
            <li key={i}>{parseInlineMarkdown(item.replace(/^\d+\. /, ''))}</li>
          ))}
        </ol>
      );
      return;
    }

    // Paragraph — render single newlines as <br/>
    const lines = trimmedBlock.split('\n');
    elements.push(
      <p key={key++} className="text-muted-foreground mb-4 leading-relaxed">
        {lines.map((line, i) => (
          <React.Fragment key={i}>
            {parseInlineMarkdown(line)}
            {i < lines.length - 1 && <br />}
          </React.Fragment>
        ))}
      </p>
    );
  });

  return elements;
};

interface MarkdownContentProps {
  content: string;
  className?: string;
}

export default function MarkdownContent({ content, className }: MarkdownContentProps) {
  if (!content) return null;
  return <div className={className}>{renderMarkdownContent(content)}</div>;
}
