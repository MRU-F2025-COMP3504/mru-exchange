import type {
  DatabaseQuery,
  Product, RequiredColumns,
  Result, UserProfile,
} from '@shared/types';

export interface ProductBuilder {
  seller(id: RequiredColumns<UserProfile, 'supabase_id'>): Result<this>;
  title(title: string): Result<this>;
  description(description: string): Result<this>;
  image(url: string): Result<this>;
  price(price: number): Result<this>;
  stock(stock: number): Result<this>;
  build(): DatabaseQuery<Product, 'id'>;
}

export interface ProductAttributeModifier {
  title(title: string): Result<this>;
  description(description: string): Result<this>;
  image(url: string): Result<this>;
  modify(): DatabaseQuery<Product, 'id'>
}