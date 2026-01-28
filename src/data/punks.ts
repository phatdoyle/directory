import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { Punk, Project } from "@/types";

const punksDirectory = path.join(process.cwd(), "content/punks");
const projectsDirectory = path.join(process.cwd(), "content/projects");

/**
 * Punk frontmatter schema ({punkId}.md)
 */
interface PunkFrontmatter {
  name?: string;
  links?: string[];
}

/**
 * Project frontmatter schema ({slug}.md)
 */
interface ProjectFrontmatter {
  name: string;
  description: string;
  thumbnail?: string;
  url: string;
  launchDate: string;
  tags: string[];
  links?: string[];
  hidden?: boolean;
  ded?: boolean;
  featured?: boolean;
  creators: number[];
}

/**
 * Load all punks from content/punks/
 */
function loadAllPunks(): Map<number, Punk> {
  const punks = new Map<number, Punk>();

  if (!fs.existsSync(punksDirectory)) {
    return punks;
  }

  const files = fs.readdirSync(punksDirectory);

  for (const file of files) {
    if (!file.endsWith(".md")) continue;

    const punkId = parseInt(file.replace(/\.md$/, ""), 10);
    if (isNaN(punkId)) continue;

    const filePath = path.join(punksDirectory, file);
    const fileContent = fs.readFileSync(filePath, "utf8");
    const { data, content } = matter(fileContent);
    const punkData = data as PunkFrontmatter;

    punks.set(punkId, {
      id: punkId,
      name: punkData.name,
      links: punkData.links,
      body: content.trim() || undefined,
    });
  }

  return punks;
}

/**
 * Load all projects from content/projects/
 */
function loadAllProjects(): Project[] {
  if (!fs.existsSync(projectsDirectory)) {
    return [];
  }

  const files = fs.readdirSync(projectsDirectory);

  return files
    .filter((file) => file.endsWith(".md"))
    .map((file) => {
      const filePath = path.join(projectsDirectory, file);
      const fileContent = fs.readFileSync(filePath, "utf8");
      const { data, content } = matter(fileContent);
      const projectData = data as ProjectFrontmatter;

      // Skip hidden or dead projects
      if (projectData.hidden || projectData.ded) {
        return null;
      }

      const id = file.replace(/\.md$/, "");

      return {
        id,
        name: projectData.name,
        description: projectData.description,
        body: content.trim() || undefined,
        thumbnail: projectData.thumbnail,
        url: projectData.url,
        launchDate: projectData.launchDate,
        tags: projectData.tags || [],
        links: projectData.links,
        ded: projectData.ded,
        featured: projectData.featured,
        creators: projectData.creators || [],
      } as Project;
    })
    .filter((project): project is Project => project !== null)
    .sort((a, b) => new Date(b.launchDate).getTime() - new Date(a.launchDate).getTime());
}

// Load data once at build time
const PUNKS_MAP = loadAllPunks();
const PROJECTS = loadAllProjects();

// Export punks as array sorted by ID
const PUNKS = Array.from(PUNKS_MAP.values()).sort((a, b) => a.id - b.id);

export default PUNKS;
export { PROJECTS };

// Helper functions
export function getAllPunks(): number[] {
  return PUNKS.map((punk) => punk.id);
}

export function getPunkById(id: number): Punk | undefined {
  return PUNKS_MAP.get(id);
}

export function getAllProjects(): Project[] {
  return PROJECTS;
}

export function getProjectById(projectId: string): Project | undefined {
  return PROJECTS.find((p) => p.id === projectId);
}

export function getProjectsByPunk(punkId: number): Project[] {
  return PROJECTS.filter((p) => p.creators.includes(punkId));
}

export function getProjectCreators(project: Project): Punk[] {
  return project.creators
    .map((id) => PUNKS_MAP.get(id))
    .filter((punk): punk is Punk => punk !== undefined);
}

export function getAllTags(): string[] {
  const tags = new Set<string>();
  PROJECTS.forEach((project) => {
    project.tags.forEach((tag) => tags.add(tag));
  });
  return Array.from(tags).sort();
}

export function getProjectsByTag(tag: string): Project[] {
  return PROJECTS.filter((project) =>
    project.tags.some((t) => t.toLowerCase() === tag.toLowerCase())
  );
}

export function getAllProjectParams() {
  return PROJECTS.map((project) => ({
    slug: project.id,
  }));
}

export function getAllPunkParams() {
  return PUNKS.map((punk) => ({
    id: String(punk.id),
  }));
}

/**
 * Group projects by their creator sets.
 *
 * Logic:
 * - If a punk has at least one SOLO project (they're the only creator),
 *   they get their own entry with ALL their projects (solo + collab)
 * - Punks who ONLY have collaborative projects are grouped together
 *
 * Returns groups sorted by featured first, then by most projects.
 */
export interface CreatorGroup {
  key: string;
  punks: Punk[];
  projects: Project[];
}

export function getProjectGroups(): CreatorGroup[] {
  // Step 1: Identify punks who have at least one solo project
  const punksWithSoloProjects = new Set<number>();
  for (const project of PROJECTS) {
    if (project.creators.length === 1) {
      punksWithSoloProjects.add(project.creators[0]);
    }
  }

  // Step 2: Build groups
  const groups = new Map<string, { punkIds: number[]; projects: Project[] }>();
  const processedProjects = new Set<string>();

  // First, create individual entries for punks with solo projects
  for (const punkId of punksWithSoloProjects) {
    const punkProjects = PROJECTS.filter((p) => p.creators.includes(punkId));
    const key = String(punkId);

    groups.set(key, { punkIds: [punkId], projects: punkProjects });

    // Mark these projects as processed
    punkProjects.forEach((p) => processedProjects.add(p.id));
  }

  // Then, group remaining projects (where NO creator has solo projects)
  for (const project of PROJECTS) {
    if (processedProjects.has(project.id)) continue;

    // All creators of this project have no solo projects, group them together
    const sortedIds = [...project.creators].sort((a, b) => a - b);
    const key = sortedIds.join("-");

    if (!groups.has(key)) {
      groups.set(key, { punkIds: sortedIds, projects: [] });
    }
    groups.get(key)!.projects.push(project);
  }

  // Convert to array and resolve punk objects
  return Array.from(groups.entries())
    .map(([key, { punkIds, projects }]) => ({
      key,
      punks: punkIds
        .map((id) => PUNKS_MAP.get(id))
        .filter((punk): punk is Punk => punk !== undefined),
      projects,
    }))
    .filter((group) => group.punks.length > 0)
    .sort((a, b) => {
      // Featured groups first (any project in the group is featured)
      const aFeatured = a.projects.some((p) => p.featured);
      const bFeatured = b.projects.some((p) => p.featured);
      if (aFeatured && !bFeatured) return -1;
      if (!aFeatured && bFeatured) return 1;
      // Then by number of projects
      return b.projects.length - a.projects.length;
    });
}
