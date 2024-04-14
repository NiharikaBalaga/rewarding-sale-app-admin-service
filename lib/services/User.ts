import UserModel from '../DB/Models/User';
import { httpCodes } from '../constants/http-status-code';
import type { Response } from 'express';
import { UserStatus } from '../DB/Models/user-status.enum';
import UserTokenBlacklistModel from '../DB/Models/User-Token-Blacklist';
import type mongoose from 'mongoose';
import { SNSService } from './SNS';

class UserService {

  static async createUserByPhone(userObject: any, userId: string) {
    try {
      // check if user already exists
      const existingUser = await this.findById(userId);
      if (existingUser) throw new Error('User With Given Id already exists');
      const user = new UserModel({ ...userObject });
      await user.save();

      return user;
    } catch (error) {
      throw error;
    }
  }

  static async findById(id: string) {
    return UserModel.findById(id);
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

  public static async updatePointsSNS(userObject: any, userId: string) {
    const user = await UserModel.findById(userId);
    if (user) {
      await UserModel.findByIdAndUpdate(userId, {
        points: userObject.points
      });
    }
    return true;
  }

  private static async _update(id: string, updateUserDto: any) {
    return UserModel
      .findByIdAndUpdate(id, updateUserDto, { new: true })
      .exec();
  }

  static async updateUser(userId: string, updateDto: any) {
    return this._update(userId, updateDto);
  }

  public static async getUsers(res: Response) {
    try {
      // Get users
      const users = await UserModel.find({}).exec();

      // send updated serialised user in response
      if (users) {
        return res.send({
          message: 'Users Retrieved Successfully',
          status: httpCodes.ok,
          users: users
        });
      } else {
        return res.send({
          message: 'Users Retrieved without success, please check',
          status: httpCodes.notFound,
          users: null
        });
      }
    } catch (error) {
      console.error('getUsers-error', error);
      return res.sendStatus(httpCodes.serverError).send('Server Error, Please try again later');
    }
  }

  static async blockUser(userId: string, blockUser: boolean, res: Response) {
    try {
      // Check if blockUser is a string and convert it to a boolean if necessary
      if (typeof blockUser === 'string')
      // @ts-ignore
        blockUser = (blockUser.toLowerCase() === 'true');

      // Updates isBlocked field to true
      const updatedUser = await this._update(userId, {
        isBlocked: blockUser
      });

      // SNS event
      if (updatedUser)
        SNSService.updateUser(updatedUser);

      // send updated serialised user in response
      if (updatedUser) {
        return res.send({
          message: 'User Blocked Successfully',
          status: UserStatus.blocked,
          updatedUser: updatedUser
        });
      } else {
        return res.send({
          message: 'User Blocked without success, please check',
          status: UserStatus.notUpdated,
          updatedUser: null
        });
      }
    } catch (error) {
      // TODO handle any failure
      console.error('blockUser-error', error);
      return res.status(httpCodes.serverError).send('Server Error, Please try again later');
    }
  }
}

export {
  UserService
};