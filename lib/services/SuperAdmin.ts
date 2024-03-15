import SuperAdminModel from '../DB/Models/SuperAdmin';
import type { Response } from 'express';
import { httpCodes } from '../constants/http-status-code';
import { AdminService } from './Admin';

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
}

export  {
  SuperAdminService
};