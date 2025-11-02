import { ProductAPI, type ProductBuilder } from '@features/products';
import { err, ok, present, query } from '@shared/utils';
import type {
  DatabaseQuery,
  PickOmit,
  Product,
  ProductTable,
  Result,
} from '@shared/types';
import { supabase } from '@shared/api';

export async function set(product: PickOmit<ProductTable, 'id' | 'user_id'>, isListed: boolean): DatabaseQuery<ProductTable> {
  const seller = present(product.user_id);

  if (seller.ok) {
    return query(
      await supabase
        .from('Product_Information')
        .update({
          isListed,
        })
        .eq('id', product.id)
        .eq('user_id', seller.data)
        .select()
        .single(),
    );
  }

  return seller;
}

export async function setAll(seller: string, isListed: boolean): DatabaseQuery<ProductTable[]> {
  return query(
    await supabase
      .from('Product_Information')
      .update({
        isListed,
      })
      .eq('user_id', seller)
      .eq('isListed', isListed)
      .select(),
  );
}

export async function remove(product: PickOmit<ProductTable, 'id' | 'user_id'>): DatabaseQuery<ProductTable> {
  const seller = present(product.user_id);

  if (seller.ok) {
    return query(
      await supabase
        .from('Product_Information')
        .delete()
        .eq('id', product.id)
        .eq('user_id', seller.data)
        .select()
        .single(),
    );
  }

  return seller;
}

export async function removeAll(seller: string): DatabaseQuery<ProductTable[]> {
  return query(
    await supabase
      .from('Product_Information')
      .delete()
      .eq('user_id', seller)
      .select(),
  );
}

export async function modify(builder: ProductBuilder): DatabaseQuery<ProductTable> {
  const seller = present(product.user_id);

  if (seller.ok) {
    return query(
      await supabase
        .from('Product_Information')
        .update(product)
        .eq('id', product.id)
        .eq('user_id', seller.data)
        .select()
        .single(),
    );
  }

  return seller;
}

export function stock(target: Product, relative: number): Result<Product> {
  const stock = target.stock + relative;

  return ok({
    ...target,
    ...{ stock },
  });
}
