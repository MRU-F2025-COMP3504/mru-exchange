import { supabase } from '../utils/supabase';
import type { CategoryTag } from '../types/database.ts';

export const categoriesApi = {
  getAllCategories: async () => {
    const { data, error } = await supabase
      .from('Catagory_Tags')
      .select('*')
      .order('name', { ascending: true });

    return { data, error };
  },

  getCategory: async (id: number) => {
    const { data, error } = await supabase
      .from('Catagory_Tags')
      .select('*')
      .eq('id', id)
      .single();

    return { data, error };
  },

  createCategory: async (name: string, description?: string) => {
    const { data, error } = await supabase
      .from('Catagory_Tags')
      .insert({
        name,
        description,
      })
      .select()
      .single();

    return { data, error };
  },

  updateCategory: async (
    id: number,
    updates: {
      name?: string;
      description?: string;
    },
  ) => {
    const { data, error } = await supabase
      .from('Catagory_Tags')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    return { data, error };
  },

  deleteCategory: async (id: number) => {
    const { error } = await supabase
      .from('Catagory_Tags')
      .delete()
      .eq('id', id);

    return { error };
  },

  getCategoryProducts: async (categoryId: number) => {
    const { data, error } = await supabase
      .from('Catagory_Assigned_Products')
      .select(
        `
        *,
        Product_Information:product_id (
          *,
          User_Information:user_id (
            first_name,
            last_name,
            user_name
          )
        )
      `,
      )
      .eq('category_id', categoryId);

    return { data, error };
  },

  getCategoryProductCount: async (categoryId: number) => {
    const { count, error } = await supabase
      .from('Catagory_Assigned_Products')
      .select('*', { count: 'exact', head: true })
      .eq('category_id', categoryId);

    return { count, error };
  },
};
