import { cn } from '@/lib/utils';

export const Tag = ({ label, className }: { label: string; className?: string }) => (
  <span
    className={cn(
      'rounded-full bg-secondary px-3 py-1 text-xs font-semibold uppercase tracking-wide',
      className
    )}
  >
    {label}
  </span>
);
