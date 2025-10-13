import { ProductFilter, ProductFilterType } from '@features/products/types';
import { Product, Result, Seller, SortingOrder } from '@shared/types';
import { ok, err } from '@shared/utils';
// import {} from '@shared/api'; // database access

/**
 * @param id the product identifier
 */
export function getProduct(id: number): Result<Product> {
  throw new Error('TODO');
}

/**
 * @param id the seller identifier
 */
export function getProductsBySeller(id: number): Result<Product[]> {
  throw new Error('TODO');
}

/**
 * @param keywords the search keywords
 * @param filters the unique filters that narrows results
 */
export function getProductsByKeywords(
  keywords: string[],
  filters: ProductFilter[],
): Result<Product[]> {
  throw new Error('TODO');
}
