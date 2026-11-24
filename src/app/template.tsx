'use client';

import { motion } from 'motion/react';

export default function Template({ children }: { children: ReactNode }) {
  return (
    <motion.div
      initial={{ y: 6 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

import type { ReactNode } from 'react';
