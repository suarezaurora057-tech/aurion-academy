import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  private supabase: SupabaseClient;

  constructor() {
    const url = typeof SUPABASE_URL !== 'undefined' && SUPABASE_URL ? SUPABASE_URL : '';
    const key = typeof SUPABASE_KEY !== 'undefined' && SUPABASE_KEY ? SUPABASE_KEY : '';
    
    if (!url || !key || url.includes('placeholder')) {
      console.warn('Supabase configuration is missing or using placeholders. Please set SUPABASE_URL and SUPABASE_KEY in your environment.');
      // Initialize with a mock-like client or just let it fail gracefully if we can
      this.supabase = createClient(url || 'https://placeholder.supabase.co', key || 'placeholder');
    } else {
      this.supabase = createClient(url, key);
    }
  }

  get client(): SupabaseClient {
    return this.supabase;
  }

  isMock(): boolean {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const client = this.supabase as any;
    return !this.supabase || client.supabaseUrl?.includes('placeholder');
  }
}
