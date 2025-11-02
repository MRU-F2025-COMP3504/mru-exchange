import type { DatabaseQuery, ProductTable, Result } from '@shared/types';

export interface Product {
  id: number;
  seller: number;
  title: string;
  description: string;
  image: URL;
  price: number;
  stock: number;
}

export interface ProductSelector {
  id(id: number): Result<this, Error>;
  seller(id: string): Result<this, Error>;
  select(): ProductTable;
}

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
