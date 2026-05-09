"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toggleSaveLab } from "@/app/labs/actions";

interface SaveLabButtonProps {
  slug: string;
  initialSaved: boolean;
  isLoggedIn: boolean;
}

export default function SaveLabButton({
  slug,
  initialSaved,
  isLoggedIn,
}: SaveLabButtonProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [saved, setSaved] = useState(initialSaved);
  const [error, setError] = useState<string | null>(null);

  // Logged-out state — clicking sends to login with return path
  if (!isLoggedIn) {
    return (
      <button
        type="button"
        onClick={() => router.push(`/login?next=/labs/${slug}`)}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-mono uppercase tracking-wider bg-[#1a1a25] text-[#a8a297] hover:bg-[#252535] hover:text-[#f5efe6] transition-colors"
      >
        <LockIcon />
        Log in to save
      </button>
    );
  }

  // Logged in — handle the toggle
  const handleClick = () => {
    setError(null);
    // Optimistic update — flip immediately for snappy UX
    const optimisticNext = !saved;
    setSaved(optimisticNext);

    startTransition(async () => {
      const result = await toggleSaveLab(slug);
      if ("error" in result && result.error) {
        // Roll back on error
        setSaved(!optimisticNext);
        setError(result.error);
    } else if ("saved" in result) {
        // Sync to truth from server (in case of race conditions)
        setSaved(result.saved === true);
      }
    });
  };

  return (
    <div className="flex flex-col items-start gap-1">
      <button
        type="button"
        onClick={handleClick}
        disabled={isPending}
        aria-pressed={saved}
        aria-label={saved ? "Remove from saved labs" : "Save this lab"}
        className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-mono uppercase tracking-wider transition-colors disabled:opacity-60 disabled:cursor-wait ${
          saved
            ? "bg-[#E8550A] text-white hover:bg-[#d04a08]"
            : "bg-[#1a1a25] text-[#a8a297] hover:bg-[#252535] hover:text-[#f5efe6]"
        }`}
      >
        <HeartIcon filled={saved} />
        {saved ? "Saved" : "Save lab"}
      </button>
      {error && (
        <p className="text-xs text-red-400 font-mono mt-1">{error}</p>
      )}
    </div>
  );
}

// Heart icon — outline when not saved, filled when saved
function HeartIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}

// Lock icon for logged-out state
function LockIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}