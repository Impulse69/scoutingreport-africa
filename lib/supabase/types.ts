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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      competitions: {
        Row: {
          country_code: string | null
          created_at: string
          id: string
          logo_url: string | null
          name: string
          type: Database["public"]["Enums"]["competition_type"]
        }
        Insert: {
          country_code?: string | null
          created_at?: string
          id?: string
          logo_url?: string | null
          name: string
          type: Database["public"]["Enums"]["competition_type"]
        }
        Update: {
          country_code?: string | null
          created_at?: string
          id?: string
          logo_url?: string | null
          name?: string
          type?: Database["public"]["Enums"]["competition_type"]
        }
        Relationships: [
          {
            foreignKeyName: "competitions_country_code_fkey"
            columns: ["country_code"]
            isOneToOne: false
            referencedRelation: "countries"
            referencedColumns: ["code"]
          },
        ]
      }
      countries: {
        Row: {
          code: string
          flag_emoji: string | null
          name: string
        }
        Insert: {
          code: string
          flag_emoji?: string | null
          name: string
        }
        Update: {
          code?: string
          flag_emoji?: string | null
          name?: string
        }
        Relationships: []
      }
      organisations: {
        Row: {
          created_at: string
          id: string
          logo_url: string | null
          name: string
        }
        Insert: {
          created_at?: string
          id?: string
          logo_url?: string | null
          name: string
        }
        Update: {
          created_at?: string
          id?: string
          logo_url?: string | null
          name?: string
        }
        Relationships: []
      }
      players: {
        Row: {
          bio: string | null
          common_name: string | null
          created_at: string
          created_by: string | null
          current_club: string | null
          current_competition_id: string | null
          date_of_birth: string
          full_name: string
          height_cm: number | null
          id: string
          nationality_code: string
          photo_url: string | null
          preferred_foot: Database["public"]["Enums"]["preferred_foot"]
          primary_position_code: string
          secondary_position_codes: string[]
          slug: string
          status: Database["public"]["Enums"]["player_status"]
          updated_at: string
          weight_kg: number | null
        }
        Insert: {
          bio?: string | null
          common_name?: string | null
          created_at?: string
          created_by?: string | null
          current_club?: string | null
          current_competition_id?: string | null
          date_of_birth: string
          full_name: string
          height_cm?: number | null
          id?: string
          nationality_code: string
          photo_url?: string | null
          preferred_foot?: Database["public"]["Enums"]["preferred_foot"]
          primary_position_code: string
          secondary_position_codes?: string[]
          slug: string
          status?: Database["public"]["Enums"]["player_status"]
          updated_at?: string
          weight_kg?: number | null
        }
        Update: {
          bio?: string | null
          common_name?: string | null
          created_at?: string
          created_by?: string | null
          current_club?: string | null
          current_competition_id?: string | null
          date_of_birth?: string
          full_name?: string
          height_cm?: number | null
          id?: string
          nationality_code?: string
          photo_url?: string | null
          preferred_foot?: Database["public"]["Enums"]["preferred_foot"]
          primary_position_code?: string
          secondary_position_codes?: string[]
          slug?: string
          status?: Database["public"]["Enums"]["player_status"]
          updated_at?: string
          weight_kg?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "players_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "players_current_competition_id_fkey"
            columns: ["current_competition_id"]
            isOneToOne: false
            referencedRelation: "competitions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "players_nationality_code_fkey"
            columns: ["nationality_code"]
            isOneToOne: false
            referencedRelation: "countries"
            referencedColumns: ["code"]
          },
          {
            foreignKeyName: "players_primary_position_code_fkey"
            columns: ["primary_position_code"]
            isOneToOne: false
            referencedRelation: "positions"
            referencedColumns: ["code"]
          },
        ]
      }
      positions: {
        Row: {
          code: string
          group: Database["public"]["Enums"]["position_group"]
          name: string
        }
        Insert: {
          code: string
          group: Database["public"]["Enums"]["position_group"]
          name: string
        }
        Update: {
          code?: string
          group?: Database["public"]["Enums"]["position_group"]
          name?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          display_name: string | null
          email: string | null
          id: string
          organisation_id: string | null
          role: Database["public"]["Enums"]["profile_role"]
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          display_name?: string | null
          email?: string | null
          id: string
          organisation_id?: string | null
          role?: Database["public"]["Enums"]["profile_role"]
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          display_name?: string | null
          email?: string | null
          id?: string
          organisation_id?: string | null
          role?: Database["public"]["Enums"]["profile_role"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_organisation_id_fkey"
            columns: ["organisation_id"]
            isOneToOne: false
            referencedRelation: "organisations"
            referencedColumns: ["id"]
          },
        ]
      }
      scout_invites: {
        Row: {
          accepted_at: string | null
          created_at: string
          email: string
          expires_at: string
          id: string
          invited_by: string | null
          token: string
        }
        Insert: {
          accepted_at?: string | null
          created_at?: string
          email: string
          expires_at?: string
          id?: string
          invited_by?: string | null
          token: string
        }
        Update: {
          accepted_at?: string | null
          created_at?: string
          email?: string
          expires_at?: string
          id?: string
          invited_by?: string | null
          token?: string
        }
        Relationships: [
          {
            foreignKeyName: "scout_invites_invited_by_fkey"
            columns: ["invited_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      scout_report_ratings: {
        Row: {
          category: Database["public"]["Enums"]["rating_category"]
          id: string
          notes: string | null
          rating: number
          report_id: string
          sub_area: string
        }
        Insert: {
          category: Database["public"]["Enums"]["rating_category"]
          id?: string
          notes?: string | null
          rating: number
          report_id: string
          sub_area: string
        }
        Update: {
          category?: Database["public"]["Enums"]["rating_category"]
          id?: string
          notes?: string | null
          rating?: number
          report_id?: string
          sub_area?: string
        }
        Relationships: [
          {
            foreignKeyName: "scout_report_ratings_report_id_fkey"
            columns: ["report_id"]
            isOneToOne: false
            referencedRelation: "scout_reports"
            referencedColumns: ["id"]
          },
        ]
      }
      scout_reports: {
        Row: {
          author_id: string
          competition_id: string | null
          created_at: string
          id: string
          improvements: Json
          match_date: string | null
          match_description: string | null
          minutes_observed: number | null
          observation_type: Database["public"]["Enums"]["observation_type"]
          player_id: string
          projection: string | null
          published_at: string | null
          recommendation_notes: string | null
          recommended_level:
            | Database["public"]["Enums"]["recommended_level"]
            | null
          recruitment_decision:
            | Database["public"]["Enums"]["recruitment_decision"]
            | null
          role_fit: string | null
          role_observed_code: string | null
          scout_notes: string | null
          status: Database["public"]["Enums"]["report_status"]
          strengths: Json
          updated_at: string
        }
        Insert: {
          author_id: string
          competition_id?: string | null
          created_at?: string
          id?: string
          improvements?: Json
          match_date?: string | null
          match_description?: string | null
          minutes_observed?: number | null
          observation_type?: Database["public"]["Enums"]["observation_type"]
          player_id: string
          projection?: string | null
          published_at?: string | null
          recommendation_notes?: string | null
          recommended_level?:
            | Database["public"]["Enums"]["recommended_level"]
            | null
          recruitment_decision?:
            | Database["public"]["Enums"]["recruitment_decision"]
            | null
          role_fit?: string | null
          role_observed_code?: string | null
          scout_notes?: string | null
          status?: Database["public"]["Enums"]["report_status"]
          strengths?: Json
          updated_at?: string
        }
        Update: {
          author_id?: string
          competition_id?: string | null
          created_at?: string
          id?: string
          improvements?: Json
          match_date?: string | null
          match_description?: string | null
          minutes_observed?: number | null
          observation_type?: Database["public"]["Enums"]["observation_type"]
          player_id?: string
          projection?: string | null
          published_at?: string | null
          recommendation_notes?: string | null
          recommended_level?:
            | Database["public"]["Enums"]["recommended_level"]
            | null
          recruitment_decision?:
            | Database["public"]["Enums"]["recruitment_decision"]
            | null
          role_fit?: string | null
          role_observed_code?: string | null
          scout_notes?: string | null
          status?: Database["public"]["Enums"]["report_status"]
          strengths?: Json
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "scout_reports_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "scout_reports_competition_id_fkey"
            columns: ["competition_id"]
            isOneToOne: false
            referencedRelation: "competitions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "scout_reports_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "scout_reports_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "players_public"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "scout_reports_role_observed_code_fkey"
            columns: ["role_observed_code"]
            isOneToOne: false
            referencedRelation: "positions"
            referencedColumns: ["code"]
          },
        ]
      }
      watchlist_players: {
        Row: {
          added_at: string
          note: string | null
          player_id: string
          watchlist_id: string
        }
        Insert: {
          added_at?: string
          note?: string | null
          player_id: string
          watchlist_id: string
        }
        Update: {
          added_at?: string
          note?: string | null
          player_id?: string
          watchlist_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "watchlist_players_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "watchlist_players_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "players_public"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "watchlist_players_watchlist_id_fkey"
            columns: ["watchlist_id"]
            isOneToOne: false
            referencedRelation: "watchlists"
            referencedColumns: ["id"]
          },
        ]
      }
      watchlists: {
        Row: {
          created_at: string
          id: string
          name: string
          owner_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          owner_id: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          owner_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "watchlists_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      player_category_ratings: {
        Row: {
          avg_rating: number | null
          category: Database["public"]["Enums"]["rating_category"] | null
          player_id: string | null
          report_count: number | null
        }
        Relationships: [
          {
            foreignKeyName: "scout_reports_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "scout_reports_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "players_public"
            referencedColumns: ["id"]
          },
        ]
      }
      players_public: {
        Row: {
          bio: string | null
          common_name: string | null
          created_at: string | null
          created_by: string | null
          current_club: string | null
          current_competition_id: string | null
          date_of_birth: string | null
          full_name: string | null
          height_cm: number | null
          id: string | null
          last_report_at: string | null
          nationality_code: string | null
          photo_url: string | null
          preferred_foot: Database["public"]["Enums"]["preferred_foot"] | null
          primary_position_code: string | null
          published_report_count: number | null
          secondary_position_codes: string[] | null
          slug: string | null
          status: Database["public"]["Enums"]["player_status"] | null
          updated_at: string | null
          weight_kg: number | null
        }
        Insert: {
          bio?: string | null
          common_name?: string | null
          created_at?: string | null
          created_by?: string | null
          current_club?: string | null
          current_competition_id?: string | null
          date_of_birth?: string | null
          full_name?: string | null
          height_cm?: number | null
          id?: string | null
          last_report_at?: never
          nationality_code?: string | null
          photo_url?: string | null
          preferred_foot?: Database["public"]["Enums"]["preferred_foot"] | null
          primary_position_code?: string | null
          published_report_count?: never
          secondary_position_codes?: string[] | null
          slug?: string | null
          status?: Database["public"]["Enums"]["player_status"] | null
          updated_at?: string | null
          weight_kg?: number | null
        }
        Update: {
          bio?: string | null
          common_name?: string | null
          created_at?: string | null
          created_by?: string | null
          current_club?: string | null
          current_competition_id?: string | null
          date_of_birth?: string | null
          full_name?: string | null
          height_cm?: number | null
          id?: string | null
          last_report_at?: never
          nationality_code?: string | null
          photo_url?: string | null
          preferred_foot?: Database["public"]["Enums"]["preferred_foot"] | null
          primary_position_code?: string | null
          published_report_count?: never
          secondary_position_codes?: string[] | null
          slug?: string | null
          status?: Database["public"]["Enums"]["player_status"] | null
          updated_at?: string | null
          weight_kg?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "players_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "players_current_competition_id_fkey"
            columns: ["current_competition_id"]
            isOneToOne: false
            referencedRelation: "competitions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "players_nationality_code_fkey"
            columns: ["nationality_code"]
            isOneToOne: false
            referencedRelation: "countries"
            referencedColumns: ["code"]
          },
          {
            foreignKeyName: "players_primary_position_code_fkey"
            columns: ["primary_position_code"]
            isOneToOne: false
            referencedRelation: "positions"
            referencedColumns: ["code"]
          },
        ]
      }
    }
    Functions: {
      current_app_role: {
        Args: never
        Returns: Database["public"]["Enums"]["profile_role"]
      }
      custom_access_token_hook: { Args: { event: Json }; Returns: Json }
      refresh_player_category_ratings: { Args: never; Returns: undefined }
      show_limit: { Args: never; Returns: number }
      show_trgm: { Args: { "": string }; Returns: string[] }
    }
    Enums: {
      competition_type:
        | "continental_club"
        | "national_team"
        | "domestic"
        | "youth"
        | "academy"
        | "friendly"
      observation_type: "live" | "video" | "mixed"
      player_status: "draft" | "published"
      position_group: "GK" | "DEF" | "MID" | "FWD"
      preferred_foot: "left" | "right" | "both" | "unknown"
      profile_role: "user" | "scout" | "admin"
      rating_category: "technical" | "tactical" | "physical" | "mentality"
      recommended_level:
        | "academy"
        | "reserves"
        | "senior_domestic"
        | "senior_continental"
        | "senior_european"
        | "international"
      recruitment_decision: "sign_now" | "monitor" | "pass" | "revisit"
      report_status: "draft" | "pending_review" | "published"
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
      competition_type: [
        "continental_club",
        "national_team",
        "domestic",
        "youth",
        "academy",
        "friendly",
      ],
      observation_type: ["live", "video", "mixed"],
      player_status: ["draft", "published"],
      position_group: ["GK", "DEF", "MID", "FWD"],
      preferred_foot: ["left", "right", "both", "unknown"],
      profile_role: ["user", "scout", "admin"],
      rating_category: ["technical", "tactical", "physical", "mentality"],
      recommended_level: [
        "academy",
        "reserves",
        "senior_domestic",
        "senior_continental",
        "senior_european",
        "international",
      ],
      recruitment_decision: ["sign_now", "monitor", "pass", "revisit"],
      report_status: ["draft", "pending_review", "published"],
    },
  },
} as const
