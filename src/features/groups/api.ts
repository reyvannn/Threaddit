import {supabase} from "@/src/lib/supabase";

export const fetchGroups = async (search: string) => {
    let data : any = null;
    let error : any = null;
    if (search === "") {
        ({data, error} = await supabase
            .from("groups")
            .select("*, posts(users!posts_user_id_fkey(*))")
            .limit(20));
    }
    else {
        ({data, error} = await supabase
            .from('groups')
            .select('*')
            .ilike('name', `%${search}%`))
        }
    if (error || data == null) {
        throw error;
    }
    return data;
}