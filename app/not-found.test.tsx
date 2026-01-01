import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import NotFound from './not-found';

describe('NotFound page', () => {
  it('renders the 404 message and link back home', () => {
    render(<NotFound />);

    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toBeInTheDocument();
    expect(heading).not.toBeEmptyDOMElement();

    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/');
  });
});
