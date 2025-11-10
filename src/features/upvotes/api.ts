import {supabase} from "@/src/lib/supabase";

export const upsertUpvote = async (postId: string, value: 1 | -1 | 0, userId:string) => {
    const {data, error} = await supabase
        .from('upvotes')
        .upsert({post_id: postId, value: value, user_id:userId})
        .select()
        .single();
    if (error) {
        throw error;
    }
    return data;
}