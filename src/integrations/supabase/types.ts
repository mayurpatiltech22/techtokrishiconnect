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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      cart_items: {
        Row: {
          created_at: string | null
          id: string
          product_id: string
          quantity: number | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          product_id: string
          quantity?: number | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          product_id?: string
          quantity?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "cart_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          image_url: string | null
          name: string
          slug: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          name: string
          slug: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          name?: string
          slug?: string
        }
        Relationships: []
      }
      equipment: {
        Row: {
          category: string | null
          created_at: string | null
          description: string | null
          district: string | null
          id: string
          image_url: string | null
          is_available: boolean | null
          location: string | null
          name: string
          owner_id: string | null
          price_per_day: number
          specifications: string[] | null
          updated_at: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          district?: string | null
          id?: string
          image_url?: string | null
          is_available?: boolean | null
          location?: string | null
          name: string
          owner_id?: string | null
          price_per_day: number
          specifications?: string[] | null
          updated_at?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          district?: string | null
          id?: string
          image_url?: string | null
          is_available?: boolean | null
          location?: string | null
          name?: string
          owner_id?: string | null
          price_per_day?: number
          specifications?: string[] | null
          updated_at?: string | null
        }
        Relationships: []
      }
      equipment_bookings: {
        Row: {
          created_at: string | null
          delivery_address: string | null
          end_date: string
          equipment_id: string
          id: string
          notes: string | null
          renter_id: string
          renter_phone: string | null
          start_date: string
          status: string | null
          total_amount: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          delivery_address?: string | null
          end_date: string
          equipment_id: string
          id?: string
          notes?: string | null
          renter_id: string
          renter_phone?: string | null
          start_date: string
          status?: string | null
          total_amount?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          delivery_address?: string | null
          end_date?: string
          equipment_id?: string
          id?: string
          notes?: string | null
          renter_id?: string
          renter_phone?: string | null
          start_date?: string
          status?: string | null
          total_amount?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "equipment_bookings_equipment_id_fkey"
            columns: ["equipment_id"]
            isOneToOne: false
            referencedRelation: "equipment"
            referencedColumns: ["id"]
          },
        ]
      }
      labor_bookings: {
        Row: {
          created_at: string | null
          end_date: string
          farmer_id: string
          farmer_phone: string | null
          id: string
          labor_group_id: string
          location: string | null
          start_date: string
          status: string | null
          total_amount: number | null
          total_workers: number | null
          updated_at: string | null
          work_description: string | null
        }
        Insert: {
          created_at?: string | null
          end_date: string
          farmer_id: string
          farmer_phone?: string | null
          id?: string
          labor_group_id: string
          location?: string | null
          start_date: string
          status?: string | null
          total_amount?: number | null
          total_workers?: number | null
          updated_at?: string | null
          work_description?: string | null
        }
        Update: {
          created_at?: string | null
          end_date?: string
          farmer_id?: string
          farmer_phone?: string | null
          id?: string
          labor_group_id?: string
          location?: string | null
          start_date?: string
          status?: string | null
          total_amount?: number | null
          total_workers?: number | null
          updated_at?: string | null
          work_description?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "labor_bookings_labor_group_id_fkey"
            columns: ["labor_group_id"]
            isOneToOne: false
            referencedRelation: "labor_groups"
            referencedColumns: ["id"]
          },
        ]
      }
      labor_groups: {
        Row: {
          created_at: string | null
          daily_rate: number | null
          description: string | null
          district: string | null
          id: string
          image_url: string | null
          is_available: boolean | null
          leader_id: string
          member_count: number | null
          name: string
          rating: number | null
          skills: string[] | null
          taluka: string | null
          total_reviews: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          daily_rate?: number | null
          description?: string | null
          district?: string | null
          id?: string
          image_url?: string | null
          is_available?: boolean | null
          leader_id: string
          member_count?: number | null
          name: string
          rating?: number | null
          skills?: string[] | null
          taluka?: string | null
          total_reviews?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          daily_rate?: number | null
          description?: string | null
          district?: string | null
          id?: string
          image_url?: string | null
          is_available?: boolean | null
          leader_id?: string
          member_count?: number | null
          name?: string
          rating?: number | null
          skills?: string[] | null
          taluka?: string | null
          total_reviews?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      market_prices: {
        Row: {
          created_at: string
          crop_name: string
          district: string
          id: string
          market_name: string
          price: number
          recorded_at: string
          unit: string | null
        }
        Insert: {
          created_at?: string
          crop_name: string
          district: string
          id?: string
          market_name: string
          price: number
          recorded_at?: string
          unit?: string | null
        }
        Update: {
          created_at?: string
          crop_name?: string
          district?: string
          id?: string
          market_name?: string
          price?: number
          recorded_at?: string
          unit?: string | null
        }
        Relationships: []
      }
      order_items: {
        Row: {
          created_at: string | null
          id: string
          order_id: string
          price: number
          product_id: string
          quantity: number
        }
        Insert: {
          created_at?: string | null
          id?: string
          order_id: string
          price: number
          product_id: string
          quantity: number
        }
        Update: {
          created_at?: string | null
          id?: string
          order_id?: string
          price?: number
          product_id?: string
          quantity?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          created_at: string | null
          id: string
          phone: string | null
          shipping_address: string | null
          status: string | null
          total_amount: number
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          phone?: string | null
          shipping_address?: string | null
          status?: string | null
          total_amount: number
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          phone?: string | null
          shipping_address?: string | null
          status?: string | null
          total_amount?: number
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      products: {
        Row: {
          category_id: string | null
          company: string | null
          created_at: string | null
          description: string | null
          id: string
          image_url: string | null
          is_active: boolean | null
          name: string
          price: number
          stock: number | null
          unit: string | null
          updated_at: string | null
        }
        Insert: {
          category_id?: string | null
          company?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          name: string
          price: number
          stock?: number | null
          unit?: string | null
          updated_at?: string | null
        }
        Update: {
          category_id?: string | null
          company?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          name?: string
          price?: number
          stock?: number | null
          unit?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          district: string | null
          full_name: string | null
          id: string
          phone: string | null
          updated_at: string | null
          user_id: string
          user_type: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          district?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string | null
          user_id: string
          user_type?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          district?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string | null
          user_id?: string
          user_type?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
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

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

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
  public: {
    Enums: {},
  },
} as const
