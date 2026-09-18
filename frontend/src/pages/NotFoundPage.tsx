import React from 'react';
import { ArrowLeft } from 'lucide-react';

interface NotFoundPageProps {
  onNavigate: (path: string) => void;
}

export const NotFoundPage: React.FC<NotFoundPageProps> = ({ onNavigate }) => {
  return (
    <div className="max-w-2xl mx-auto px-6 py-32 text-center space-y-6">
      <div className="font-heading text-8xl font-bold text-white/10 tracking-tighter">404</div>
      <h1 className="text-2xl font-heading font-bold text-white">Page Not Found</h1>
      <p className="text-neutral-500 text-sm">
        This page doesn't exist. Maybe the circuit is broken somewhere.
      </p>
      <button
        type="button"
        onClick={() => onNavigate('/')}
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-white text-[#0a0a0a] text-sm font-semibold hover:bg-neutral-200 transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Home</span>
      </button>
    </div>
  );
};
