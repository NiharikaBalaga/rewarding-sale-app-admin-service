import type mongoose from 'mongoose';
import PostModel, { IPost } from '../DB/Models/Post';
import type { IPostPointsSchema } from '../DB/Models/Post-points.schema';
import PostPointsModel from '../DB/Models/Post-points.schema';
import { UserService } from './User';
import { SNSService } from './SNS';
import type { Response } from 'express';
import UserModel from '../DB/Models/User';
import { httpCodes } from '../constants/http-status-code';

export class PointsService {
  static async initPostPoints(postPoints: IPostPointsSchema) {
    // init post Points document
    const newPostPoints = new PostPointsModel({
      userId: postPoints.userId,
      postId: postPoints.postId,
      points: postPoints.points
    });
    return newPostPoints.save();
  }

  public static async getUserPostsPoints(userId: string, res: Response) {
    try {
      console.log('getUsersPostsPoints');
      const user = await UserModel.findById(userId);
      console.log('getUsersPostsPoints user: ', user);

      if (!user) {
        return res.send({
          message: 'User not found',
          status: httpCodes.notFound,
          userPostsPoints: null
        });
      }

      // Fetch post points and populate the related post details
      const postPointsDetails = await PostPointsModel.find({ userId: user._id })
        .populate('postId') // This assumes that 'postId' is set up correctly in your PostPointsModel to reference the PostModel
        .exec();

      const userPostsPoints = postPointsDetails.map(details => {
        const post = details.postId; // This is now a populated post object
        return {
          postid: post._id.toString(),
          userId: user._id.toString(),
          firstName: user.firstName,
          lastName: user.lastName,
          user_points: user.points,
          post_points: details.points,
          // @ts-ignore
          post_status: post.status,
          // @ts-ignore
          isActive: post.isActive,
          // @ts-ignore
          productImageObjectUrl: post.productImageObjectUrl,
          // @ts-ignore
          productName: post.productName,
        };
      });

      console.log('getUsersPostsPoints userPostsPoints: ', userPostsPoints);
      return res.send({
        message: 'Users Posts Points Retrieved Successfully',
        status: httpCodes.ok,
        userPostsPoints: userPostsPoints
      });

    } catch (error) {
      console.error('getUsersPostsPoints-error', error);
      return res.status(httpCodes.serverError).send('Server Error, Please try again later');
    }
  }

  public static async updateUserPostPoints(userId: string, postId: string, userPoints: number, oldPostPoints: number, newPostPoints: number, res: Response) {
    try {
      console.log('updateUserPostPoints');
      const user = await UserModel.findById(userId);
      console.log('updateUserPostPoints user: ', user);

      if (!user) {
        return res.send({
          message: 'User not found',
          status: httpCodes.notFound,
          userPostsPoints: null
        });
      }

      // Calculate difference between the old and the new points in the post
      const differencePostPoints = Number(newPostPoints) - Number(oldPostPoints);
      // Calculate new user points directly
      const newUserPoints = Number(userPoints) + differencePostPoints;

      console.log('updateUserPostPoints differencePostPoints: ', differencePostPoints);
      console.log('updateUserPostPoints newUserPoints: ', newUserPoints);

      // Update User points
      const userUpdated = await UserModel.findByIdAndUpdate(userId, {
        points: newUserPoints
      }, { new: true });
      console.log('userUpdated: ', userUpdated);
      // SNS Event
      if (userUpdated)
        SNSService.updateUserRewards(userUpdated);


      // Update Post Points
      const postPointUpdated = await PostPointsModel.findOneAndUpdate({
        postId,
        userId
      }, {
        points: newPostPoints,
      }, { new: true });
      console.log('postPointUpdated: ', postPointUpdated);
      // SNS Event
      if (postPointUpdated)
        SNSService.updatePostPointsRewards(postPointUpdated);


      return res.send({
        message: 'Users Posts Points Updated Successfully',
        status: httpCodes.ok,
        userUpdated: userUpdated,
        postPointUpdated: postPointUpdated
      });

    } catch (error) {
      console.error('getUsersPostsPoints-error', error);
      return res.status(httpCodes.serverError).send('Server Error, Please try again later');
    }
  }
}