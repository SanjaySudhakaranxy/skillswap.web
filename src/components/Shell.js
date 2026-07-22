import NavBar from "./NavBar";

export default function Shell({ title, subtitle, children }) {
  return (
    <div>
      <NavBar />
      <main className="max-w-5xl mx-auto px-4 py-8">
        {title && (
          <div className="mb-6">
            <h1 className="text-2xl font-bold">{title}</h1>
            {subtitle && <p className="text-slate-400 text-sm mt-1">{subtitle}</p>}
          </div>
        )}
        {children}
      </main>
    </div>
  );
}
