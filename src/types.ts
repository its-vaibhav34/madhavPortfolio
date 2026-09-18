export interface Project {
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
  /** Base64 data URI or URL for demonstration video */
  videoFile: string;
  result: string;
  featured: boolean;
}

export interface ProfileConfig {
  name: string;
  headline: string;
  tagline: string;
  shortBio: string;
  aboutText: string[];
  githubUrl: string;
  exploring: string[];
}
