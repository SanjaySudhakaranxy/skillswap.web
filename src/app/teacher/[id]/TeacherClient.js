"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Shell from "@/components/Shell";
import { supabase } from "@/lib/supabaseClient";

export default function TeacherClient({ teacherId }) {
  const router = useRouter();
  const [teacher, setTeacher] = useState(null);
  const [myBalance, setMyBalance] = useState(0);
  const [loading, setLoading] = useState(true);

  const [skill, setSkill] = useState("");
  const [message, setMessage] = useState("");
  const [when, setWhen] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: me } = await supabase
        .from("profiles").select("coin_balance").eq("id", user.id).single();
      setMyBalance(me?.coin_balance ?? 0);

      const { data: t } = await supabase
        .from("profiles").select("*").eq("id", teacherId).single();
      setTeacher(t);
      setSkill((t?.teach_skills || [])[0] || "");
      setLoading(false);
    }
    load();
  }, [teacherId]);

  async function request() {
    setError("");
    if (!skill) return setError("Pick a skill.");
    setBusy(true);
    const { error } = await supabase.rpc("request_session", {
      p_teacher_id: teacherId,
      p_skill: skill,
      p_message: message,
      p_scheduled_time: when ? new Date(when).toISOString() : null,
      p_meeting_link: "",
    });
    setBusy(false);
    if (error) return setError(error.message);
    router.push("/sessions");
    router.refresh();
  }

  if (loading) return <Shell title="Teacher"><p className="text-slate-400">Loading...</p></Shell>;
  if (!teacher) return <Shell title="Teacher"><p className="text-slate-400">Not found.</p></Shell>;

  const tooPoor = myBalance < teacher.cost_per_session;

  return (
    <Shell title={teacher.name}>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="card">
          <div className="flex items-start">
            <div>
              <p className="text-slate-400 text-sm">
                {teacher.sessions_completed} sessions completed
              </p>
            </div>
            <span className="ml-auto text-coin font-bold text-xl">
              {teacher.cost_per_session} SC
            </span>
          </div>

          {teacher.bio && <p className="text-slate-300 text-sm mt-4">{teacher.bio}</p>}

          <p className="label mt-5">Teaches</p>
          <div className="flex flex-wrap gap-2">
            {(teacher.teach_skills || []).map((s) => (
              <span key={s} className="chip">{s}</span>
            ))}
          </div>

          {(teacher.learn_skills || []).length > 0 && (
            <>
              <p className="label mt-5">Wants to learn</p>
              <div className="flex flex-wrap gap-2">
                {teacher.learn_skills.map((s) => (
                  <span key={s} className="chip">{s}</span>
                ))}
              </div>
            </>
          )}
        </div>

        <div className="card">
          <h2 className="font-semibold mb-4">Request a session</h2>

          <div className="mb-3">
            <label className="label">Skill</label>
            <select className="input" value={skill} onChange={(e) => setSkill(e.target.value)}>
              {(teacher.teach_skills || []).map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div className="mb-3">
            <label className="label">Preferred time (optional)</label>
            <input
              className="input"
              type="datetime-local"
              value={when}
              onChange={(e) => setWhen(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <label className="label">Message</label>
            <textarea
              className="input h-24 resize-none"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="What do you want to cover?"
            />
          </div>

          <div className="text-sm text-slate-400 mb-4">
            Your balance: <span className="text-coin font-semibold">{myBalance} SC</span>
            <br />
            {teacher.cost_per_session} SC will be held in escrow until the session is
            confirmed or declined.
          </div>

          {error && <p className="text-red-400 text-sm mb-3">{error}</p>}

          <button onClick={request} disabled={busy || tooPoor} className="btn-primary w-full">
            {tooPoor
              ? "Not enough SkillCoins"
              : busy
              ? "Sending..."
              : "Request session"}
          </button>
        </div>
      </div>
    </Shell>
  );
}
