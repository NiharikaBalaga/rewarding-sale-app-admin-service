import type { IVote } from '../DB/Models/Vote';
import VoteModel from '../DB/Models/Vote';
import { httpCodes } from '../constants/http-status-code';
import type { Response } from 'express';
import type { IUser } from '../DB/Models/User';
import PostModel from '../DB/Models/Post';
import type mongoose from 'mongoose';
import { PostStatus } from '../DB/Models/post-status.enum';

class VoteService {

  public static async vote(postId: mongoose.Types.ObjectId, vote: IVote) {
    try {
      // Only Published Post
      const existingPost = await PostModel.findOne({
        _id: postId,
        status: PostStatus.published
      });

      if (!existingPost) throw new Error('Post Does not exist / not published');

      // Create new Vote on the post by this vote
      const newVote = new VoteModel({
        ...vote
      });
      await newVote.save();
      return newVote;
    } catch (error){
      throw error;
    }
  }

  public static async postVoteCount(postId: mongoose.Types.ObjectId, res: Response) {
    try {
      // Only Published Post
      const existingPost = await PostModel.findById(postId);

      if (!existingPost) {
        return  res.status(httpCodes.badRequest).send({
          message: 'Post Does not exist / not published'
        });
      }

      const postVoteCount = await VoteModel.countDocuments({
        postId
      });
      return res.status(httpCodes.ok).send({
        postVoteCount
      });
    } catch (error) {
      console.error('postVoteCount-voteService', error);
      return res.sendStatus(httpCodes.serverError);
    }
  }

  public static async postsVoteCount(res: Response) {
    try {
      // Only Published Posts
      const posts = await PostModel.find({ status: 'POST_PUBLISHED' }).lean(); // lean() returns plain JavaScript objects

      if (!posts.length) {
        return res.status(httpCodes.badRequest).send({
          message: 'There are no posts in the database'
        });
      }

      // Iterate through each post to get the vote count
      for (const post of posts) {
        const postVoteCount = await VoteModel.countDocuments({ postId: post._id });
        // @ts-ignore
        post.votesCount = postVoteCount; // Add the vote count to the post object
      }

      return res.status(httpCodes.ok).send({ posts }); // Send the modified posts array
    } catch (error) {
      console.error('postsVoteCount-voteService', error);
      return res.sendStatus(httpCodes.serverError);
    }
  }


  public static async userPostVote(postId: mongoose.Types.ObjectId, user: IUser, res: Response) {
    try {
      // Only Published Post
      const existingPost = await PostModel.findById(postId);

      if (!existingPost) {
        return  res.status(httpCodes.badRequest).send({
          message: 'Post Does not exist / not published'
        });
      }
      const existingVote = await VoteModel.findOne({ userId: user.id, postId });

      return res.status(httpCodes.ok).send({
        userVote: !!existingVote
      });
    } catch (error){
      console.error('userPostVote-voteService', error);
      return res.sendStatus(httpCodes.serverError);
    }
  }
}

export {
  VoteService
};
