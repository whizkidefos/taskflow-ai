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
      stacks: {
        Row: {
          id: string
          created_at: string
          title: string
          user_id: string
          is_completed: boolean
          is_archived: boolean
          completed_at: string | null
          archived_at: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          title: string
          user_id: string
          is_completed?: boolean
          is_archived?: boolean
          completed_at?: string | null
          archived_at?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          title?: string
          user_id?: string
          is_completed?: boolean
          is_archived?: boolean
          completed_at?: string | null
          archived_at?: string | null
        }
      }
      tasks: {
        Row: {
          id: string
          created_at: string
          title: string
          stack_id: string
          user_id: string
          is_completed: boolean
          completed_at: string | null
          position: number
        }
        Insert: {
          id?: string
          created_at?: string
          title: string
          stack_id: string
          user_id: string
          is_completed?: boolean
          completed_at?: string | null
          position?: number
        }
        Update: {
          id?: string
          created_at?: string
          title?: string
          stack_id?: string
          user_id?: string
          is_completed?: boolean
          completed_at?: string | null
          position?: number
        }
      }
      events: {
        Row: {
          id: string
          created_at: string
          updated_at: string | null
          title: string
          description: string | null
          start_time: string
          end_time: string | null
          user_id: string
          stack_id: string | null
          task_id: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string | null
          title: string
          description?: string | null
          start_time: string
          end_time?: string | null
          user_id: string
          stack_id?: string | null
          task_id?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string | null
          title?: string
          description?: string | null
          start_time?: string
          end_time?: string | null
          user_id?: string
          stack_id?: string | null
          task_id?: string | null
        }
      }
      tags: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          name: string
          color: string
          user_id: string
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          name: string
          color: string
          user_id: string
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          name?: string
          color?: string
          user_id?: string
        }
      }
      task_tags: {
        Row: {
          task_id: string
          tag_id: string
        }
        Insert: {
          task_id: string
          tag_id: string
        }
        Update: {
          task_id?: string
          tag_id?: string
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

export type TaskPriority = 'low' | 'medium' | 'high'

export type Tag = Database['public']['Tables']['tags']['Row']
export type Task = Database['public']['Tables']['tasks']['Row']
export type Stack = Database['public']['Tables']['stacks']['Row']
export type Event = Database['public']['Tables']['events']['Row']
