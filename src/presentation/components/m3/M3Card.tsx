import React from 'react';

export type M3CardVariant = 'elevated' | 'filled' | 'outlined';

interface M3CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: M3CardVariant;
  interactive?: boolean;
  children: React.ReactNode;
}

export const M3Card: React.FC<M3CardProps> = ({
  variant = 'outlined',
  interactive = false,
  className = '',
  children,
  ...props
}) => {
  const variantStyles = {
    elevated: 'bg-white shadow-md border-0',
    filled: 'bg-[#F0F4FC] border-0',
    outlined: 'bg-white border border-[#E1E7F0]',
  };

  const interactiveStyles = interactive
    ? 'cursor-pointer hover:shadow-lg hover:border-[#0B2F64]/30 active:scale-[0.99] transition-all duration-200'
    : '';

  return (
    <div
      className={`rounded-2xl p-4 sm:p-5 text-[#191C1E] transition-shadow duration-200 ${variantStyles[variant]} ${interactiveStyles} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
