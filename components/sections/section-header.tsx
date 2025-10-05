import { cn } from '@/lib/utils';

export const SectionHeader = ({
  eyebrow,
  title,
  description,
  className
}: {
  eyebrow: string;
  title: string;
  description?: string;
  className?: string;
}) => (
  <div className={cn('space-y-2 text-balance', className)}>
    <span className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
      {eyebrow}
    </span>
    <h2 className="text-2xl font-bold md:text-3xl">{title}</h2>
    {description ? <p className="text-sm text-muted-foreground md:text-base">{description}</p> : null}
  </div>
);
