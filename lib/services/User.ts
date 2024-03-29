import UserModel from '../DB/Models/User';
import { httpCodes } from '../constants/http-status-code';
import type { Response } from 'express';
import { UserStatus } from '../DB/Models/user-status.enum';
import UserTokenBlacklistModel from '../DB/Models/User-Token-Blacklist';


class UserService{

  static async createUserByPhone(userObject: any, userId: string) {
    try {
      // check if user already exists
      const existingUser = await this.findById(userId);
      if (existingUser) throw new Error('User With Given Id already exists');
      const user = new UserModel({ ...userObject  });
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
      return res.send({
        message: 'Users Retrieved Successfully',
        status: httpCodes.ok,
        users: users
      });
    } catch (error){
      console.error('getUsers-error', error);
      return  res.sendStatus(httpCodes.serverError).send('Server Error, Please try again later');
    }
  }

  static async blockUser(userId: string, res: Response) {
    try {

      // Updates isBlocked field to true
      const updatedUser = await this._update(userId, {
        isBlocked: true
      });

      // TODO: Check how to implement Aws
      // SNS event
      /* if (updatedUser)
        Aws.userUpdatedEvent(updatedUser);*/

      // send updated serialised user in response
      return res.send({
        message: 'User Blocked Successfully',
        status: UserStatus.blocked,
        updatedUser: updatedUser
      });
    } catch (error) {
      // TODO handle any failure
      console.error('blockUser-error', error);
      return res.status(httpCodes.serverError).send('Server Error, Please try again later');
    }
  }

  // TODO add unblock user
}


export {
  UserService
};