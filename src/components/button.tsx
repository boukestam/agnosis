import React from 'react';

import clsx from 'clsx';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'primary';
  className?: string;
  disabled?: boolean;
}

function Button({ children, onClick, type = 'primary', className, disabled }: ButtonProps) {
  return (
    <button
      className={clsx(
        'text-sm',
        type === 'primary' &&
          'text-white button pixel outline-none border-text-light hover:brightness-125',
        className,
      )}
      onClick={onClick}
      disabled={disabled}
    >
      <div className="flex items-center justify-center h-full px-2 bg-ui-fill">{children}</div>
    </button>
  );
}

export default Button;
