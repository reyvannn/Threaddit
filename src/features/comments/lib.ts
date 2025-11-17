import {supabase} from "@/src/lib/supabase";
import {fetchComments} from "@/src/features/comments/api";
import {Comment} from "@/src/features/comments/types";

export const fetchAndParseComments = async (postId: string) => {
    const comments = await fetchComments(postId);
    if (!comments) return [];
    const newComments = restructureComments(comments)
    return newComments;
}

const test = [{"comment": "Very nice explanation. Detailed, straight to the point and with valid comparisons!", "created_at": "2025-02-19T12:00:00+00:00", "id": "ad040bfb-4456-4360-9d11-5ec70252a4d7", "parent_id": null, "post_id": "951cc06c-58af-49da-af27-77b053481393", "user": {"id": "37c5770a-2b64-467f-85df-ee730eeef5a1", "image": null, "name": "u/AliceJohnson"}, "user_id": "37c5770a-2b64-467f-85df-ee730eeef5a1"}, {"comment": "Nicely written, keep up the good work!", "created_at": "2025-02-19T12:02:00+00:00", "id": "d1902bce-4b65-448c-b2c8-da2cbf5d4596", "parent_id": null, "post_id": "951cc06c-58af-49da-af27-77b053481393", "user": {"id": "8d365aa0-366e-4c60-8ac7-bd648a8acddf", "image": null, "name": "u/DanielMartinez"}, "user_id": "8d365aa0-366e-4c60-8ac7-bd648a8acddf"}, {"comment": "Totally agree!", "created_at": "2025-02-19T12:05:00+00:00", "id": "544059ce-7e99-4ebc-9c11-2e5f177c6465", "parent_id": "ad040bfb-4456-4360-9d11-5ec70252a4d7", "post_id": "951cc06c-58af-49da-af27-77b053481393", "user": {"id": "7b7203de-dba0-4122-b211-e5254d8896f2", "image": null, "name": "u/MichaelSmith"}, "user_id": "7b7203de-dba0-4122-b211-e5254d8896f2"}, {"comment": "Yep, wanted to say exactly the same", "created_at": "2025-02-20T10:06:00+00:00", "id": "bbb72a79-120a-4854-88fe-398db353b134", "parent_id": "d1902bce-4b65-448c-b2c8-da2cbf5d4596", "post_id": "951cc06c-58af-49da-af27-77b053481393", "user": {"id": "af0d1a00-e835-4d65-946b-2fb4fb6fca18", "image": null, "name": "u/EmmaDavis"}, "user_id": "af0d1a00-e835-4d65-946b-2fb4fb6fca18"}, {"comment": "Totally!", "created_at": "2025-02-20T12:08:00+00:00", "id": "f1f9aa71-257c-424f-ad6d-10a9107cd7b3", "parent_id": "bbb72a79-120a-4854-88fe-398db353b134", "post_id": "951cc06c-58af-49da-af27-77b053481393", "user": {"id": "8d365aa0-366e-4c60-8ac7-bd648a8acddf", "image": null, "name": "u/DanielMartinez"}, "user_id": "8d365aa0-366e-4c60-8ac7-bd648a8acddf"}]

function restructureComments(commentsInput: Comment[]) {
    if (!commentsInput) return [];
    const comments = commentsInput.map(comment => ({...comment, replies: [], upvotes: 0}))
    let restructuredComments: Comment[] = [];
    let i:number;
    for (i=0; i<comments.length; i++) {
        const comment = comments[i];
        if (!comment.parent_id) {
            restructuredComments.push(comment);
        } else {
            restructuredComments = findCommentAndAddReply(comment, restructuredComments);
        }
    }

    function findCommentAndAddReply(reply: Comment, comments: Comment[]) {
        let queue = [...comments];
        while (queue.length > 0) {
            let current: Comment | undefined = queue.pop();
            if (current && current.id === reply.parent_id) {
                current.replies.push(reply)
                return comments;
            }
            if (current && current.replies.length > 0) {
                queue.push(...current.replies);
            }
        }
        throw new Error("Parent comment not found for reply: " + reply.comment);
    }

    return restructuredComments;
}