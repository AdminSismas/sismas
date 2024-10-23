export class CommentsCollection {
    commentId?: number;
    commentText?: string;
    updatedAt?: string;
    userName?: string;
    userFullName?: string;


    constructor (commentId: number, commentText: string, updatedAt: string, userName: string, userFullName: string) {
        this.commentId = commentId;
        this.commentText = commentText;
        this.updatedAt = updatedAt;
        this.userName = userName;
        this.userFullName = userFullName;
    }
}