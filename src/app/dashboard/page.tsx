import { createClient } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import Link from "next/link";
import SiteNav from "@/components/nav/SiteNav";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // If not logged in, send to login
  if (!user) {
    redirect("/login");
  }

  return (
    <main className="min-h-screen bg-[#0a0a0f] text-[#f5efe6]">
      <SiteNav />
      <div className="flex flex-col items-center justify-center px-6 py-20">
        <div className="max-w-md w-full text-center">
          <div className="text-5xl mb-4">🎉</div>
          <h1 className="text-3xl font-black tracking-tight mb-3">
            Welcome to NEETlab
          </h1>
          <p className="text-[#a8a297] mb-2">
            You&apos;re logged in as{" "}
            <span className="text-[#E8550A] font-medium">{user.email}</span>
          </p>
          <p className="text-xs text-[#5a5750] mb-8">
            Full dashboard coming next — for now, browse the labs.
          </p>

          <Link
            href="/labs"
            className="inline-block px-8 py-3 rounded-full bg-[#E8550A] text-[#0a0a0f] font-semibold hover:bg-[#ff6b1f] transition-colors"
          >
            Explore Labs
          </Link>
        </div>
      </div>
    </main>
  );
}