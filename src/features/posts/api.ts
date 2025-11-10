// /features/posts/api.ts

import {supabase} from "@/src/lib/supabase";
import {InsertPost, Post} from "@/src/features/posts/types";

export const fetchPosts = async (userId:string) => {
    const {data, error} = await supabase
        .from('posts')
        .select('*, group:groups(*), user:users!posts_user_id_fkey(*), upvotes(value.sum()), user_vote:upvotes(value)')
        .eq("user_vote.user_id", userId)
        .order('created_at', {ascending: false});
    if (error || data == null) {
        throw error;
    }
    return data;
};

export const fetchPostById = async (id: string, userId:string): Promise<Post> => {
    const {data, error} = await supabase
        .from('posts')
        .select('*, group:groups(*), user:users!posts_user_id_fkey(*), upvotes(value.sum()), user_vote:upvotes(value)')
        .eq('id', id)
        .eq("user_vote.user_id", userId)
        .single();
    if (error || data === null) {
        throw error;
    }
    console.log(data)
    return data;
};

export const insertPost = async (post: InsertPost) => {
    const {data, error} = await supabase
        .from("posts")
        .insert(post)
        .select()
        .single();
    if (error) {
        throw error;
    }
    return data;
}

export const deletePost = async (id: string) => {
    const {error} = await supabase
        .from("posts")
        .delete()
        .eq("id", id)
    if (error) {
        throw error;
    }
    return
}