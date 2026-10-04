import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

// Fallback pour éviter que Next.js ne plante au moment du Build Vercel
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://cefeoldodzahxmpfnolt.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_jZq1diYEyeFKuYQw-fDqUQ_s8yln...';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function HBKGrowthApp() {
  // ... reste du code inchangé
