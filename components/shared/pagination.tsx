import Link from 'next/link';
import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

type PaginationProps = {
  basePath: string;
  currentPage: number;
  totalPages: number;
  className?: string;
};

type PaginationControlProps = {
  children: ReactNode;
  href: string;
  disabled: boolean;
  'aria-label': string;
};

const baseButtonClasses =
  'inline-flex h-10 items-center justify-center rounded-full border text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2';

const disabledClasses = 'border-border/50 text-muted-foreground opacity-60';
const controlClasses = 'px-4';
const numberClasses = 'w-10';
const inactiveClasses =
  'border-border/60 text-muted-foreground hover:bg-muted/60 hover:text-foreground';
const activeClasses = 'border-primary bg-primary text-primary-foreground shadow';

const normalizeBasePath = (basePath: string) => {
  if (basePath === '/') return '/';
  return basePath.endsWith('/') ? basePath.slice(0, -1) : basePath;
};

const buildHref = (basePath: string, page: number) => {
  const normalized = normalizeBasePath(basePath);
  if (page <= 1) {
    return normalized || '/';
  }
  const prefix = normalized === '/' ? '' : normalized;
  return `${prefix}/page/${page}`;
};

const PaginationControl = ({
  children,
  disabled,
  href,
  'aria-label': ariaLabel,
}: PaginationControlProps) =>
  disabled ? (
    <span
      className={cn(baseButtonClasses, controlClasses, disabledClasses)}
      aria-disabled="true"
      aria-label={ariaLabel}
    >
      {children}
    </span>
  ) : (
    <Link
      href={href}
      aria-label={ariaLabel}
      className={cn(baseButtonClasses, controlClasses, inactiveClasses)}
      prefetch={false}
    >
      {children}
    </Link>
  );

export const Pagination = ({ basePath, currentPage, totalPages, className }: PaginationProps) => {
  if (totalPages <= 1) {
    return null;
  }

  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <nav
      className={cn('flex flex-wrap items-center justify-center gap-2', className)}
      aria-label="ページ切り替え"
    >
      <PaginationControl
        aria-label="前のページへ"
        disabled={currentPage <= 1}
        href={buildHref(basePath, currentPage - 1)}
      >
        前へ
      </PaginationControl>
      {pages.map((pageNumber) => {
        const href = buildHref(basePath, pageNumber);
        const isActive = pageNumber === currentPage;
        return (
          <Link
            key={pageNumber}
            href={href}
            prefetch={false}
            aria-label={`ページ ${pageNumber}`}
            aria-current={isActive ? 'page' : undefined}
            className={cn(
              baseButtonClasses,
              numberClasses,
              isActive ? activeClasses : inactiveClasses
            )}
          >
            {pageNumber}
          </Link>
        );
      })}
      <PaginationControl
        aria-label="次のページへ"
        disabled={currentPage >= totalPages}
        href={buildHref(basePath, currentPage + 1)}
      >
        次へ
      </PaginationControl>
    </nav>
  );
};
