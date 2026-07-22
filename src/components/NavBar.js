"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

const LINKS = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/browse", label: "Browse" },
  { href: "/sessions", label: "Sessions" },
  { href: "/wallet", label: "Wallet" },
  { href: "/profile", label: "Profile" },
];

export default function NavBar() {
  const router = useRouter();
  const pathname = usePathname();
  const [balance, setBalance] = useState(null);

  useEffect(() => {
    let active = true;
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase
        .from("profiles")
        .select("coin_balance")
        .eq("id", user.id)
        .single();
      if (active && data) setBalance(data.coin_balance);
    }
    load();
    return () => { active = false; };
  }, [pathname]);

  async function signOut() {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <header className="border-b border-line bg-panel/60 backdrop-blur sticky top-0 z-10">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center gap-4">
        <Link href="/dashboard" className="font-bold text-lg">
          Skill<span className="text-indigo-400">Swap</span>
        </Link>

        <nav className="hidden sm:flex gap-1 ml-2">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={
                "px-3 py-1.5 rounded-lg text-sm " +
                (pathname === l.href
                  ? "bg-line text-white"
                  : "text-slate-400 hover:text-white")
              }
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-3">
          {balance !== null && (
            <span className="text-sm font-semibold text-coin">{balance} SC</span>
          )}
          <button onClick={signOut} className="text-sm text-slate-400 hover:text-white">
            Sign out
          </button>
        </div>
      </div>

      <nav className="sm:hidden flex overflow-x-auto gap-1 px-4 pb-2">
        {LINKS.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className={
              "px-3 py-1 rounded-lg text-sm whitespace-nowrap " +
              (pathname === l.href ? "bg-line text-white" : "text-slate-400")
            }
          >
            {l.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
