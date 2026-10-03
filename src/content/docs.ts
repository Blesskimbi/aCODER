import docsData from "./docs-data/docs.json";

export interface DocItem {
  id: string;
  title: string;
  section: string;
  repo: "A-Coder" | "a-coder-cli";
  path: string;
  content: string;
}

export interface DocSection {
  title: string;
  iconName: string;
  items: DocItem[];
}

export const ALL_DOCS: DocItem[] = docsData as DocItem[];

export const DOC_SECTIONS: DocSection[] = [
  {
    title: "Get Started",
    iconName: "Compass",
    items: ALL_DOCS.filter((d) => d.section === "Get Started"),
  },
  {
    title: "Chat & Modes",
    iconName: "MessageSquare",
    items: ALL_DOCS.filter((d) => d.section === "Chat & Modes"),
  },
  {
    title: "Editing & Code",
    iconName: "FileCode",
    items: ALL_DOCS.filter((d) => d.section === "Editing & Code"),
  },
  {
    title: "Models & Context",
    iconName: "Cpu",
    items: ALL_DOCS.filter((d) => d.section === "Models & Context"),
  },
  {
    title: "Integrations",
    iconName: "Puzzle",
    items: ALL_DOCS.filter((d) => d.section === "Integrations"),
  },
  {
    title: "Multimodal & SCM",
    iconName: "Sparkles",
    items: ALL_DOCS.filter((d) => d.section === "Multimodal & SCM"),
  },
  {
    title: "CLI Agent",
    iconName: "Terminal",
    items: ALL_DOCS.filter((d) => d.section === "CLI Agent"),
  },
  {
    title: "Architecture",
    iconName: "Layers",
    items: ALL_DOCS.filter((d) => d.section === "Architecture"),
  },
];

export function getDocById(id: string): DocItem {
  const found = ALL_DOCS.find((d) => d.id === id);
  return found || ALL_DOCS[0];
}
