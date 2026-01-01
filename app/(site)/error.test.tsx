import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import GlobalError from './error';

describe('GlobalError page', () => {
  it('renders the error state and triggers a reset', async () => {
    const error = new Error('boom');
    const reset = vi.fn();
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(<GlobalError error={error} reset={reset} />);

    await waitFor(() => expect(consoleSpy).toHaveBeenCalledWith(error));

    fireEvent.click(screen.getByRole('button'));
    expect(reset).toHaveBeenCalled();

    consoleSpy.mockRestore();
  });
});
