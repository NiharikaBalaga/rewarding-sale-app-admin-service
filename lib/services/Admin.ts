import type { Response } from "express";
import AdminModel, {IAdmin} from "../DB/Models/Admin";
import {httpCodes} from "../constants/http-status-code";
import UserModel from "../DB/Models/User";
import UserTokenBlacklistModel from "../DB/Models/User-Token-Blacklist";

class AdminService{

    static async findById(id: string) {
        return UserModel.findById(id);
    }

    public static async tokenInBlackList(accessToken: string) {
        return UserTokenBlacklistModel.findOne({
            token: accessToken
        });
    }

    public static async newAdmin(adminObject: Partial<IAdmin>, res: Response) {
        try {
            // Create new Admin
            const newAdmin = new AdminModel({
                ...adminObject,
            });
            await newAdmin.save();

            // send updated serialised admin in response
            return res.send({
                message: 'Admin created Successfully',
                status: httpCodes.ok
            });
        } catch (logoutError){
            console.error('newAdmin-AdminService', logoutError);
            return  res.sendStatus(httpCodes.serverError);
        }
    }
}


export {
    AdminService
};