export type Result<T> = { ok: true; data: T } | { ok: false; error: string };

export enum SortingOrder {
  NATURAL,
  ASCENDING,
  DESCENDING,
}

export interface Product {
  id: number;
  seller: Seller;
  title: string;
  description: string;
  image: string;
  price: number;
  stock: number;
}

export interface Buyer {
  id: number;
}

export interface Seller {
  id: number;
}
