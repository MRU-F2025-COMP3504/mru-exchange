import type { Tables } from '@shared/types/database/schema';

export type UserProfile = Tables<'User_Information'>;
export type Product = Tables<'Product_Information'>;
export type Chat = Tables<'Chats'>;
export type UserMessage = Tables<'Messages'>;
export type Category = Tables<'Category_Tags'>;
export type CategorizedProduct = Tables<'Category_Assigned_Products'>;
export type ProductBookmarker = Tables<'Shopping_Cart'>;
export type BookmarkedProduct = Tables<'Shopping_Cart_Products'>;
export type Review = Tables<'Reviews'>;
export type UserReport = Tables<'Reports'>;
export type InteractingUsers = Tables<'User_Interactions'>;
