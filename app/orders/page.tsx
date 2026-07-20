import { AppShell } from "../../components/ui/app-shell";
import { listOrders } from "../../lib/api";

export default async function OrdersPage() {
  const orders = await listOrders();

  return (
    <AppShell>
      <div className="space-y-6">
        <section>
          <h1 className="text-3xl font-bold text-brand-ink">Orders</h1>
          <p className="mt-1 text-sm text-slate-500">Track customer purchase progress.</p>
        </section>

        <div className="grid gap-4">
          {orders.map((order) => (
            <div key={order.id} className="rounded-3xl border border-white/70 bg-white/85 p-5 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="font-semibold text-brand-ink">{order.customer_name}</h2>
                  <p className="text-sm text-slate-500">{order.customer_email}</p>
                </div>
                <div className="text-sm text-slate-500">{order.status}</div>
              </div>
              <p className="mt-3 text-sm text-slate-600">Total: ₦{order.total_amount.toLocaleString()}</p>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
