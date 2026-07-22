"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Shell from "@/components/Shell";
import { supabase } from "@/lib/supabaseClient";

export default function DashboardClient() {
  const [profile, setProfile] = useState(null);
  const [upcoming, setUpcoming] = useState([]);
  const [pendingCount, setPendingCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: p } = await supabase
        .from("profiles").select("*").eq("id", user.id).single();
      setProfile(p);

      const { data: acc } = await supabase
        .from("sessions")
        .select("*")
        .eq("status", "accepted")
        .order("scheduled_time", { ascending: true });
      setUpcoming(acc || []);

      const { data: pend } = await supabase
        .from("sessions")
        .select("id")
        .eq("status", "pending")
        .eq("teacher_id", user.id);
      setPendingCount((pend || []).length);

      setLoading(false);
    }
    load();
  }, []);

  if (loading) {
    return <Shell title="Dashboard"><p className="text-slate-400">Loading...</p></Shell>;
  }

  const incomplete = !profile?.teach_skills?.length;

  return (
    <Shell title={"Hi, " + (profile?.name || "there")} subtitle="Teach. Earn. Learn.">
      {incomplete && (
        <div className="card border-indigo-500/60 mb-6">
          <p className="text-sm">
            You have not listed any skills yet, so you will not show up in Browse.{" "}
            <Link href="/profile" className="text-indigo-400 underline">
              Set up your profile
            </Link>
            .
          </p>
        </div>
      )}

      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        <div className="card">
          <p className="text-slate-400 text-sm">Balance</p>
          <p className="text-3xl font-bold text-coin mt-1">{profile?.coin_balance ?? 0}</p>
          <p className="text-slate-500 text-xs mt-1">SkillCoins</p>
        </div>
        <div className="card">
          <p className="text-slate-400 text-sm">Sessions completed</p>
          <p className="text-3xl font-bold mt-1">{profile?.sessions_completed ?? 0}</p>
          <p className="text-slate-500 text-xs mt-1">Taught + learned</p>
        </div>
        <div className="card">
          <p className="text-slate-400 text-sm">Requests waiting on you</p>
          <p className="text-3xl font-bold mt-1">{pendingCount}</p>
          <Link href="/sessions" className="text-indigo-400 text-xs underline mt-1 inline-block">
            Review them
          </Link>
        </div>
      </div>

      <h2 className="font-semibold mb-3">Upcoming sessions</h2>
      {upcoming.length === 0 ? (
        <div className="card text-slate-400 text-sm">
          Nothing scheduled.{" "}
          <Link href="/browse" className="text-indigo-400 underline">Find a teacher</Link>.
        </div>
      ) : (
        <div className="space-y-3">
          {upcoming.map((s) => (
            <div key={s.id} className="card flex items-center gap-4">
              <div>
                <p className="font-medium capitalize">{s.skill}</p>
                <p className="text-slate-400 text-sm">
                  {s.scheduled_time
                    ? new Date(s.scheduled_time).toLocaleString()
                    : "No time set"}
                </p>
              </div>
              <span className="ml-auto text-coin font-semibold">{s.coin_amount} SC</span>
            </div>
          ))}
        </div>
      )}

      <div className="flex gap-3 mt-8">
        <Link href="/browse" className="btn-primary">Browse teachers</Link>
        <Link href="/wallet" className="btn-ghost">View wallet</Link>
      </div>
    </Shell>
  );
}
