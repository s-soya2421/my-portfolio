'use client';

import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';

export const PageTransition = ({ children }: { children: ReactNode }) => {
  const pathname = usePathname();

  return (
    <div key={pathname} className="reveal-rise">
      {children}
    </div>
  );
};
