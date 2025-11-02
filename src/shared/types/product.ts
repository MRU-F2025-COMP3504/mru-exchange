export interface Product {
  id: number;
  seller: Seller;
  title: string;
  description: string;
  image: string;
  price: number;
  stock: number;
}

export interface Buyer {
  id: number;
}

export interface Seller {
  id: number;
}
