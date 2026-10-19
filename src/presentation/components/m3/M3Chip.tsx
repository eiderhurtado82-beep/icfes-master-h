import React from 'react';

interface M3ChipProps {
  label: string;
  selected?: boolean;
  onClick?: () => void;
  icon?: React.ReactNode;
  variant?: 'filter' | 'assist';
  count?: number;
}

export const M3Chip: React.FC<M3ChipProps> = ({
  label,
  selected = false,
  onClick,
  icon,
  variant = 'filter',
  count,
}) => {
  const isClickable = Boolean(onClick);

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!isClickable}
      className={`inline-flex items-center h-8 px-3.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all duration-150 select-none ${
        isClickable ? 'cursor-pointer active:scale-95' : 'cursor-default'
      } ${
        selected
          ? 'bg-[#DCE4F9] text-[#001944] border border-[#0B2F64]/20 shadow-xs'
          : 'bg-white text-[#43474E] border border-[#C3C7D0] hover:bg-[#F0F4FC]'
      }`}
    >
      {icon && <span className="mr-1.5 shrink-0">{icon}</span>}
      <span>{label}</span>
      {count !== undefined && (
        <span
          className={`ml-1.5 px-1.5 py-0.2 rounded-full text-[10px] ${
            selected ? 'bg-[#0B2F64] text-white' : 'bg-[#E1E7F0] text-[#43474E]'
          }`}
        >
          {count}
        </span>
      )}
    </button>
  );
};
