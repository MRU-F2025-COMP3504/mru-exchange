export interface ProductAttributes {
  title: string;
  description: string;
  image: string;
}

export interface ProductStock {
  price: number;
  unit: number;
}

export interface Product {
  id: number;
  attributes: ProductAttributes;
  stock: ProductStock;
}

export interface ProductSeller {
  seller: Seller;
  item: Product;
}

export interface Buyer {}

export interface Seller {}
