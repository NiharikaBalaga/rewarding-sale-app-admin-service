import { httpCodes } from '../constants/http-status-code';
import type { Response } from 'express';
import type { IUser } from '../DB/Models/User';
import PostModel from '../DB/Models/Post';
import type mongoose from 'mongoose';
import { PostStatus } from '../DB/Models/post-status.enum';
import type { IReport } from '../DB/Models/Report';
import ReportModel from '../DB/Models/Report';
import { ReportTypes } from '../DB/Models/report-types.enum';


class ReportService {
  public static async reportPost(postId: mongoose.Types.ObjectId, report: IReport) {
    try {
      // Only Published Post
      const existingPost = await PostModel.findOne({
        _id: postId,
        status: PostStatus.published
      });

      if (!existingPost) throw new Error('Post Does not exist / not published');

      // create the report for the post
      return await new ReportModel({
        ...report
      }).save();
    } catch (error) {
      console.error('reportPost-ReportService', error);
      throw error;
    }

  }

  public static async getPostReportCounts(postId: mongoose.Types.ObjectId, res: Response) {
    try {
      // Only Published Post
      const existingPost = await PostModel.findOne({
        _id: postId,
        status: PostStatus.published
      });

      if (!existingPost) {
        return res.status(httpCodes.badRequest).send({
          message: 'Post Does not exist / not published'
        });
      }

      const reportCountsPromises = Object.values(ReportTypes).map(async reportType => {
        const count = await ReportModel.countDocuments({
          postId,
          type: reportType
        });

        return { [reportType]: count };
      });

      const reportCounts = await Promise.all(reportCountsPromises);

      return res.status(httpCodes.ok).send(reportCounts);

    } catch (error) {
      console.error('getPostReportCounts-ReportService', error);
      return res.sendStatus(httpCodes.serverError);
    }
  }

  public static async getUserPostReport(postId: mongoose.Types.ObjectId, currentUser: IUser, res: Response) {
    try {
      // Only Published Post
      const existingPost = await PostModel.findOne({
        _id: postId,
        status: PostStatus.published
      });

      if (!existingPost) {
        return res.status(httpCodes.badRequest).send({
          message: 'Post Does not exist / not published'
        });
      }


      const userReports = await ReportModel.find({
        postId: existingPost.id,
        userId: currentUser.id
      });

      return res.send({
        userReports: userReports.map(report => report.type)
      });

    } catch (error) {
      console.error('getUserPostReport-ReportService', error);
      return res.sendStatus(httpCodes.serverError);
    }
  }

}

export {
  ReportService
};
