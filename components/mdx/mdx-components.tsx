import Image from 'next/image';
import type { MDXComponents } from 'mdx/types';
import { cn } from '@/lib/utils';

export const mdxComponents: MDXComponents = {
  img: ({ className, alt, ...props }) => (
    <Image
      className={cn('rounded-2xl border border-border/60 shadow', className)}
      alt={alt ?? ''}
      width={1280}
      height={720}
      {...props}
    />
  ),
  pre: ({ className, ...props }) => (
    <pre
      className={cn(
        'mt-6 overflow-x-auto rounded-2xl border border-border/60 bg-muted px-4 py-3 text-sm',
        className
      )}
      {...props}
    />
  ),
  code: ({ className, ...props }) => (
    <code className={cn('rounded bg-muted px-1.5 py-0.5 text-sm', className)} {...props} />
  ),
  h2: ({ className, ...props }) => (
    <h2 className={cn('mt-12 text-2xl font-semibold', className)} {...props} />
  ),
  h3: ({ className, ...props }) => (
    <h3 className={cn('mt-8 text-xl font-semibold', className)} {...props} />
  ),
  ul: ({ className, ...props }) => (
    <ul className={cn('mt-4 list-disc space-y-2 pl-6', className)} {...props} />
  ),
  ol: ({ className, ...props }) => (
    <ol className={cn('mt-4 list-decimal space-y-2 pl-6', className)} {...props} />
  ),
  blockquote: ({ className, ...props }) => (
    <blockquote
      className={cn('mt-6 border-l-4 border-primary/40 pl-4 italic text-muted-foreground', className)}
      {...props}
    />
  )
};
