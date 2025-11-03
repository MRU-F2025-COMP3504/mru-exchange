import type { DatabaseQuery, PickOmit, Product, Result } from '@shared/types';

export interface ProductBuilder {
  seller(id: string): Result<this, Error>;
  title(title: string): Result<this, Error>;
  description(description: string): Result<this, Error>;
  image(url: string): Result<this, Error>;
  price(price: number): Result<this, Error>;
  stock(stock: number): Result<this, Error>;
  build(): DatabaseQuery<Product>;
}

export interface ProductAttributeModifier {
  title(title: string): Result<this, Error>;
  description(description: string): Result<this, Error>;
  image(url: string): Result<this, Error>;
  modify<T extends PickOmit<Product, 'id'>>(): DatabaseQuery<T>
}