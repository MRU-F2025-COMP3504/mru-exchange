export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  mru_dev: {
    Tables: {
      Category_Assigned_Products: {
        Row: {
          category_id: number
          created_at: string
          product_id: number
        }
        Insert: {
          category_id?: number
          created_at?: string
          product_id: number
        }
        Update: {
          category_id?: number
          created_at?: string
          product_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "Catagory_Assigned_Products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "Category_Tags"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Catagory_Assigned_Products_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "get_reviews_created_on_user"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "Catagory_Assigned_Products_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "Product_Information"
            referencedColumns: ["id"]
          },
        ]
      }
      Category_Tags: {
        Row: {
          created_at: string
          description: string
          id: number
          name: string
        }
        Insert: {
          created_at?: string
          description: string
          id?: number
          name: string
        }
        Update: {
          created_at?: string
          description?: string
          id?: number
          name?: string
        }
        Relationships: []
      }
      Chats: {
        Row: {
          created_at: string
          id: number
          user_id_1: string
          user_id_2: string
          visible: boolean
        }
        Insert: {
          created_at?: string
          id?: number
          user_id_1?: string
          user_id_2: string
          visible?: boolean
        }
        Update: {
          created_at?: string
          id?: number
          user_id_1?: string
          user_id_2?: string
          visible?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "Chats_user_id_1_fkey"
            columns: ["user_id_1"]
            isOneToOne: false
            referencedRelation: "get_shopping_cart_information_for_user"
            referencedColumns: ["seller_id"]
          },
          {
            foreignKeyName: "Chats_user_id_1_fkey"
            columns: ["user_id_1"]
            isOneToOne: false
            referencedRelation: "User_Information"
            referencedColumns: ["supabase_id"]
          },
          {
            foreignKeyName: "Chats_user_id_2_fkey"
            columns: ["user_id_2"]
            isOneToOne: false
            referencedRelation: "get_shopping_cart_information_for_user"
            referencedColumns: ["seller_id"]
          },
          {
            foreignKeyName: "Chats_user_id_2_fkey"
            columns: ["user_id_2"]
            isOneToOne: false
            referencedRelation: "User_Information"
            referencedColumns: ["supabase_id"]
          },
        ]
      }
      Messages: {
        Row: {
          chat_id: number
          created_at: string
          id: number
          logged_message: string
          sender_id: string
          visible: boolean
        }
        Insert: {
          chat_id: number
          created_at?: string
          id?: number
          logged_message: string
          sender_id: string
          visible?: boolean
        }
        Update: {
          chat_id?: number
          created_at?: string
          id?: number
          logged_message?: string
          sender_id?: string
          visible?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "Messages_chat_id_fkey"
            columns: ["chat_id"]
            isOneToOne: false
            referencedRelation: "Chats"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "get_shopping_cart_information_for_user"
            referencedColumns: ["seller_id"]
          },
          {
            foreignKeyName: "Messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "User_Information"
            referencedColumns: ["supabase_id"]
          },
        ]
      }
      Product_Information: {
        Row: {
          created_at: string
          description: string
          id: number
          image: Json | null
          isDeleted: boolean
          isListed: boolean
          price: number
          stock_count: number
          title: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description: string
          id?: number
          image?: Json | null
          isDeleted?: boolean
          isListed?: boolean
          price: number
          stock_count?: number
          title: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string
          id?: number
          image?: Json | null
          isDeleted?: boolean
          isListed?: boolean
          price?: number
          stock_count?: number
          title?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "Product_Information_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "get_shopping_cart_information_for_user"
            referencedColumns: ["seller_id"]
          },
          {
            foreignKeyName: "Product_Information_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "User_Information"
            referencedColumns: ["supabase_id"]
          },
        ]
      }
      Product_Order: {
        Row: {
          created_at: string
          id: number
          ordered_by_id: string
          product_id: number
        }
        Insert: {
          created_at?: string
          id?: number
          ordered_by_id?: string
          product_id: number
        }
        Update: {
          created_at?: string
          id?: number
          ordered_by_id?: string
          product_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "Product_Order_ordered_by_id_fkey"
            columns: ["ordered_by_id"]
            isOneToOne: false
            referencedRelation: "get_shopping_cart_information_for_user"
            referencedColumns: ["seller_id"]
          },
          {
            foreignKeyName: "Product_Order_ordered_by_id_fkey"
            columns: ["ordered_by_id"]
            isOneToOne: false
            referencedRelation: "User_Information"
            referencedColumns: ["supabase_id"]
          },
          {
            foreignKeyName: "Product_Order_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "get_reviews_created_on_user"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "Product_Order_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "Product_Information"
            referencedColumns: ["id"]
          },
        ]
      }
      Reports: {
        Row: {
          closed_date: string | null
          created_at: string
          created_by_id: string
          created_on_id: string
          description: string
          id: number
          is_closed: boolean
          linked_information: string | null
        }
        Insert: {
          closed_date?: string | null
          created_at?: string
          created_by_id?: string
          created_on_id: string
          description: string
          id?: number
          is_closed?: boolean
          linked_information?: string | null
        }
        Update: {
          closed_date?: string | null
          created_at?: string
          created_by_id?: string
          created_on_id?: string
          description?: string
          id?: number
          is_closed?: boolean
          linked_information?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "Reports_created_by_id_fkey"
            columns: ["created_by_id"]
            isOneToOne: false
            referencedRelation: "get_shopping_cart_information_for_user"
            referencedColumns: ["seller_id"]
          },
          {
            foreignKeyName: "Reports_created_by_id_fkey"
            columns: ["created_by_id"]
            isOneToOne: false
            referencedRelation: "User_Information"
            referencedColumns: ["supabase_id"]
          },
          {
            foreignKeyName: "Reports_created_on_id_fkey"
            columns: ["created_on_id"]
            isOneToOne: false
            referencedRelation: "get_shopping_cart_information_for_user"
            referencedColumns: ["seller_id"]
          },
          {
            foreignKeyName: "Reports_created_on_id_fkey"
            columns: ["created_on_id"]
            isOneToOne: false
            referencedRelation: "User_Information"
            referencedColumns: ["supabase_id"]
          },
        ]
      }
      Reviews: {
        Row: {
          created_at: string
          created_by_id: string
          created_on_id: string
          description: string
          id: number
          product_id: number | null
          rating: number
        }
        Insert: {
          created_at?: string
          created_by_id?: string
          created_on_id: string
          description?: string
          id?: number
          product_id?: number | null
          rating: number
        }
        Update: {
          created_at?: string
          created_by_id?: string
          created_on_id?: string
          description?: string
          id?: number
          product_id?: number | null
          rating?: number
        }
        Relationships: [
          {
            foreignKeyName: "Reviews_created_by_id_fkey"
            columns: ["created_by_id"]
            isOneToOne: false
            referencedRelation: "get_shopping_cart_information_for_user"
            referencedColumns: ["seller_id"]
          },
          {
            foreignKeyName: "Reviews_created_by_id_fkey"
            columns: ["created_by_id"]
            isOneToOne: false
            referencedRelation: "User_Information"
            referencedColumns: ["supabase_id"]
          },
          {
            foreignKeyName: "Reviews_created_on_id_fkey"
            columns: ["created_on_id"]
            isOneToOne: false
            referencedRelation: "get_shopping_cart_information_for_user"
            referencedColumns: ["seller_id"]
          },
          {
            foreignKeyName: "Reviews_created_on_id_fkey"
            columns: ["created_on_id"]
            isOneToOne: false
            referencedRelation: "User_Information"
            referencedColumns: ["supabase_id"]
          },
          {
            foreignKeyName: "Reviews_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "get_reviews_created_on_user"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "Reviews_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "Product_Information"
            referencedColumns: ["id"]
          },
        ]
      }
      Shopping_Cart: {
        Row: {
          created_at: string
          id: number
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: number
          user_id?: string
        }
        Update: {
          created_at?: string
          id?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "Shopping_Cart_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "get_shopping_cart_information_for_user"
            referencedColumns: ["seller_id"]
          },
          {
            foreignKeyName: "Shopping_Cart_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "User_Information"
            referencedColumns: ["supabase_id"]
          },
        ]
      }
      Shopping_Cart_Products: {
        Row: {
          created_at: string
          product_id: number
          shopping_cart_id: number
        }
        Insert: {
          created_at?: string
          product_id: number
          shopping_cart_id: number
        }
        Update: {
          created_at?: string
          product_id?: number
          shopping_cart_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "Shopping_Cart_Products_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "get_reviews_created_on_user"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "Shopping_Cart_Products_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "Product_Information"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Shopping_Cart_Products_shopping_cart_id_fkey"
            columns: ["shopping_cart_id"]
            isOneToOne: false
            referencedRelation: "Shopping_Cart"
            referencedColumns: ["id"]
          },
        ]
      }
      User_Information: {
        Row: {
          created_at: string
          deleted_on: string | null
          email: string
          first_name: string | null
          flagged_type: string | null
          id: number
          is_deleted: boolean
          is_flagged: boolean
          last_name: string | null
          profile_image: Json | null
          rating: number | null
          supabase_id: string
          user_name: string | null
        }
        Insert: {
          created_at?: string
          deleted_on?: string | null
          email: string
          first_name?: string | null
          flagged_type?: string | null
          id?: number
          is_deleted?: boolean
          is_flagged?: boolean
          last_name?: string | null
          profile_image?: Json | null
          rating?: number | null
          supabase_id?: string
          user_name?: string | null
        }
        Update: {
          created_at?: string
          deleted_on?: string | null
          email?: string
          first_name?: string | null
          flagged_type?: string | null
          id?: number
          is_deleted?: boolean
          is_flagged?: boolean
          last_name?: string | null
          profile_image?: Json | null
          rating?: number | null
          supabase_id?: string
          user_name?: string | null
        }
        Relationships: []
      }
      User_Interactions: {
        Row: {
          created_at: string
          id: number
          user_1_is_blocked: boolean
          user_1_is_muted: boolean
          user_2_is_blocked: boolean
          user_2_is_muted: boolean
          user_id_1: string
          user_id_2: string
        }
        Insert: {
          created_at?: string
          id?: number
          user_1_is_blocked?: boolean
          user_1_is_muted?: boolean
          user_2_is_blocked?: boolean
          user_2_is_muted?: boolean
          user_id_1?: string
          user_id_2: string
        }
        Update: {
          created_at?: string
          id?: number
          user_1_is_blocked?: boolean
          user_1_is_muted?: boolean
          user_2_is_blocked?: boolean
          user_2_is_muted?: boolean
          user_id_1?: string
          user_id_2?: string
        }
        Relationships: [
          {
            foreignKeyName: "User_Interactions_user_id_1_fkey"
            columns: ["user_id_1"]
            isOneToOne: false
            referencedRelation: "get_shopping_cart_information_for_user"
            referencedColumns: ["seller_id"]
          },
          {
            foreignKeyName: "User_Interactions_user_id_1_fkey"
            columns: ["user_id_1"]
            isOneToOne: false
            referencedRelation: "User_Information"
            referencedColumns: ["supabase_id"]
          },
          {
            foreignKeyName: "User_Interactions_user_id_2_fkey"
            columns: ["user_id_2"]
            isOneToOne: false
            referencedRelation: "get_shopping_cart_information_for_user"
            referencedColumns: ["seller_id"]
          },
          {
            foreignKeyName: "User_Interactions_user_id_2_fkey"
            columns: ["user_id_2"]
            isOneToOne: false
            referencedRelation: "User_Information"
            referencedColumns: ["supabase_id"]
          },
        ]
      }
    }
    Views: {
      get_blocked_accounts_for_user: {
        Row: {
          first_name: string | null
          last_name: string | null
        }
        Relationships: []
      }
      get_category_tags_for_user: {
        Row: {
          description: string | null
          name: string | null
        }
        Insert: {
          description?: string | null
          name?: string | null
        }
        Update: {
          description?: string | null
          name?: string | null
        }
        Relationships: []
      }
      get_chat_messages_for_user: {
        Row: {
          created_at: string | null
          first_name: string | null
          last_name: string | null
          logged_message: string | null
        }
        Relationships: []
      }
      get_chats_for_user: {
        Row: {
          created_at: string | null
          first_name: string | null
          last_message: string | null
          last_name: string | null
        }
        Relationships: []
      }
      get_list_of_products_for_user: {
        Row: {
          category: string | null
          created_at: string | null
          description: string | null
          image: Json | null
          price: number | null
          stock_count: number | null
          title: string | null
        }
        Relationships: []
      }
      get_messages_for_user: {
        Row: {
          logged_message: string | null
        }
        Relationships: []
      }
      get_muted_accounts_for_user: {
        Row: {
          first_name: string | null
          last_name: string | null
        }
        Relationships: []
      }
      get_product_information_for_user: {
        Row: {
          category: string | null
          created_at: string | null
          description: string | null
          first_name: string | null
          image: Json | null
          last_name: string | null
          price: number | null
          rating: number | null
          stock_count: number | null
          title: string | null
        }
        Relationships: []
      }
      get_reports_created_for_user: {
        Row: {
          created_by_first_name: string | null
          created_by_last_name: string | null
          created_date: string | null
          created_on_first_name: string | null
          created_on_last_name: string | null
          description: string | null
          is_report_closed: boolean | null
          linked_information: string | null
        }
        Relationships: []
      }
      get_reviews_created_by_user: {
        Row: {
          created_at: string | null
          created_by_first_name: string | null
          created_by_last_name: string | null
          created_on_first_name: string | null
          created_on_last_name: string | null
          product_title: string | null
          review_message: string | null
          review_rating: number | null
        }
        Relationships: []
      }
      get_reviews_created_on_user: {
        Row: {
          first_name: string | null
          last_name: string | null
          primary_user_rating: number | null
          product_id: number | null
          product_title: string | null
          review_rating: number | null
        }
        Relationships: []
      }
      get_shopping_cart_information_for_user: {
        Row: {
          product_name: string | null
          product_price: number | null
          seller_id: string | null
        }
        Relationships: []
      }
      get_user_profile_information_for_user: {
        Row: {
          email: string | null
          first_name: string | null
          last_name: string | null
          profile_image: Json | null
          rating: number | null
        }
        Insert: {
          email?: string | null
          first_name?: string | null
          last_name?: string | null
          profile_image?: Json | null
          rating?: number | null
        }
        Update: {
          email?: string | null
          first_name?: string | null
          last_name?: string | null
          profile_image?: Json | null
          rating?: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      compare_verified_users: {
        Args: { user1: string; user2: string }
        Returns: boolean
      }
      is_chat_visible_to_user: {
        Args: { chat_row: Database["mru_dev"]["Tables"]["Chats"]["Row"] }
        Returns: boolean
      }
      is_user_interaction_blocked: {
        Args: { user1: string; user2: string }
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "mru_dev">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  mru_dev: {
    Enums: {},
  },
} as const
