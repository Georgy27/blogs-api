import { PostsDBModel } from "../models/posts-model";
import { PostsModel } from "../models/posts-model/post-schema";
import { injectable } from "inversify";

@injectable()
export class PostsRepository {
  async createPost(newPost: PostsDBModel): Promise<PostsDBModel> {
    await PostsModel.create({ ...newPost });
    return newPost;
  }
  async updatePost(
    postId: string,
    title: string,
    shortDescription: string,
    content: string,
    blogId: string
  ) {
    const result = await PostsModel.updateOne(
      { id: postId },

      { title, shortDescription, content, blogId }
    );

    return result.matchedCount === 1;
  }
  async deletePost(id: string) {
    const result = await PostsModel.deleteOne({ id });
    return result.deletedCount === 1;
  }
  async clearPosts() {
    await PostsModel.deleteMany({});
  }
}
