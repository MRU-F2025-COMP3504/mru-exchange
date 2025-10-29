import type { Tables } from '@shared/types/database';

export type UserTable = Tables<'User_Information'>;
export type ProductTable = Tables<'Product_Information'>;
export type ChatTable = Tables<'Chats'>;
export type MessageTable = Tables<'Messages'>;
export type CategoryTagTable = Tables<'Category_Tags'>;
export type CategoryAssignedProductTable = Tables<'Category_Assigned_Products'>;
export type ShoppingCartTable = Tables<'Shopping_Cart'>;
export type ReviewTable = Tables<'Reviews'>;
export type ReportTable = Tables<'Reports'>;
export type UserInteractionTable = Tables<'User_Interactions'>;
