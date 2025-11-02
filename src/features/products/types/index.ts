import type { DatabaseQuery, ProductTable, Result } from '@shared/types';

export interface ProductBuilder {
  seller(id: string): this;
  title(title: string): this;
  description(description: string): this;
  image(url: string): Result<this, Error>;
  price(price: number): Result<this, Error>;
  stock(stock: number): Result<this, Error>;
  build(): DatabaseQuery<ProductTable>;
}

export interface ProductFilter {
  seller: string;
  price: {
    min: number;
    max: number;
  };
  stock: {
    min: number;
    max: number;
  };
  listed: boolean;
  categories: number[];
}
