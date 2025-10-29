export const ProductFilterType = {
  CATEGORY: 'CATEGORY',
  SELLER: 'SELLER',
  PRICE_RANGE: 'PRICE_RANGE',
  STOCK_RANGE: 'STOCK_RANGE',
} as const;

export interface ProductFilter {
  type: string;
  order: number;
  content: string;
}
