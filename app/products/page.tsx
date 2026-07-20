import { AppShell } from "../../components/ui/app-shell";
import { AddProductForm } from "../../components/products/add-product-form";
import { listProducts } from "../../lib/api";

export default async function ProductsPage() {
  const products = await listProducts();

  return (
    <AppShell>
      <div className="space-y-6">
        <section className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-brand-ink">Products</h1>
            <p className="mt-1 text-sm text-slate-500">Inventory view for perfumes and gift sets.</p>
          </div>
          <AddProductForm />
        </section>

        <div className="overflow-hidden rounded-3xl border border-white/70 bg-white/85 shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="px-4 py-3">Image</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Scent</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Stock</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-t border-slate-100 hover:bg-slate-50/50">
                  <td className="px-4 py-3">
                    {product.image_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={product.image_url}
                        alt={product.name}
                        width={48}
                        height={48}
                        className="h-12 w-12 rounded-xl object-cover"
                      />
                    ) : (
                      <div className="h-12 w-12 rounded-xl bg-slate-100" />
                    )}
                  </td>
                  <td className="px-4 py-3 font-medium text-brand-ink">{product.name}</td>
                  <td className="px-4 py-3 text-slate-600">{product.category}</td>
                  <td className="px-4 py-3 text-slate-600">{product.scent_family}</td>
                  <td className="px-4 py-3 text-slate-600">₦{product.price?.toLocaleString()}</td>
                  <td className="px-4 py-3 text-slate-600">{product.stock}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      product.status === "active"
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-slate-100 text-slate-500"
                    }`}>{product.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AppShell>
  );
}
