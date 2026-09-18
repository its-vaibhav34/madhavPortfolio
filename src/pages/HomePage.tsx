import React, { useState, useEffect } from 'react';
import { Project } from '../types';
import { fetchProjects } from '../api/projects';
import { INITIAL_PROJECTS } from '../data/projects';
import { profileConfig } from '../config';
import { ProjectCard } from '../components/ProjectCard';
import { Star, ArrowUpRight } from 'lucide-react';

interface HomePageProps {
  onNavigate: (path: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);

  useEffect(() => {
    fetchProjects().then(setProjects).catch(() => {});
  }, []);

  const featuredProjects = projects.filter(p => p.featured).slice(0, 3);
  const totalProjects = projects.length;

  return (
    <div className="space-y-0">
      {/* Hero Section */}
      <section className="relative pt-16 sm:pt-24 pb-16 sm:pb-24 max-w-6xl mx-auto px-6 sm:px-10">
        {/* Tech label */}
        <div className="flex items-center space-x-2 mb-10">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
          <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-neutral-500">
            {profileConfig.headline}
          </span>
        </div>

        {/* Massive Typography */}
        <div className="mb-10 select-none">
          <h1 className="font-heading font-bold tracking-tighter leading-[0.9]">
            <span className="block text-[clamp(3.5rem,12vw,9rem)] text-white">
              MADHAV
            </span>
            <span className="block text-[clamp(3.5rem,12vw,9rem)] text-outline">
              SHARMA
            </span>
            <span className="block text-[clamp(3.5rem,12vw,9rem)] text-white">
              LAB
            </span>
          </h1>
        </div>

        {/* Tagline with left border accent */}
        <div className="border-l-2 border-neutral-700 pl-5 mb-10 max-w-lg">
          <p className="text-sm sm:text-base text-neutral-400 leading-relaxed">
            {profileConfig.tagline}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-3 mb-16">
          <button
            id="hero-explore-builds-btn"
            type="button"
            onClick={() => onNavigate('/builds')}
            className="flex items-center space-x-2 bg-white text-[#0a0a0a] px-6 py-3 rounded-md text-sm font-semibold hover:bg-neutral-200 transition-colors cursor-pointer"
          >
            <Star className="w-4 h-4" />
            <span>Explore Builds</span>
          </button>

          <a
            id="hero-github-btn"
            href={profileConfig.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-2 border border-white/20 px-6 py-3 rounded-md text-sm font-semibold text-white hover:bg-white/5 transition-colors"
          >
            <span>View GitHub</span>
          </a>
        </div>

        {/* Stats Row */}
        <div className="flex items-center space-x-10 border-t border-white/5 pt-8">
          <div>
            <div className="text-3xl sm:text-4xl font-heading font-bold text-white tracking-tight">
              {totalProjects}+
            </div>
            <div className="text-[10px] font-mono uppercase tracking-[0.15em] text-neutral-600 mt-1">
              College Builds
            </div>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-heading font-bold text-white tracking-tight">
              100%
            </div>
            <div className="text-[10px] font-mono uppercase tracking-[0.15em] text-neutral-600 mt-1">
              Open Source
            </div>
          </div>
        </div>
      </section>

      {/* Featured Builds Section */}
      <section className="max-w-6xl mx-auto px-6 sm:px-10 border-t border-white/5 pt-16 pb-8">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="text-2xl sm:text-3xl font-heading font-bold text-white tracking-tight">
              MY LATEST BUILDS
            </h2>
            <p className="text-xs text-neutral-500 font-mono mt-1.5 tracking-wide">
              Circuits I've soldered. Code I've flashed. Stuff that actually works.
            </p>
          </div>

          <button
            type="button"
            onClick={() => onNavigate('/builds')}
            className="flex items-center space-x-1.5 text-xs font-mono text-emerald-500 font-semibold hover:text-emerald-400 transition-colors cursor-pointer"
          >
            <span>SEE ALL</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Featured Builds Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {featuredProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onSelect={(slug) => onNavigate(`/builds/${slug}`)}
            />
          ))}
        </div>
      </section>
    </div>
  );
};
