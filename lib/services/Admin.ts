import type { Response } from 'express';
import AdminModel, { IAdmin } from '../DB/Models/Admin';
import { httpCodes } from '../constants/http-status-code';
import * as argon2 from 'argon2';
import { TokenService } from './Token';
import { SNSService } from './SNS';
import PostModel from '../DB/Models/Post';
import VoteModel from '../DB/Models/Vote';
import ReportModel from '../DB/Models/Report';
import UserTokenBlacklistModel from '../DB/Models/User-Token-Blacklist';

class AdminService {

  static async findById(id: string) {
    return AdminModel.findById(id);
  }

  static async findByEmail(email: string) {
    return AdminModel.findOne({
      email
    });
  }

  static async addTokenInBlackList(accessToken: string) {
    const blackListToken = new UserTokenBlacklistModel({
      token: accessToken,
    });
    return blackListToken.save();
  }

  public static async tokenInBlackList(accessToken: string) {
    return UserTokenBlacklistModel.findOne({
      token: accessToken
    });
  }

  public static async logout(userId: string, accessToken: string, res: Response) {
    try {
      // add current access token into blacklist collection, so we won't allow this token anymore - check tokenBlacklist middleware
      const blackListToken = new UserTokenBlacklistModel({
        token: accessToken
      });

      await blackListToken.save();

      return res.send('Logout Success');
    } catch (logoutError){
      console.error('logout-AdminService', logoutError);
      return  res.sendStatus(httpCodes.serverError);
    }
  }

  static async create(email: string, firstName: string, lastName: string, phoneNumber: string) {
    try {
      const existingAdmin = await this.findByEmail(email);
      if (existingAdmin) throw new Error('Admin Exists Already');
      const randomPassword = (Math.random() + 1).toString(36).substring(7);
      const hashedRandomPassword = await argon2.hash(randomPassword);
      const admin = new AdminModel({
        phoneNumber,
        email,
        password: hashedRandomPassword,
        firstName,
        lastName,
        signedUp: false,
        isBlocked: false,
      });

      await admin.save();

      console.log('One time Password: ', randomPassword);

      await SNSService.sendAdminLoginDetailsToPhone(phoneNumber, randomPassword);
    } catch (error) {
      throw error;
    }
  }

  static async setUp(email: string, phoneNumber: string, oneTimePassword: string, password: string, res: Response) {
    try {
      const admin = await AdminModel.findOne({
        email,
        phoneNumber
      });
      console.log('setUp');
      console.log('admin', admin);
      console.log('email', email);
      console.log('phoneNumber', phoneNumber);
      console.log('oneTimePassword', oneTimePassword);
      console.log('password', password);

      if (admin) {
        // Should not be signedUp already to setup account
        if (admin.signedUp)
          return res.status(httpCodes.badRequest).send('Account Already done setup');

        const passwordMatches = await argon2.verify(
          admin.password,
          oneTimePassword
        );

        if (!passwordMatches)
          return res.status(httpCodes.badRequest).send('Wrong Password');

        // password Matches
        // store user entered password as hashed password into DB
        const hashedPassword = await argon2.hash(password);
        console.log('hashedPassword', hashedPassword);
        console.log('--------------------------------------------');
        console.log('');
        await AdminModel.findByIdAndUpdate(admin.id, {
          password: hashedPassword,
          signedUp: true
        });

        const { accessToken } = await TokenService.getAdminToken(admin.id, admin.phoneNumber);
        return res.status(httpCodes.ok).send({
          accessToken
        });

      } else {
        return res.status(httpCodes.badRequest).send('User Does not exist');
      }
    } catch (error) {
      console.error('setUp-Admin-service-error', error);
      return res.status(httpCodes.serverError).send('Server Error');
    }
  }

  static async login(email: string, password: string, res: Response) {
    try {

      const admin = await AdminModel.findOne({
        email
      });

      console.log('login');
      console.log('admin', admin);
      console.log('email', email);
      console.log('password', password);
      console.log('--------------------------------------------');
      console.log('');

      if (admin) {
        if (!admin.signedUp)
          return res.status(httpCodes.badRequest).send('Please Setup Account Before Login');
        const passwordMatches = await argon2.verify(
          admin.password,
          password
        );

        if (!passwordMatches)
          return res.status(httpCodes.badRequest).send('Wrong Password');

        const { accessToken } = await TokenService.getAdminToken(admin.id, admin.phoneNumber);
        return res.status(httpCodes.ok).send({
          accessToken
        });

      } else {
        return res.status(httpCodes.badRequest).send('User Does not exist');
      }
    } catch (error) {
      console.error('login-Admin-service-error', error);
      return res.status(httpCodes.serverError).send('Server Error');
    }
  }

  public static async postsVotesReportsCount(res: Response) {
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

      // Iterate through each post to get the report count
      for (const post of posts) {
        const postReportCount = await ReportModel.countDocuments({ postId: post._id });
        // @ts-ignore
        post.reportsCount = postReportCount; // Add the report count to the post object
      }

      return res.status(httpCodes.ok).send({ posts }); // Send the modified posts array
    } catch (error) {
      console.error('postsVoteCount-voteService', error);
      return res.sendStatus(httpCodes.serverError);
    }
  }
}

export {
  AdminService
};