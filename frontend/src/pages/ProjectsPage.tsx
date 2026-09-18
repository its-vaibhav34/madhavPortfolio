import React, { useState, useEffect } from 'react';
import { Project } from '../types';
import { fetchProjects } from '../api/projects';
import { INITIAL_PROJECTS } from '../data/projects';
import { ProjectCard } from '../components/ProjectCard';

interface ProjectsPageProps {
  onNavigate: (path: string) => void;
}

export const ProjectsPage: React.FC<ProjectsPageProps> = ({ onNavigate }) => {
  const [allProjects, setAllProjects] = useState<Project[]>(INITIAL_PROJECTS);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  useEffect(() => {
    fetchProjects().then(setAllProjects).catch(() => {});
  }, []);

  const categories = ['All', 'Electronics', 'IoT', 'Robotics'];

  const filteredProjects = selectedCategory === 'All'
    ? allProjects
    : allProjects.filter(p => p.category.toLowerCase() === selectedCategory.toLowerCase());

  return (
    <div className="max-w-6xl mx-auto px-6 sm:px-10 py-12 sm:py-20 space-y-10">
      {/* Header */}
      <div className="space-y-3">
        <h1 className="text-4xl sm:text-6xl font-heading font-bold tracking-tight text-white">
          MY LATEST BUILDS
        </h1>
        <p className="text-sm sm:text-base text-neutral-500 max-w-xl leading-relaxed">
          Circuits I've soldered. Code I've flashed. Stuff that actually works. Every project here was built from scratch on my workbench.
        </p>
      </div>

      {/* Category Filter */}
      <div className="flex items-center space-x-2 border-b border-white/5 pb-4 overflow-x-auto">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-md text-xs font-mono tracking-tight transition-all cursor-pointer ${
              selectedCategory === cat
                ? 'bg-white text-[#0a0a0a] font-semibold'
                : 'text-neutral-500 hover:text-white hover:bg-white/5 bg-white/[0.02]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredProjects.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            onSelect={(slug) => onNavigate(`/builds/${slug}`)}
          />
        ))}
      </div>

      {filteredProjects.length === 0 && (
        <div className="text-center py-20 text-neutral-600 font-mono text-xs">
          No builds found in this category.
        </div>
      )}
    </div>
  );
};
