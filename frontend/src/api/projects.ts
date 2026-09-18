import { Project } from '../types';
import { INITIAL_PROJECTS } from '../data/projects';

export const BACKEND_URL = ((import.meta as any).env?.VITE_API_URL || 'https://madhavportfolio.onrender.com').replace(/\/$/, '');
const API_BASE = `${BACKEND_URL}/api/projects`;

/**
 * Check backend health & database provider info
 */
export async function checkBackendHealth(): Promise<{
  status: string;
  database: string;
  provider: string;
}> {
  const res = await fetch(`${BACKEND_URL}/api/health`);
  if (!res.ok) {
    throw new Error(`Health check failed with status ${res.status}`);
  }
  return await res.json();
}

/**
 * Fetch all projects from the MongoDB Atlas backend API.
 * Gracefully falls back to INITIAL_PROJECTS if the backend server is temporarily starting up or sleeping.
 */
export async function fetchProjects(options?: {
  featured?: boolean;
  category?: string;
}): Promise<Project[]> {
  const params = new URLSearchParams();
  if (options?.featured) params.append('featured', 'true');
  if (options?.category && options.category !== 'All') {
    params.append('category', options.category);
  }

  const url = `${API_BASE}${params.toString() ? `?${params.toString()}` : ''}`;

  try {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`Server returned ${res.status}: ${res.statusText}`);
    }
    const data: Project[] = await res.json();
    return data;
  } catch (err) {
    console.warn('Backend API request failed, using initial projects as fallback:', err);
    let filtered = INITIAL_PROJECTS;
    if (options?.featured) {
      filtered = filtered.filter(p => p.featured);
    }
    if (options?.category && options.category !== 'All') {
      filtered = filtered.filter(p => p.category.toLowerCase() === options.category!.toLowerCase());
    }
    return filtered;
  }
}

/**
 * Fetch a single project by slug from the MongoDB Atlas backend.
 */
export async function fetchProjectBySlug(slug: string): Promise<Project | null> {
  try {
    const res = await fetch(`${API_BASE}/${encodeURIComponent(slug)}`);
    if (!res.ok) {
      if (res.status === 404) return null;
      throw new Error(`Server returned ${res.status}`);
    }
    return await res.json();
  } catch (err) {
    console.warn(`Failed to fetch project ${slug} from backend:`, err);
    const fallback = INITIAL_PROJECTS.find(p => p.slug === slug || p.id === slug);
    return fallback || null;
  }
}

/**
 * Create a new project in MongoDB Atlas.
 */
export async function createProject(project: Partial<Project>): Promise<Project> {
  const res = await fetch(API_BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(project),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || `Failed to create project (${res.status})`);
  }

  return await res.json();
}

/**
 * Update an existing project by ID in MongoDB Atlas.
 */
export async function updateProject(id: string, project: Partial<Project>): Promise<Project> {
  const res = await fetch(`${API_BASE}/${encodeURIComponent(id)}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(project),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || `Failed to update project (${res.status})`);
  }

  return await res.json();
}

/**
 * Delete a project by ID from MongoDB Atlas.
 */
export async function deleteProject(id: string): Promise<void> {
  const res = await fetch(`${API_BASE}/${encodeURIComponent(id)}`, {
    method: 'DELETE',
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || `Failed to delete project (${res.status})`);
  }
}

/**
 * Reset all projects in MongoDB Atlas to the default seed builds.
 */
export async function resetProjects(): Promise<Project[]> {
  const res = await fetch(`${API_BASE}/reset`, {
    method: 'POST',
  });

  if (!res.ok) {
    throw new Error(`Failed to reset projects (${res.status})`);
  }

  const data = await res.json();
  return data.projects || INITIAL_PROJECTS;
}
