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
      profiles: {
        Row: {
          id: string;
          full_name: string;
          email: string;
          is_pro: boolean;
          xp_points: number;
          streak_days: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          full_name: string;
          email: string;
          is_pro?: boolean;
          xp_points?: number;
          streak_days?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string;
          email?: string;
          is_pro?: boolean;
          xp_points?: number;
          streak_days?: number;
          created_at?: string;
        };
        Relationships: [];
      };
      pending_payments: {
        Row: {
          id: string;
          student_name: string;
          method: string;
          amount: string;
          reference: string;
          status: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          student_name: string;
          method: string;
          amount: string;
          reference: string;
          status?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          student_name?: string;
          method?: string;
          amount?: string;
          reference?: string;
          status?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      exam_questions: {
        Row: {
          id: string;
          area: string;
          question_text: string;
          options: Json;
          correct_option: string;
          explanation: string;
        };
        Insert: {
          id?: string;
          area: string;
          question_text: string;
          options: Json;
          correct_option: string;
          explanation: string;
        };
        Update: {
          id?: string;
          area?: string;
          question_text?: string;
          options?: Json;
          correct_option?: string;
          explanation?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};
