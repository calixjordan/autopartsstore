export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  partNumber: string;
  category: string;
  brand: string;
  compatibleModels: string[];
  stock: number;
  rating: number;
  reviewCount: number;
  createdAt: string;
  updatedAt: string;
}

export type ProductCategory =
  | "All"
  | "Engine"
  | "Exterior"
  | "Brakes"
  | "Electronics"
  | "Suspension"
  | "Transmission"
  | "Cooling"
  | "Interior";

export interface ProductsApiResponse {
  products: Product[];
  total: number;
  page: number;
  pageSize: number;
}

export interface CheckoutItem {
  productId: string;
  quantity: number;
  price: number;
  name: string;
}

export interface CheckoutSessionRequest {
  items: CheckoutItem[];
}

export interface CheckoutSessionResponse {
  sessionId: string;
  url: string;
}
