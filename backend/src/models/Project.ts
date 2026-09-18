import mongoose, { Schema, Document } from 'mongoose';

export interface IProject extends Document {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: 'IoT' | 'Embedded' | 'Robotics' | 'Electronics';
  image: string;
  technologies: string[];
  components: string[];
  howItWorks: string[];
  circuitImage: string;
  code: string;
  codeLanguage: string;
  githubUrl: string;
  youtubeUrl: string;
  videoFile: string;
  result: string;
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ProjectSchema = new Schema<IProject>(
  {
    id: { type: String, required: true, unique: true, index: true },
    slug: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    category: {
      type: String,
      enum: ['IoT', 'Embedded', 'Robotics', 'Electronics'],
      default: 'Electronics',
    },
    image: { type: String, default: '' },
    technologies: { type: [String], default: [] },
    components: { type: [String], default: [] },
    howItWorks: { type: [String], default: [] },
    circuitImage: { type: String, default: '' },
    code: { type: String, default: '' },
    codeLanguage: { type: String, default: 'cpp' },
    githubUrl: { type: String, default: '' },
    youtubeUrl: { type: String, default: '' },
    videoFile: { type: String, default: '' },
    result: { type: String, default: '' },
    featured: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (_doc, ret: Record<string, any>) => {
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

export const Project = mongoose.model<IProject>('Project', ProjectSchema);
