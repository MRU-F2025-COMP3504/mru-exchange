import type {
  DatabaseQuery,
  Product,
  RequiredColumns,
  Result,
  UserProfile,
} from '@shared/types';

export interface ProductFilter {
  seller: (seller: RequiredColumns<UserProfile, 'supabase_id'>) => Result<this>;
  price: (min: number, max: number) => Result<this>;
  stock: (min: number, max: number) => Result<this>;
  categories: (...categories: number[]) => Result<this>;
  find: () => DatabaseQuery<Product[], 'id'>;
}
