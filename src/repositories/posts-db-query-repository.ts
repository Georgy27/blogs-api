import { PostsDBModel, PostsViewModel } from "../models/posts-model";
import { PostsModel } from "../models/posts-model/post-schema";
import { FilterQuery } from "mongoose";
import { injectable } from "inversify";
import { AuthViewModel } from "../models/auth-model";
import { ReactionsModel } from "../models/reactions-model/reactions-schema";
import {
  reactionStatusEnum,
  reactionStatusEnumKeys,
} from "../models/reactions-model";

@injectable()
export class PostsQueryRepository {
  async findPosts(
    pageNumber: number,
    pageSize: number,
    sortBy: string,
    sortDirection: string | undefined,
    user: AuthViewModel | null,
    blogId?: string
  ): Promise<PostsViewModel> {
    const filter: FilterQuery<PostsDBModel> = {};

    if (blogId) {
      filter.blogId = { $regex: blogId };
    }
    const posts: PostsDBModel[] = await PostsModel.find(filter, { _id: false })
      .sort({ [sortBy]: sortDirection === "asc" ? 1 : -1 })
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize)
      .lean();
    console.log(posts);
    const postsWithLikesInfo = await Promise.all(
      posts.map(async (post) => {
        return this.addLikesInfoToPosts(post, user);
      })
    );

    const numberOfPosts = await PostsModel.count(filter);

    return {
      pagesCount: Math.ceil(numberOfPosts / pageSize),
      page: pageNumber,
      pageSize: pageSize,
      totalCount: numberOfPosts,
      items: postsWithLikesInfo,
    };
  }
  async findPost(id: string): Promise<PostsDBModel | null> {
    const post: PostsDBModel | null = await PostsModel.findOne(
      { id },
      { _id: false }
    ).lean();
    return post;
  }
  async findPostWithLikesInfo(
    id: string,
    user: AuthViewModel | null
  ): Promise<PostsDBModel | null> {
    const post: PostsDBModel | null = await PostsModel.findOne(
      { id },
      { _id: false }
    ).lean();

    if (!post) return null;
    return this.addLikesInfoToPosts(post, user);
  }
  private async addLikesInfoToPosts(
    post: PostsDBModel,
    user: AuthViewModel | null
  ) {
    const likes = await ReactionsModel.countDocuments({
      parentId: post.id,
      status: reactionStatusEnum.Like,
    });
    console.log(likes);
    const dislikes = await ReactionsModel.countDocuments({
      parentId: post.id,
      status: reactionStatusEnum.Dislike,
    });
    const newestLikes = await ReactionsModel.find({
      parentId: post.id,
      status: reactionStatusEnum.Like,
    })
      .sort({
        addedAt: "desc",
      })
      .limit(3);
    const mappedNewestLikes = newestLikes.map((likes) => {
      return {
        addedAt: likes.addedAt,
        userId: likes.userId,
        login: likes.userLogin,
      };
    });
    let myStatus: reactionStatusEnumKeys = "None";
    if (!user) {
      myStatus = "None";
    } else {
      const myStatusFromDb = await ReactionsModel.findOne(
        { parentId: post.id, userId: user.userId },
        { _id: 0 }
      ).lean();
      if (myStatusFromDb) {
        myStatus = myStatusFromDb.status;
      }
    }
    return {
      id: post.id,
      title: post.title,
      shortDescription: post.shortDescription,
      content: post.content,
      blogId: post.blogId,
      blogName: post.blogName,
      createdAt: post.createdAt,
      extendedLikesInfo: {
        likesCount: likes,
        dislikesCount: dislikes,
        myStatus: myStatus,
        newestLikes: mappedNewestLikes,
      },
    };
    // post.extendedLikesInfo.likesCount = likes;
    // post.extendedLikesInfo.dislikesCount = dislikes;
    // post.extendedLikesInfo.myStatus = myStatus;
    // post.extendedLikesInfo.newestLikes = mappedNewestLikes;
    // return post;
  }
}
