export * from '@shared/types/database';
export * from '@shared/types/property';
export * from '@shared/types/result';
export * from '@shared/types/table';

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
