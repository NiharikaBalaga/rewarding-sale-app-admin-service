import SuperAdminModel from '../DB/Models/SuperAdmin';
import type { Response } from 'express';
import { httpCodes } from '../constants/http-status-code';
import { AdminService } from './Admin';
import mongoose from 'mongoose';
import { AdminStatus } from '../DB/Models/admin-status.enum';
import AdminModel, { IAdmin } from '../DB/Models/Admin';

class SuperAdminService {
  static async findById(id: string) {
    return SuperAdminModel.findById(id);
  }

  static async createNewAdmin(email: string, firstName: string, lastName: string, phoneNumber: string, res: Response) {
    try {
      await AdminService.create(email, firstName, lastName, phoneNumber);
      return res.send('New Admin Created');
    } catch (error) {
      if (error.message === 'Admin Exists Already')
        return res.status(httpCodes.badRequest).send('Admin Exists Already');
      console.error('createNewAdmin-superAdmin-service-error', error);
      return res.status(httpCodes.serverError).send('Server Error');
    }
  }

  public static async getAdmins(res: Response) {
    try {
      // Get admins
      const admins = await AdminModel.find({}).exec();

      // send updated serialised admin in response
      if (admins) {
        return res.send({
          message: 'Admins Retrieved Successfully',
          status: httpCodes.ok,
          admins: admins
        });
      } else {
        return res.send({
          message: 'Admins Retrieved without success, please check',
          status: httpCodes.notFound,
          admins: null
        });
      }
    } catch (error) {
      console.error('getAdmins-error', error);
      return res.sendStatus(httpCodes.serverError).send('Server Error, Please try again later');
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
      if (updatedAdmin) {
        return res.send({
          message: 'Admin Updated Successfully',
          status: AdminStatus.updated,
          updatedAdmin: updatedAdmin
        });
      } else {
        return res.send({
          message: 'Admin Updated without success, please check',
          status: AdminStatus.notUpdated,
          updatedAdmin: null
        });
      }
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
      if (updatedAdmin) {
        return res.send({
          message: 'Admin Blocked Successfully',
          status: AdminStatus.blocked,
          updatedAdmin: updatedAdmin
        });
      } else {
        return res.send({
          message: 'Admin Blocked without success, please check',
          status: AdminStatus.notUpdated,
          updatedAdmin: updatedAdmin
        });
      }
    } catch (error) {
      // TODO handle any failure
      console.error('blockAdmin-error', error);
      return res.status(httpCodes.serverError).send('Server Error, Please try again later');
    }
  }

  public static async deleteAdmin(adminId: mongoose.Types.ObjectId, res: Response) {
    try {
      // Delete admin
      const adminDeleted = await AdminModel.deleteOne({ _id: adminId }).exec();

      // send updated serialised admin in response
      if (adminDeleted) {
        return res.send({
          message: 'Admin Deleted Successfully',
          status: AdminStatus.deleted,
          adminDeleted: adminDeleted
        });
      } else {
        return res.send({
          message: 'Admin Deleted without success, please check',
          status: AdminStatus.notDeleted,
          adminDeleted: null
        });
      }
    } catch (error) {
      console.error('deleteAdmin-error', error);
      return res.sendStatus(httpCodes.serverError).send('Server Error, Please try again later');
    }
  }
}

export {
  SuperAdminService
};