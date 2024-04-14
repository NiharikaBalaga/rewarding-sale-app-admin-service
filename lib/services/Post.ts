import type { IPost } from '../DB/Models/Post';
import PostModel from '../DB/Models/Post';
import type mongoose from 'mongoose';
import type { Response } from 'express';
import { httpCodes } from '../constants/http-status-code';
import type { IAdmin } from '../DB/Models/Admin';
import { PostStatus } from '../DB/Models/post-status.enum';

class PostService {

  static async createPostWithGivenPostId(post: IPost, postId: mongoose.Types.ObjectId) {
    try {
      const existingPost = await this.findById(postId);
      if (existingPost) throw new Error('Post With Given Id already exists');

      const newPost = new PostModel({ ...post });
      return newPost.save();
    } catch (error) {
      throw error;
    }
  }

  static async findById(id: string | mongoose.Types.ObjectId) {
    return PostModel.findById(id);
  }

  private static async _update(id: string | mongoose.Types.ObjectId, updatePostDto: any) {
    return PostModel
      .findByIdAndUpdate(id, updatePostDto, { new: true })
      .exec();
  }

  static async updatePost(updatedPost: IPost, postId: mongoose.Types.ObjectId) {
    return this._update(postId, updatedPost);
  }

  static async deletePost(postId: string | mongoose.Types.ObjectId) {
    return PostModel.findByIdAndDelete(postId);
  }

  public static async getPosts(res: Response) {
    try {
      // Get posts
      const posts = await PostModel.find({}).exec();

      // send updated serialised post in response
      if (posts) {
        return res.send({
          message: 'Posts Retrieved Successfully',
          status: httpCodes.ok,
          posts: posts
        });
      } else {
        return res.send({
          message: 'Posts Retrieved without success, please check',
          status: httpCodes.notFound,
          posts: null
        });
      }
    } catch (error) {
      console.error('getPosts-error', error);
      return res.sendStatus(httpCodes.serverError).send('Server Error, Please try again later');
    }
  }

  static async updatePostAdmin(postId: string, postObject: Partial<IAdmin>, res: Response) {
    try {

      // Updates admin data
      const updatedPost = await this._update(postId, {
        ...postObject
      });

      // TODO: Check how to implement Aws
      // SNS event
      /* if (updatedPost)
              Aws.adminUpdatedEvent(updatedPost);*/

      // send updated serialised post in response
      if (updatedPost) {
        return res.send({
          message: 'Post Updated Successfully',
          status: PostStatus.updated,
          updatedPost: updatedPost
        });
      } else {
        return res.send({
          message: 'Post updated without success, please check',
          status: PostStatus.notUpdated,
          updatedPost: null
        });
      }

    } catch (error) {
      // TODO handle any failure
      console.error('updatePost-error', error);
      return res.status(httpCodes.serverError).send('Server Error, Please try again later');
    }

  }

  static async blockPost(postId: string, blockPost: boolean, res: Response) {
    try {
      // Check if blockPost is a string and convert it to a boolean if necessary
      if (typeof blockPost === 'string')
      // @ts-ignore
        blockPost = (blockPost.toLowerCase() === 'true');

      const postStatus = blockPost ? PostStatus.blocked : PostStatus.published;

      // Updates isActive field to false and status field to POST_BLOCKED
      const updatedPost = await this._update(postId, {
        isActive: !blockPost,
        status: postStatus
      });

      // TODO: Check how to implement Aws
      // SNS event
      /* if (updatedPost)
              Aws.userUpdatedEvent(updatedPost);*/

      if (updatedPost) {
        return res.send({
          message: 'Post Blocked Successfully',
          status: PostStatus.blocked,
          updatedPost: updatedPost
        });
      } else {
        return res.send({
          message: 'Post Blocked without success, please check',
          status: PostStatus.notUpdated,
          updatedPost: null
        });
      }
    } catch (error) {
      // TODO handle any failure
      console.error('blockPost-error', error);
      return res.status(httpCodes.serverError).send('Server Error, Please try again later');
    }
  }

}

export {
  PostService
};
