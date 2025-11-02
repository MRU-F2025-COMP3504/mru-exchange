export interface ProductFilter {
  seller: string;
  price: {
    min: number;
    max: number;
  };
  stock: {
    min: number;
    max: number;
  };
  listed: boolean;
  categories: number[];
}