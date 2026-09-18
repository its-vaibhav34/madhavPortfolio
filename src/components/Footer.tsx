import React from 'react';
import { profileConfig } from '../config';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-white/5 mt-20 py-8 text-[10px] sm:text-xs text-neutral-600 font-mono tracking-wider">
      <div className="max-w-6xl mx-auto px-6 sm:px-10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-center sm:text-left">
          CYBER CIRCUIT LAB &copy; {currentYear} &mdash; BUILT WITH CURIOSITY AND A LOT OF DEBUGGING
        </div>

        <div className="flex items-center space-x-6">
          <span className="flex items-center space-x-1.5">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
            <span>SYSTEMS NOMINAL</span>
          </span>

          <a
            id="footer-github-link"
            href={profileConfig.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors font-semibold"
          >
            GITHUB
          </a>
        </div>
      </div>
    </footer>
  );
};
