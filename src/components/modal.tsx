import React from 'react';

export function Modal({ children }: { children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-20 flex items-center justify-center bg-black bg-opacity-50">
      <div className="frame">
        <div className="p-4 bg-ui-frame">{children}</div>
      </div>
    </div>
  );
}
