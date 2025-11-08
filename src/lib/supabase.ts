// /lib/supabase.ts

import {AppState} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {createClient, SupabaseClient} from "@supabase/supabase-js";
import { Database } from "@/src/types/database.types";
import {SignedInSessionResource} from "@clerk/types";

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

export let supabase:SupabaseClient;

export const createSupabaseClient = (opts: { getToken: () => Promise<string | null> }   ) => {
    supabase = createClient<Database>(
        supabaseUrl,
        supabaseAnonKey,
        {
            auth: {
                autoRefreshToken: false,
                persistSession: false,
                detectSessionInUrl: false
            },
            accessToken: opts.getToken,
        })
    console.log(`Supabase client created`)
}