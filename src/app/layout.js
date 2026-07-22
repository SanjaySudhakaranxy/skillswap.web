import "./globals.css";

export const metadata = {
  title: "SkillSwap — Teach. Earn. Learn.",
  description: "Trade knowledge with SkillCoins. No money, just skills.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
