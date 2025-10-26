import { supabase } from '../utils/supabase';
import type { ProductInformation } from '../types/database.ts';

export interface CreateProductData {
  title: string;
  description: string;
  price: number;
  stock_count?: number;
  image?: any;
  categoryIds?: number[];
}

export interface UpdateProductData {
  title?: string;
  description?: string;
  price?: number;
  stock_count?: number;
  image?: any;
  isListed?: boolean;
}

export interface ProductFilters {
  categoryId?: number;
  isListed?: boolean;
  minPrice?: number;
  maxPrice?: number;
  searchQuery?: string;
  userId?: string;
}

export const productsApi = {
  getProducts: async (filters?: ProductFilters) => {
    let query = supabase
      .from('Product_Information')
      .select(
        `
        *,
        User_Information:user_id (
          id,
          first_name,
          last_name,
          user_name,
          email
        ),
        Catagory_Assigned_Products (
          category_id,
          Catagory_Tags (
            id,
            name,
            description
          )
        )
      `,
      )
      .order('created_at', { ascending: false });

    if (filters?.isListed !== undefined) {
      query = query.eq('isListed', filters.isListed);
    } else {
      query = query.eq('isListed', true);
    }

    if (filters?.userId) {
      query = query.eq('user_id', filters.userId);
    }

    if (filters?.minPrice !== undefined) {
      query = query.gte('price', filters.minPrice);
    }

    if (filters?.maxPrice !== undefined) {
      query = query.lte('price', filters.maxPrice);
    }

    if (filters?.searchQuery) {
      query = query.or(
        `title.ilike.%${filters.searchQuery}%,description.ilike.%${filters.searchQuery}%`,
      );
    }

    const { data, error } = await query;

    if (filters?.categoryId && data) {
      const filtered = data.filter((product: any) =>
        product.Catagory_Assigned_Products?.some(
          (cat: any) => cat.category_id === filters.categoryId,
        ),
      );
      return { data: filtered, error };
    }

    return { data, error };
  },

  getProduct: async (id: number) => {
    const { data, error } = await supabase
      .from('Product_Information')
      .select(
        `
        *,
        User_Information:user_id (
          id,
          first_name,
          last_name,
          user_name,
          email
        ),
        Catagory_Assigned_Products (
          category_id,
          Catagory_Tags (
            id,
            name,
            description
          )
        ),
        Reviews (
          id,
          rating,
          description,
          created_at,
          User_Information:created_by_id (
            first_name,
            last_name,
            user_name
          )
        )
      `,
      )
      .eq('id', id)
      .single();

    return { data, error };
  },

  getUserProducts: async (userId: string) => {
    const { data, error } = await supabase
      .from('Product_Information')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    return { data, error };
  },

  createProduct: async (userId: string, productData: CreateProductData) => {
    const { categoryIds, ...productInfo } = productData;

    const { data, error } = await supabase
      .from('Product_Information')
      .insert({
        user_id: userId,
        ...productInfo,
        isListed: true,
        stock_count: productData.stock_count || 1,
      })
      .select()
      .single();

    if (error) return { data: null, error };

    if (categoryIds && categoryIds.length > 0 && data) {
      const categoryAssignments = categoryIds.map((categoryId) => ({
        product_id: data.id,
        category_id: categoryId,
      }));

      await supabase
        .from('Catagory_Assigned_Products')
        .insert(categoryAssignments);
    }

    return { data, error: null };
  },

  updateProduct: async (productId: number, updates: UpdateProductData) => {
    const { data, error } = await supabase
      .from('Product_Information')
      .update(updates)
      .eq('id', productId)
      .select()
      .single();

    return { data, error };
  },

  deleteProduct: async (productId: number) => {
    const { error } = await supabase
      .from('Product_Information')
      .delete()
      .eq('id', productId);

    return { error };
  },

  unlistProduct: async (productId: number) => {
    const { data, error } = await supabase
      .from('Product_Information')
      .update({ isListed: false })
      .eq('id', productId)
      .select()
      .single();

    return { data, error };
  },

  listProduct: async (productId: number) => {
    const { data, error } = await supabase
      .from('Product_Information')
      .update({ isListed: true })
      .eq('id', productId)
      .select()
      .single();

    return { data, error };
  },

  updateStock: async (productId: number, stockCount: number) => {
    const { data, error } = await supabase
      .from('Product_Information')
      .update({ stock_count: stockCount })
      .eq('id', productId)
      .select()
      .single();

    return { data, error };
  },

  assignCategories: async (productId: number, categoryIds: number[]) => {
    await supabase
      .from('Catagory_Assigned_Products')
      .delete()
      .eq('product_id', productId);

    const categoryAssignments = categoryIds.map((categoryId) => ({
      product_id: productId,
      category_id: categoryId,
    }));

    const { data, error } = await supabase
      .from('Catagory_Assigned_Products')
      .insert(categoryAssignments)
      .select();

    return { data, error };
  },

  getProductCategories: async (productId: number) => {
    const { data, error } = await supabase
      .from('Catagory_Assigned_Products')
      .select(
        `
        category_id,
        Catagory_Tags (
          id,
          name,
          description
        )
      `,
      )
      .eq('product_id', productId);

    return { data, error };
  },
};
