// import { Product } from '@features/products';
// import {} from '@shared/api'; // database access
import { Product, Result, Seller } from '@shared/types';
import { ok, err } from '@shared/utils';

export function create(product: Partial<Product>): Result<Product> {
  if (!product.seller) {
    return err('Missing product seller');
  }

  if (!product.title || product.title.length === 0) {
    return err('Missing title');
  }

  // return from database
  const record = {};

  return ok(record);
}

export function modify(
  target: Product,
  modify: Partial<Product>,
): Result<Product> {
  const id = target.id;
  const seller = target.seller;

  if (modify.title && modify.title.length === 0) {
    return err('Missing title');
  }

  return ok({
    ...target,
    ...modify,
  });
}

export function stock(target: Product, relative: number): Result<Product> {
  const stock = target.stock + relative;

  return ok({
    ...target,
    ...{ stock },
  });
}
