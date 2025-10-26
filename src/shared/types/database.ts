export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      Category_Assigned_Products: {
        Row: {
          category_id: number;
          created_at: string;
          product_id: number;
        };
        Insert: {
          category_id?: number;
          created_at?: string;
          product_id: number;
        };
        Update: {
          category_id?: number;
          created_at?: string;
          product_id?: number;
        };
        Relationships: [
          {
            foreignKeyName: 'Catagory_Assigned_Products_category_id_fkey';
            columns: ['category_id'];
            isOneToOne: false;
            referencedRelation: 'Category_Tags';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'Catagory_Assigned_Products_product_id_fkey';
            columns: ['product_id'];
            isOneToOne: false;
            referencedRelation: 'Product_Information';
            referencedColumns: ['id'];
          },
        ];
      };
      Category_Tags: {
        Row: {
          created_at: string;
          description: string | null;
          id: number;
          name: string | null;
        };
        Insert: {
          created_at?: string;
          description?: string | null;
          id?: number;
          name?: string | null;
        };
        Update: {
          created_at?: string;
          description?: string | null;
          id?: number;
          name?: string | null;
        };
        Relationships: [];
      };
      Chats: {
        Row: {
          created_at: string;
          id: number;
          user_id_1: string | null;
          user_id_2: string | null;
          visible_to_user_1: boolean | null;
          visible_to_user_2: boolean | null;
        };
        Insert: {
          created_at?: string;
          id?: number;
          user_id_1?: string | null;
          user_id_2?: string | null;
          visible_to_user_1?: boolean | null;
          visible_to_user_2?: boolean | null;
        };
        Update: {
          created_at?: string;
          id?: number;
          user_id_1?: string | null;
          user_id_2?: string | null;
          visible_to_user_1?: boolean | null;
          visible_to_user_2?: boolean | null;
        };
        Relationships: [
          {
            foreignKeyName: 'Chats_user_id_1_fkey';
            columns: ['user_id_1'];
            isOneToOne: false;
            referencedRelation: 'User_Information';
            referencedColumns: ['supabase_id'];
          },
          {
            foreignKeyName: 'Chats_user_id_2_fkey';
            columns: ['user_id_2'];
            isOneToOne: false;
            referencedRelation: 'User_Information';
            referencedColumns: ['supabase_id'];
          },
        ];
      };
      Messages: {
        Row: {
          chat_id: number | null;
          created_at: string;
          id: number;
          logged_message: string | null;
          sender_id: string | null;
          visible: boolean | null;
        };
        Insert: {
          chat_id?: number | null;
          created_at?: string;
          id?: number;
          logged_message?: string | null;
          sender_id?: string | null;
          visible?: boolean | null;
        };
        Update: {
          chat_id?: number | null;
          created_at?: string;
          id?: number;
          logged_message?: string | null;
          sender_id?: string | null;
          visible?: boolean | null;
        };
        Relationships: [
          {
            foreignKeyName: 'Messages_chat_id_fkey';
            columns: ['chat_id'];
            isOneToOne: false;
            referencedRelation: 'Chats';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'Messages_sender_id_fkey';
            columns: ['sender_id'];
            isOneToOne: false;
            referencedRelation: 'User_Information';
            referencedColumns: ['supabase_id'];
          },
        ];
      };
      Product_Information: {
        Row: {
          created_at: string;
          description: string | null;
          id: number;
          image: Json | null;
          isDeleted: boolean | null;
          isListed: boolean | null;
          price: number | null;
          stock_count: number | null;
          title: string | null;
          user_id: string | null;
        };
        Insert: {
          created_at?: string;
          description?: string | null;
          id?: number;
          image?: Json | null;
          isDeleted?: boolean | null;
          isListed?: boolean | null;
          price?: number | null;
          stock_count?: number | null;
          title?: string | null;
          user_id?: string | null;
        };
        Update: {
          created_at?: string;
          description?: string | null;
          id?: number;
          image?: Json | null;
          isDeleted?: boolean | null;
          isListed?: boolean | null;
          price?: number | null;
          stock_count?: number | null;
          title?: string | null;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'Product_Information_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'User_Information';
            referencedColumns: ['supabase_id'];
          },
        ];
      };
      Reports: {
        Row: {
          closed_date: string | null;
          created_at: string;
          created_by_id: string | null;
          created_on_id: string | null;
          description: string | null;
          id: number;
          is_closed: boolean | null;
          linked_information: string | null;
        };
        Insert: {
          closed_date?: string | null;
          created_at?: string;
          created_by_id?: string | null;
          created_on_id?: string | null;
          description?: string | null;
          id?: number;
          is_closed?: boolean | null;
          linked_information?: string | null;
        };
        Update: {
          closed_date?: string | null;
          created_at?: string;
          created_by_id?: string | null;
          created_on_id?: string | null;
          description?: string | null;
          id?: number;
          is_closed?: boolean | null;
          linked_information?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'Reports_created_by_id_fkey';
            columns: ['created_by_id'];
            isOneToOne: false;
            referencedRelation: 'User_Information';
            referencedColumns: ['supabase_id'];
          },
          {
            foreignKeyName: 'Reports_created_on_id_fkey';
            columns: ['created_on_id'];
            isOneToOne: false;
            referencedRelation: 'User_Information';
            referencedColumns: ['supabase_id'];
          },
        ];
      };
      Reviews: {
        Row: {
          created_at: string;
          created_by_id: string | null;
          created_on_id: string | null;
          description: string | null;
          id: number;
          product_id: number | null;
          rating: number | null;
        };
        Insert: {
          created_at?: string;
          created_by_id?: string | null;
          created_on_id?: string | null;
          description?: string | null;
          id?: number;
          product_id?: number | null;
          rating?: number | null;
        };
        Update: {
          created_at?: string;
          created_by_id?: string | null;
          created_on_id?: string | null;
          description?: string | null;
          id?: number;
          product_id?: number | null;
          rating?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: 'Reviews_created_by_id_fkey';
            columns: ['created_by_id'];
            isOneToOne: false;
            referencedRelation: 'User_Information';
            referencedColumns: ['supabase_id'];
          },
          {
            foreignKeyName: 'Reviews_created_on_id_fkey';
            columns: ['created_on_id'];
            isOneToOne: false;
            referencedRelation: 'User_Information';
            referencedColumns: ['supabase_id'];
          },
          {
            foreignKeyName: 'Reviews_product_id_fkey';
            columns: ['product_id'];
            isOneToOne: false;
            referencedRelation: 'Product_Information';
            referencedColumns: ['id'];
          },
        ];
      };
      Shopping_Cart: {
        Row: {
          created_at: string;
          id: number;
          user_id: string | null;
        };
        Insert: {
          created_at?: string;
          id?: number;
          user_id?: string | null;
        };
        Update: {
          created_at?: string;
          id?: number;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'Shopping_Cart_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'User_Information';
            referencedColumns: ['supabase_id'];
          },
        ];
      };
      Shopping_Cart_Products: {
        Row: {
          created_at: string;
          product_id: number;
          shopping_cart_id: number;
        };
        Insert: {
          created_at?: string;
          product_id: number;
          shopping_cart_id: number;
        };
        Update: {
          created_at?: string;
          product_id?: number;
          shopping_cart_id?: number;
        };
        Relationships: [
          {
            foreignKeyName: 'Shopping_Cart_Products_product_id_fkey';
            columns: ['product_id'];
            isOneToOne: false;
            referencedRelation: 'Product_Information';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'Shopping_Cart_Products_shopping_cart_id_fkey';
            columns: ['shopping_cart_id'];
            isOneToOne: false;
            referencedRelation: 'Shopping_Cart';
            referencedColumns: ['id'];
          },
        ];
      };
      User_Information: {
        Row: {
          created_at: string;
          deleted_on: string | null;
          email: string | null;
          first_name: string | null;
          flagged_type: string | null;
          id: number;
          is_deleted: boolean | null;
          is_flagged: boolean | null;
          last_name: string | null;
          profile_image: Json | null;
          rating: number | null;
          supabase_id: string;
          user_name: string | null;
        };
        Insert: {
          created_at?: string;
          deleted_on?: string | null;
          email?: string | null;
          first_name?: string | null;
          flagged_type?: string | null;
          id: number;
          is_deleted?: boolean | null;
          is_flagged?: boolean | null;
          last_name?: string | null;
          profile_image?: Json | null;
          rating?: number | null;
          supabase_id?: string;
          user_name?: string | null;
        };
        Update: {
          created_at?: string;
          deleted_on?: string | null;
          email?: string | null;
          first_name?: string | null;
          flagged_type?: string | null;
          id?: number;
          is_deleted?: boolean | null;
          is_flagged?: boolean | null;
          last_name?: string | null;
          profile_image?: Json | null;
          rating?: number | null;
          supabase_id?: string;
          user_name?: string | null;
        };
        Relationships: [];
      };
      User_Interactions: {
        Row: {
          created_at: string;
          id: number;
          user_1_is_blocked: boolean | null;
          user_1_is_muted: boolean | null;
          user_2_is_blocked: boolean | null;
          user_2_is_muted: boolean | null;
          user_id_1: string | null;
          user_id_2: string | null;
        };
        Insert: {
          created_at?: string;
          id?: number;
          user_1_is_blocked?: boolean | null;
          user_1_is_muted?: boolean | null;
          user_2_is_blocked?: boolean | null;
          user_2_is_muted?: boolean | null;
          user_id_1?: string | null;
          user_id_2?: string | null;
        };
        Update: {
          created_at?: string;
          id?: number;
          user_1_is_blocked?: boolean | null;
          user_1_is_muted?: boolean | null;
          user_2_is_blocked?: boolean | null;
          user_2_is_muted?: boolean | null;
          user_id_1?: string | null;
          user_id_2?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'User_Interactions_user_id_1_fkey';
            columns: ['user_id_1'];
            isOneToOne: false;
            referencedRelation: 'User_Information';
            referencedColumns: ['supabase_id'];
          },
          {
            foreignKeyName: 'User_Interactions_user_id_2_fkey';
            columns: ['user_id_2'];
            isOneToOne: false;
            referencedRelation: 'User_Information';
            referencedColumns: ['supabase_id'];
          },
        ];
      };
    };
    Views: {
      get_chat_messages_for_user: {
        Row: {
          created_at: string | null;
          first_name: string | null;
          last_name: string | null;
          logged_message: string | null;
        };
        Relationships: [];
      };
      get_chats_for_user: {
        Row: {
          created_at: string | null;
          first_name: string | null;
          last_message: string | null;
          last_name: string | null;
        };
        Relationships: [];
      };
      get_messages_for_user: {
        Row: {
          logged_message: string | null;
        };
        Relationships: [];
      };
    };
    Functions: {
      compare_verified_users: {
        Args: { user1: string; user2: string };
        Returns: boolean;
      };
      is_chat_visible_to_user: {
        Args: { chat_row: Database['public']['Tables']['Chats']['Row'] };
        Returns: boolean;
      };
      is_user_interaction_blocked: {
        Args: { user1: string; user2: string };
        Returns: boolean;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, '__InternalSupabase'>;

type DefaultSchema = DatabaseWithoutInternals[Extract<
  keyof Database,
  'public'
>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema['Tables'] &
        DefaultSchema['Views'])
    ? (DefaultSchema['Tables'] &
        DefaultSchema['Views'])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema['Enums']
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums'][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums']
    ? DefaultSchema['Enums'][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema['CompositeTypes']
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema['CompositeTypes']
    ? DefaultSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {},
  },
} as const;
