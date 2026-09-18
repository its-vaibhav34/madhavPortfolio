import React, { useState, useEffect } from 'react';
import { Project } from '../types';
import { fetchProjectBySlug } from '../api/projects';
import { INITIAL_PROJECTS } from '../data/projects';
import { TechTag } from '../components/TechTag';
import { CodeBlock } from '../components/CodeBlock';
import { ExpandableImage } from '../components/ImageViewer';
import { ArrowLeft, Github, ArrowUpRight, Cpu, Zap, Play, Video, Youtube } from 'lucide-react';
import { getYouTubeEmbedUrl } from '../utils/youtube';

interface ProjectDetailPageProps {
  slug: string;
  onNavigate: (path: string) => void;
}

export const ProjectDetailPage: React.FC<ProjectDetailPageProps> = ({ slug, onNavigate }) => {
  const initial = INITIAL_PROJECTS.find(p => p.slug === slug || p.id === slug) || null;
  const [project, setProject] = useState<Project | null>(initial);
  const [loading, setLoading] = useState<boolean>(!initial);

  useEffect(() => {
    fetchProjectBySlug(slug)
      .then(p => {
        if (p) setProject(p);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading && !project) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-24 text-center space-y-4 font-mono text-xs text-neutral-500">
        <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
        <p>Loading build from database...</p>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-24 text-center space-y-6">
        <h1 className="text-2xl font-heading font-bold text-white">Build Not Found</h1>
        <p className="text-neutral-500 text-sm">
          This build doesn't exist or has been removed.
        </p>
        <button
          type="button"
          onClick={() => onNavigate('/builds')}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-white text-[#0a0a0a] text-xs font-semibold hover:bg-neutral-200 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Builds</span>
        </button>
      </div>
    );
  }

  return (
    <article className="max-w-4xl mx-auto px-6 sm:px-10 py-12 sm:py-20 space-y-14">
      {/* Back button */}
      <div>
        <button
          type="button"
          onClick={() => onNavigate('/builds')}
          className="inline-flex items-center gap-1.5 text-xs font-mono text-neutral-500 hover:text-white transition-colors group cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" />
          <span>Back to Builds</span>
        </button>
      </div>

      {/* Header — BOLD COOL FONT big heading */}
      <header className="space-y-6">
        <div className="space-y-4">
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-heading font-bold tracking-tighter text-white leading-[0.95]">
            {project.title}
          </h1>
          <p className="text-base sm:text-lg text-neutral-500 leading-relaxed max-w-2xl">
            {project.description}
          </p>
        </div>

        {/* Tech stack in small highlighted boxes */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-white/5">
          <div className="flex flex-wrap items-center gap-2">
            {project.technologies.map((tech) => (
              <TechTag key={tech} name={tech} size="md" />
            ))}
          </div>

          {project.githubUrl && (
            <a
              id="project-github-btn"
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-md border border-white/10 bg-white/5 text-xs font-medium text-neutral-300 hover:bg-white/10 hover:text-white transition-all"
            >
              <Github className="w-3.5 h-3.5" />
              <span>View Source</span>
              <ArrowUpRight className="w-3 h-3 text-neutral-600" />
            </a>
          )}
        </div>
      </header>

      {/* Project Image */}
      <div className="rounded-xl overflow-hidden border border-white/5 bg-[#111111]">
        <img
          src={project.image}
          alt={project.title}
          className="w-full h-auto max-h-[480px] object-cover opacity-90"
        />
      </div>

      {/* ABOUT THIS BUILD */}
      <section className="space-y-4">
        <h2 className="text-xs font-mono uppercase tracking-[0.2em] text-neutral-500 font-semibold">
          About This Build
        </h2>
        <div className="text-base text-neutral-400 leading-relaxed border-l-2 border-emerald-500/30 pl-5">
          <p>{project.result || project.description}</p>
        </div>
      </section>

      {/* MAIN FEATURES */}
      <section className="space-y-5 pt-8 border-t border-white/5">
        <h2 className="text-xs font-mono uppercase tracking-[0.2em] text-neutral-500 font-semibold">
          Main Features
        </h2>
        <ol className="space-y-3">
          {project.howItWorks.map((step, idx) => (
            <li key={idx} className="flex items-start space-x-4 text-sm text-neutral-400">
              <span className="flex items-center justify-center w-6 h-6 rounded-md bg-white/5 border border-white/10 font-mono text-[11px] text-emerald-500 shrink-0 mt-0.5 font-bold">
                {idx + 1}
              </span>
              <span className="leading-relaxed">{step}</span>
            </li>
          ))}
        </ol>
      </section>

      {/* COMPONENTS USED */}
      <section className="space-y-5 pt-8 border-t border-white/5">
        <h2 className="text-xs font-mono uppercase tracking-[0.2em] text-neutral-500 font-semibold">
          Components Used
        </h2>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {project.components.map((comp) => (
            <li
              key={comp}
              className="flex items-center space-x-3 text-sm text-neutral-300 bg-[#111111] border border-white/5 rounded-lg px-4 py-3 hover:border-white/10 transition-colors"
            >
              <Cpu className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              <span>{comp}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* CIRCUIT DIAGRAM */}
      {project.circuitImage && (
        <section className="space-y-5 pt-8 border-t border-white/5">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-mono uppercase tracking-[0.2em] text-neutral-500 font-semibold">
              Circuit Diagram
            </h2>
            <span className="text-[11px] font-mono text-emerald-500/70">Click to enlarge</span>
          </div>

          <ExpandableImage
            src={project.circuitImage}
            alt={`${project.title} circuit wiring diagram`}
            caption={`${project.title} — schematic wiring and pinout diagram`}
          />
        </section>
      )}

      {/* SOURCE CODE */}
      {project.code && (
        <section className="space-y-5 pt-8 border-t border-white/5">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-mono uppercase tracking-[0.2em] text-neutral-500 font-semibold flex items-center gap-2">
              <Zap className="w-3.5 h-3.5 text-emerald-500" />
              Source Code
            </h2>
            <span className="text-[11px] font-mono text-neutral-600">Firmware Source</span>
          </div>

          <CodeBlock
            code={project.code}
            language={project.codeLanguage}
            githubUrl={project.githubUrl}
            filename={`${project.slug}.${project.codeLanguage === 'python' ? 'py' : project.codeLanguage === 'c' ? 'c' : 'ino'}`}
          />
        </section>
      )}

      {/* PROJECT DEMONSTRATION VIDEO */}
      {getYouTubeEmbedUrl(project.youtubeUrl) ? (
        <section className="space-y-5 pt-8 border-t border-white/5">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-mono uppercase tracking-[0.2em] text-neutral-500 font-semibold flex items-center gap-2">
              <Youtube className="w-3.5 h-3.5 text-red-500" />
              Project Demonstration
            </h2>
            <span className="text-[11px] font-mono text-neutral-600">Video Demo</span>
          </div>

          <div className="rounded-xl overflow-hidden border border-white/5 bg-[#0d1117] shadow-2xl">
            {/* Video header bar */}
            <div className="flex items-center justify-between px-4 py-3 bg-[#161b22] border-b border-white/5">
              <div className="flex items-center space-x-3">
                <div className="flex space-x-1.5">
                  <span className="w-3 h-3 rounded-full bg-[#ff5f56] inline-block" />
                  <span className="w-3 h-3 rounded-full bg-[#ffbd2e] inline-block" />
                  <span className="w-3 h-3 rounded-full bg-[#27c93f] inline-block" />
                </div>
                <span className="text-[11px] text-neutral-400 font-mono font-medium truncate">
                  {project.title} — Working Demonstration
                </span>
              </div>
              <div className="flex items-center space-x-1.5">
                <Play className="w-3 h-3 text-emerald-500 fill-emerald-500" />
                <span className="text-[10px] font-mono text-emerald-500/90 font-medium">LIVE DEMO</span>
              </div>
            </div>

            {/* Video player: plays in frontend, no redirect to YouTube */}
            <div className="relative w-full aspect-video bg-black">
              <iframe
                src={getYouTubeEmbedUrl(project.youtubeUrl)!}
                title={`${project.title} Demonstration Video`}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
          </div>
        </section>
      ) : project.videoFile ? (
        <section className="space-y-5 pt-8 border-t border-white/5">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-mono uppercase tracking-[0.2em] text-neutral-500 font-semibold flex items-center gap-2">
              <Video className="w-3.5 h-3.5 text-emerald-500" />
              Project Demonstration
            </h2>
            <span className="text-[11px] font-mono text-neutral-600">Video</span>
          </div>

          <div className="rounded-xl overflow-hidden border border-white/5 bg-[#0d1117]">
            {/* Video header bar */}
            <div className="flex items-center justify-between px-4 py-3 bg-[#161b22] border-b border-white/5">
              <div className="flex items-center space-x-3">
                <div className="flex space-x-1.5">
                  <span className="w-3 h-3 rounded-full bg-[#ff5f56] inline-block" />
                  <span className="w-3 h-3 rounded-full bg-[#ffbd2e] inline-block" />
                  <span className="w-3 h-3 rounded-full bg-[#27c93f] inline-block" />
                </div>
                <span className="text-[11px] text-neutral-400 font-mono font-medium">
                  {project.title} — Demo
                </span>
              </div>
              <div className="flex items-center space-x-1.5">
                <Play className="w-3 h-3 text-emerald-500" />
                <span className="text-[10px] font-mono text-emerald-500/70">LIVE DEMO</span>
              </div>
            </div>

            {/* Video player */}
            <div className="relative bg-black">
              <video
                src={project.videoFile}
                controls
                className="w-full max-h-[500px] object-contain"
                preload="metadata"
                playsInline
              >
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
        </section>
      ) : null}
    </article>
  );
};
