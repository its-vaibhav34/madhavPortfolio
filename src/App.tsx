/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { ProjectsPage } from './pages/ProjectsPage';
import { ProjectDetailPage } from './pages/ProjectDetailPage';
import { AdminPage } from './pages/AdminPage';
import { NotFoundPage } from './pages/NotFoundPage';

export default function App() {
  const getInitialPath = (): string => {
    if (typeof window === 'undefined') return '/';
    if (window.location.hash.startsWith('#/')) {
      return window.location.hash.slice(1);
    }
    return window.location.pathname || '/';
  };

  const [currentPath, setCurrentPath] = useState<string>(getInitialPath);

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(getInitialPath());
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (path: string) => {
    if (path === currentPath) return;
    try {
      window.history.pushState(null, '', path);
    } catch {
      window.location.hash = path;
    }
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isAdmin = currentPath.startsWith('/admin');

  // Route matching
  const renderRoute = () => {
    if (currentPath === '/' || currentPath === '') {
      return <HomePage onNavigate={navigate} />;
    }

    // Builds list
    if (currentPath === '/builds' || currentPath === '/builds/') {
      return <ProjectsPage onNavigate={navigate} />;
    }

    // Build detail: /builds/:slug
    if (currentPath.startsWith('/builds/')) {
      const slug = currentPath.replace('/builds/', '').split('/')[0];
      if (slug) {
        return <ProjectDetailPage slug={slug} onNavigate={navigate} />;
      }
      return <ProjectsPage onNavigate={navigate} />;
    }

    // Legacy /projects routes redirect to /builds
    if (currentPath.startsWith('/projects')) {
      const rest = currentPath.replace('/projects', '');
      navigate('/builds' + rest);
      return <ProjectsPage onNavigate={navigate} />;
    }

    // Admin — hidden, only accessible via /admin URL
    if (currentPath === '/admin' || currentPath === '/admin/') {
      return <AdminPage onNavigate={navigate} />;
    }

    // 404
    return <NotFoundPage onNavigate={navigate} />;
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0a0a0a] text-[#f5f5f5] bg-noise relative overflow-x-hidden selection:bg-emerald-900/40 selection:text-emerald-200">
      {/* Hide navbar/footer on admin page — clean dedicated view */}
      {!isAdmin && <Navbar currentPath={currentPath} onNavigate={navigate} />}

      <main className="flex-1 relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPath}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
          >
            {renderRoute()}
          </motion.div>
        </AnimatePresence>
      </main>

      {!isAdmin && <Footer />}
    </div>
  );
}
