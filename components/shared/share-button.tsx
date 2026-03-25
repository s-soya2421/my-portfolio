'use client';

import { Check, Share2 } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

type ShareButtonProps = {
  title: string;
  url: string;
  locale?: 'ja' | 'en';
};

export const ShareButton = ({ title, url, locale = 'ja' }: ShareButtonProps) => {
  const [copied, setCopied] = useState(false);

  const labels =
    locale === 'en'
      ? {
          share: 'Share',
          copied: 'Copied',
          copySuccess: 'Link copied to clipboard.',
          ariaLabel: 'Share this article',
        }
      : {
          share: '共有',
          copied: 'コピー済み',
          copySuccess: '記事リンクをコピーしました。',
          ariaLabel: 'この記事を共有',
        };

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClick = async () => {
    if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
      try {
        await navigator.share({ title, url });
        return;
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') {
          return;
        }
      }
    }

    await copyToClipboard();
  };

  return (
    <div className="flex items-center gap-3">
      <Button type="button" variant="outline" size="sm" onClick={() => void handleClick()}>
        {copied ? <Check className="h-4 w-4" /> : <Share2 className="h-4 w-4" />}
        <span className="ml-1">{copied ? labels.copied : labels.share}</span>
      </Button>
      <p aria-live="polite" className="text-xs text-muted-foreground">
        {copied ? labels.copySuccess : labels.ariaLabel}
      </p>
    </div>
  );
};
