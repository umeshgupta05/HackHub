export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      hackathon_comments: {
        Row: {
          comment: string
          created_at: string | null
          hackathon_id: string | null
          id: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          comment: string
          created_at?: string | null
          hackathon_id?: string | null
          id?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          comment?: string
          created_at?: string | null
          hackathon_id?: string | null
          id?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "hackathon_comments_hackathon_id_fkey"
            columns: ["hackathon_id"]
            isOneToOne: false
            referencedRelation: "hackathons"
            referencedColumns: ["id"]
          },
        ]
      }
      hackathons: {
        Row: {
          college_name: string | null
          coordinator_email: string | null
          coordinator_name: string | null
          coordinator_phone: string | null
          created_at: string | null
          created_by: string | null
          current_participants: number | null
          date: string
          description: string
          eligibility_criteria: string | null
          id: string
          image_url: string | null
          location: string
          max_participants: number
          name: string
          prize_pool: number | null
          registration_deadline: string | null
          rules: string | null
          skill_level: string | null
          status: string
          team_size_max: number | null
          team_size_min: number | null
          technologies: string[] | null
          updated_at: string | null
          website_url: string | null
        }
        Insert: {
          college_name?: string | null
          coordinator_email?: string | null
          coordinator_name?: string | null
          coordinator_phone?: string | null
          created_at?: string | null
          created_by?: string | null
          current_participants?: number | null
          date: string
          description: string
          eligibility_criteria?: string | null
          id?: string
          image_url?: string | null
          location: string
          max_participants: number
          name: string
          prize_pool?: number | null
          registration_deadline?: string | null
          rules?: string | null
          skill_level?: string | null
          status?: string
          team_size_max?: number | null
          team_size_min?: number | null
          technologies?: string[] | null
          updated_at?: string | null
          website_url?: string | null
        }
        Update: {
          college_name?: string | null
          coordinator_email?: string | null
          coordinator_name?: string | null
          coordinator_phone?: string | null
          created_at?: string | null
          created_by?: string | null
          current_participants?: number | null
          date?: string
          description?: string
          eligibility_criteria?: string | null
          id?: string
          image_url?: string | null
          location?: string
          max_participants?: number
          name?: string
          prize_pool?: number | null
          registration_deadline?: string | null
          rules?: string | null
          skill_level?: string | null
          status?: string
          team_size_max?: number | null
          team_size_min?: number | null
          technologies?: string[] | null
          updated_at?: string | null
          website_url?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          full_name: string | null
          id: string
          updated_at: string | null
        }
        Insert: {
          full_name?: string | null
          id: string
          updated_at?: string | null
        }
        Update: {
          full_name?: string | null
          id?: string
          updated_at?: string | null
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

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
