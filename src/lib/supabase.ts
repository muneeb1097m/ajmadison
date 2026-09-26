import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl && supabaseAnonKey && !supabaseUrl.includes('placeholder')
);

// Client for browser / public operations
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : (null as unknown as ReturnType<typeof createClient>);

// Admin client for backend operations
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
export const supabaseAdmin = (supabaseUrl && serviceRoleKey)
  ? createClient(supabaseUrl, serviceRoleKey)
  : supabase;

export interface BookingRecord {
  id?: string;
  booking_ref: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  delivery_address: string;
  zip_code: string;
  delivery_type: string;
  preferred_date?: string;
  notes?: string;
  total_price: number;
  items: {
    productId: string;
    productName: string;
    brand: string;
    modelNumber: string;
    price: number;
    quantity: number;
    image?: string;
  }[];
  status: 'Pending Review' | 'Confirmed' | 'Shipped / Dispatched' | 'In Dispute' | 'Completed' | 'Cancelled';
  created_at?: string;
  updated_at?: string;
}

export interface DbProductRecord {
  id: string;
  name: string;
  brand: string;
  model_number: string;
  category: string;
  sub_category: string;
  sub_category_slug: string;
  price: number;
  original_price: number;
  is_closeout: boolean;
  closeout_badge?: string;
  rating: number;
  reviews_count: number;
  image: string;
  gallery: string[];
  in_stock: boolean;
  delivery_estimate: string;
  specs: Record<string, unknown>;
  description: string;
  created_at?: string;
}
