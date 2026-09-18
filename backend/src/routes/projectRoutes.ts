import { Router, Request, Response } from 'express';
import { Project } from '../models/Project.js';
import { seedDatabase } from '../seed.js';

const router = Router();

// Helper to generate slug from title
function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

// GET /api/projects - list all projects
router.get('/', async (req: Request, res: Response) => {
  try {
    const { featured, category } = req.query;
    const filter: Record<string, any> = {};

    if (featured === 'true') {
      filter.featured = true;
    }
    if (category && typeof category === 'string') {
      filter.category = new RegExp(`^${category}$`, 'i');
    }

    const projects = await Project.find(filter).sort({ createdAt: -1 });
    res.json(projects);
  } catch (error) {
    console.error('Failed to get projects:', error);
    res.status(500).json({ error: 'Failed to retrieve projects' });
  }
});

// GET /api/projects/:slug - get project by slug or ID
router.get('/:slug', async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    const project = await Project.findOne({
      $or: [{ slug }, { id: slug }]
    });

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.json(project);
  } catch (error) {
    console.error('Failed to get project:', error);
    res.status(500).json({ error: 'Failed to retrieve project' });
  }
});

// POST /api/projects - create new project
router.post('/', async (req: Request, res: Response) => {
  try {
    const data = req.body;

    if (!data.title) {
      return res.status(400).json({ error: 'Title is required' });
    }

    let slug = data.slug ? slugify(data.slug) : slugify(data.title);
    let id = data.id || `proj_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;

    // Ensure slug uniqueness
    let existing = await Project.findOne({ slug });
    let counter = 1;
    while (existing) {
      slug = `${slugify(data.title)}-${counter++}`;
      existing = await Project.findOne({ slug });
    }

    const newProject = new Project({
      ...data,
      id,
      slug,
    });

    const saved = await newProject.save();
    res.status(201).json(saved);
  } catch (error: any) {
    console.error('Failed to create project:', error);
    res.status(500).json({ error: error.message || 'Failed to create project' });
  }
});

// PUT /api/projects/:id - update project
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Prevent overwriting id
    delete updateData._id;

    const updated = await Project.findOneAndUpdate(
      { $or: [{ id }, { slug: id }] },
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.json(updated);
  } catch (error: any) {
    console.error('Failed to update project:', error);
    res.status(500).json({ error: error.message || 'Failed to update project' });
  }
});

// DELETE /api/projects/:id - delete project
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deleted = await Project.findOneAndDelete({
      $or: [{ id }, { slug: id }]
    });

    if (!deleted) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.json({ message: 'Project deleted successfully', id });
  } catch (error) {
    console.error('Failed to delete project:', error);
    res.status(500).json({ error: 'Failed to delete project' });
  }
});

// POST /api/projects/reset - reset to default initial projects
router.post('/reset', async (_req: Request, res: Response) => {
  try {
    await seedDatabase(true);
    const projects = await Project.find().sort({ createdAt: -1 });
    res.json({ message: 'Projects reset to default', projects });
  } catch (error) {
    console.error('Failed to reset projects:', error);
    res.status(500).json({ error: 'Failed to reset projects' });
  }
});

export default router;
