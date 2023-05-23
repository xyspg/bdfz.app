export type Json = string | number | boolean | null | { [key: string]: Json } | Json[]

export interface Database {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          operationName?: string
          query?: string
          variables?: Json
          extensions?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      chat_statistics: {
        Row: {
          browser_vendor: string | null
          chat_history: Json | null
          chat_id: string
          has_flagged_content: boolean
          id: number
          os_cpu: string | null
          platform: string | null
          screen_resolution: string | null
          timestamp: string
          total_word_count: number | null
          user_id: string | null
        }
        Insert: {
          browser_vendor?: string | null
          chat_history?: Json | null
          chat_id: string
          has_flagged_content: boolean
          id?: number
          os_cpu?: string | null
          platform?: string | null
          screen_resolution?: string | null
          timestamp: string
          total_word_count?: number | null
          user_id?: string | null
        }
        Update: {
          browser_vendor?: string | null
          chat_history?: Json | null
          chat_id?: string
          has_flagged_content?: boolean
          id?: number
          os_cpu?: string | null
          platform?: string | null
          screen_resolution?: string | null
          timestamp?: string
          total_word_count?: number | null
          user_id?: string | null
        }
      }
      embeddings_log: {
        Row: {
          context: string | null
          department: string | null
          email: string
          id: number
          page_section: Json | null
          question: string | null
          timestamp: string | null
          token_count: number | null
        }
        Insert: {
          context?: string | null
          department?: string | null
          email: string
          id?: number
          page_section?: Json | null
          question?: string | null
          timestamp?: string | null
          token_count?: number | null
        }
        Update: {
          context?: string | null
          department?: string | null
          email?: string
          id?: number
          page_section?: Json | null
          question?: string | null
          timestamp?: string | null
          token_count?: number | null
        }
      }
      feedback: {
        Row: {
          answer: string | null
          browser_vendor: string | null
          feedback: string
          id: number
          os_cpu: string | null
          platform: string | null
          question: string
          screen_resolution: string | null
          timestamp: string
          user_id: string | null
          visitor_id: string | null
        }
        Insert: {
          answer?: string | null
          browser_vendor?: string | null
          feedback: string
          id?: number
          os_cpu?: string | null
          platform?: string | null
          question: string
          screen_resolution?: string | null
          timestamp: string
          user_id?: string | null
          visitor_id?: string | null
        }
        Update: {
          answer?: string | null
          browser_vendor?: string | null
          feedback?: string
          id?: number
          os_cpu?: string | null
          platform?: string | null
          question?: string
          screen_resolution?: string | null
          timestamp?: string
          user_id?: string | null
          visitor_id?: string | null
        }
      }
      nods_page: {
        Row: {
          checksum: string | null
          department: string | null
          id: number
          meta: Json | null
          parent_page_id: number | null
          path: string
          source: string | null
          type: string | null
        }
        Insert: {
          checksum?: string | null
          department?: string | null
          id?: number
          meta?: Json | null
          parent_page_id?: number | null
          path: string
          source?: string | null
          type?: string | null
        }
        Update: {
          checksum?: string | null
          department?: string | null
          id?: number
          meta?: Json | null
          parent_page_id?: number | null
          path?: string
          source?: string | null
          type?: string | null
        }
      }
      nods_page_section: {
        Row: {
          content: string | null
          embedding: unknown | null
          heading: string | null
          id: number
          page_id: number
          slug: string | null
          token_count: number | null
        }
        Insert: {
          content?: string | null
          embedding?: unknown | null
          heading?: string | null
          id?: number
          page_id: number
          slug?: string | null
          token_count?: number | null
        }
        Update: {
          content?: string | null
          embedding?: unknown | null
          heading?: string | null
          id?: number
          page_id?: number
          slug?: string | null
          token_count?: number | null
        }
      }
      statistics: {
        Row: {
          answer: string | null
          browser_vendor: string | null
          has_flagged_content: boolean
          id: number
          os_cpu: string | null
          platform: string | null
          question: string
          screen_resolution: string | null
          timestamp: string
          user_id: string | null
          visitor_id: string | null
          word_count: number | null
        }
        Insert: {
          answer?: string | null
          browser_vendor?: string | null
          has_flagged_content: boolean
          id?: number
          os_cpu?: string | null
          platform?: string | null
          question: string
          screen_resolution?: string | null
          timestamp: string
          user_id?: string | null
          visitor_id?: string | null
          word_count?: number | null
        }
        Update: {
          answer?: string | null
          browser_vendor?: string | null
          has_flagged_content?: boolean
          id?: number
          os_cpu?: string | null
          platform?: string | null
          question?: string
          screen_resolution?: string | null
          timestamp?: string
          user_id?: string | null
          visitor_id?: string | null
          word_count?: number | null
        }
      }
      users: {
        Row: {
          email: string | null
          id: string
        }
        Insert: {
          email?: string | null
          id: string
        }
        Update: {
          email?: string | null
          id?: string
        }
      }
    }
    Views: {
      user_word_counts: {
        Row: {
          total_word_count: number | null
          user_email: string | null
          user_id: string | null
        }
      }
    }
    Functions: {
      get_page_parents: {
        Args: {
          page_id: number
        }
        Returns: {
          id: number
          parent_page_id: number
          path: string
          meta: Json
        }[]
      }
      ivfflathandler: {
        Args: {
          '': unknown
        }
        Returns: unknown
      }
      match_page_sections: {
        Args: {
          embedding: unknown
          match_threshold: number
          match_count: number
          min_content_length: number
          department: string
        }
        Returns: {
          id: number
          page_id: number
          slug: string
          heading: string
          content: string
          similarity: number
        }[]
      }
      vector_avg: {
        Args: {
          '': number[]
        }
        Returns: unknown
      }
      vector_dims: {
        Args: {
          '': unknown
        }
        Returns: number
      }
      vector_norm: {
        Args: {
          '': unknown
        }
        Returns: number
      }
      vector_out: {
        Args: {
          '': unknown
        }
        Returns: unknown
      }
      vector_send: {
        Args: {
          '': unknown
        }
        Returns: string
      }
      vector_typmod_in: {
        Args: {
          '': unknown[]
        }
        Returns: number
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  storage: {
    Tables: {
      buckets: {
        Row: {
          allowed_mime_types: string[] | null
          avif_autodetection: boolean | null
          created_at: string | null
          file_size_limit: number | null
          id: string
          name: string
          owner: string | null
          public: boolean | null
          updated_at: string | null
        }
        Insert: {
          allowed_mime_types?: string[] | null
          avif_autodetection?: boolean | null
          created_at?: string | null
          file_size_limit?: number | null
          id: string
          name: string
          owner?: string | null
          public?: boolean | null
          updated_at?: string | null
        }
        Update: {
          allowed_mime_types?: string[] | null
          avif_autodetection?: boolean | null
          created_at?: string | null
          file_size_limit?: number | null
          id?: string
          name?: string
          owner?: string | null
          public?: boolean | null
          updated_at?: string | null
        }
      }
      migrations: {
        Row: {
          executed_at: string | null
          hash: string
          id: number
          name: string
        }
        Insert: {
          executed_at?: string | null
          hash: string
          id: number
          name: string
        }
        Update: {
          executed_at?: string | null
          hash?: string
          id?: number
          name?: string
        }
      }
      objects: {
        Row: {
          bucket_id: string | null
          created_at: string | null
          id: string
          last_accessed_at: string | null
          metadata: Json | null
          name: string | null
          owner: string | null
          path_tokens: string[] | null
          updated_at: string | null
          version: string | null
        }
        Insert: {
          bucket_id?: string | null
          created_at?: string | null
          id?: string
          last_accessed_at?: string | null
          metadata?: Json | null
          name?: string | null
          owner?: string | null
          path_tokens?: string[] | null
          updated_at?: string | null
          version?: string | null
        }
        Update: {
          bucket_id?: string | null
          created_at?: string | null
          id?: string
          last_accessed_at?: string | null
          metadata?: Json | null
          name?: string | null
          owner?: string | null
          path_tokens?: string[] | null
          updated_at?: string | null
          version?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      can_insert_object: {
        Args: {
          bucketid: string
          name: string
          owner: string
          metadata: Json
        }
        Returns: undefined
      }
      extension: {
        Args: {
          name: string
        }
        Returns: string
      }
      filename: {
        Args: {
          name: string
        }
        Returns: string
      }
      foldername: {
        Args: {
          name: string
        }
        Returns: string[]
      }
      get_size_by_bucket: {
        Args: Record<PropertyKey, never>
        Returns: {
          size: number
          bucket_id: string
        }[]
      }
      search: {
        Args: {
          prefix: string
          bucketname: string
          limits?: number
          levels?: number
          offsets?: number
          search?: string
          sortcolumn?: string
          sortorder?: string
        }
        Returns: {
          name: string
          id: string
          updated_at: string
          created_at: string
          last_accessed_at: string
          metadata: Json
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
