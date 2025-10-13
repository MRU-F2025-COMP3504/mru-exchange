export type Result<T> = { ok: true; data: T } | { ok: false; error: string };

export interface Product {
  title: string;
  description: string;
  image: string;
  price: number;
  stock: number;
}

export interface ProductSeller {
  id: number;
  product: Product;
  seller: Seller;
}

export interface Buyer {
  id: number;
}

export interface Seller {
  id: number;
}
