"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Shell from "@/components/Shell";
import { supabase } from "@/lib/supabaseClient";

export default function BrowseClient() {
  const [teachers, setTeachers] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .neq("id", user.id)
        .order("sessions_completed", { ascending: false });
      setTeachers((data || []).filter((p) => (p.teach_skills || []).length > 0));
      setLoading(false);
    }
    load();
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return teachers;
    return teachers.filter(
      (t) =>
        (t.name || "").toLowerCase().includes(q) ||
        (t.teach_skills || []).some((s) => s.includes(q))
    );
  }, [query, teachers]);

  return (
    <Shell title="Browse teachers" subtitle="Search by name or skill.">
      <input
        className="input max-w-md mb-6"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Try: react, guitar, sql..."
      />

      {loading ? (
        <p className="text-slate-400">Loading...</p>
      ) : filtered.length === 0 ? (
        <div className="card text-slate-400 text-sm">
          No teachers found. Create a second account and add teach skills to it to test.
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {filtered.map((t) => (
            <Link key={t.id} href={"/teacher/" + t.id} className="card hover:border-indigo-400">
              <div className="flex items-start">
                <div>
                  <p className="font-semibold">{t.name}</p>
                  <p className="text-slate-500 text-xs">
                    {t.sessions_completed} sessions completed
                  </p>
                </div>
                <span className="ml-auto text-coin font-semibold whitespace-nowrap">
                  {t.cost_per_session} SC
                </span>
              </div>
              {t.bio && (
                <p className="text-slate-400 text-sm mt-3 line-clamp-2">{t.bio}</p>
              )}
              <div className="flex flex-wrap gap-2 mt-3">
                {(t.teach_skills || []).map((s) => (
                  <span key={s} className="chip">{s}</span>
                ))}
              </div>
            </Link>
          ))}
        </div>
      )}
    </Shell>
  );
}
