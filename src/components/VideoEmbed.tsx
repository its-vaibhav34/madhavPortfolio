import React, { useState } from 'react';
import { Play, ExternalLink } from 'lucide-react';

interface VideoEmbedProps {
  youtubeUrl: string;
  thumbnailUrl?: string;
  title: string;
}

export const VideoEmbed: React.FC<VideoEmbedProps> = ({
  youtubeUrl,
  thumbnailUrl,
  title
}) => {
  const [isPlaying, setIsPlaying] = useState(false);

  // Extract YouTube ID if valid
  const getEmbedUrl = (url: string) => {
    try {
      const parsed = new URL(url);
      let videoId = '';
      if (parsed.hostname.includes('youtube.com')) {
        videoId = parsed.searchParams.get('v') || '';
      } else if (parsed.hostname.includes('youtu.be')) {
        videoId = parsed.pathname.slice(1);
      }
      if (videoId) {
        return `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
      }
    } catch {
      // fallback
    }
    return null;
  };

  const embedUrl = getEmbedUrl(youtubeUrl);
  const fallbackThumb =
    thumbnailUrl ||
    'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80';

  if (isPlaying && embedUrl) {
    return (
      <div className="relative aspect-video w-full rounded-xl overflow-hidden border border-zinc-200 bg-black shadow-sm">
        <iframe
          src={embedUrl}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full h-full border-0"
        />
      </div>
    );
  }

  return (
    <div className="group relative aspect-video w-full rounded-xl overflow-hidden border border-zinc-200 bg-zinc-900 shadow-sm cursor-pointer">
      <img
        src={fallbackThumb}
        alt={title}
        className="w-full h-full object-cover opacity-85 transition-transform duration-500 group-hover:scale-105 group-hover:opacity-75"
      />

      {/* Dark gradient overlay for contrast */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/20" />

      {/* Center Play Button */}
      <div
        onClick={() => setIsPlaying(true)}
        className="absolute inset-0 flex flex-col items-center justify-center text-white"
      >
        <div className="w-16 h-16 rounded-full bg-white/95 text-zinc-900 flex items-center justify-center shadow-lg transition-transform duration-200 group-hover:scale-110">
          <Play className="w-6 h-6 fill-current ml-1 text-zinc-900" />
        </div>
        <p className="mt-4 text-xs font-mono uppercase tracking-widest text-zinc-200">
          Watch Workbench Demo
        </p>
      </div>

      {/* External Link fallback on corner */}
      <a
        href={youtubeUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={(e) => e.stopPropagation()}
        className="absolute top-3 right-3 p-2 rounded-md bg-black/50 text-zinc-300 hover:text-white hover:bg-black/80 transition-colors"
        title="Open directly on YouTube"
      >
        <ExternalLink className="w-4 h-4" />
      </a>
    </div>
  );
};
