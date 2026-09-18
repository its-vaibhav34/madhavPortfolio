import React from 'react';
import { profileConfig } from '../config';
import { Github, ArrowUpRight } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="max-w-2xl mx-auto px-6 py-14 sm:py-20 space-y-10">
      {/* Heading */}
      <div className="space-y-3">
        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-[#1a1a1a]">
          About Me
        </h1>
      </div>

      {/* Short Introduction */}
      <div className="space-y-4 text-base sm:text-lg text-stone-600 leading-relaxed font-normal">
        {profileConfig.aboutText.map((paragraph, idx) => (
          <p key={idx}>{paragraph}</p>
        ))}
      </div>

      {/* Currently Exploring */}
      <div className="space-y-4 pt-6 border-t border-stone-100">
        <h2 className="text-xs font-mono uppercase tracking-widest text-stone-400 font-semibold">
          Currently Exploring
        </h2>
        <div className="flex flex-wrap gap-2">
          {profileConfig.exploring.map((topic) => (
            <span
              key={topic}
              className="px-3.5 py-1.5 rounded-full border border-stone-200 bg-stone-50 text-stone-700 text-xs font-mono"
            >
              {topic}
            </span>
          ))}
        </div>
      </div>

      {/* GitHub Button */}
      <div className="pt-6 border-t border-stone-100">
        <a
          id="about-github-btn"
          href={profileConfig.githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center space-x-2 bg-[#1a1a1a] text-white px-8 py-3 rounded-full text-sm font-medium hover:scale-105 transition-transform shadow-xs"
        >
          <Github className="w-4 h-4" />
          <span>View GitHub Profile</span>
          <span className="text-stone-400">↗</span>
        </a>
      </div>
    </div>
  );
};
