import { Product, Result, Seller, SortingOrder } from '@shared/types';
import { ok, err } from '@shared/utils';
// import {} from '@shared/api'; // database access

export enum ProductFilterType {
  CATEGORY,
  SELLER,
  PRICE_RANGE,
  STOCK_RANGE,
}

export interface ProductFilter {
  type: ProductFilterType;
  order: SortingOrder;
  content: string;
}

/**
 * @param id the product identifier
 */
export function getProduct(id: number): Result<Product> {
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
