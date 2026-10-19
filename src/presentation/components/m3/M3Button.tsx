import React from 'react';

export type M3ButtonVariant = 'filled' | 'tonal' | 'outlined' | 'text' | 'elevated' | 'success';

interface M3ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: M3ButtonVariant;
  icon?: React.ReactNode;
  iconPosition?: 'start' | 'end';
  fullWidth?: boolean;
  size?: 'small' | 'medium' | 'large';
  children: React.ReactNode;
}

export const M3Button: React.FC<M3ButtonProps> = ({
  variant = 'filled',
  icon,
  iconPosition = 'start',
  fullWidth = false,
  size = 'medium',
  className = '',
  disabled = false,
  children,
  ...props
}) => {
  const sizeClasses = {
    small: 'h-9 px-3.5 text-xs gap-1.5',
    medium: 'h-10 px-5 text-sm gap-2',
    large: 'h-12 px-6 text-base gap-2.5',
  };

  const variantClasses = {
    filled:
      'bg-[#0B2F64] text-white hover:bg-[#082249] active:bg-[#051733] shadow-sm disabled:bg-[#191C1E]/12 disabled:text-[#191C1E]/38',
    tonal:
      'bg-[#DCE4F9] text-[#001944] hover:bg-[#CFDCF7] active:bg-[#BFD2F4] disabled:bg-[#191C1E]/12 disabled:text-[#191C1E]/38',
    outlined:
      'border border-[#73777F] text-[#0B2F64] hover:bg-[#0B2F64]/8 active:bg-[#0B2F64]/12 disabled:border-[#191C1E]/12 disabled:text-[#191C1E]/38',
    text:
      'text-[#0B2F64] hover:bg-[#0B2F64]/8 active:bg-[#0B2F64]/12 disabled:text-[#191C1E]/38',
    elevated:
      'bg-white text-[#0B2F64] shadow-md hover:shadow-lg active:shadow-sm disabled:bg-[#191C1E]/12 disabled:text-[#191C1E]/38',
    success:
      'bg-[#00875A] text-white hover:bg-[#00704A] active:bg-[#005A3B] shadow-sm disabled:bg-[#191C1E]/12 disabled:text-[#191C1E]/38',
  };

  return (
    <button
      className={`relative inline-flex items-center justify-center font-semibold rounded-full tracking-tight transition-all duration-200 select-none cursor-pointer disabled:cursor-not-allowed ${
        fullWidth ? 'w-full' : ''
      } ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      disabled={disabled}
      {...props}
    >
      {icon && iconPosition === 'start' && <span className="shrink-0">{icon}</span>}
      <span className="truncate">{children}</span>
      {icon && iconPosition === 'end' && <span className="shrink-0">{icon}</span>}
    </button>
  );
};
