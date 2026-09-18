import React, { useEffect, useState } from 'react';
import { X, ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';

interface ImageViewerProps {
  src: string;
  alt: string;
  caption?: string;
  isOpen: boolean;
  onClose: () => void;
}

export const ImageViewer: React.FC<ImageViewerProps> = ({
  src,
  alt,
  caption,
  isOpen,
  onClose
}) => {
  const [isZoomed, setIsZoomed] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = 'auto';
      setIsZoomed(false);
    }

    return () => {
      document.body.style.overflow = 'auto';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={alt}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 sm:p-8"
      onClick={onClose}
    >
      {/* Controls Bar */}
      <div
        className="absolute top-4 right-4 z-50 flex items-center space-x-3 bg-[#111111]/90 px-3 py-1.5 rounded-full border border-white/10 text-white"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={() => setIsZoomed(!isZoomed)}
          className="p-1.5 hover:text-emerald-400 transition-colors cursor-pointer"
          title={isZoomed ? "Zoom Out" : "Zoom In"}
          aria-label={isZoomed ? "Zoom Out" : "Zoom In"}
        >
          {isZoomed ? <ZoomOut className="w-4 h-4" /> : <ZoomIn className="w-4 h-4" />}
        </button>
        <div className="w-px h-3.5 bg-white/10" />
        <button
          type="button"
          onClick={onClose}
          className="p-1.5 hover:text-neutral-400 transition-colors cursor-pointer"
          title="Close (Esc)"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Main Container */}
      <div
        className="relative max-w-5xl max-h-[90vh] overflow-auto flex flex-col items-center justify-center p-2 select-none"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={src}
          alt={alt}
          onClick={() => setIsZoomed(!isZoomed)}
          className={`rounded-lg object-contain transition-transform duration-200 cursor-zoom-in ${
            isZoomed
              ? 'scale-150 cursor-zoom-out shadow-2xl'
              : 'max-h-[80vh] w-auto max-w-full shadow-lg'
          }`}
        />
        {caption && (
          <p className="mt-3 text-xs font-mono text-neutral-400 text-center tracking-wide">
            {caption}
          </p>
        )}
      </div>
    </div>
  );
};

export const ExpandableImage: React.FC<{
  src: string;
  alt: string;
  caption?: string;
  className?: string;
}> = ({ src, alt, caption, className = "" }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div
        className={`group relative cursor-pointer overflow-hidden rounded-xl border border-white/5 bg-[#111111] ${className}`}
        onClick={() => setIsOpen(true)}
      >
        <img
          src={src}
          alt={alt}
          loading="lazy"
          className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-[1.01] opacity-80 group-hover:opacity-100"
        />
        {/* Overlay hover badge */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-end justify-end p-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#0a0a0a]/90 backdrop-blur-sm text-neutral-300 text-xs font-medium border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity">
            <Maximize2 className="w-3.5 h-3.5 text-neutral-500" />
            Click to enlarge
          </span>
        </div>
      </div>
      {caption && (
        <p className="mt-2 text-xs text-neutral-600 font-mono text-center">
          {caption}
        </p>
      )}

      <ImageViewer
        src={src}
        alt={alt}
        caption={caption}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </>
  );
};
