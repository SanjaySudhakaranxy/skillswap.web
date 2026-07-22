"use client";

import { useEffect, useState } from "react";
import Shell from "@/components/Shell";
import { supabase } from "@/lib/supabaseClient";

const LABELS = {
  welcome: "Welcome bonus",
  escrow_hold: "Held in escrow",
  refund: "Refund",
  earning: "Teaching payout",
};

export default function WalletClient() {
  const [balance, setBalance] = useState(0);
  const [tx, setTx] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: p } = await supabase
        .from("profiles").select("coin_balance").eq("id", user.id).single();
      setBalance(p?.coin_balance ?? 0);

      const { data: t } = await supabase
        .from("transactions")
        .select("*")
        .order("created_at", { ascending: false });
      setTx(t || []);
      setLoading(false);
    }
    load();
  }, []);

  const earned = tx.filter((t) => t.amount > 0 && t.type === "earning")
    .reduce((a, b) => a + b.amount, 0);
  const spent = tx.filter((t) => t.amount < 0)
    .reduce((a, b) => a + Math.abs(b.amount), 0);

  return (
    <Shell title="Wallet" subtitle="Every coin movement on your account.">
      {loading ? (
        <p className="text-slate-400">Loading...</p>
      ) : (
        <>
          <div className="card mb-6">
            <p className="text-slate-400 text-sm">Current balance</p>
            <p className="text-5xl font-bold text-coin mt-1">{balance}</p>
            <p className="text-slate-500 text-sm mt-1">SkillCoins</p>
            <div className="flex gap-6 mt-5 pt-5 border-t border-line text-sm">
              <div>
                <p className="text-slate-400">Earned teaching</p>
                <p className="text-emerald-400 font-semibold">+{earned}</p>
              </div>
              <div>
                <p className="text-slate-400">Spent learning</p>
                <p className="text-red-400 font-semibold">-{spent}</p>
              </div>
            </div>
          </div>

          <h2 className="font-semibold mb-3">Transaction history</h2>
          {tx.length === 0 ? (
            <div className="card text-slate-400 text-sm">No transactions yet.</div>
          ) : (
            <div className="card divide-y divide-line p-0">
              {tx.map((t) => (
                <div key={t.id} className="flex items-center gap-4 px-5 py-4">
                  <div>
                    <p className="font-medium text-sm">{LABELS[t.type] || t.type}</p>
                    <p className="text-slate-500 text-xs">
                      {t.note} - {new Date(t.created_at).toLocaleString()}
                    </p>
                  </div>
                  <span
                    className={
                      "ml-auto font-semibold whitespace-nowrap " +
                      (t.amount >= 0 ? "text-emerald-400" : "text-red-400")
                    }
                  >
                    {t.amount >= 0 ? "+" : ""}{t.amount} SC
                  </span>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </Shell>
  );
}
