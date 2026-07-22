import Link from "next/link";

export const dynamic = "force-dynamic";

const STEPS = [
  { n: "1", t: "Teach", d: "List up to 5 skills you can teach and set your price in SkillCoins." },
  { n: "2", t: "Earn", d: "Run the session, both sides confirm, and the coins land in your wallet." },
  { n: "3", t: "Learn", d: "Spend those coins booking anyone else on the platform." },
];

export default function LandingPage() {
  return (
    <div>
      <header className="border-b border-line">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center">
          <span className="font-bold text-lg">
            Skill<span className="text-indigo-400">Swap</span>
          </span>
          <Link href="/login" className="ml-auto btn-primary text-sm">
            Get started
          </Link>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4">
        <section className="py-20 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold leading-tight">
            Trade knowledge.<br />
            <span className="text-indigo-400">Not money.</span>
          </h1>
          <p className="text-slate-400 mt-5 max-w-xl mx-auto">
            SkillSwap is a peer-to-peer skill exchange. Teach what you know to earn
            SkillCoins, then spend them learning something new. Every new account
            starts with 100 coins.
          </p>
          <Link href="/login" className="btn-primary inline-block mt-8">
            Create a free account
          </Link>
        </section>

        <section className="grid sm:grid-cols-3 gap-4 pb-20">
          {STEPS.map((s) => (
            <div key={s.n} className="card">
              <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center font-bold mb-3">
                {s.n}
              </div>
              <h3 className="font-semibold text-lg">{s.t}</h3>
              <p className="text-slate-400 text-sm mt-2">{s.d}</p>
            </div>
          ))}
        </section>

        <section className="card mb-20">
          <h2 className="font-semibold text-lg mb-2">How the coins stay fair</h2>
          <ul className="text-slate-400 text-sm space-y-2 list-disc pl-5">
            <li>Coins are locked in escrow the moment you request a session.</li>
            <li>If the teacher declines, you get a full automatic refund.</li>
            <li>The teacher is paid only after both people confirm it happened.</li>
            <li>Every movement is recorded in your wallet history.</li>
          </ul>
        </section>
      </main>

      <footer className="border-t border-line py-8 text-center text-slate-500 text-sm">
        SkillSwap — Teach. Earn. Learn.
      </footer>
    </div>
  );
}
