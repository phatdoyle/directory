export interface Project {
  id: string;
  name: string;
  description: string;
  body?: string; // Markdown content from the file
  thumbnail?: string; // Optional - will auto-fetch from URL's OG image if not provided
  url: string;
  launchDate: string;
  tags: string[];
  twitter?: string;
  github?: string;
  discord?: string;
}

export interface Punk {
  id: number;
  name?: string;
  twitter?: string;
  website?: string;
  body?: string; // Markdown content from index.md
  projects: Project[];
}

export type PunksData = Record<number, Punk>;
