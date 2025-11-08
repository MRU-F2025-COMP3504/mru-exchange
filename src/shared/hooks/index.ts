/**
 * MRU Exchange Custom Hooks
 * Export all custom React hooks for easy imports
 */

export { useProducts, useProduct, useUserProducts } from '@features/catalogue/hooks/useProducts.ts';
export { useChat, useChats, useUnreadCount } from '@features/messaging/hooks/useMessages.ts';
export { useCart, useIsInCart } from '@features/ordering/hooks/useCart.ts';
export {
  useProductReviews,
  useUserReviews,
  useSellerReviews,
} from '@features/review/hooks/useReviews.ts';
export {
  useCategories,
  useCategory,
  useCategoryProducts,
} from '@features/catalogue/hooks/useCategories.ts';
