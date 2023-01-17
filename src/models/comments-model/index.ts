export type CommentsDBModel = {
  id: string;
  postId: string;
  content: string;
  userId: string;
  userLogin: string;
  createdAt: string;
};
export type CommentViewModel = {
  id: string;
  content: string;
  userId: string;
  userLogin: string;
  createdAt: string;
};
