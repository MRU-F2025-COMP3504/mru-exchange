import type { DatabaseQuery, PickOmit, ProductTable, Result } from '@shared/types';

export interface ProductAttributeModifier {
  title(title: string): Result<this, Error>;
  description(description: string): Result<this, Error>;
  image(url: string): Result<this, Error>;
  modify<T extends PickOmit<ProductTable, 'id'>>(): DatabaseQuery<T>
}