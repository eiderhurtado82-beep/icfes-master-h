import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

// Credenciales reales de Supabase - Proyecto hbdzmeobpbnbyhtrwimu
const SUPABASE_RAW_URL =
  (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_SUPABASE_URL) ||
  (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_SUPABASE_URL) ||
  'https://hbdzmeobpbnbyhtrwimu.supabase.co';

// Normalizar para asegurar URL raíz limpia requerida por el SDK de Supabase (@supabase/supabase-js)
const SUPABASE_URL = SUPABASE_RAW_URL.replace(/\/rest\/v1\/?$/, '').replace(/\/+$/, '');

const SUPABASE_ANON_KEY =
  (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_SUPABASE_ANON_KEY) ||
  (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_SUPABASE_ANON_KEY) ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhiZHptZW9icGJuYnlodHJ3aW11Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTIzNTc2NjAsImV4cCI6MjEwNzkzMzY2MH0.R4iK51Y69x2tSRyyr1qPyiwz8RRTcGnOBvjxm12_hXU';

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY);
export * from './database.types';
