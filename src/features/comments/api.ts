import {supabase} from "@/src/lib/supabase";
import {Comment, CommentFetch} from "@/src/features/comments/types";

export const fetchComments = async (postId: string) => {
    const {data, error} = await supabase
        .from("comments")
        .select("*, user:users!comments_user_id_fkey(*)")
        .eq("post_id", postId)
        .order("created_at", {ascending: true});
    if (error) {
        throw error;
    }
    return data;
}