export interface Project {
  id: string;
  name: string;
  description: string;
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
  projects: Project[];
}

export type PunksData = Record<number, Punk>;
