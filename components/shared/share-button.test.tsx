import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { ShareButton } from './share-button';

const setNavigatorShare = (share?: (data: ShareData) => Promise<void>) => {
  Object.defineProperty(window.navigator, 'share', {
    configurable: true,
    value: share,
  });
};

const setNavigatorClipboard = (writeText: (text: string) => Promise<void>) => {
  Object.defineProperty(window.navigator, 'clipboard', {
    configurable: true,
    value: { writeText },
  });
};

describe('ShareButton', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    setNavigatorShare(undefined);
    setNavigatorClipboard(vi.fn().mockResolvedValue(undefined));
  });

  it('falls back to clipboard copy when navigator.share is unavailable', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    setNavigatorShare(undefined);
    setNavigatorClipboard(writeText);

    render(<ShareButton title="My Post" url="https://example.com/blog/post" />);

    fireEvent.click(screen.getByRole('button', { name: '共有' }));

    await waitFor(() => {
      expect(writeText).toHaveBeenCalledWith('https://example.com/blog/post');
    });
    expect(screen.getByText('コピー済み')).toBeInTheDocument();
  });

  it('uses Web Share API when available', async () => {
    const share = vi.fn().mockResolvedValue(undefined);
    const writeText = vi.fn().mockResolvedValue(undefined);
    setNavigatorShare(share);
    setNavigatorClipboard(writeText);

    render(<ShareButton title="My Post" url="https://example.com/en/blog/post" locale="en" />);

    fireEvent.click(screen.getByRole('button', { name: 'Share' }));

    await waitFor(() => {
      expect(share).toHaveBeenCalledWith({
        title: 'My Post',
        url: 'https://example.com/en/blog/post',
      });
    });
    expect(writeText).not.toHaveBeenCalled();
  });
});
