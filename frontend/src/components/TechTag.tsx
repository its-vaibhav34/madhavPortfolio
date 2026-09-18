import React from 'react';

interface TechTagProps {
  name: string;
  size?: 'sm' | 'md';
}

export const TechTag: React.FC<TechTagProps> = ({ name, size = 'sm' }) => {
  return (
    <span
      className={`inline-flex items-center font-mono rounded-md border border-white/10 bg-white/5 text-neutral-300 transition-all hover:bg-white/10 hover:border-white/20 ${
        size === 'sm'
          ? 'px-2.5 py-1 text-[10px]'
          : 'px-3 py-1.5 text-xs'
      }`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 shrink-0" />
      {name}
    </span>
  );
};
