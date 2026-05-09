"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { updateProfile } from "@/app/dashboard/actions";

type Profile = {
  id: string;
  name: string | null;
  email: string;
  target_year: string | null;
  current_class: string | null;
  role: string;
  created_at: string;
};

const TARGET_YEARS = ["2026", "2027", "2028"];
const CLASSES = [
  { value: "11", label: "Class 11" },
  { value: "12", label: "Class 12" },
  { value: "dropper", label: "Dropper" },
];

export default function ProfileForm({ profile }: { profile: Profile }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [editing, setEditing] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const [name, setName] = useState(profile.name ?? "");
  const [targetYear, setTargetYear] = useState(profile.target_year ?? "");
  const [currentClass, setCurrentClass] = useState(
    profile.current_class ?? ""
  );

  function handleSave() {
    setMessage(null);

    const formData = new FormData();
    formData.append("name", name.trim());
    formData.append("target_year", targetYear);
    formData.append("current_class", currentClass);

    startTransition(async () => {
      const result = await updateProfile(formData);

      if (result?.error) {
        setMessage({ type: "error", text: result.error });
        return;
      }

      setMessage({ type: "success", text: "Profile updated." });
      setEditing(false);
      router.refresh();
    });
  }

  function handleCancel() {
    setName(profile.name ?? "");
    setTargetYear(profile.target_year ?? "");
    setCurrentClass(profile.current_class ?? "");
    setEditing(false);
    setMessage(null);
  }

  // ---------- READ-ONLY VIEW ----------
  if (!editing) {
    return (
      <div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Name" value={profile.name || "—"} />
          <Field label="Email" value={profile.email} muted />
          <Field
            label="Target NEET year"
            value={profile.target_year || "Not set"}
            placeholder={!profile.target_year}
          />
          <Field
            label="Current class"
            value={
              profile.current_class
                ? CLASSES.find((c) => c.value === profile.current_class)
                    ?.label ?? profile.current_class
                : "Not set"
            }
            placeholder={!profile.current_class}
          />
        </div>

        {message && <Toast message={message} />}

        <div className="mt-5 flex items-center justify-between">
          <p className="text-[11px] text-[#5a5750]">
            Member since{" "}
            {new Date(profile.created_at).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </p>
          <button
            onClick={() => setEditing(true)}
            className="rounded-full border border-[#E8550A]/40 bg-[#E8550A]/10 px-4 py-2 font-mono text-xs uppercase tracking-[0.2em] text-[#E8550A] transition hover:bg-[#E8550A]/20"
          >
            Edit profile
          </button>
        </div>
      </div>
    );
  }

  // ---------- EDIT VIEW ----------
  return (
    <div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* Name */}
        <div>
          <Label>Name</Label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            disabled={isPending}
            className="mt-1.5 w-full rounded-lg border border-[#1a1a25] bg-[#0a0a0f] px-3 py-2 text-sm text-[#f5efe6] placeholder-[#5a5750] focus:border-[#E8550A] focus:outline-none disabled:opacity-50"
          />
        </div>

        {/* Email (read-only) */}
        <div>
          <Label>Email</Label>
          <input
            type="email"
            value={profile.email}
            readOnly
            className="mt-1.5 w-full cursor-not-allowed rounded-lg border border-[#1a1a25] bg-[#0a0a0f]/50 px-3 py-2 text-sm text-[#a8a297]"
          />
        </div>

        {/* Target year */}
        <div>
          <Label>Target NEET year</Label>
          <div className="mt-1.5 flex gap-2">
            {TARGET_YEARS.map((year) => (
              <button
                key={year}
                type="button"
                disabled={isPending}
                onClick={() =>
                  setTargetYear(targetYear === year ? "" : year)
                }
                className={`flex-1 rounded-lg border px-3 py-2 font-mono text-sm transition disabled:opacity-50 ${
                  targetYear === year
                    ? "border-[#E8550A] bg-[#E8550A]/15 text-[#E8550A]"
                    : "border-[#1a1a25] bg-[#0a0a0f] text-[#a8a297] hover:text-[#f5efe6]"
                }`}
              >
                {year}
              </button>
            ))}
          </div>
        </div>

        {/* Current class */}
        <div>
          <Label>Current class</Label>
          <div className="mt-1.5 flex gap-2">
            {CLASSES.map((c) => (
              <button
                key={c.value}
                type="button"
                disabled={isPending}
                onClick={() =>
                  setCurrentClass(currentClass === c.value ? "" : c.value)
                }
                className={`flex-1 rounded-lg border px-3 py-2 text-xs transition disabled:opacity-50 ${
                  currentClass === c.value
                    ? "border-[#4ECDC4] bg-[#4ECDC4]/15 text-[#4ECDC4]"
                    : "border-[#1a1a25] bg-[#0a0a0f] text-[#a8a297] hover:text-[#f5efe6]"
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {message && <Toast message={message} />}

      <div className="mt-5 flex items-center justify-end gap-3">
        <button
          onClick={handleCancel}
          disabled={isPending}
          className="rounded-full border border-[#1a1a25] px-4 py-2 font-mono text-xs uppercase tracking-[0.2em] text-[#a8a297] transition hover:text-[#f5efe6] disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          disabled={isPending}
          className="rounded-full border border-[#E8550A] bg-[#E8550A] px-5 py-2 font-mono text-xs uppercase tracking-[0.2em] text-[#0a0a0f] transition hover:bg-[#FF6B35] disabled:opacity-50"
        >
          {isPending ? "Saving..." : "Save changes"}
        </button>
      </div>
    </div>
  );
}

// ---------- Helpers ----------
function Label({ children }: { children: React.ReactNode }) {
  return (
    <label className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#a8a297]">
      {children}
    </label>
  );
}

function Field({
  label,
  value,
  muted = false,
  placeholder = false,
}: {
  label: string;
  value: string;
  muted?: boolean;
  placeholder?: boolean;
}) {
  return (
    <div>
      <Label>{label}</Label>
      <p
        className={`mt-1.5 text-sm ${
          placeholder
            ? "text-[#5a5750] italic"
            : muted
              ? "text-[#a8a297]"
              : "text-[#f5efe6]"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

function Toast({
  message,
}: {
  message: { type: "success" | "error"; text: string };
}) {
  const styles =
    message.type === "success"
      ? "border-[#4ECDC4]/30 bg-[#4ECDC4]/10 text-[#4ECDC4]"
      : "border-[#ff5252]/30 bg-[#ff5252]/10 text-[#ff5252]";
  return (
    <div
      className={`mt-4 rounded-lg border px-3 py-2 text-xs ${styles}`}
    >
      {message.text}
    </div>
  );
}