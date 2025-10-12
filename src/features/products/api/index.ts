import { Product } from '@features/products/types';
import { SortingOrder } from '@shared/utils';
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

export interface ProductSeller {
  item: Product;
  seller: number; // todo: use concrete type
}

/**
 * @param id the product identifier
 */
export function getProductInformation(id: number): Product {
  throw new Error('TODO');
}

/**
 * @param id the product seller
 */
export function getProductSeller(id: number): ProductSeller {
  throw new Error('TODO');
}

/**
 * @param keywords the search keywords
 * @param filters the unique filters that narrows results
 */
export function getProductsByKeywords(
  keywords: string[],
  filters: ProductFilter[],
): ProductSeller[] {
  throw new Error('TODO');
}
