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
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      contest_participants: {
        Row: {
          additional_notes: string | null
          contest_id: string
          contest_name: string | null
          expected_prize_amount: number | null
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
          additional_notes?: string | null
          contest_id: string
          contest_name?: string | null
          expected_prize_amount?: number | null
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
          additional_notes?: string | null
          contest_id?: string
          contest_name?: string | null
          expected_prize_amount?: number | null
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
      custom_contest_payments: {
        Row: {
          amount: number
          cashfree_order_id: string | null
          cashfree_payment_id: string | null
          contest_id: string | null
          created_at: string | null
          currency: string | null
          id: string
          status: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          amount: number
          cashfree_order_id?: string | null
          cashfree_payment_id?: string | null
          contest_id?: string | null
          created_at?: string | null
          currency?: string | null
          id?: string
          status?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          cashfree_order_id?: string | null
          cashfree_payment_id?: string | null
          contest_id?: string | null
          created_at?: string | null
          currency?: string | null
          id?: string
          status?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "custom_contest_payments_contest_id_fkey"
            columns: ["contest_id"]
            isOneToOne: false
            referencedRelation: "contests"
            referencedColumns: ["id"]
          },
        ]
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
          cashfree_order_id: string | null
          cashfree_payment_id: string | null
          contest_id: string
          created_at: string | null
          currency: string | null
          id: string
          participant_id: string | null
          status: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          amount: number
          cashfree_order_id?: string | null
          cashfree_payment_id?: string | null
          contest_id: string
          created_at?: string | null
          currency?: string | null
          id?: string
          participant_id?: string | null
          status?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          cashfree_order_id?: string | null
          cashfree_payment_id?: string | null
          contest_id?: string
          created_at?: string | null
          currency?: string | null
          id?: string
          participant_id?: string | null
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
      winner_submissions: {
        Row: {
          additional_notes: string | null
          contest_name: string
          expected_prize_amount: number
          id: string
          result_screenshot: string | null
          status: string | null
          submitted_at: string
          user_id: string
        }
        Insert: {
          additional_notes?: string | null
          contest_name: string
          expected_prize_amount: number
          id?: string
          result_screenshot?: string | null
          status?: string | null
          submitted_at?: string
          user_id: string
        }
        Update: {
          additional_notes?: string | null
          contest_name?: string
          expected_prize_amount?: number
          id?: string
          result_screenshot?: string | null
          status?: string | null
          submitted_at?: string
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
      admin_delete_winner_submission: {
        Args: { submission_id: string }
        Returns: Json
      }
      get_admin_contest_participants: {
        Args: Record<PropertyKey, never>
        Returns: {
          contest_id: string
          game_id: string
          id: string
          is_winner: boolean
          joined_at: string
          payment_id: string
          payment_status: string
          prize_amount: number
          result_screenshot: string
          score: number
          transaction_id: string
          user_id: string
        }[]
      }
      get_admin_contests: {
        Args: { contest_ids: string[] }
        Returns: {
          entry_fee: number
          game: string
          id: string
          title: string
        }[]
      }
      get_admin_contests_full: {
        Args: Record<PropertyKey, never>
        Returns: {
          created_at: string
          created_by: string
          description: string
          end_date: string
          entry_fee: number
          first_prize: number
          game: string
          id: string
          image_url: string
          max_participants: number
          participant_count: number
          prize_pool: number
          second_prize: number
          start_date: string
          status: string
          third_prize: number
          title: string
        }[]
      }
      get_admin_custom_challenges: {
        Args: Record<PropertyKey, never>
        Returns: {
          challenge_type: string
          created_at: string
          created_by: string
          creator_contact: string
          creator_name: string
          description: string
          end_date: string
          entry_fee: number
          first_prize: number
          game: string
          id: string
          max_participants: number
          participant_count: number
          payment_status: string
          second_prize: number
          start_date: string
          status: string
          third_prize: number
          title: string
        }[]
      }
      get_admin_dashboard_stats: {
        Args: Record<PropertyKey, never>
        Returns: {
          active_contests: number
          contests_created_today: number
          new_users_today: number
          payments_processed_today: number
          total_contests: number
          total_entries: number
          total_users: number
        }[]
      }
      get_admin_profiles: {
        Args: { user_ids: string[] }
        Returns: {
          name: string
          user_id: string
          whatsapp_number: string
        }[]
      }
      get_admin_users_full: {
        Args: Record<PropertyKey, never>
        Returns: {
          achievements: string[]
          created_at: string
          email: string
          favorite_game: string
          games_played: number
          id: string
          name: string
          skill_level: string
          total_winnings: number
          updated_at: string
          user_id: string
          username: string
          wallet_balance: number
          whatsapp_number: string
        }[]
      }
      get_admin_winner_submissions: {
        Args: Record<PropertyKey, never>
        Returns: {
          additional_notes: string
          contest_id: string
          contest_name: string
          contest_title: string
          expected_prize_amount: number
          first_prize: number
          id: string
          is_winner: boolean
          joined_at: string
          prize_amount: number
          result_screenshot: string
          score: number
          second_prize: number
          third_prize: number
          user_id: string
          user_name: string
        }[]
      }
      get_custom_challenge_participants: {
        Args: { challenge_id: string }
        Returns: {
          contest_id: string
          game_id: string
          id: string
          is_winner: boolean
          joined_at: string
          payment_id: string
          payment_status: string
          prize_amount: number
          result_screenshot: string
          score: number
          transaction_id: string
          user_contact: string
          user_id: string
          user_name: string
        }[]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["user_role"]
          _user_id: string
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
