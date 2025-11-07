// /features/posts/api.ts

import {supabase} from "@/src/lib/supabase";
import {InsertPost} from "@/src/features/posts/types";

export const fetchPosts = async () => {
    const {data, error} = await supabase.from('posts').select('*, group:groups(*), user:users!posts_user_id_fkey(*)').order('created_at', {ascending: false});
    if (error || data == null) {
        throw error;
    }
    return data;
};

export const fetchPostById = async (id: string) => {
    const {data, error} = await supabase
        .from('posts')
        .select('*, group:groups(*), user:users!posts_user_id_fkey(*)')
        .eq('id', id)
        .single();
    if (error || data === null) {
        throw error;
    }
    return data;
};

export const insertPost = async (post: InsertPost) => {
    const {data, error} = await supabase
        .from("posts")
        .insert(post)
        .select()
        .single();
    if (error) {
        throw new Error(`Failed to create post: ${error.message}`);
    }
    return data;
}