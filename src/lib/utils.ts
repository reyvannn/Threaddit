export const containsComment = (comment: any, targetId: string): boolean => {
    if (comment.id === targetId) return true;
    if (comment.replies && comment.replies.length > 0) {
        return comment.replies.some((reply: any) => containsComment(reply, targetId));
    }
    return false;
};