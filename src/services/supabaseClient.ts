import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database.types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  // Defensive warning in development mode
  console.warn(
    'Faltan las variables de entorno VITE_SUPABASE_URL o VITE_SUPABASE_ANON_KEY. ' +
    'Por favor crea un archivo .env.local basándote en .env.example.'
  );
}

export const supabase = createClient<Database>(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-anon-key'
);

