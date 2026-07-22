"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

export default function LoginClient() {
  const router = useRouter();
  const [mode, setMode] = useState("signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit() {
    setError("");
    if (!email || !password) return setError("Email and password are required.");
    if (password.length < 6) return setError("Password must be at least 6 characters.");
    if (mode === "signup" && !name.trim()) return setError("Please enter your name.");

    setBusy(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { name: name.trim() } },
        });
        if (error) throw error;
        router.push("/profile");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        router.push("/dashboard");
      }
      router.refresh();
    } catch (e) {
      setError(e.message || "Something went wrong.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <Link href="/" className="block text-center font-bold text-xl mb-6">
          Skill<span className="text-indigo-400">Swap</span>
        </Link>

        <div className="card">
          <div className="flex gap-2 mb-5">
            <button
              onClick={() => setMode("signin")}
              className={"flex-1 " + (mode === "signin" ? "btn-primary" : "btn-ghost")}
            >
              Sign in
            </button>
            <button
              onClick={() => setMode("signup")}
              className={"flex-1 " + (mode === "signup" ? "btn-primary" : "btn-ghost")}
            >
              Sign up
            </button>
          </div>

          {mode === "signup" && (
            <div className="mb-3">
              <label className="label">Name</label>
              <input
                className="input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
              />
            </div>
          )}

          <div className="mb-3">
            <label className="label">Email</label>
            <input
              className="input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
          </div>

          <div className="mb-4">
            <label className="label">Password</label>
            <input
              className="input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && submit()}
              placeholder="At least 6 characters"
            />
          </div>

          {error && <p className="text-red-400 text-sm mb-3">{error}</p>}

          <button onClick={submit} disabled={busy} className="btn-primary w-full">
            {busy ? "Please wait..." : mode === "signup" ? "Create account" : "Sign in"}
          </button>

          {mode === "signup" && (
            <p className="text-slate-500 text-xs mt-3 text-center">
              You will receive 100 SkillCoins on signup.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
