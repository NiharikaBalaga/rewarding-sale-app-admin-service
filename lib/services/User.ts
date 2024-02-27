import UserModel from '../DB/Models/User';
import UserTokenBlacklistModel from '../DB/Models/User-Token-Blacklist';
import {httpCodes} from "../constants/http-status-code";
import type { Response } from "express";

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

  public static async getUsers(res: Response) {
    try {
      // Get users
      const users = await UserModel.find({}).exec();

      // send updated serialised user in response
      return res.send({
        message: 'Users Retrieved Successfully',
        status: httpCodes.ok
      });
    } catch (error){
      console.error('getUsers-error', error);
      return  res.sendStatus(httpCodes.serverError).send('Server Error, Please try again later');
    }
  }

  private static async _update(id: string, updateUserDto: any) {
    return UserModel
      .findByIdAndUpdate(id, updateUserDto, { new: true })
      .exec();
  }


  static async updateUser(userId: string, updateDto: any) {
    return this._update(userId, updateDto);
  }

  public static async tokenInBlackList(accessToken: string) {
    return UserTokenBlacklistModel.findOne({
      token: accessToken
    });
  }

}


export {
  UserService
};