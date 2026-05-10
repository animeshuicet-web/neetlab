// Single source of truth for all NEETlab labs.
// To add a new REACT lab: add an entry with type: 'react' + componentName,
//   then create the component at src/components/molecules/<ComponentName>Canvas.tsx
// To add a new HTML lab: add an entry with type: 'html' + htmlPath,
//   then drop the file at public/labs-html/<slug>/index.html
// To unpublish a lab: set published: false (it'll hide from /labs catalog)

export type LabDomain = "physical" | "inorganic" | "organic";
export type LabDifficulty = "easy" | "medium" | "hard";
export type LabType = "react" | "html";

// Structured learning notes shown in the sidebar of every lab page.
// All fields optional — labs can use as many or as few as makes sense.
export interface LabFact {
  label: string;
  value: string;
  note?: string;
}

export interface LabQuestion {
  text: string;
  options: string[];
  correctIndex: number; // 0 = A, 1 = B, etc.
}

export interface LabLearningNotes {
  intro?: string;
  facts?: LabFact[];
  memoryTrick?: string;
  question?: LabQuestion;
}

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

  // Lab type. Defaults to 'react' if omitted (back-compat).
  type?: LabType;

  // For type: 'react' — name of the component to load from
  // src/components/molecules/<componentName>Canvas.tsx
  componentName?: string;

  // For type: 'html' — path under /public to the lab's index.html
  // Example: '/labs-html/periodic-trends/index.html'
  htmlPath?: string;

  // Optional hint shown below the canvas (e.g. "drag to rotate")
  canvasHint?: string;

  // Optional structured learning notes shown in the sidebar
  learningNotes?: LabLearningNotes;
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
    type: "react",
    componentName: "Methane",
    canvasHint: "drag to rotate · pinch zoom is locked for clarity",
    learningNotes: {
      intro:
        "Methane (CH₄) has one carbon atom bonded to four hydrogens. The four bonds spread out as far apart as possible, forming a tetrahedron. This is the geometry of every sp³-hybridized carbon you'll meet in NEET.",
      facts: [
        {
          label: "Bond angle",
          value: "109.5°",
          note: "the only geometry that puts 4 bonds farthest apart",
        },
        {
          label: "Hybridization",
          value: "sp³",
          note: "one s + three p orbitals mix",
        },
        { label: "C-H bond length", value: "109 pm" },
        { label: "Geometry name", value: "tetrahedral" },
      ],
      memoryTrick:
        "4 hydrogens, 4 corners of a tetrahedron, 109.5° apart — maximum distance, minimum repulsion.",
      question: {
        text: "The hybridization of carbon in CH₄ and the bond angle are:",
        options: ["sp², 120°", "sp³, 109.5°", "sp, 180°", "sp³d, 90°"],
        correctIndex: 1,
      },
    },
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
    type: "react",
    componentName: "AtomicOrbitals", // not built yet — will show "Coming soon" until AtomicOrbitalsCanvas.tsx exists
  },
  {
    slug: "blackbody-radiation",
    title: "Blackbody Radiation — From Catastrophe to Quantum",
    shortTitle: "Blackbody Radiation",
    chapter: "Atomic Structure",
    domain: "physical",
    difficulty: "medium",
    weightage: "1-2",
    description:
      "Drag a temperature slider from human body heat to a blue supergiant. Watch Planck's curve shift, see why classical physics predicted an ultraviolet catastrophe, and understand Wien's law and Stefan-Boltzmann in real time.",
    tags: ["planck", "wien", "stefan-boltzmann", "quantum", "uv-catastrophe"],
    is3D: false,
    published: true,
    type: "html",
    htmlPath: "/labs-html/blackbody-radiation/index.html",
    canvasHint: "drag the slider · try the famous-object presets · toggle UV catastrophe",
    learningNotes: {
      intro:
        "Every hot object glows. The shape of that glow — what wavelengths it emits — depends only on temperature. Classical physics predicted infinite energy at short wavelengths (the 'ultraviolet catastrophe'). Planck's quantum hypothesis fixed it and started modern physics.",
      facts: [
        {
          label: "Wien's displacement law",
          value: "λ_max · T = 2.898×10⁻³ m·K",
          note: "hotter object → peak wavelength shifts toward blue",
        },
        {
          label: "Stefan-Boltzmann law",
          value: "P = σT⁴",
          note: "double the temperature → 16× the power",
        },
        {
          label: "Planck's quantum",
          value: "E = nhν",
          note: "energy comes in discrete packets, not continuous",
        },
        {
          label: "Sun's surface",
          value: "5778 K",
          note: "peak near green (~500 nm) — why our eyes see best there",
        },
      ],
      memoryTrick:
        "Wien shifts the peak. Stefan-Boltzmann shifts the area. Planck killed the catastrophe.",
      question: {
        text: "If the absolute temperature of a blackbody is doubled, the wavelength of maximum emission becomes:",
        options: [
          "Doubled",
          "Halved",
          "Four times the original",
          "Unchanged",
        ],
        correctIndex: 1,
      },
    },
  },
  {
    slug: "states-of-matter",
    title: "States of Matter — From BEC to Plasma",
    shortTitle: "States of Matter",
    chapter: "States of Matter",
    domain: "physical",
    difficulty: "easy",
    weightage: "2-3",
    description:
      "Drag the energy slider from absolute zero to a million Kelvin. Watch particles transition from a Bose-Einstein Condensate, through solid, liquid, gas, and into ionised plasma. Understand why all states are just energy in disguise.",
    tags: ["states-of-matter", "kinetic-theory", "phase-transition", "bec", "plasma"],
    is3D: false,
    published: true,
    type: "html",
    htmlPath: "/labs-html/states-of-matter/index.html",
    canvasHint: "drag the slider · click any state · watch the particles",
    learningNotes: {
      intro:
        "Solid, liquid, gas — what students learn first. But the full story has two more states: Bose-Einstein Condensate near absolute zero, and Plasma at extreme temperatures. All five sit on a single energy continuum: heat is just particles moving, and matter changes character based on how much energy you give it.",
      facts: [
        {
          label: "What separates the states",
          value: "Kinetic energy",
          note: "more energy → particles overcome attractive forces → state changes",
        },
        {
          label: "Bose-Einstein Condensate",
          value: "~0 K",
          note: "predicted in 1924, first made in lab in 1995 — particles merge into one quantum state",
        },
        {
          label: "Plasma",
          value: "Most common state in universe",
          note: "stars, lightning, neon signs — atoms are ionised, electrons roam free",
        },
        {
          label: "Why ice floats on water",
          value: "Hydrogen bonding",
          note: "solid H₂O is less dense than liquid H₂O — rare exception to the usual solid > liquid density rule",
        },
      ],
      memoryTrick:
        "Five states, one slider — energy is the only knob. Cold = order, hot = chaos.",
      question: {
        text: "Which of the following is NOT a characteristic of the gaseous state?",
        options: [
          "Particles have negligible intermolecular forces",
          "Particles fill the entire volume of the container",
          "Particles have a fixed shape and volume",
          "Particles move randomly with high kinetic energy",
        ],
        correctIndex: 2,
      },
    },
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

// Helper: resolve a lab's effective type (defaults to 'react' for back-compat)
export function getLabType(lab: Lab): LabType {
  return lab.type ?? "react";
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