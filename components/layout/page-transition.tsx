'use client';

import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { usePathname } from 'next/navigation';

export const PageTransition = ({ children }: { children: ReactNode }) => {
  const pathname = usePathname();

  return (
    <motion.div
      key={pathname}
      initial={{ opacity: 1, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );
};
