import Link from "next/link";
import { createClient } from "@/lib/supabase-server";
import LogoutButton from "./LogoutButton";

export default async function SiteNav() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Fetch profile name if logged in (for nav greeting)
  let profileName: string | null = null;
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("name")
      .eq("id", user.id)
      .single();
    profileName = profile?.name?.split(" ")[0] ?? null; // first name only
  }

  return (
    <nav className="px-6 py-5 border-b border-[#1a1a25]">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
        <Link href="/" className="flex items-baseline gap-2 group">
          <span className="text-2xl font-black tracking-tight text-[#f5efe6]">
            NEET<span className="text-[#E8550A]">lab</span>
          </span>
          <span className="text-base text-[#E8550A] group-hover:scale-125 transition-transform">
            ⬡
          </span>
        </Link>

        <div className="flex items-center gap-2 md:gap-4">
          <Link
            href="/labs"
            className="text-sm text-[#a8a297] hover:text-[#E8550A] transition-colors px-2"
          >
            Labs
          </Link>

          {user ? (
            <>
              <Link
                href="/dashboard"
                className="text-sm text-[#a8a297] hover:text-[#E8550A] transition-colors px-2"
              >
                {profileName ? `Hi, ${profileName}` : "Dashboard"}
              </Link>
              <LogoutButton />
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm text-[#a8a297] hover:text-[#f5efe6] transition-colors px-3 py-1.5"
              >
                Log in
              </Link>
              <Link
                href="/signup"
                className="text-sm font-medium bg-[#E8550A] text-[#0a0a0f] hover:bg-[#ff6b1f] transition-colors px-4 py-1.5 rounded-full"
              >
                Sign up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}