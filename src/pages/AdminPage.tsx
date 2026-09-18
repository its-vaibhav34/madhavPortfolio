import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Project } from '../types';
import { fetchProjects, createProject, updateProject, deleteProject, resetProjects, checkBackendHealth } from '../api/projects';
import { INITIAL_PROJECTS } from '../data/projects';
import {
  Plus, Pencil, Trash2, Save, X, ArrowLeft, Upload, Image as ImageIcon,
  Video, Code2, RotateCcw, ChevronDown, ChevronUp, Eye, Star, StarOff,
  AlertTriangle, Check, FileText, Youtube
} from 'lucide-react';
import { getYouTubeEmbedUrl, getYouTubeVideoId } from '../utils/youtube';

interface AdminPageProps {
  onNavigate: (path: string) => void;
}

type FormMode = 'list' | 'add' | 'edit';

const CATEGORIES: Project['category'][] = ['Electronics', 'IoT', 'Robotics', 'Embedded'];
const CODE_LANGUAGES = ['cpp', 'c', 'python', 'javascript'];

// Helper to generate slug from title
function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

// Helper to generate unique ID
function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
}

// Blank project template
function createBlankProject(): Project {
  return {
    id: generateId(),
    slug: '',
    title: '',
    description: '',
    category: 'Electronics',
    image: '',
    technologies: [],
    components: [],
    howItWorks: [],
    circuitImage: '',
    code: '',
    codeLanguage: 'cpp',
    githubUrl: '',
    youtubeUrl: '',
    videoFile: '',
    result: '',
    featured: false,
  };
}

// File upload component
const FileUpload: React.FC<{
  label: string;
  accept: string;
  value: string;
  onChange: (dataUri: string) => void;
  icon: React.ReactNode;
  preview?: 'image' | 'video';
}> = ({ label, accept, value, onChange, icon, preview }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleFile = useCallback((file: File) => {
    setLoading(true);
    const reader = new FileReader();
    reader.onload = (e) => {
      onChange(e.target?.result as string);
      setLoading(false);
    };
    reader.onerror = () => setLoading(false);
    reader.readAsDataURL(file);
  }, [onChange]);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  return (
    <div className="space-y-2">
      <label className="text-xs font-mono uppercase tracking-wider text-neutral-500 flex items-center gap-1.5">
        {icon}
        {label}
      </label>

      {/* Drop zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all ${
          dragOver
            ? 'border-emerald-500/50 bg-emerald-500/5'
            : value
              ? 'border-white/10 bg-white/[0.02]'
              : 'border-white/10 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04]'
        }`}
      >
        {loading ? (
          <div className="text-neutral-500 text-sm">Processing file...</div>
        ) : value ? (
          <div className="space-y-3">
            {preview === 'image' && (
              <img src={value} alt="Preview" className="max-h-32 mx-auto rounded-md object-contain" />
            )}
            {preview === 'video' && (
              <video src={value} className="max-h-32 mx-auto rounded-md" controls preload="metadata" />
            )}
            <div className="flex items-center justify-center gap-2">
              <Check className="w-3.5 h-3.5 text-emerald-500" />
              <span className="text-xs text-emerald-500 font-mono">File uploaded</span>
            </div>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onChange(''); }}
              className="text-[10px] text-red-400 hover:text-red-300 font-mono cursor-pointer"
            >
              Remove file
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            <Upload className="w-6 h-6 mx-auto text-neutral-600" />
            <p className="text-xs text-neutral-500">
              Drag & drop or <span className="text-emerald-500">click to browse</span>
            </p>
            <p className="text-[10px] text-neutral-600 font-mono">{accept}</p>
          </div>
        )}
      </div>

      {/* Also allow URL input */}
      <input
        type="text"
        value={value.startsWith('data:') ? '' : value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="...or paste a URL"
        className="w-full bg-white/[0.03] border border-white/10 rounded-md px-3 py-2 text-xs text-neutral-300 placeholder-neutral-600 focus:outline-none focus:border-emerald-500/30"
      />

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
          e.target.value = '';
        }}
      />
    </div>
  );
};

// Comma-separated list editor
const ListEditor: React.FC<{
  label: string;
  items: string[];
  onChange: (items: string[]) => void;
  placeholder?: string;
}> = ({ label, items, onChange, placeholder }) => {
  const [inputVal, setInputVal] = useState('');

  const addItem = () => {
    const trimmed = inputVal.trim();
    if (trimmed && !items.includes(trimmed)) {
      onChange([...items, trimmed]);
      setInputVal('');
    }
  };

  return (
    <div className="space-y-2">
      <label className="text-xs font-mono uppercase tracking-wider text-neutral-500">{label}</label>
      <div className="flex gap-2">
        <input
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addItem(); } }}
          placeholder={placeholder || `Add ${label.toLowerCase()}...`}
          className="flex-1 bg-white/[0.03] border border-white/10 rounded-md px-3 py-2 text-xs text-neutral-300 placeholder-neutral-600 focus:outline-none focus:border-emerald-500/30"
        />
        <button
          type="button"
          onClick={addItem}
          className="px-3 py-2 bg-white/5 border border-white/10 rounded-md text-xs text-neutral-400 hover:bg-white/10 hover:text-white transition-all cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
        </button>
      </div>
      {items.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {items.map((item, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-1 px-2 py-1 bg-white/5 border border-white/10 rounded-md text-[10px] font-mono text-neutral-300"
            >
              {item}
              <button
                type="button"
                onClick={() => onChange(items.filter((_, j) => j !== i))}
                className="text-neutral-600 hover:text-red-400 transition-colors cursor-pointer"
              >
                <X className="w-2.5 h-2.5" />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

// Multi-line list editor (for components, how it works)
const MultiLineEditor: React.FC<{
  label: string;
  items: string[];
  onChange: (items: string[]) => void;
  placeholder?: string;
}> = ({ label, items, onChange, placeholder }) => {
  const [inputVal, setInputVal] = useState('');

  const addItem = () => {
    const trimmed = inputVal.trim();
    if (trimmed) {
      onChange([...items, trimmed]);
      setInputVal('');
    }
  };

  return (
    <div className="space-y-2">
      <label className="text-xs font-mono uppercase tracking-wider text-neutral-500">{label}</label>
      <div className="flex gap-2">
        <input
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addItem(); } }}
          placeholder={placeholder || `Add item and press Enter...`}
          className="flex-1 bg-white/[0.03] border border-white/10 rounded-md px-3 py-2 text-xs text-neutral-300 placeholder-neutral-600 focus:outline-none focus:border-emerald-500/30"
        />
        <button
          type="button"
          onClick={addItem}
          className="px-3 py-2 bg-white/5 border border-white/10 rounded-md text-xs text-neutral-400 hover:bg-white/10 hover:text-white transition-all cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
        </button>
      </div>
      {items.length > 0 && (
        <div className="space-y-1.5">
          {items.map((item, i) => (
            <div
              key={i}
              className="flex items-start gap-2 px-3 py-2 bg-white/[0.02] border border-white/5 rounded-md group"
            >
              <span className="text-[10px] font-mono text-emerald-500 mt-0.5 shrink-0">{i + 1}.</span>
              <span className="flex-1 text-xs text-neutral-400">{item}</span>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                {i > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      const arr = [...items];
                      [arr[i - 1], arr[i]] = [arr[i], arr[i - 1]];
                      onChange(arr);
                    }}
                    className="p-0.5 text-neutral-600 hover:text-white cursor-pointer"
                  >
                    <ChevronUp className="w-3 h-3" />
                  </button>
                )}
                {i < items.length - 1 && (
                  <button
                    type="button"
                    onClick={() => {
                      const arr = [...items];
                      [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]];
                      onChange(arr);
                    }}
                    className="p-0.5 text-neutral-600 hover:text-white cursor-pointer"
                  >
                    <ChevronDown className="w-3 h-3" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => onChange(items.filter((_, j) => j !== i))}
                  className="p-0.5 text-neutral-600 hover:text-red-400 cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};


export const AdminPage: React.FC<AdminPageProps> = ({ onNavigate }) => {
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [dbProvider, setDbProvider] = useState<string>('MongoDB');
  const [mode, setMode] = useState<FormMode>('list');
  const [editingProject, setEditingProject] = useState<Project>(createBlankProject());
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  // Show toast notification
  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Load projects from MongoDB API on mount
  const loadProjects = useCallback(async () => {
    try {
      setLoading(true);
      const data = await fetchProjects();
      setProjects(data);

      checkBackendHealth()
        .then(health => {
          if (health.provider) setDbProvider(health.provider);
        })
        .catch(() => {});
    } catch {
      showToast('Could not fetch from backend, showing starter builds', 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  // Handle add
  const handleAdd = () => {
    setEditingProject(createBlankProject());
    setMode('add');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle edit
  const handleEdit = (project: Project) => {
    setEditingProject({ ...project });
    setMode('edit');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle delete
  const handleDelete = async (id: string) => {
    try {
      setSaving(true);
      await deleteProject(id);
      setProjects(prev => prev.filter(p => p.id !== id && p.slug !== id));
      showToast('Build permanently deleted from MongoDB');
      setConfirmDelete(null);
    } catch (err: any) {
      showToast(err.message || 'Failed to delete build', 'error');
    } finally {
      setSaving(false);
    }
  };

  // Handle save (add/edit)
  const handleSave = async () => {
    // Validation
    if (!editingProject.title.trim()) {
      showToast('Title is required', 'error');
      return;
    }

    const projectToSave = {
      ...editingProject,
      slug: editingProject.slug || slugify(editingProject.title),
    };

    setSaving(true);
    try {
      if (mode === 'add') {
        const created = await createProject(projectToSave);
        setProjects(prev => [created, ...prev.filter(p => p.id !== created.id)]);
        showToast('Build saved to MongoDB!');
      } else {
        const updated = await updateProject(projectToSave.id, projectToSave);
        setProjects(prev => prev.map(p => (p.id === updated.id || p.slug === updated.slug ? updated : p)));
        showToast('Build updated in MongoDB!');
      }

      setMode('list');
      setEditingProject(createBlankProject());
    } catch (err: any) {
      showToast(err.message || 'Failed to save build to database', 'error');
    } finally {
      setSaving(false);
    }
  };

  // Handle cancel
  const handleCancel = () => {
    setMode('list');
    setEditingProject(createBlankProject());
  };

  // Handle reset
  const handleReset = async () => {
    if (!window.confirm('Reset all builds in MongoDB to the default starter builds?')) return;
    try {
      setSaving(true);
      const defaults = await resetProjects();
      setProjects(defaults);
      showToast('All builds reset to defaults in MongoDB');
    } catch (err: any) {
      showToast(err.message || 'Failed to reset builds', 'error');
    } finally {
      setSaving(false);
    }
  };

  // Toggle featured
  const toggleFeatured = async (id: string) => {
    const current = projects.find(p => p.id === id);
    if (!current) return;
    const newFeatured = !current.featured;

    // Optimistic update
    setProjects(prev => prev.map(p => p.id === id ? { ...p, featured: newFeatured } : p));

    try {
      await updateProject(id, { featured: newFeatured });
      showToast(newFeatured ? 'Marked as featured' : 'Removed from featured');
    } catch {
      // Revert on error
      setProjects(prev => prev.map(p => p.id === id ? { ...p, featured: !newFeatured } : p));
      showToast('Failed to update featured state', 'error');
    }
  };

  // Update editing project field
  const updateField = <K extends keyof Project>(field: K, value: Project[K]) => {
    setEditingProject(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Toast notification */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-lg border text-sm font-medium flex items-center gap-2 animate-fade-in-up ${
          toast.type === 'success'
            ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
            : 'bg-red-500/10 border-red-500/20 text-red-400'
        }`}>
          {toast.type === 'success' ? <Check className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
          {toast.message}
        </div>
      )}

      {/* Admin Header */}
      <div className="border-b border-white/5 bg-[#0a0a0a]">
        <div className="max-w-6xl mx-auto px-6 sm:px-10 py-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => onNavigate('/')}
                className="p-2 bg-white/5 border border-white/10 rounded-md text-neutral-400 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <div>
                <div className="flex items-center gap-2.5">
                  <h1 className="text-2xl font-heading font-bold text-white tracking-tight">
                    Admin Panel
                  </h1>
                  <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-mono font-medium bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    {dbProvider}
                  </span>
                </div>
                <p className="text-xs font-mono text-neutral-600 mt-0.5">
                  MANAGE YOUR BUILDS • {projects.length} STORED IN DATABASE
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {mode === 'list' && (
                <>
                  <button
                    type="button"
                    disabled={saving}
                    onClick={handleReset}
                    className="flex items-center gap-1.5 px-3 py-2 bg-white/5 border border-white/10 rounded-md text-xs text-neutral-400 hover:bg-white/10 hover:text-white disabled:opacity-50 transition-all cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Reset Defaults</span>
                  </button>
                  <button
                    type="button"
                    disabled={saving}
                    onClick={handleAdd}
                    className="flex items-center gap-1.5 px-4 py-2 bg-emerald-500 text-[#0a0a0a] rounded-md text-xs font-semibold hover:bg-emerald-400 disabled:opacity-50 transition-all cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Build</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 sm:px-10 py-8">
        {/* Loading State */}
        {loading && mode === 'list' && (
          <div className="text-center py-16 space-y-3 font-mono text-xs text-neutral-500">
            <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
            <p>Syncing with MongoDB database...</p>
          </div>
        )}

        {/* ===== FORM VIEW (Add / Edit) ===== */}
        {(mode === 'add' || mode === 'edit') && (
          <div className="space-y-8">
            {/* Form Header */}
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-heading font-bold text-white">
                {mode === 'add' ? '+ New Build' : `Edit: ${editingProject.title}`}
              </h2>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={saving}
                  onClick={handleCancel}
                  className="flex items-center gap-1.5 px-3 py-2 bg-white/5 border border-white/10 rounded-md text-xs text-neutral-400 hover:text-white disabled:opacity-50 transition-all cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={saving}
                  onClick={handleSave}
                  className="flex items-center gap-1.5 px-4 py-2 bg-emerald-500 text-[#0a0a0a] rounded-md text-xs font-semibold hover:bg-emerald-400 disabled:opacity-50 transition-all cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{saving ? 'Saving...' : mode === 'add' ? 'Save Build' : 'Save Changes'}</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* LEFT COLUMN — Basic Info */}
              <div className="space-y-6">
                {/* Title */}
                <div className="space-y-2">
                  <label className="text-xs font-mono uppercase tracking-wider text-neutral-500">Title *</label>
                  <input
                    type="text"
                    value={editingProject.title}
                    onChange={(e) => {
                      updateField('title', e.target.value);
                      if (mode === 'add') updateField('slug', slugify(e.target.value));
                    }}
                    placeholder="e.g. Arduino LED Blink"
                    className="w-full bg-white/[0.03] border border-white/10 rounded-md px-4 py-3 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-emerald-500/30"
                  />
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <label className="text-xs font-mono uppercase tracking-wider text-neutral-500">Description</label>
                  <textarea
                    value={editingProject.description}
                    onChange={(e) => updateField('description', e.target.value)}
                    placeholder="Short project description..."
                    rows={3}
                    className="w-full bg-white/[0.03] border border-white/10 rounded-md px-4 py-3 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-emerald-500/30 resize-none"
                  />
                </div>

                {/* Category */}
                <div className="space-y-2">
                  <label className="text-xs font-mono uppercase tracking-wider text-neutral-500">Category</label>
                  <div className="flex gap-2 flex-wrap">
                    {CATEGORIES.map(cat => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => updateField('category', cat)}
                        className={`px-4 py-2 rounded-md text-xs font-mono transition-all cursor-pointer ${
                          editingProject.category === cat
                            ? 'bg-emerald-500 text-[#0a0a0a] font-semibold'
                            : 'bg-white/5 border border-white/10 text-neutral-400 hover:bg-white/10'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Featured toggle */}
                <div className="flex items-center justify-between p-3 rounded-lg border border-white/10 bg-white/[0.02]">
                  <div className="space-y-0.5">
                    <label className="text-xs font-mono uppercase tracking-wider text-neutral-300 flex items-center gap-1.5">
                      <Star className={`w-3.5 h-3.5 ${editingProject.featured ? 'text-amber-400 fill-amber-400' : 'text-neutral-500'}`} />
                      Feature on Landing Page
                    </label>
                    <p className="text-[10px] text-neutral-500 font-mono">
                      {editingProject.featured ? '★ Pin this project to "My Latest Builds" on home page' : '☆ Not pinned to home page'}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => updateField('featured', !editingProject.featured)}
                    className={`px-3 py-1.5 rounded text-xs font-mono transition-all cursor-pointer ${
                      editingProject.featured
                        ? 'bg-amber-500/20 border border-amber-500/40 text-amber-300 font-semibold'
                        : 'bg-white/5 border border-white/10 text-neutral-400 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    {editingProject.featured ? 'Featured' : 'Not Featured'}
                  </button>
                </div>

                {/* About / Result */}
                <div className="space-y-2">
                  <label className="text-xs font-mono uppercase tracking-wider text-neutral-500">About This Build</label>
                  <textarea
                    value={editingProject.result}
                    onChange={(e) => updateField('result', e.target.value)}
                    placeholder="What you built, what you learned, how it went..."
                    rows={4}
                    className="w-full bg-white/[0.03] border border-white/10 rounded-md px-4 py-3 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-emerald-500/30 resize-none"
                  />
                </div>

                {/* GitHub URL */}
                <div className="space-y-2">
                  <label className="text-xs font-mono uppercase tracking-wider text-neutral-500">GitHub URL</label>
                  <input
                    type="url"
                    value={editingProject.githubUrl}
                    onChange={(e) => updateField('githubUrl', e.target.value)}
                    placeholder="https://github.com/..."
                    className="w-full bg-white/[0.03] border border-white/10 rounded-md px-4 py-3 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-emerald-500/30"
                  />
                </div>

                {/* Tech Stack */}
                <ListEditor
                  label="Tech Stack"
                  items={editingProject.technologies}
                  onChange={(items) => updateField('technologies', items)}
                  placeholder="e.g. Arduino Uno, HC-SR04..."
                />

                {/* Components */}
                <MultiLineEditor
                  label="Components Used"
                  items={editingProject.components}
                  onChange={(items) => updateField('components', items)}
                  placeholder="e.g. Arduino Uno R3"
                />

                {/* Features / How It Works */}
                <MultiLineEditor
                  label="Main Features / How It Works"
                  items={editingProject.howItWorks}
                  onChange={(items) => updateField('howItWorks', items)}
                  placeholder="Describe a feature or step..."
                />
              </div>

              {/* RIGHT COLUMN — Files & Code */}
              <div className="space-y-6">
                {/* Project Image */}
                <FileUpload
                  label="Project Image"
                  accept="image/png, image/jpeg, image/webp, image/gif"
                  value={editingProject.image}
                  onChange={(val) => updateField('image', val)}
                  icon={<ImageIcon className="w-3 h-3" />}
                  preview="image"
                />

                {/* Circuit Diagram */}
                <FileUpload
                  label="Circuit Diagram"
                  accept="image/png, image/jpeg, image/webp, image/svg+xml"
                  value={editingProject.circuitImage}
                  onChange={(val) => updateField('circuitImage', val)}
                  icon={<FileText className="w-3 h-3" />}
                  preview="image"
                />

                {/* Source Code */}
                <div className="space-y-2">
                  <label className="text-xs font-mono uppercase tracking-wider text-neutral-500 flex items-center gap-1.5">
                    <Code2 className="w-3 h-3" />
                    Source Code
                  </label>

                  {/* Language selector */}
                  <div className="flex gap-2 mb-2">
                    {CODE_LANGUAGES.map(lang => (
                      <button
                        key={lang}
                        type="button"
                        onClick={() => updateField('codeLanguage', lang)}
                        className={`px-3 py-1.5 rounded-md text-[10px] font-mono transition-all cursor-pointer ${
                          editingProject.codeLanguage === lang
                            ? 'bg-white/10 border border-white/20 text-white'
                            : 'bg-white/[0.02] border border-white/5 text-neutral-600 hover:text-neutral-400'
                        }`}
                      >
                        {lang}
                      </button>
                    ))}
                  </div>

                  {/* Code editor */}
                  <div className="rounded-lg border border-white/10 bg-[#0d1117] overflow-hidden">
                    <div className="flex items-center px-3 py-2 bg-[#161b22] border-b border-white/5">
                      <div className="flex space-x-1.5 mr-3">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
                        <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
                        <span className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
                      </div>
                      <span className="text-[10px] font-mono text-neutral-500">
                        {editingProject.slug || 'firmware'}.{editingProject.codeLanguage === 'python' ? 'py' : editingProject.codeLanguage === 'c' ? 'c' : 'ino'}
                      </span>
                    </div>
                    <textarea
                      value={editingProject.code}
                      onChange={(e) => updateField('code', e.target.value)}
                      placeholder="// Paste your source code here..."
                      rows={16}
                      className="w-full bg-transparent px-4 py-3 text-[13px] font-mono text-neutral-300 placeholder-neutral-700 focus:outline-none resize-none leading-relaxed"
                      spellCheck={false}
                    />
                  </div>
                </div>

                {/* Demonstration Video (YouTube Link Only) */}
                <div className="space-y-2">
                  <label className="text-xs font-mono uppercase tracking-wider text-neutral-500 flex items-center gap-1.5">
                    <Youtube className="w-3.5 h-3.5 text-red-500" />
                    Demonstration Video (YouTube Link)
                  </label>

                  <div className="relative">
                    <input
                      type="url"
                      value={editingProject.youtubeUrl}
                      onChange={(e) => updateField('youtubeUrl', e.target.value)}
                      placeholder="https://youtu.be/1n_KjpMfVT0"
                      className="w-full bg-white/[0.03] border border-white/10 rounded-md px-4 py-3 pr-10 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-emerald-500/30 font-mono"
                    />
                    {editingProject.youtubeUrl && (
                      <button
                        type="button"
                        onClick={() => updateField('youtubeUrl', '')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white transition-colors cursor-pointer"
                        title="Clear YouTube link"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  <p className="text-[11px] text-neutral-500 font-mono">
                    Paste a YouTube link (e.g. <span className="text-neutral-400">https://youtu.be/1n_KjpMfVT0</span>). In the frontend, the video plays directly on the page without redirecting to YouTube.
                  </p>

                  {/* Live in-admin player preview */}
                  {editingProject.youtubeUrl.trim() && (
                    <div className="mt-2 rounded-lg overflow-hidden border border-white/10 bg-[#0d1117]">
                      {getYouTubeEmbedUrl(editingProject.youtubeUrl) ? (
                        <div>
                          <div className="flex items-center justify-between px-3 py-2 bg-[#161b22] border-b border-white/5 text-[10px] font-mono text-neutral-400">
                            <span className="flex items-center gap-1.5 text-emerald-400">
                              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse" />
                              Embedded Player Preview
                            </span>
                            <span className="text-neutral-500">
                              ID: {getYouTubeVideoId(editingProject.youtubeUrl)}
                            </span>
                          </div>
                          <div className="aspect-video w-full bg-black">
                            <iframe
                              src={getYouTubeEmbedUrl(editingProject.youtubeUrl)!}
                              title="YouTube Preview"
                              className="w-full h-full border-0"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                              allowFullScreen
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="p-3 bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-mono flex items-center gap-2">
                          <AlertTriangle className="w-4 h-4 shrink-0" />
                          <span>Invalid YouTube URL. Please enter a valid link (e.g. https://youtu.be/1n_KjpMfVT0).</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ===== LIST VIEW ===== */}
        {mode === 'list' && (
          <div className="space-y-4">
            {projects.length === 0 ? (
              <div className="text-center py-20 space-y-4">
                <div className="text-6xl text-neutral-800">⚡</div>
                <p className="text-neutral-500 text-sm">No builds yet. Add your first one!</p>
                <button
                  type="button"
                  onClick={handleAdd}
                  className="flex items-center gap-1.5 px-4 py-2 mx-auto bg-emerald-500 text-[#0a0a0a] rounded-md text-xs font-semibold hover:bg-emerald-400 transition-all cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add First Build
                </button>
              </div>
            ) : (
              projects.map((project) => (
                <div
                  key={project.id}
                  className="flex items-center gap-4 p-4 bg-[#111111] border border-white/5 rounded-xl hover:border-white/10 transition-all group"
                >
                  {/* Thumbnail */}
                  <div className="w-16 h-16 rounded-lg overflow-hidden bg-[#0a0a0a] shrink-0">
                    {project.image ? (
                      <img src={project.image} alt={project.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-neutral-700">
                        <ImageIcon className="w-6 h-6" />
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-semibold text-white truncate">{project.title}</h3>
                      {project.featured && (
                        <Star className="w-3 h-3 text-amber-500 shrink-0 fill-amber-500" />
                      )}
                    </div>
                    <p className="text-xs text-neutral-500 truncate mt-0.5">{project.description}</p>
                    <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                      <span className="text-[10px] font-mono px-1.5 py-0.5 bg-white/5 rounded text-neutral-500">
                        {project.category}
                      </span>
                      {project.youtubeUrl && (
                        <span className="text-[10px] font-mono px-1.5 py-0.5 bg-red-500/10 text-red-400 rounded flex items-center gap-1 border border-red-500/20">
                          <Youtube className="w-2.5 h-2.5 text-red-500" /> YouTube
                        </span>
                      )}
                      <span className="text-[10px] font-mono text-neutral-600">
                        {project.technologies.slice(0, 3).join(' • ')}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => onNavigate(`/builds/${project.slug}`)}
                      className="p-2 text-neutral-600 hover:text-white hover:bg-white/5 rounded-md transition-all cursor-pointer"
                      title="Preview"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => toggleFeatured(project.id)}
                      className={`p-2 rounded-md transition-all cursor-pointer ${
                        project.featured
                          ? 'text-amber-500 hover:bg-amber-500/10'
                          : 'text-neutral-600 hover:text-amber-500 hover:bg-white/5'
                      }`}
                      title={project.featured ? 'Remove from featured' : 'Add to featured'}
                    >
                      {project.featured ? <Star className="w-4 h-4 fill-amber-500" /> : <StarOff className="w-4 h-4" />}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleEdit(project)}
                      className="p-2 text-neutral-600 hover:text-emerald-400 hover:bg-white/5 rounded-md transition-all cursor-pointer"
                      title="Edit"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    {confirmDelete === project.id ? (
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleDelete(project.id)}
                          className="px-2 py-1.5 bg-red-500/10 border border-red-500/20 rounded-md text-[10px] font-mono text-red-400 hover:bg-red-500/20 cursor-pointer"
                        >
                          Confirm
                        </button>
                        <button
                          type="button"
                          onClick={() => setConfirmDelete(null)}
                          className="p-1.5 text-neutral-600 hover:text-white cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setConfirmDelete(project.id)}
                        className="p-2 text-neutral-600 hover:text-red-400 hover:bg-white/5 rounded-md transition-all cursor-pointer"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};
