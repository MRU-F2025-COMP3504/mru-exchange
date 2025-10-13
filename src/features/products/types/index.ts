import { SortingOrder } from '@shared/types';

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
