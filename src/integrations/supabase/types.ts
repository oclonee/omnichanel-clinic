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
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      channels: {
        Row: {
          config: Json | null
          created_at: string
          id: string
          is_active: boolean | null
          name: string
          type: Database["public"]["Enums"]["channel_type"]
          updated_at: string
        }
        Insert: {
          config?: Json | null
          created_at?: string
          id?: string
          is_active?: boolean | null
          name: string
          type: Database["public"]["Enums"]["channel_type"]
          updated_at?: string
        }
        Update: {
          config?: Json | null
          created_at?: string
          id?: string
          is_active?: boolean | null
          name?: string
          type?: Database["public"]["Enums"]["channel_type"]
          updated_at?: string
        }
        Relationships: []
      }
      conversations: {
        Row: {
          assigned_agent_id: string | null
          channel_id: string | null
          created_at: string
          id: string
          last_message_at: string | null
          patient_id: string | null
          priority: number | null
          status: Database["public"]["Enums"]["conversation_status"] | null
          subject: string | null
          updated_at: string
        }
        Insert: {
          assigned_agent_id?: string | null
          channel_id?: string | null
          created_at?: string
          id?: string
          last_message_at?: string | null
          patient_id?: string | null
          priority?: number | null
          status?: Database["public"]["Enums"]["conversation_status"] | null
          subject?: string | null
          updated_at?: string
        }
        Update: {
          assigned_agent_id?: string | null
          channel_id?: string | null
          created_at?: string
          id?: string
          last_message_at?: string | null
          patient_id?: string | null
          priority?: number | null
          status?: Database["public"]["Enums"]["conversation_status"] | null
          subject?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "conversations_assigned_agent_id_fkey"
            columns: ["assigned_agent_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversations_channel_id_fkey"
            columns: ["channel_id"]
            isOneToOne: false
            referencedRelation: "channels"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversations_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          content: string
          conversation_id: string | null
          created_at: string
          external_id: string | null
          id: string
          is_read: boolean | null
          message_type: Database["public"]["Enums"]["message_type"] | null
          metadata: Json | null
          patient_id: string | null
          sender_id: string | null
        }
        Insert: {
          content: string
          conversation_id?: string | null
          created_at?: string
          external_id?: string | null
          id?: string
          is_read?: boolean | null
          message_type?: Database["public"]["Enums"]["message_type"] | null
          metadata?: Json | null
          patient_id?: string | null
          sender_id?: string | null
        }
        Update: {
          content?: string
          conversation_id?: string | null
          created_at?: string
          external_id?: string | null
          id?: string
          is_read?: boolean | null
          message_type?: Database["public"]["Enums"]["message_type"] | null
          metadata?: Json | null
          patient_id?: string | null
          sender_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      patients: {
        Row: {
          address: string | null
          birth_date: string | null
          cpf: string | null
          created_at: string
          email: string | null
          id: string
          name: string
          notes: string | null
          phone: string | null
          status: Database["public"]["Enums"]["patient_status"] | null
          updated_at: string
        }
        Insert: {
          address?: string | null
          birth_date?: string | null
          cpf?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name: string
          notes?: string | null
          phone?: string | null
          status?: Database["public"]["Enums"]["patient_status"] | null
          updated_at?: string
        }
        Update: {
          address?: string | null
          birth_date?: string | null
          cpf?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name?: string
          notes?: string | null
          phone?: string | null
          status?: Database["public"]["Enums"]["patient_status"] | null
          updated_at?: string
        }
        Relationships: []
      }
      performance_metrics: {
        Row: {
          agent_id: string | null
          average_response_time: unknown | null
          created_at: string
          date: string
          id: string
          rating_count: number | null
          rating_sum: number | null
          resolved_conversations: number | null
          total_conversations: number | null
          total_messages: number | null
          updated_at: string
        }
        Insert: {
          agent_id?: string | null
          average_response_time?: unknown | null
          created_at?: string
          date?: string
          id?: string
          rating_count?: number | null
          rating_sum?: number | null
          resolved_conversations?: number | null
          total_conversations?: number | null
          total_messages?: number | null
          updated_at?: string
        }
        Update: {
          agent_id?: string | null
          average_response_time?: unknown | null
          created_at?: string
          date?: string
          id?: string
          rating_count?: number | null
          rating_sum?: number | null
          resolved_conversations?: number | null
          total_conversations?: number | null
          total_messages?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "performance_metrics_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string
          id: string
          is_online: boolean | null
          last_activity: string | null
          name: string
          phone: string | null
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email: string
          id: string
          is_online?: boolean | null
          last_activity?: string | null
          name: string
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string
          id?: string
          is_online?: boolean | null
          last_activity?: string | null
          name?: string
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Relationships: []
      }
      quick_responses: {
        Row: {
          content: string
          created_at: string
          created_by: string | null
          id: string
          is_global: boolean | null
          title: string
          updated_at: string
        }
        Insert: {
          content: string
          created_at?: string
          created_by?: string | null
          id?: string
          is_global?: boolean | null
          title: string
          updated_at?: string
        }
        Update: {
          content?: string
          created_at?: string
          created_by?: string | null
          id?: string
          is_global?: boolean | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "quick_responses_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_role: {
        Args: { user_id: string }
        Returns: Database["public"]["Enums"]["user_role"]
      }
    }
    Enums: {
      channel_type:
        | "whatsapp"
        | "instagram"
        | "facebook"
        | "email"
        | "telefone"
        | "site"
      conversation_status: "ativo" | "pendente" | "resolvido" | "encerrado"
      message_type: "texto" | "audio" | "imagem" | "documento" | "video"
      patient_status: "ativo" | "inativo" | "bloqueado"
      user_role: "atendente" | "gerente" | "admin"
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
      channel_type: [
        "whatsapp",
        "instagram",
        "facebook",
        "email",
        "telefone",
        "site",
      ],
      conversation_status: ["ativo", "pendente", "resolvido", "encerrado"],
      message_type: ["texto", "audio", "imagem", "documento", "video"],
      patient_status: ["ativo", "inativo", "bloqueado"],
      user_role: ["atendente", "gerente", "admin"],
    },
  },
} as const
