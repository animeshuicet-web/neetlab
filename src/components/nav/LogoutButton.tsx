"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase";

export default function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  async function handleLogout() {
    setLoading(true);
    await supabase.auth.signOut();
    router.push("/");
    router.refresh(); // forces nav to re-render with logged-out state
  }

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      className="text-sm text-[#a8a297] hover:text-[#FF6B6B] transition-colors px-3 py-1.5 disabled:opacity-50"
    >
      {loading ? "..." : "Log out"}
    </button>
  );
}