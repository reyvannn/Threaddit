import {Tables, TablesInsert} from "@/src/types/database.types";

export type Post = Tables<"posts"> & {
    group: Tables<"groups">,
    user: Tables<"users">,
}

export type InsertPost = TablesInsert<"posts">