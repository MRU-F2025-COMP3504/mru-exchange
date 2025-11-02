import type {
  DatabaseQuery,
  PickOmit,
  ProductTable,
  Result,
} from '@shared/types';

export interface ProductBuilder {
  seller(id: string): Result<this, Error>;
  title(title: string): Result<this, Error>;
  description(description: string): Result<this, Error>;
  image(url: string): Result<this, Error>;
  price(price: number): Result<this, Error>;
  stock(stock: number): Result<this, Error>;
  build(): DatabaseQuery<ProductTable>;
}

export interface ProductFilter {
  seller(id: string): Result<this, Error>;
  price(min: number, max: number): Result<this, Error>;
  stock(min: number, max: number): Result<this, Error>;
  categories(...categories: number[]): Result<this, Error>;
  find(): DatabaseQuery<PickOmit<ProductTable, 'id'>[]>;
}
