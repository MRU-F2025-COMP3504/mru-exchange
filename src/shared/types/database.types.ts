export interface Database {
  public: {
    Tables: {
      User_Information: {
        Row: {
          id: number;
          first_name: string | null;
          last_name: string | null;
          email: string | null;
          created_at: string;
          deleted_on: string | null;
          is_deleted: boolean | null;
          is_flagged: boolean | null;
          flagged_type: string | null;
          user_name: string | null;
          supabase_id: string | null;
        };
        Insert: {
          id?: number;
          first_name?: string | null;
          last_name?: string | null;
          email?: string | null;
          created_at?: string;
          deleted_on?: string | null;
          is_deleted?: boolean | null;
          is_flagged?: boolean | null;
          flagged_type?: string | null;
          user_name?: string | null;
          supabase_id?: string | null;
        };
        Update: {
          id?: number;
          first_name?: string | null;
          last_name?: string | null;
          email?: string | null;
          created_at?: string;
          deleted_on?: string | null;
          is_deleted?: boolean | null;
          is_flagged?: boolean | null;
          flagged_type?: string | null;
          user_name?: string | null;
          supabase_id?: string | null;
        };
      };
      Product_Information: {
        Row: {
          id: number;
          created_at: string;
          title: string | null;
          description: string | null;
          image: any | null; // jsonb type
          price: number | null;
          stock_count: number | null;
          user_id: string | null;
          isListed: boolean | null;
        };
        Insert: {
          id?: number;
          created_at?: string;
          title?: string | null;
          description?: string | null;
          image?: any | null;
          price?: number | null;
          stock_count?: number | null;
          user_id?: string | null;
          isListed?: boolean | null;
        };
        Update: {
          id?: number;
          created_at?: string;
          title?: string | null;
          description?: string | null;
          image?: any | null;
          price?: number | null;
          stock_count?: number | null;
          user_id?: string | null;
          isListed?: boolean | null;
        };
      };
      Chats: {
        Row: {
          id: number;
          created_at: string;
          user_id_1: string | null;
          user_id_2: string | null;
          visible_to_user_1: boolean | null;
          visible_to_user_2: boolean | null;
        };
        Insert: {
          id?: number;
          created_at?: string;
          user_id_1?: string | null;
          user_id_2?: string | null;
          visible_to_user_1?: boolean | null;
          visible_to_user_2?: boolean | null;
        };
        Update: {
          id?: number;
          created_at?: string;
          user_id_1?: string | null;
          user_id_2?: string | null;
          visible_to_user_1?: boolean | null;
          visible_to_user_2?: boolean | null;
        };
      };
      Messages: {
        Row: {
          id: number;
          chat_id: number | null;
          logged_message: string | null;
          created_at: string;
          sender_id: string | null;
          visible: boolean | null;
        };
        Insert: {
          id?: number;
          chat_id?: number | null;
          logged_message?: string | null;
          created_at?: string;
          sender_id?: string | null;
          visible?: boolean | null;
        };
        Update: {
          id?: number;
          chat_id?: number | null;
          logged_message?: string | null;
          created_at?: string;
          sender_id?: string | null;
          visible?: boolean | null;
        };
      };
      Catagory_Tags: {
        Row: {
          id: number;
          name: string | null;
          description: string | null;
          created_at: string;
        };
        Insert: {
          id?: number;
          name?: string | null;
          description?: string | null;
          created_at?: string;
        };
        Update: {
          id?: number;
          name?: string | null;
          description?: string | null;
          created_at?: string;
        };
      };
      Catagory_Assigned_Products: {
        Row: {
          category_id: number;
          product_id: number;
          created_at: string;
        };
        Insert: {
          category_id: number;
          product_id: number;
          created_at?: string;
        };
        Update: {
          category_id?: number;
          product_id?: number;
          created_at?: string;
        };
      };
      Shopping_Cart: {
        Row: {
          id: number;
          created_at: string;
          product_id: number | null;
          user_id: string | null;
        };
        Insert: {
          id?: number;
          created_at?: string;
          product_id?: number | null;
          user_id?: string | null;
        };
        Update: {
          id?: number;
          created_at?: string;
          product_id?: number | null;
          user_id?: string | null;
        };
      };
      Reviews: {
        Row: {
          id: number;
          created_at: string;
          product_id: number | null;
          rating: number | null;
          description: string | null;
          created_by_id: string | null;
          created_on_id: string | null;
        };
        Insert: {
          id?: number;
          created_at?: string;
          product_id?: number | null;
          rating?: number | null;
          description?: string | null;
          created_by_id?: string | null;
          created_on_id?: string | null;
        };
        Update: {
          id?: number;
          created_at?: string;
          product_id?: number | null;
          rating?: number | null;
          description?: string | null;
          created_by_id?: string | null;
          created_on_id?: string | null;
        };
      };
      Reports: {
        Row: {
          id: number;
          created_at: string;
          closed_date: string | null;
          is_closed: boolean | null;
          linked_information: string | null;
          created_by_id: string | null;
          created_on_id: string | null;
        };
        Insert: {
          id?: number;
          created_at?: string;
          closed_date?: string | null;
          is_closed?: boolean | null;
          linked_information?: string | null;
          created_by_id?: string | null;
          created_on_id?: string | null;
        };
        Update: {
          id?: number;
          created_at?: string;
          closed_date?: string | null;
          is_closed?: boolean | null;
          linked_information?: string | null;
          created_by_id?: string | null;
          created_on_id?: string | null;
        };
      };
      User_Interactions: {
        Row: {
          id: number;
          created_at: string;
          user_id_1: string | null;
          user_id_2: string | null;
          user_1_is_blocked: boolean | null;
          user_1_is_muted: boolean | null;
          user_2_is_blocked: boolean | null;
          user_2_is_muted: boolean | null;
        };
        Insert: {
          id?: number;
          created_at?: string;
          user_id_1?: string | null;
          user_id_2?: string | null;
          user_1_is_blocked?: boolean | null;
          user_1_is_muted?: boolean | null;
          user_2_is_blocked?: boolean | null;
          user_2_is_muted?: boolean | null;
        };
        Update: {
          id?: number;
          created_at?: string;
          user_id_1?: string | null;
          user_id_2?: string | null;
          user_1_is_blocked?: boolean | null;
          user_1_is_muted?: boolean | null;
          user_2_is_blocked?: boolean | null;
          user_2_is_muted?: boolean | null;
        };
      };
    };
  };
}

// Convenience types
export type UserInformation = Database['public']['Tables']['User_Information']['Row'];
export type ProductInformation = Database['public']['Tables']['Product_Information']['Row'];
export type Chat = Database['public']['Tables']['Chats']['Row'];
export type Message = Database['public']['Tables']['Messages']['Row'];
export type CategoryTag = Database['public']['Tables']['Catagory_Tags']['Row'];
export type CategoryAssignedProduct = Database['public']['Tables']['Catagory_Assigned_Products']['Row'];
export type ShoppingCart = Database['public']['Tables']['Shopping_Cart']['Row'];
export type Review = Database['public']['Tables']['Reviews']['Row'];
export type Report = Database['public']['Tables']['Reports']['Row'];
export type UserInteraction = Database['public']['Tables']['User_Interactions']['Row'];
