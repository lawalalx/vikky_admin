import Link from "next/link";
import { BarChart3, Package, ReceiptText, Sparkles } from "lucide-react";

type Props = {
  children: React.ReactNode;
};

const nav = [
  { href: "/dashboard", label: "Dashboard", icon: BarChart3 },
  { href: "/products", label: "Products", icon: Package },
  { href: "/orders", label: "Orders", icon: ReceiptText }
];

export function AppShell({ children }: Props): React.JSX.Element {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#fffafc] to-white">
      <header className="border-b border-white/70 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div>
            <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.3em] text-brand-rose">
              <Sparkles className="h-4 w-4" />
              Vikky Admin
            </div>
            <p className="mt-1 text-sm text-slate-500">Luxury perfume operations console.</p>
          </div>

          <div className="flex items-center gap-2">
            <nav className="flex items-center gap-2">
              {nav.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-600 transition hover:border-brand-plum hover:text-brand-plum"
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            <Link
              href="/api/auth/logout"
              className="inline-flex items-center rounded-full border border-brand-plum/10 bg-brand-plum px-4 py-2 text-sm font-medium text-white shadow-glow transition hover:translate-y-[-1px] hover:bg-brand-ink"
            >
              Logout
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">{children}</main>
    </div>
  );
}
