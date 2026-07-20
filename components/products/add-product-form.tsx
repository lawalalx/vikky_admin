"use client";

import { useRef, useState } from "react";
import { ImagePlus, Loader2, Plus, X } from "lucide-react";

const API_BASE = process.env.NEXT_PUBLIC_ADMIN_API_BASE_URL ?? "http://127.0.0.1:8000";
const ADMIN_COOKIE = "vikky_admin_key";

function getAdminKey(): string | undefined {
  if (typeof document === "undefined") return undefined;
  return document.cookie
    .split("; ")
    .find((r) => r.startsWith(`${ADMIN_COOKIE}=`))
    ?.split("=")[1];
}

const CATEGORIES = ["women", "men", "unisex", "niche", "gift-sets"];
const SCENT_FAMILIES = ["floral", "woody", "amber", "fresh", "spicy", "gourmand"];
const CONCENTRATIONS = ["parfum", "extrait", "eau_de_parfum", "eau_de_toilette"];

export function AddProductForm(): React.JSX.Element {
  const [open, setOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    name: "",
    brand: "Vikky",
    description: "",
    category: "unisex",
    scent_family: "floral",
    concentration: "eau_de_parfum",
    size_ml: 100,
    price: 0,
    currency: "NGN",
    notes: "",
    stock: 0,
    in_stock: true,
    featured: false,
    status: "active",
  });

  async function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImagePreview(URL.createObjectURL(file));
    setIsUploading(true);
    setError("");
    try {
      const key = getAdminKey();
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch(`${API_BASE}/api/v1/admin/products/upload-image`, {
        method: "POST",
        headers: key ? { "X-Admin-API-Key": key } : {},
        body: fd,
      });
      if (!res.ok) throw new Error(`Upload failed: ${res.status}`);
      const data = (await res.json()) as { url: string };
      setImageUrl(data.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Image upload failed");
    } finally {
      setIsUploading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!imageUrl) { setError("Please upload a product image first."); return; }
    setIsSubmitting(true);
    setError("");
    try {
      const key = getAdminKey();
      const payload = {
        ...form,
        size_ml: Number(form.size_ml),
        price: Number(form.price),
        stock: Number(form.stock),
        notes: form.notes.split(",").map((n) => n.trim()).filter(Boolean),
        image_url: imageUrl,
      };
      const res = await fetch(`${API_BASE}/api/v1/admin/products`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(key ? { "X-Admin-API-Key": key } : {}),
        },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const body = await res.text();
        throw new Error(body || `Failed: ${res.status}`);
      }
      setSuccess("Product added! Refresh the page to see it.");
      setOpen(false);
      // reset
      setForm({ name: "", brand: "Vikky", description: "", category: "unisex", scent_family: "floral", concentration: "eau_de_parfum", size_ml: 100, price: 0, currency: "NGN", notes: "", stock: 0, in_stock: true, featured: false, status: "active" });
      setImageUrl(""); setImagePreview("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create product");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      {success && (
        <div className="fixed right-4 top-4 z-50 rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700 shadow-lg">
          {success}
          <button onClick={() => setSuccess("")} className="ml-3 text-emerald-500 hover:text-emerald-800"><X className="h-3.5 w-3.5 inline" /></button>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 rounded-full bg-brand-plum px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-ink"
      >
        <Plus className="h-4 w-4" />
        Add Product
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm">
          <div className="w-full max-w-xl overflow-hidden rounded-3xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 bg-brand-plum px-6 py-4">
              <h2 className="font-semibold text-white">Add New Product</h2>
              <button type="button" onClick={() => setOpen(false)} className="text-white/70 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="max-h-[80vh] overflow-y-auto px-6 py-5 space-y-4">
              {/* Image Upload */}
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">Product Image *</p>
                <div
                  onClick={() => fileRef.current?.click()}
                  className="relative flex h-36 cursor-pointer items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 transition hover:border-brand-plum/40"
                >
                  {imagePreview ? (
                    <img src={imagePreview} alt="preview" className="h-full w-full object-cover" />
                  ) : (
                    <div className="text-center">
                      <ImagePlus className="mx-auto h-8 w-8 text-slate-300" />
                      <p className="mt-1 text-xs text-slate-400">Click to upload (JPEG/PNG/WebP)</p>
                    </div>
                  )}
                  {isUploading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white/80">
                      <Loader2 className="h-6 w-6 animate-spin text-brand-plum" />
                    </div>
                  )}
                </div>
                <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handleImageChange} />
                {imageUrl && <p className="mt-1 truncate text-[10px] text-emerald-600">✓ Uploaded to Cloudinary</p>}
              </div>

              {/* Fields */}
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-500">Name *</label>
                  <input required value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-brand-plum/20" />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-500">Brand *</label>
                  <input required value={form.brand} onChange={(e) => setForm((f) => ({ ...f, brand: e.target.value }))} className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-brand-plum/20" />
                </div>
                <div className="sm:col-span-2">
                  <label className="mb-1 block text-xs font-semibold text-slate-500">Description *</label>
                  <textarea required rows={2} value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-brand-plum/20" />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-500">Category</label>
                  <select value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))} className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none">
                    {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-500">Scent Family</label>
                  <select value={form.scent_family} onChange={(e) => setForm((f) => ({ ...f, scent_family: e.target.value }))} className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none">
                    {SCENT_FAMILIES.map((s) => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-500">Concentration</label>
                  <select value={form.concentration} onChange={(e) => setForm((f) => ({ ...f, concentration: e.target.value }))} className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none">
                    {CONCENTRATIONS.map((c) => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-500">Size (ml)</label>
                  <input type="number" min={1} value={form.size_ml} onChange={(e) => setForm((f) => ({ ...f, size_ml: Number(e.target.value) }))} className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-brand-plum/20" />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-500">Price (₦)</label>
                  <input type="number" min={0} value={form.price} onChange={(e) => setForm((f) => ({ ...f, price: Number(e.target.value) }))} className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-brand-plum/20" />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-500">Stock Qty</label>
                  <input type="number" min={0} value={form.stock} onChange={(e) => setForm((f) => ({ ...f, stock: Number(e.target.value) }))} className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-brand-plum/20" />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-500">Notes (comma-separated)</label>
                  <input value={form.notes} onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))} placeholder="rose, oud, amber" className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-brand-plum/20" />
                </div>
                <div className="flex items-center gap-4 pt-2">
                  <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
                    <input type="checkbox" checked={form.in_stock} onChange={(e) => setForm((f) => ({ ...f, in_stock: e.target.checked }))} />
                    In Stock
                  </label>
                  <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
                    <input type="checkbox" checked={form.featured} onChange={(e) => setForm((f) => ({ ...f, featured: e.target.checked }))} />
                    Featured
                  </label>
                </div>
              </div>

              {error && <p className="rounded-xl bg-rose-50 px-3 py-2 text-xs text-rose-600">{error}</p>}

              <button
                type="submit"
                disabled={isSubmitting || isUploading}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-brand-plum py-3 text-sm font-bold text-white transition hover:bg-brand-ink disabled:bg-slate-300"
              >
                {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                {isSubmitting ? "Adding…" : "Add Product"}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
