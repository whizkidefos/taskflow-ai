export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      events: {
        Row: {
          id: string
          created_at: string
          title: string
          description: string | null
          user_id: string
          date: string
          time: string | null
          type: 'task' | 'meeting' | 'reminder'
          completed_at: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          title: string
          description?: string | null
          user_id: string
          date: string
          time?: string | null
          type?: 'task' | 'meeting' | 'reminder'
          completed_at?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          title?: string
          description?: string | null
          user_id?: string
          date?: string
          time?: string | null
          type?: 'task' | 'meeting' | 'reminder'
          completed_at?: string | null
        }
      }
      stacks: {
        Row: {
          id: string
          created_at: string
          title: string
          user_id: string
          archived_at: string | null
          completed_at: string | null
          created_by: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          title: string
          user_id: string
          archived_at?: string | null
          completed_at?: string | null
          created_by?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          title?: string
          user_id?: string
          archived_at?: string | null
          completed_at?: string | null
          created_by?: string | null
        }
      }
      tasks: {
        Row: {
          id: string
          created_at: string
          stack_id: string
          title: string
          completed_at: string | null
          created_by: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          stack_id: string
          title: string
          completed_at?: string | null
          created_by?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          stack_id?: string
          title?: string
          completed_at?: string | null
          created_by?: string | null
        }
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
  }
}
