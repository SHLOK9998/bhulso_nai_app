import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://qnscenrjpufcuwioglrc.supabase.co';
const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFuc2NlbnJqcHVmY3V3aW9nbHJjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg3MzE0NTAsImV4cCI6MjA5NDMwNzQ1MH0.usmHui93eRSMe4-UZdTJpdWFdBKyAwrqUQZ9QGqMrfo';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
