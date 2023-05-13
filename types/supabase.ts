export type Json = string | number | boolean | null | { [key: string]: Json } | Json[]

export interface Database {
  public: {
    Tables: {
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
          visitor_id: string
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
          visitor_id: string
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
          visitor_id?: string
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
      profiles: {
        Row: {
          avatar_url: string | null
          email: string | null
          id: string
          isplus: boolean | null
          updated_at: string | null
          website: string | null
        }
        Insert: {
          avatar_url?: string | null
          email?: string | null
          id: string
          isplus?: boolean | null
          updated_at?: string | null
          website?: string | null
        }
        Update: {
          avatar_url?: string | null
          email?: string | null
          id?: string
          isplus?: boolean | null
          updated_at?: string | null
          website?: string | null
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
          visitor_id: string
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
          visitor_id: string
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
          visitor_id?: string
        }
      }
    }
    Views: {
      [_ in never]: never
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
      match_page_sections:
        | {
            Args: {
              embedding: unknown
              match_threshold: number
              match_count: number
              min_content_length: number
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
        | {
            Args: {
              embedding: unknown
              match_threshold: number
              match_count: number
              min_content_length: number
              isdalton: boolean
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
        | {
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
}
