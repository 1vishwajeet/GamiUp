export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      contest_participants: {
        Row: {
          contest_id: string
          game_id: string | null
          id: string
          is_winner: boolean | null
          joined_at: string | null
          payment_id: string | null
          payment_status: string | null
          prize_amount: number | null
          result_screenshot: string | null
          score: number | null
          transaction_id: string | null
          user_id: string
        }
        Insert: {
          contest_id: string
          game_id?: string | null
          id?: string
          is_winner?: boolean | null
          joined_at?: string | null
          payment_id?: string | null
          payment_status?: string | null
          prize_amount?: number | null
          result_screenshot?: string | null
          score?: number | null
          transaction_id?: string | null
          user_id: string
        }
        Update: {
          contest_id?: string
          game_id?: string | null
          id?: string
          is_winner?: boolean | null
          joined_at?: string | null
          payment_id?: string | null
          payment_status?: string | null
          prize_amount?: number | null
          result_screenshot?: string | null
          score?: number | null
          transaction_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "contest_participants_contest_id_fkey"
            columns: ["contest_id"]
            isOneToOne: false
            referencedRelation: "contests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_contest_participants_contest_id"
            columns: ["contest_id"]
            isOneToOne: false
            referencedRelation: "contests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_contest_participants_user_id"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      contests: {
        Row: {
          created_at: string | null
          created_by: string | null
          description: string | null
          end_date: string
          entry_fee: number
          first_prize: number | null
          game: string
          id: string
          image_updated_at: string | null
          image_url: string | null
          max_participants: number
          prize_pool: number
          second_prize: number | null
          start_date: string
          status: string | null
          third_prize: number | null
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          end_date: string
          entry_fee: number
          first_prize?: number | null
          game: string
          id?: string
          image_updated_at?: string | null
          image_url?: string | null
          max_participants: number
          prize_pool: number
          second_prize?: number | null
          start_date: string
          status?: string | null
          third_prize?: number | null
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          end_date?: string
          entry_fee?: number
          first_prize?: number | null
          game?: string
          id?: string
          image_updated_at?: string | null
          image_url?: string | null
          max_participants?: number
          prize_pool?: number
          second_prize?: number | null
          start_date?: string
          status?: string | null
          third_prize?: number | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      contests_history: {
        Row: {
          created_at: string | null
          deleted_at: string | null
          description: string | null
          end_date: string
          entry_fee: number
          first_prize: number | null
          game: string
          id: string
          image_url: string | null
          max_participants: number
          participant_count: number | null
          prize_pool: number
          second_prize: number | null
          start_date: string
          status: string | null
          third_prize: number | null
          title: string
        }
        Insert: {
          created_at?: string | null
          deleted_at?: string | null
          description?: string | null
          end_date: string
          entry_fee: number
          first_prize?: number | null
          game: string
          id: string
          image_url?: string | null
          max_participants: number
          participant_count?: number | null
          prize_pool: number
          second_prize?: number | null
          start_date: string
          status?: string | null
          third_prize?: number | null
          title: string
        }
        Update: {
          created_at?: string | null
          deleted_at?: string | null
          description?: string | null
          end_date?: string
          entry_fee?: number
          first_prize?: number | null
          game?: string
          id?: string
          image_url?: string | null
          max_participants?: number
          participant_count?: number | null
          prize_pool?: number
          second_prize?: number | null
          start_date?: string
          status?: string | null
          third_prize?: number | null
          title?: string
        }
        Relationships: []
      }
      leaderboard: {
        Row: {
          games_won: number | null
          id: string
          rank: number | null
          total_winnings: number | null
          updated_at: string | null
          user_id: string
          win_rate: number | null
        }
        Insert: {
          games_won?: number | null
          id?: string
          rank?: number | null
          total_winnings?: number | null
          updated_at?: string | null
          user_id: string
          win_rate?: number | null
        }
        Update: {
          games_won?: number | null
          id?: string
          rank?: number | null
          total_winnings?: number | null
          updated_at?: string | null
          user_id?: string
          win_rate?: number | null
        }
        Relationships: []
      }
      payments: {
        Row: {
          amount: number
          contest_id: string
          created_at: string | null
          currency: string | null
          id: string
          participant_id: string | null
          razorpay_order_id: string | null
          razorpay_payment_id: string | null
          status: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          amount: number
          contest_id: string
          created_at?: string | null
          currency?: string | null
          id?: string
          participant_id?: string | null
          razorpay_order_id?: string | null
          razorpay_payment_id?: string | null
          status?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          contest_id?: string
          created_at?: string | null
          currency?: string | null
          id?: string
          participant_id?: string | null
          razorpay_order_id?: string | null
          razorpay_payment_id?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_payments_contest_id"
            columns: ["contest_id"]
            isOneToOne: false
            referencedRelation: "contests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_payments_user_id"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "payments_participant_id_fkey"
            columns: ["participant_id"]
            isOneToOne: false
            referencedRelation: "contest_participants"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          achievements: string[] | null
          avatar_url: string | null
          created_at: string | null
          email: string
          favorite_game: string | null
          games_played: number | null
          id: string
          name: string
          skill_level: string | null
          total_winnings: number | null
          updated_at: string | null
          user_id: string
          username: string | null
          wallet_balance: number | null
          whatsapp_number: string | null
        }
        Insert: {
          achievements?: string[] | null
          avatar_url?: string | null
          created_at?: string | null
          email: string
          favorite_game?: string | null
          games_played?: number | null
          id?: string
          name: string
          skill_level?: string | null
          total_winnings?: number | null
          updated_at?: string | null
          user_id: string
          username?: string | null
          wallet_balance?: number | null
          whatsapp_number?: string | null
        }
        Update: {
          achievements?: string[] | null
          avatar_url?: string | null
          created_at?: string | null
          email?: string
          favorite_game?: string | null
          games_played?: number | null
          id?: string
          name?: string
          skill_level?: string | null
          total_winnings?: number | null
          updated_at?: string | null
          user_id?: string
          username?: string | null
          wallet_balance?: number | null
          whatsapp_number?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["user_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      admin_delete_contest: {
        Args: { p_contest_id: string }
        Returns: Json
      }
      get_admin_contest_participants: {
        Args: Record<PropertyKey, never>
        Returns: {
          id: string
          user_id: string
          contest_id: string
          transaction_id: string
          payment_id: string
          payment_status: string
          joined_at: string
          score: number
          result_screenshot: string
          is_winner: boolean
          prize_amount: number
          game_id: string
        }[]
      }
      get_admin_contests: {
        Args: { contest_ids: string[] }
        Returns: {
          id: string
          title: string
          game: string
          entry_fee: number
        }[]
      }
      get_admin_contests_full: {
        Args: Record<PropertyKey, never>
        Returns: {
          id: string
          title: string
          description: string
          game: string
          entry_fee: number
          prize_pool: number
          first_prize: number
          second_prize: number
          third_prize: number
          max_participants: number
          start_date: string
          end_date: string
          status: string
          image_url: string
          created_at: string
          created_by: string
          participant_count: number
        }[]
      }
      get_admin_dashboard_stats: {
        Args: Record<PropertyKey, never>
        Returns: {
          total_users: number
          total_contests: number
          active_contests: number
          total_entries: number
          new_users_today: number
          contests_created_today: number
          payments_processed_today: number
        }[]
      }
      get_admin_profiles: {
        Args: { user_ids: string[] }
        Returns: {
          user_id: string
          name: string
          whatsapp_number: string
        }[]
      }
      get_admin_users_full: {
        Args: Record<PropertyKey, never>
        Returns: {
          id: string
          user_id: string
          name: string
          email: string
          username: string
          whatsapp_number: string
          wallet_balance: number
          games_played: number
          total_winnings: number
          favorite_game: string
          skill_level: string
          achievements: string[]
          created_at: string
          updated_at: string
        }[]
      }
      get_admin_winner_submissions: {
        Args: Record<PropertyKey, never>
        Returns: {
          id: string
          user_id: string
          contest_id: string
          score: number
          result_screenshot: string
          is_winner: boolean
          prize_amount: number
          joined_at: string
          user_name: string
          contest_title: string
          first_prize: number
          second_prize: number
          third_prize: number
        }[]
      }
      has_role: {
        Args: {
          _user_id: string
          _role: Database["public"]["Enums"]["user_role"]
        }
        Returns: boolean
      }
    }
    Enums: {
      user_role: "admin" | "user"
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
    Enums: {
      user_role: ["admin", "user"],
    },
  },
} as const
