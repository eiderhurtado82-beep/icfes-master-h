import React from 'react';

interface M3LinearProgressProps {
  value: number; // 0 to 100
  color?: 'primary' | 'tertiary' | 'error';
  height?: number;
  className?: string;
  showLabel?: boolean;
}

export const M3LinearProgress: React.FC<M3LinearProgressProps> = ({
  value,
  color = 'tertiary',
  height = 8,
  className = '',
  showLabel = false,
}) => {
  const clamped = Math.min(100, Math.max(0, value));

  const colorStyles = {
    primary: {
      bar: 'bg-[#0B2F64]',
      track: 'bg-[#DCE4F9]',
    },
    tertiary: {
      bar: 'bg-[#00875A]', // Verde institucional de progreso
      track: 'bg-[#AFF2D4]',
    },
    error: {
      bar: 'bg-[#BA1A1A]',
      track: 'bg-[#FFDAD6]',
    },
  };

  return (
    <div className={`w-full ${className}`}>
      {showLabel && (
        <div className="flex justify-between items-center text-xs font-semibold mb-1 text-[#43474E]">
          <span>Progreso</span>
          <span className="font-mono tabular-nums">{Math.round(clamped)}%</span>
        </div>
      )}
      <div
        className={`w-full rounded-full overflow-hidden ${colorStyles[color].track}`}
        style={{ height: `${height}px` }}
      >
        <div
          className={`h-full rounded-full transition-all duration-300 ease-out ${colorStyles[color].bar}`}
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
};

interface M3CircularProgressProps {
  value: number; // 0 to 100
  size?: number;
  strokeWidth?: number;
  color?: 'primary' | 'tertiary';
  label?: string;
}

export const M3CircularProgress: React.FC<M3CircularProgressProps> = ({
  value,
  size = 72,
  strokeWidth = 7,
  color = 'tertiary',
  label,
}) => {
  const clamped = Math.min(100, Math.max(0, value));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (clamped / 100) * circumference;

  const strokeColor = color === 'tertiary' ? '#00875A' : '#0B2F64';
  const trackColor = color === 'tertiary' ? '#AFF2D4' : '#DCE4F9';

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="rotate-[-90deg]">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={trackColor}
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-500 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="text-sm font-bold text-[#191C1E] font-mono tabular-nums">
          {label ?? `${Math.round(clamped)}%`}
        </span>
      </div>
    </div>
  );
};
