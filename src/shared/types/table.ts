import type { Tables } from '@shared/types/database';

export type UserProfile = Tables<'User_Information'>;
export type Product = Tables<'Product_Information'>;
export type Chat = Tables<'Chats'>;
export type UserMessage = Tables<'Messages'>;
export type Category = Tables<'Category_Tags'>;
export type CategorizedProduct = Tables<'Category_Assigned_Products'>;
export type ShoppingCart = Tables<'Shopping_Cart'>;
export type ProductOrder = Tables<'Shopping_Cart_Products'>;
export type Review = Tables<'Reviews'>;
export type Report = Tables<'Reports'>;
export type UserInteraction = Tables<'User_Interactions'>;
