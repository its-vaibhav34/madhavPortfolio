import React from 'react';
import { Project } from '../types';
import { ArrowUpRight } from 'lucide-react';

interface ProjectCardProps {
  project: Project;
  onSelect: (slug: string) => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, onSelect }) => {
  return (
    <div
      id={`project-card-${project.slug}`}
      onClick={() => onSelect(project.slug)}
      className="group bg-[#111111] border border-white/5 rounded-xl overflow-hidden flex flex-col hover:border-white/15 transition-all duration-300 cursor-pointer card-glow"
    >
      {/* Image Container */}
      <div className="h-48 sm:h-52 bg-[#0a0a0a] overflow-hidden relative">
        <img
          src={project.image}
          alt={project.title}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.05] opacity-80 group-hover:opacity-100"
        />
        {/* Category badge */}
        <div className="absolute top-3 left-3 bg-[#0a0a0a]/80 backdrop-blur-sm px-2.5 py-1 rounded-md text-[10px] font-mono border border-white/10 uppercase tracking-wider text-neutral-300">
          {project.category}
        </div>
      </div>

      {/* Card Body */}
      <div className="p-5 flex flex-col flex-1 justify-between">
        <div>
          <h3 className="font-heading font-bold text-lg mb-2 group-hover:text-emerald-400 transition-colors text-white tracking-tight">
            {project.title}
          </h3>

          <p className="text-xs text-neutral-500 line-clamp-2 mb-4 leading-relaxed">
            {project.description}
          </p>

          {/* Technology tags */}
          <div className="flex gap-1.5 flex-wrap mb-4">
            {project.technologies.slice(0, 3).map((tech) => (
              <span
                key={tech}
                className="text-[10px] font-mono bg-white/5 text-neutral-400 px-2 py-0.5 rounded border border-white/10"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* View Build Link */}
        <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs font-mono text-emerald-500 font-medium">
          <span>View Build</span>
          <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </div>
      </div>
    </div>
  );
};
