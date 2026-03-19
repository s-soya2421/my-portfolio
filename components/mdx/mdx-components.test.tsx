import { render, screen } from '@testing-library/react';
import type { ReactElement } from 'react';
import { describe, expect, it } from 'vitest';
import { mdxComponents } from './mdx-components';

describe('mdxComponents', () => {
  it('renders image with default classes and fallback alt text', () => {
    const Img = mdxComponents.img as (props: Record<string, unknown>) => ReactElement;

    render(<Img src="/images/example.png" className="custom-image" />);

    const image = screen.getByRole('presentation');
    expect(image).toHaveAttribute('src', '/images/example.png');
    expect(image).toHaveAttribute('alt', '');
    expect(image.className).toContain('rounded-2xl');
    expect(image.className).toContain('custom-image');
  });

  it('renders typography components with base and custom classes', () => {
    const Pre = mdxComponents.pre as (props: Record<string, unknown>) => ReactElement;
    const Code = mdxComponents.code as (props: Record<string, unknown>) => ReactElement;
    const H2 = mdxComponents.h2 as (props: Record<string, unknown>) => ReactElement;
    const H3 = mdxComponents.h3 as (props: Record<string, unknown>) => ReactElement;
    const Ul = mdxComponents.ul as (props: Record<string, unknown>) => ReactElement;
    const Ol = mdxComponents.ol as (props: Record<string, unknown>) => ReactElement;
    const Blockquote = mdxComponents.blockquote as (
      props: Record<string, unknown>
    ) => ReactElement;

    render(
      <>
        <Pre className="custom-pre">pre-body</Pre>
        <Code className="custom-code">code-body</Code>
        <H2 className="custom-h2">Heading Two</H2>
        <H3 className="custom-h3">Heading Three</H3>
        <Ul className="custom-ul">
          <li>first</li>
        </Ul>
        <Ol className="custom-ol">
          <li>second</li>
        </Ol>
        <Blockquote className="custom-quote">quote-body</Blockquote>
      </>
    );

    expect(screen.getByText('pre-body').className).toContain('custom-pre');
    expect(screen.getByText('pre-body').className).toContain('overflow-x-auto');
    expect(screen.getByText('code-body').className).toContain('custom-code');
    expect(screen.getByText('code-body').className).toContain('rounded');
    expect(screen.getByRole('heading', { level: 2 }).className).toContain('custom-h2');
    expect(screen.getByRole('heading', { level: 2 }).className).toContain('text-2xl');
    expect(screen.getByRole('heading', { level: 3 }).className).toContain('custom-h3');
    expect(screen.getByRole('heading', { level: 3 }).className).toContain('text-xl');
    const [unorderedList, orderedList] = screen.getAllByRole('list');
    expect(unorderedList.className).toContain('custom-ul');
    expect(orderedList.className).toContain('custom-ol');
    expect(screen.getByText('quote-body').className).toContain('custom-quote');
    expect(screen.getByText('quote-body').className).toContain('border-l-4');
  });
});
