import type { Response } from "express";
import AdminModel, {IAdmin} from "../DB/Models/Admin";
import {httpCodes} from "../constants/http-status-code";
import UserModel from "../DB/Models/User";
import UserTokenBlacklistModel from "../DB/Models/User-Token-Blacklist";
import {AdminStatus} from "../DB/Models/admin-status.enum";
import mongoose from "mongoose";

class AdminService{

    static async findById(id: string) {
        return UserModel.findById(id);
    }

    public static async tokenInBlackList(accessToken: string) {
        return UserTokenBlacklistModel.findOne({
            token: accessToken
        });
    }

    public static async getAdmins(res: Response) {
        try {
            // Get admins
            const admins = await AdminModel.find({}).exec();

            // send updated serialised admin in response
            return res.send({
                message: 'Admins Retrieved Successfully',
                status: httpCodes.ok,
                admins: admins
            });
        } catch (error){
            console.error('getAdmins-error', error);
            return  res.sendStatus(httpCodes.serverError).send('Server Error, Please try again later');
        }
    }

    public static async createAdmin(adminObject: Partial<IAdmin>, res: Response) {
        try {
            // Create new Admin
            const newAdmin = new AdminModel({
                ...adminObject,
            });
            await newAdmin.save();

            // send updated serialised admin in response
            return res.send({
                message: 'Admin created Successfully',
                status: AdminStatus.created,
                newAdmin: newAdmin
            });
        } catch (logoutError){
            console.error('createAdmin-AdminService', logoutError);
            return  res.sendStatus(httpCodes.serverError);
        }
    }

    private static async _update(id: string, updateAdminDto: any) {
        return AdminModel
            .findByIdAndUpdate(id, updateAdminDto, { new: true })
            .exec();
    }

    static async updateAdmin(adminId: string, adminObject: Partial<IAdmin>, res: Response) {
        try {

            // Updates admin data
            const updatedAdmin = await this._update(adminId, {
                ...adminObject
            });

            // TODO: Check how to implement Aws
            // SNS event
            /*if (updatedAdmin)
              Aws.adminUpdatedEvent(updatedAdmin);*/

            // send updated serialised admin in response
            return res.send({
                message: 'Admin Updated Successfully',
                status: AdminStatus.updated,
                updatedAdmin: updatedAdmin
            });
        } catch (error) {
            // TODO handle any failure
            console.error('updateAdmin-error', error);
            return res.status(httpCodes.serverError).send('Server Error, Please try again later');
        }

    }

    static async blockAdmin(adminId: string, res: Response) {
        try {

            // Updates isBlocked field to true
            const updatedAdmin = await this._update(adminId, {
                isBlocked: true
            });

            // TODO: Check how to implement Aws
            // SNS event
            /*if (updatedAdmin)
              Aws.adminUpdatedEvent(updatedAdmin);*/

            // send updated serialised admin in response
            return res.send({
                message: 'Admin Blocked Successfully',
                status: AdminStatus.blocked,
                updatedAdmin: updatedAdmin
            });
        } catch (error) {
            // TODO handle any failure
            console.error('blockAdmin-error', error);
            return res.status(httpCodes.serverError).send('Server Error, Please try again later');
        }
    }

    public static async deleteAdmin(adminId: mongoose.Types.ObjectId, res: Response) {
        try {
            console.log("deleteAdmin service");
            console.log("adminId: ", adminId);
            // Delete admin
            const adminDeleted = await AdminModel.deleteOne({ _id: adminId }).exec();


            // send updated serialised admin in response
            return res.send({
                message: 'Admin Deleted Successfully',
                status: AdminStatus.deleted,
                adminDeleted: adminDeleted
            });
        } catch (error){
            console.error('deleteAdmin-error', error);
            return  res.sendStatus(httpCodes.serverError).send('Server Error, Please try again later');
        }
    }
}


export {
    AdminService
};