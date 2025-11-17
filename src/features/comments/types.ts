import {Tables} from "@/src/types/database.types";

type CommentType = Tables<"comments">

export type Comment = CommentType & {
    upvotes: number,
    user: Tables<"users">,
    replies: Comment[]
}

export type CommentFetch = CommentType & {
    user: Tables<"users">
}