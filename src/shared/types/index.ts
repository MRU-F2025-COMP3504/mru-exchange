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
  product: Product;
  seller: Seller;
}

export interface Buyer {
  id: number;
}

export interface Seller {
  id: number;
}
