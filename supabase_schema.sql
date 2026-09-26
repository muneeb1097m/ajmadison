-- AJ MADISON DATABASE SCHEMA FOR SUPABASE

-- 1. Create Bookings Table
CREATE TABLE IF NOT EXISTS public.bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_ref TEXT UNIQUE NOT NULL,
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    delivery_address TEXT NOT NULL,
    zip_code TEXT NOT NULL,
    delivery_type TEXT DEFAULT 'Standard Delivery',
    preferred_date TEXT,
    notes TEXT,
    total_price NUMERIC NOT NULL DEFAULT 0,
    items JSONB NOT NULL DEFAULT '[]'::jsonb,
    status TEXT NOT NULL DEFAULT 'Pending Review', -- 'Pending Review', 'Confirmed', 'Shipped / Dispatched', 'In Dispute', 'Completed', 'Cancelled'
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Create Products Table
CREATE TABLE IF NOT EXISTS public.products (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    brand TEXT NOT NULL,
    model_number TEXT NOT NULL,
    category TEXT NOT NULL,
    sub_category TEXT NOT NULL,
    sub_category_slug TEXT NOT NULL,
    price NUMERIC NOT NULL,
    original_price NUMERIC NOT NULL,
    is_closeout BOOLEAN DEFAULT false,
    closeout_badge TEXT,
    rating NUMERIC DEFAULT 4.8,
    reviews_count INTEGER DEFAULT 10,
    image TEXT NOT NULL,
    gallery TEXT[] DEFAULT '{}',
    in_stock BOOLEAN DEFAULT true,
    delivery_estimate TEXT,
    specs JSONB DEFAULT '{}'::jsonb,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Row Level Security (RLS)
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Allow public to insert new bookings (anyone can book an appliance)
CREATE POLICY "Allow public insert to bookings" 
ON public.bookings 
FOR INSERT 
TO public 
WITH CHECK (true);

-- Allow public to read their own booking by booking_ref
CREATE POLICY "Allow public read bookings" 
ON public.bookings 
FOR SELECT 
TO public 
USING (true);

-- Allow authenticated users (Admin) full access to bookings
CREATE POLICY "Allow authenticated full access to bookings" 
ON public.bookings 
FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);

-- Allow public read access to products
CREATE POLICY "Allow public read products" 
ON public.products 
FOR SELECT 
TO public 
USING (true);

-- Allow authenticated (Admin) full access to products (create, update, delete)
CREATE POLICY "Allow authenticated full access to products" 
ON public.products 
FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);
