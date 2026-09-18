import React, { useState } from 'react';
import { profileConfig } from '../config';
import { Github, Menu, X } from 'lucide-react';

interface NavbarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPath, onNavigate }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNav = (path: string, e: React.MouseEvent) => {
    e.preventDefault();
    onNavigate(path);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-white/5">
      <div className="max-w-6xl mx-auto px-6 sm:px-10 h-16 flex items-center justify-between">
        {/* Logo / Name */}
        <a
          id="navbar-brand"
          href="/"
          onClick={(e) => handleNav('/', e)}
          className="flex items-center space-x-3 hover:opacity-80 transition-opacity"
        >
          <div className="w-7 h-7 bg-white rounded-sm flex items-center justify-center">
            <span className="text-[#0a0a0a] text-xs font-bold">▲</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="font-heading font-bold tracking-tight text-sm text-white uppercase">
              CYBER CIRCUIT LAB
            </span>
            <span className="text-[10px] font-mono text-neutral-500 tracking-wider hidden sm:inline">
              
            </span>
          </div>
        </a>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center space-x-6 text-sm">
          <a
            id="nav-builds-link"
            href="/builds"
            onClick={(e) => handleNav('/builds', e)}
            className={`transition-colors py-1 font-medium tracking-tight ${
              currentPath.startsWith('/builds')
                ? 'text-white'
                : 'text-neutral-500 hover:text-white'
            }`}
          >
            Builds
          </a>

          <a
            id="nav-github-link"
            href={profileConfig.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-2 bg-white/5 border border-white/10 px-4 py-1.5 rounded-full hover:bg-white/10 transition-all text-xs font-medium text-neutral-300 hover:text-white"
            title="View GitHub Profile"
          >
            <Github className="w-3.5 h-3.5" />
            <span>GitHub</span>
          </a>
        </nav>

        {/* Mobile menu toggle */}
        <div className="md:hidden flex items-center space-x-2">
          <a
            href={profileConfig.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 text-neutral-400 hover:text-white transition-colors"
            aria-label="GitHub"
          >
            <Github className="w-4 h-4" />
          </a>
          <button
            id="mobile-menu-btn"
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-neutral-400 hover:text-white focus:outline-none cursor-pointer"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-white/5 bg-[#0a0a0a]/95 backdrop-blur-xl px-6 py-4 space-y-3">
          <a
            href="/"
            onClick={(e) => handleNav('/', e)}
            className={`block py-2 text-sm font-medium ${
              currentPath === '/' ? 'text-white' : 'text-neutral-400 hover:text-white'
            }`}
          >
            Home
          </a>
          <a
            href="/builds"
            onClick={(e) => handleNav('/builds', e)}
            className={`block py-2 text-sm font-medium ${
              currentPath.startsWith('/builds') ? 'text-white' : 'text-neutral-400 hover:text-white'
            }`}
          >
            Builds
          </a>
        </div>
      )}
    </header>
  );
};
