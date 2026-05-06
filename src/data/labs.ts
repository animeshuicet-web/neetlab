// Single source of truth for all NEETlab labs.
// To add a new lab: add an entry here, create a folder at src/app/labs/<slug>/page.tsx
// To unpublish a lab: set published: false (it'll hide from /labs catalog)

export type LabDomain = "physical" | "inorganic" | "organic";
export type LabDifficulty = "easy" | "medium" | "hard";

export interface Lab {
  slug: string;
  title: string;
  shortTitle: string;
  chapter: string;
  domain: LabDomain;
  difficulty: LabDifficulty;
  weightage: string;
  description: string;
  tags: string[];
  is3D: boolean;
  published: boolean;
}

export const labs: Lab[] = [
  {
    slug: "methane",
    title: "Methane (CH₄) — Tetrahedral Geometry",
    shortTitle: "Methane",
    chapter: "Chemical Bonding & Molecular Structure",
    domain: "physical",
    difficulty: "easy",
    weightage: "3-4",
    description:
      "Explore the perfect 109.5° tetrahedral geometry of methane. Drag to rotate and see why sp³ hybridization gives this shape — the foundation of all alkane chemistry.",
    tags: ["sp3", "hybridization", "VSEPR", "alkane"],
    is3D: true,
    published: true,
  },
  {
    slug: "atomic-orbitals",
    title: "Atomic Orbitals — s, p, d Shapes in 3D",
    shortTitle: "Atomic Orbitals",
    chapter: "Atomic Structure",
    domain: "physical",
    difficulty: "easy",
    weightage: "2-3",
    description:
      "Visualize s, p, and d orbital shapes in 3D. Toggle between orbitals and understand why electron density takes these specific forms — the building blocks of every chemical bond.",
    tags: ["orbitals", "quantum", "electron-cloud", "shapes"],
    is3D: true,
    published: true,
  },
];

// Helper: get a lab by slug (used by individual lab pages)
export function getLabBySlug(slug: string): Lab | undefined {
  return labs.find((l) => l.slug === slug);
}

// Helper: get only published labs (for the catalog page)
export function getPublishedLabs(): Lab[] {
  return labs.filter((l) => l.published);
}

// Helper: domain display labels with colors
export const DOMAIN_META: Record<LabDomain, { label: string; color: string }> = {
  physical: { label: "Physical", color: "#4ECDC4" },
  inorganic: { label: "Inorganic", color: "#FFD93D" },
  organic: { label: "Organic", color: "#E8550A" },
};

export const DIFFICULTY_META: Record<LabDifficulty, { label: string; color: string }> = {
  easy: { label: "Easy", color: "#4ECDC4" },
  medium: { label: "Medium", color: "#FFD93D" },
  hard: { label: "Hard", color: "#FF6B6B" },
};