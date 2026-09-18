import express, { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import projectRoutes from './routes/projectRoutes.js';
import { seedDatabase } from './seed.js';

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from backend folder or root
dotenv.config();
dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config({ path: path.resolve(process.cwd(), 'backend/.env') });
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const app = express();
const PORT = process.env.PORT || 5000;

// Body parsing with 50MB limit to handle base64 circuit diagrams and images
app.use(cors({ origin: '*' }));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Health Check API
app.get('/api/health', async (_req: Request, res: Response) => {
  const isConnected = mongoose.connection.readyState === 1;

  res.json({
    status: 'ok',
    database: isConnected ? 'connected' : 'disconnected',
    provider: 'MongoDB Atlas',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/projects', projectRoutes);

// Error handling middleware
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error('Unhandled server error:', err);
  res.status(500).json({ error: err.message || 'Internal Server Error' });
});

// Connect directly to MongoDB Atlas
async function connectToDatabase() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.error('❌ MONGODB_URI is not defined in backend/.env!');
    process.exit(1);
  }

  console.log('🚀 Connecting to MongoDB Atlas...');

  try {
    await mongoose.connect(uri);
    console.log('✅ Connected to MongoDB Atlas successfully!');

    // Auto seed if Atlas database is empty
    await seedDatabase(false);
  } catch (err: any) {
    console.error('❌ Failed to connect to MongoDB Atlas:', err.message);
  }
}

// Start Server
app.listen(PORT, async () => {
  console.log(`🚀 Portfolio Backend Server running at http://localhost:${PORT}`);
  await connectToDatabase();
});
