import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

// Variables de entorno de Supabase
const SUPABASE_URL =
  (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_SUPABASE_URL) ||
  (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_SUPABASE_URL) ||
  'https://tu-proyecto.supabase.co';

const SUPABASE_ANON_KEY =
  (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_SUPABASE_ANON_KEY) ||
  (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_SUPABASE_ANON_KEY) ||
  'tu-anon-key-publica';

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY);
export * from './database.types';
