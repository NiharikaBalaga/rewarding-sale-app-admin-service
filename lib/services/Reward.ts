import UserModel from '../DB/Models/User';
import { httpCodes } from '../constants/http-status-code';
import type { Response } from 'express';
import { UserStatus } from '../DB/Models/user-status.enum';

class RewardService {

  public static async updatePoints(userId: string, points: bigint, res: Response) {
    try {
      const user = await UserModel.findById(userId);
      if (user) {
        const userUpdated = await UserModel.findByIdAndUpdate(userId, {
          points: points
        }, { new: true });

        if (userUpdated) {
          return res.send({
            message: 'Users Updated Successfully',
            status: httpCodes.ok,
            userUpdated: userUpdated
          });
        }
      }
      return res.send({
        message: 'Users Updated without success, please check',
        status: UserStatus.notUpdated,
        users: null
      });
    } catch (error) {
      console.error('updatePoints-error', error);
      return res.sendStatus(httpCodes.serverError).send('Server Error, Please try again later');
    }
  }
}

export {
  RewardService
};