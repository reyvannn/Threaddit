import {Tables, TablesInsert} from "@/src/types/database.types";

export type Post = Tables<"posts"> & {
    group: Tables<"groups">,
    user: Tables<"users">,
    upvotes: {sum:number}[]
    user_vote: Array<{ value: number | null | undefined}>;
}

export type InsertPost = TablesInsert<"posts">