import { generateProjectOGImage, generateNotFoundImage } from "@/lib/og-image";
import { getProjectById, getAllProjects } from "@/data/punks";
import { SITE_URL } from "@/lib/constants";

export const runtime = "nodejs";

export async function generateStaticParams() {
  const projects = getAllProjects();
  return projects.map((project) => ({
    slug: project.id,
  }));
}

export const alt = "Made by Punks";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProjectById(slug);

  if (!project) {
    return generateNotFoundImage(size);
  }

  return generateProjectOGImage(
    {
      name: project.name,
      description: project.description,
      thumbnail: project.thumbnail,
      punkId: project.creators[0],
      tags: project.tags,
    },
    size,
    SITE_URL
  );
}
