export enum reactionStatusEnum {
  Like = "Like",
  Dislike = "Dislike",
  None = "None",
}
export type reactionStatusEnumKeys = keyof typeof reactionStatusEnum;
export interface ReactionsDBModel {
  id: string;
  parentType: string;
  parentId: string;
  status: reactionStatusEnumKeys;
  addedAt: string;
  userId: string;
  userLogin: string;
}
export interface ReactionsInfo {
  likesCount: number;
  dislikesCount: number;
  myStatus: reactionStatusEnumKeys;
}
