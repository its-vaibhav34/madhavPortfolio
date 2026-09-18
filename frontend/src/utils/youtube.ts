/**
 * Utilities for parsing and embedding YouTube videos
 */

/**
 * Extracts YouTube video ID from various URL formats:
 * - https://youtu.be/1n_KjpMfVT0
 * - https://www.youtube.com/watch?v=1n_KjpMfVT0
 * - https://youtube.com/shorts/1n_KjpMfVT0
 * - https://www.youtube.com/embed/1n_KjpMfVT0
 * - Plain 11-character video ID
 */
export function getYouTubeVideoId(url?: string | null): string | null {
  if (!url) return null;
  const trimmed = url.trim();
  if (!trimmed) return null;

  // Plain 11-char alphanumeric/underscore/dash ID
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return trimmed;
  }

  // Common YouTube URL regex matching standard watch, youtu.be, shorts, embed
  const regex = /(?:youtu\.be\/|youtube(?:-nocookie)?\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/|live\/))([a-zA-Z0-9_-]{11})/;
  const match = trimmed.match(regex);
  if (match && match[1]) {
    return match[1];
  }

  return null;
}

/**
 * Returns a privacy-enhanced YouTube embed URL (youtube-nocookie.com)
 */
export function getYouTubeEmbedUrl(url?: string | null): string | null {
  const videoId = getYouTubeVideoId(url);
  if (!videoId) return null;
  return `https://www.youtube-nocookie.com/embed/${videoId}?rel=0&modestbranding=1`;
}
