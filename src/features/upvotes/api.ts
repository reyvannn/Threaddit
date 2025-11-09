import {supabase} from "@/src/lib/supabase";

export const fetchPostUpvotes = async (postId: string) => {
    const {data, error} = await supabase
        .from('upvotes')
        .select("value.sum()")
        .eq('post_id', postId)
        .single();
    console.log(data)
    if (error) {
        throw error;
    }
    if (data == null) {
        return 0;
    }
    return data;
};