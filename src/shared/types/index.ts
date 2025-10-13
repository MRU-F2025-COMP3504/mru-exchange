export interface ProductAttributes {
  seller: number;
  title: string;
  description: string;
  image: string;
}

export interface ProductStock {
  price: number;
  unit: number;
}

interface Product {
  attributes: ProductAttributes;
  stock: ProductStock;
}

export interface Buyer {}

export interface Seller {}
