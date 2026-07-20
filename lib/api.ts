import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import type { DashboardSummary, Order, Product } from "../types";

const API_BASE = process.env.ADMIN_API_BASE_URL ?? "http://127.0.0.1:8000";
const ADMIN_COOKIE_NAME = "vikky_admin_key";

function getAdminKey(): string | undefined {
  return cookies().get(ADMIN_COOKIE_NAME)?.value;
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const headers = new Headers(init?.headers ?? {});
  headers.set("Content-Type", "application/json");

  const apiKey = getAdminKey();
  if (apiKey) {
    headers.set("X-Admin-API-Key", apiKey);
  }

  const response = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers,
    cache: "no-store"
  });

  if (!response.ok) {
    if (response.status === 401) {
      redirect("/login");
    }
    const body = await response.text();
    throw new Error(body || `Request failed: ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export async function getDashboardSummary(): Promise<DashboardSummary> {
  return request<DashboardSummary>("/api/v1/admin/summary");
}

export async function listProducts(): Promise<Product[]> {
  return request<Product[]>("/api/v1/admin/products");
}

export async function listOrders(): Promise<Order[]> {
  return request<Order[]>("/api/v1/admin/orders");
}

export async function createProduct(data: Omit<Product, "id">): Promise<Product> {
  return request<Product>("/api/v1/admin/products", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function uploadProductImage(file: File): Promise<{ url: string }> {
  const apiKey = cookies().get("vikky_admin_key")?.value;
  const form = new FormData();
  form.append("file", file);
  const response = await fetch(`${API_BASE}/api/v1/admin/products/upload-image`, {
    method: "POST",
    headers: apiKey ? { "X-Admin-API-Key": apiKey } : {},
    body: form,
    cache: "no-store",
  });
  if (!response.ok) {
    if (response.status === 401) redirect("/login");
    throw new Error(`Upload failed: ${response.status}`);
  }
  return response.json() as Promise<{ url: string }>;
}
