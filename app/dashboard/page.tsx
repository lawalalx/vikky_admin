import { AppShell } from "../../components/ui/app-shell";
import { StatCard } from "../../components/cards/stat-card";
import { getDashboardSummary } from "../../lib/api";

export default async function DashboardPage() {
  const summary = await getDashboardSummary();

  return (
    <AppShell>
      <div className="space-y-6">
        <section>
          <h1 className="text-3xl font-bold text-brand-ink">Management Dashboard</h1>
          <p className="mt-1 text-sm text-slate-500">Overview of catalog health, inventory, and order flow.</p>
        </section>

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard title="Total Products" value={summary.total_products} hint="All catalog items" />
          <StatCard title="Active Products" value={summary.active_products} hint="Live storefront items" />
          <StatCard title="Low Stock" value={summary.low_stock_products} hint="Needs replenishment" />
          <StatCard title="Pending Orders" value={summary.pending_orders} hint="Awaiting action" />
        </section>
      </div>
    </AppShell>
  );
}

