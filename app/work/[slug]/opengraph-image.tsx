import { caseStudies, getProject } from "@/content/projects";
import { ogSize, renderOg } from "@/lib/og";

export const alt = "Case study";
export const size = ogSize;
export const contentType = "image/png";

export function generateStaticParams() {
  return caseStudies.map((p) => ({ slug: p.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProject(slug);
  return renderOg({ title: project?.title ?? "Case study", eyebrow: "Case study — Bhavish" });
}
