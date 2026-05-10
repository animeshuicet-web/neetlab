import { notFound } from "next/navigation";
import LabLayout from "@/components/lab/LabLayout";
import LabRenderer from "@/components/lab/LabRenderer";
import { getLabBySlug, getPublishedLabs } from "@/data/labs";

interface PageProps {
  params: Promise<{ slug: string }>;
}

// Pre-render all published labs at build time for speed + SEO
export async function generateStaticParams() {
  return getPublishedLabs().map((lab) => ({ slug: lab.slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const lab = getLabBySlug(slug);
  if (!lab) return { title: "Lab not found — NEETlab" };
  return {
    title: `${lab.shortTitle} — NEETlab`,
    description: lab.description,
  };
}

export default async function LabPage({ params }: PageProps) {
  const { slug } = await params;
  const lab = getLabBySlug(slug);

  if (!lab || !lab.published) {
    notFound();
  }

  const notes = lab.learningNotes;

  return (
    <LabLayout lab={lab}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Lab canvas — 2/3 on desktop, full width on mobile */}
        <div className="lg:col-span-2">
          <LabRenderer lab={lab} />
          <p className="text-center text-xs text-[#5a5750] mt-3 font-mono">
            {lab.canvasHint ?? "interactive — tap or drag to explore"}
          </p>
        </div>

        {/* Learning notes — 1/3 on desktop, below canvas on mobile */}
        <aside className="space-y-6">
          {notes?.intro && (
            <section>
              <h3 className="text-xs font-mono uppercase tracking-wider text-[#5a5750] mb-3">
                What you&apos;re seeing
              </h3>
              <p className="text-sm text-[#f5efe6] leading-relaxed">
                {notes.intro}
              </p>
            </section>
          )}

          {notes?.facts && notes.facts.length > 0 && (
            <section>
              <h3 className="text-xs font-mono uppercase tracking-wider text-[#5a5750] mb-3">
                Key NEET facts
              </h3>
              <ul className="space-y-2.5 text-sm text-[#f5efe6]">
                {notes.facts.map((fact, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="text-[#E8550A]">▸</span>
                    <span>
                      {fact.label}:{" "}
                      <strong className="text-[#FFD93D]">{fact.value}</strong>
                      {fact.note && <span className="text-[#a8a297]"> — {fact.note}</span>}
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {notes?.memoryTrick && (
            <section>
              <h3 className="text-xs font-mono uppercase tracking-wider text-[#5a5750] mb-3">
                Memory trick
              </h3>
              <p className="text-sm text-[#4ECDC4] leading-relaxed font-medium">
                {notes.memoryTrick}
              </p>
            </section>
          )}

          {notes?.question && (
            <section className="pt-4 border-t border-[#1a1a25]">
              <h3 className="text-xs font-mono uppercase tracking-wider text-[#5a5750] mb-3">
                NEET-style question
              </h3>
              <p className="text-sm text-[#f5efe6] leading-relaxed mb-3">
                {notes.question.text}
              </p>
              <ol className="space-y-1.5 text-sm text-[#a8a297] ml-1">
                {notes.question.options.map((opt, i) => {
                  const letter = String.fromCharCode(65 + i); // A, B, C, D
                  const isCorrect = i === notes.question!.correctIndex;
                  return (
                    <li key={i}>
                      ({letter}) {opt}
                      {isCorrect && " ✓"}
                    </li>
                  );
                })}
              </ol>
            </section>
          )}

          {!notes && (
            <p className="text-sm text-[#5a5750] italic">
              Learning notes coming soon.
            </p>
          )}
        </aside>
      </div>
    </LabLayout>
  );
}