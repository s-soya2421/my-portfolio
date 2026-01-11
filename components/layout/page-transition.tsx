'use client';

import type { ReactNode } from 'react';
import { usePathname } from 'next/navigation';

export const PageTransition = ({ children }: { children: ReactNode }) => {
  const pathname = usePathname();

  return (
    <div key={pathname} className="reveal-rise">
      {children}
    </div>
  );
};
