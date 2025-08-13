import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true
    }
})

// Tipos para o banco de dados
export interface Database {
    public: {
        Tables: {
            users: {
                Row: {
                    id: string
                    email: string
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id: string
                    email: string
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    email?: string
                    created_at?: string
                    updated_at?: string
                }
            }
            balances: {
                Row: {
                    id: string
                    user_id: string
                    amount: number
                    currency: string
                    type: 'salary' | 'balance'
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    amount: number
                    currency: string
                    type: 'salary' | 'balance'
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    amount?: number
                    currency?: string
                    type?: 'salary' | 'balance'
                    created_at?: string
                    updated_at?: string
                }
            }
            debts: {
                Row: {
                    id: string
                    user_id: string
                    description: string
                    amount: number
                    due_date: string
                    is_recurring: boolean
                    recurrence_type?: 'monthly' | 'weekly' | 'yearly'
                    is_paid: boolean
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    description: string
                    amount: number
                    due_date: string
                    is_recurring?: boolean
                    recurrence_type?: 'monthly' | 'weekly' | 'yearly'
                    is_paid?: boolean
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    description?: string
                    amount?: number
                    due_date?: string
                    is_recurring?: boolean
                    recurrence_type?: 'monthly' | 'weekly' | 'yearly'
                    is_paid?: boolean
                    created_at?: string
                    updated_at?: string
                }
            }
            coupons: {
                Row: {
                    id: string
                    user_id: string
                    name: string
                    description: string
                    discount_value: number
                    discount_type: 'percentage' | 'fixed'
                    valid_until: string
                    store: string
                    is_used: boolean
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    name: string
                    description: string
                    discount_value: number
                    discount_type: 'percentage' | 'fixed'
                    valid_until: string
                    store: string
                    is_used?: boolean
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    name?: string
                    description?: string
                    discount_value?: number
                    discount_type?: 'percentage' | 'fixed'
                    valid_until?: string
                    store?: string
                    is_used?: boolean
                    created_at?: string
                    updated_at?: string
                }
            }
            discount_cards: {
                Row: {
                    id: string
                    user_id: string
                    name: string
                    description: string
                    card_number?: string
                    store: string
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    name: string
                    description: string
                    card_number?: string
                    store: string
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    name?: string
                    description?: string
                    card_number?: string
                    store?: string
                    created_at?: string
                    updated_at?: string
                }
            }
        }
    }
}
