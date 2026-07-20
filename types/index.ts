export type ProductStatus = "active" | "draft" | "archived";

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
  scent_family: string;
  concentration: string;
  size_ml: number;
  price: number;
  currency: string;
  notes: string[];
  image_url: string;
  in_stock: boolean;
  featured: boolean;
  stock: number;
  status: ProductStatus;
}

export interface Order {
  id: string;
  customer_name: string;
  customer_email: string;
  total_amount: number;
  status: "pending" | "paid" | "fulfilled" | "cancelled";
  created_at: string;
}

export interface DashboardSummary {
  total_products: number;
  active_products: number;
  low_stock_products: number;
  pending_orders: number;
}
