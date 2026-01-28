/**
 * Script to fetch Open Graph images from project URLs and save them locally.
 * Uses Microlink API to extract OG metadata.
 *
 * Usage: npx tsx scripts/fetch-og-images.ts
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import { join, basename } from "path";
import matter from "gray-matter";

interface OGData {
  title?: string;
  description?: string;
  image?: { url: string } | string;
  url?: string;
  publisher?: string;
}

interface MicrolinkResponse {
  status: string;
  data: OGData;
}

interface ProjectFrontmatter {
  name: string;
  description: string;
  url: string;
  thumbnail?: string;
  launchDate: string;
  tags: string[];
  twitter?: string;
  github?: string;
  discord?: string;
  ded?: boolean;
  featured?: boolean;
  creators: number[];
}

const PROJECTS_DIR = join(process.cwd(), "content/projects");
const PUBLIC_DIR = join(process.cwd(), "public/projects");

// Ensure public/projects directory exists
if (!existsSync(PUBLIC_DIR)) {
  mkdirSync(PUBLIC_DIR, { recursive: true });
}

async function fetchOGData(url: string): Promise<OGData | null> {
  try {
    const apiUrl = `https://api.microlink.io?url=${encodeURIComponent(url)}`;
    const response = await fetch(apiUrl);

    if (!response.ok) {
      console.error(`  ❌ Microlink API error: ${response.status}`);
      return null;
    }

    const json = (await response.json()) as MicrolinkResponse;

    if (json.status !== "success" || !json.data) {
      console.error(`  ❌ Microlink returned no data`);
      return null;
    }

    return json.data;
  } catch (error) {
    console.error(`  ❌ Failed to fetch OG data:`, error);
    return null;
  }
}

async function downloadImage(
  imageUrl: string,
  filename: string
): Promise<string | null> {
  try {
    const response = await fetch(imageUrl);
    if (!response.ok) {
      console.error(`  ❌ Failed to download image: ${response.status}`);
      return null;
    }

    const contentType = response.headers.get("content-type") || "";
    let extension = ".png";
    if (contentType.includes("jpeg") || contentType.includes("jpg")) {
      extension = ".jpg";
    } else if (contentType.includes("webp")) {
      extension = ".webp";
    } else if (contentType.includes("gif")) {
      extension = ".gif";
    }

    const buffer = await response.arrayBuffer();
    const outputPath = join(PUBLIC_DIR, `${filename}${extension}`);
    writeFileSync(outputPath, Buffer.from(buffer));

    return `/projects/${filename}${extension}`;
  } catch (error) {
    console.error(`  ❌ Failed to download image:`, error);
    return null;
  }
}

async function processProject(filename: string): Promise<void> {
  const filepath = join(PROJECTS_DIR, filename);
  const slug = basename(filename, ".md");

  console.log(`\n📦 Processing: ${slug}`);

  const content = readFileSync(filepath, "utf-8");
  const { data, content: body } = matter(content);
  const frontmatter = data as ProjectFrontmatter;

  // Skip if already has a local thumbnail
  if (frontmatter.thumbnail?.startsWith("/projects/")) {
    console.log(`  ✅ Already has local thumbnail: ${frontmatter.thumbnail}`);
    return;
  }

  // Fetch OG data
  console.log(`  🔍 Fetching OG data from: ${frontmatter.url}`);
  const ogData = await fetchOGData(frontmatter.url);

  if (!ogData) {
    console.log(`  ⚠️  No OG data found`);
    return;
  }

  // Get image URL
  const imageUrl =
    typeof ogData.image === "string" ? ogData.image : ogData.image?.url;

  if (!imageUrl) {
    console.log(`  ⚠️  No OG image found`);
    return;
  }

  console.log(`  📷 Found OG image: ${imageUrl.substring(0, 80)}...`);

  // Download image
  const localPath = await downloadImage(imageUrl, slug);

  if (!localPath) {
    console.log(`  ⚠️  Failed to download image`);
    return;
  }

  console.log(`  💾 Saved to: ${localPath}`);

  // Update frontmatter
  frontmatter.thumbnail = localPath;

  // Write updated file
  const newContent = matter.stringify(body, frontmatter);
  writeFileSync(filepath, newContent);

  console.log(`  ✅ Updated ${filename}`);
}

async function main(): Promise<void> {
  console.log("🚀 Fetching OG images for all projects...\n");

  // Get all .md files in projects directory
  const { readdirSync } = await import("fs");
  const projectFiles = readdirSync(PROJECTS_DIR).filter((f) =>
    f.endsWith(".md")
  );

  console.log(`Found ${projectFiles.length} projects`);

  for (const file of projectFiles) {
    await processProject(file);
    // Add a small delay to avoid rate limiting
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  console.log("\n✨ Done!");
}

main().catch(console.error);
