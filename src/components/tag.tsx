import React, { ReactNode } from 'react';

import clsx from 'clsx';

export function Tag({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={clsx('px-2 py-0.5 text-xs text-white bg-red-500 rounded-full', className)}>
      {children}
    </div>
  );
}
