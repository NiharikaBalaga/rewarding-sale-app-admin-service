import UserModel from "../Models/User";
import type { Response } from 'express';
import {httpCodes} from "../constants/http-status-code";
import AdminModel, {IAdmin} from "../Models/Admin";

class UserService{
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
}


export {
    UserService
};