"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Shell from "@/components/Shell";
import SkillPicker from "@/components/SkillPicker";
import { supabase } from "@/lib/supabaseClient";

export default function ProfileClient() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [cost, setCost] = useState(20);
  const [teach, setTeach] = useState([]);
  const [learn, setLearn] = useState([]);

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();
      if (error) setError(error.message);
      if (data) {
        setName(data.name || "");
        setBio(data.bio || "");
        setCost(data.cost_per_session);
        setTeach(data.teach_skills || []);
        setLearn(data.learn_skills || []);
      }
      setLoading(false);
    }
    load();
  }, []);

  async function save() {
    setError("");
    setMessage("");
    if (!name.trim()) return setError("Name cannot be empty.");
    const costNum = parseInt(cost, 10);
    if (isNaN(costNum) || costNum < 0 || costNum > 500)
      return setError("Cost per session must be between 0 and 500.");

    setSaving(true);
    const { data: { user } } = await supabase.auth.getUser();
    const { error } = await supabase
      .from("profiles")
      .update({
        name: name.trim(),
        bio: bio.trim(),
        cost_per_session: costNum,
        teach_skills: teach,
        learn_skills: learn,
      })
      .eq("id", user.id);
    setSaving(false);

    if (error) return setError(error.message);
    setMessage("Profile saved.");
    router.refresh();
  }

  if (loading) {
    return <Shell title="Profile"><p className="text-slate-400">Loading...</p></Shell>;
  }

  return (
    <Shell title="Your profile" subtitle="This is what other learners see when they browse.">
      <div className="card max-w-2xl space-y-5">
        <div>
          <label className="label">Name</label>
          <input className="input" value={name} onChange={(e) => setName(e.target.value)} />
        </div>

        <div>
          <label className="label">Bio</label>
          <textarea
            className="input h-24 resize-none"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Who you are and how you teach."
          />
        </div>

        <div>
          <label className="label">Cost per session (SkillCoins)</label>
          <input
            className="input"
            type="number"
            min="0"
            max="500"
            value={cost}
            onChange={(e) => setCost(e.target.value)}
          />
        </div>

        <SkillPicker
          label="Skills I can teach"
          hint="e.g. react, guitar, sql"
          value={teach}
          onChange={setTeach}
        />

        <SkillPicker
          label="Skills I want to learn"
          hint="e.g. figma, spanish"
          value={learn}
          onChange={setLearn}
        />

        {error && <p className="text-red-400 text-sm">{error}</p>}
        {message && <p className="text-emerald-400 text-sm">{message}</p>}

        <button onClick={save} disabled={saving} className="btn-primary">
          {saving ? "Saving..." : "Save profile"}
        </button>
      </div>
    </Shell>
  );
}
