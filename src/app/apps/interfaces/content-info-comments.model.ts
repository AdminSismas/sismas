export class contentInfoComments {
    commentId?: number | undefined | null;
    commentText?: string | undefined | null;
    updatedAt?: any;
    userName?: string;
    userFullName?: string;


    constructor(content?: any) {
        this.commentId = content.commentId;
        this.commentText = content.commentText;
        this.updatedAt = content.updatedAt;
        this.userName = content.userName;
        this.userFullName = content.userFullName;
    }
}
