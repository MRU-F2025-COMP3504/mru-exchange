import type {
  DatabaseQuery,
  PickOmit,
  Product,
  Result,
} from '@shared/types';

export interface ProductFilter {
  seller(id: string): Result<this, Error>;
  price(min: number, max: number): Result<this, Error>;
  stock(min: number, max: number): Result<this, Error>;
  categories(...categories: number[]): Result<this, Error>;
  find<T extends PickOmit<Product, 'id'>>(): DatabaseQuery<T[]>;
}
