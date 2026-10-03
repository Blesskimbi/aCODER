import type { Metadata } from "next";
import { getRepoStats } from "@/lib/github";
import { DocsClientContainer } from "@/components/docs/DocsClientContainer";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Documentation — A-Coder IDE & CLI Agent",
  description:
    "Official documentation for A-Coder IDE and A-Coder CLI. Learn about installation, chat modes, providers and local models, built-in tools, MCP, TOON token compression, and JSON-RPC automation.",
};

export default async function DocsPage() {
  const stats = await getRepoStats();

  return <DocsClientContainer stars={stats.stars} initialDocId="introduction" />;
}
