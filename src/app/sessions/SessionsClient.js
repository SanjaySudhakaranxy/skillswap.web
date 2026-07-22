"use client";

import { useEffect, useState } from "react";
import Shell from "@/components/Shell";
import { supabase } from "@/lib/supabaseClient";

const TABS = [
  { key: "pending", label: "Pending" },
  { key: "accepted", label: "Accepted" },
  { key: "completed", label: "Completed" },
  { key: "declined", label: "Declined" },
];

export default function SessionsClient() {
  const [userId, setUserId] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [names, setNames] = useState({});
  const [tab, setTab] = useState("pending");
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);
  const [error, setError] = useState("");
  const [link, setLink] = useState("");

  async function load() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    setUserId(user.id);

    const { data } = await supabase
      .from("sessions")
      .select("*")
      .order("created_at", { ascending: false });
    const list = data || [];
    setSessions(list);

    const ids = Array.from(
      new Set(list.flatMap((s) => [s.teacher_id, s.learner_id]))
    ).filter((id) => id !== user.id);

    if (ids.length) {
      const { data: profs } = await supabase
        .from("profiles").select("id, name").in("id", ids);
      const map = {};
      (profs || []).forEach((p) => { map[p.id] = p.name; });
      setNames(map);
    }
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function respond(session, accept) {
    setError("");
    setBusyId(session.id);
    const { error } = await supabase.rpc("respond_session", {
      p_session_id: session.id,
      p_accept: accept,
      p_meeting_link: accept ? link : null,
    });
    setBusyId(null);
    setLink("");
    if (error) return setError(error.message);
    await load();
  }

  async function confirm(session) {
    setError("");
    setBusyId(session.id);
    const { error } = await supabase.rpc("confirm_session", { p_session_id: session.id });
    setBusyId(null);
    if (error) return setError(error.message);
    await load();
  }

  const visible = sessions.filter((s) => s.status === tab);

  if (loading) {
    return <Shell title="Sessions"><p className="text-slate-400">Loading...</p></Shell>;
  }

  return (
    <Shell title="Sessions" subtitle="Requests you sent and requests you received.">
      <div className="flex gap-2 mb-6 overflow-x-auto">
        {TABS.map((t) => {
          const count = sessions.filter((s) => s.status === t.key).length;
          return (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={tab === t.key ? "btn-primary" : "btn-ghost"}
            >
              {t.label} ({count})
            </button>
          );
        })}
      </div>

      {error && <p className="text-red-400 text-sm mb-4">{error}</p>}

      {visible.length === 0 ? (
        <div className="card text-slate-400 text-sm">Nothing here yet.</div>
      ) : (
        <div className="space-y-4">
          {visible.map((s) => {
            const isTeacher = s.teacher_id === userId;
            const other = names[isTeacher ? s.learner_id : s.teacher_id] || "Unknown";
            const myConfirm = isTeacher ? s.teacher_confirmed : s.learner_confirmed;
            const theirConfirm = isTeacher ? s.learner_confirmed : s.teacher_confirmed;

            return (
              <div key={s.id} className="card">
                <div className="flex items-start gap-3">
                  <div>
                    <p className="font-semibold capitalize">{s.skill}</p>
                    <p className="text-slate-400 text-sm">
                      {isTeacher ? "You teach " + other : other + " teaches you"}
                    </p>
                  </div>
                  <span className="ml-auto text-coin font-semibold whitespace-nowrap">
                    {isTeacher ? "+" : "-"}{s.coin_amount} SC
                  </span>
                </div>

                {s.scheduled_time && (
                  <p className="text-slate-400 text-sm mt-3">
                    Time: {new Date(s.scheduled_time).toLocaleString()}
                  </p>
                )}
                {s.message && (
                  <p className="text-slate-300 text-sm mt-2 italic">"{s.message}"</p>
                )}
                {s.meeting_link && (
                  <a
                    href={s.meeting_link}
                    target="_blank"
                    rel="noreferrer"
                    className="text-indigo-400 text-sm underline mt-2 inline-block"
                  >
                    Join meeting link
                  </a>
                )}

                {s.status === "pending" && isTeacher && (
                  <div className="mt-4 space-y-2">
                    <input
                      className="input"
                      value={link}
                      onChange={(e) => setLink(e.target.value)}
                      placeholder="Google Meet / Zoom link (optional)"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => respond(s, true)}
                        disabled={busyId === s.id}
                        className="btn-primary"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => respond(s, false)}
                        disabled={busyId === s.id}
                        className="btn-danger"
                      >
                        Decline and refund
                      </button>
                    </div>
                  </div>
                )}

                {s.status === "pending" && !isTeacher && (
                  <p className="text-slate-500 text-sm mt-3">
                    Waiting for {other} to respond. Your coins are held in escrow.
                  </p>
                )}

                {s.status === "accepted" && (
                  <div className="mt-4">
                    <p className="text-slate-400 text-sm mb-2">
                      You: {myConfirm ? "confirmed" : "not confirmed"} | {other}:{" "}
                      {theirConfirm ? "confirmed" : "not confirmed"}
                    </p>
                    <button
                      onClick={() => confirm(s)}
                      disabled={myConfirm || busyId === s.id}
                      className="btn-primary"
                    >
                      {myConfirm ? "Waiting for " + other : "Confirm session completed"}
                    </button>
                  </div>
                )}

                {s.status === "completed" && (
                  <p className="text-emerald-400 text-sm mt-3">
                    Completed. {isTeacher ? "Coins paid to you." : "Coins sent to " + other + "."}
                  </p>
                )}

                {s.status === "declined" && (
                  <p className="text-slate-500 text-sm mt-3">
                    Declined. {isTeacher ? "Learner was refunded." : "You were refunded."}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </Shell>
  );
}
