import mongoose from 'mongoose';
import type { Request, Response } from 'express';
import { UserService } from '../services/User';
import { AdminService } from '../services/Admin';
import type { IUser } from '../DB/Models/User';
import type { ISuperAdmin } from '../DB/Models/SuperAdmin';
import { SuperAdminService } from '../services/SuperAdmin';

interface RequestValidatedByPassport extends Request {
  user: {
    userId: string;
    accessToken: string;
    phoneNumber: string,
    iat: number,
    exp: number,
    refreshToken: string
  }
}

interface RequestInterferedByIsSuperAdmin extends RequestValidatedByPassport {
  superAdmin: ISuperAdmin
}

class AdminServiceController {
  public static createNewAdmin(req: RequestInterferedByIsSuperAdmin, res: Response) {
    const { matchedData: { email, firstName, lastName, phoneNumber } } = req.body;
    return SuperAdminService.createNewAdmin(email, firstName, lastName, phoneNumber, res);
  }

  public static adminSetup(req: Request, res: Response) {
    const { matchedData: { email, oneTimePassword, phoneNumber, password } } = req.body;
    return AdminService.setUp(email, phoneNumber, oneTimePassword, password, res);
  }

  public static adminLogin(req: Request, res: Response) {
    const { matchedData: { email, password } } = req.body;
    return AdminService.login(email, password, res);
  }

  // Temporal Id - It must be removed when token is set up
  static AdminId = '65e14c9aaeba468189905fd2';

  public static getUsers(req: Request, res: Response) {
    return UserService.getUsers(res);
  }

  public static blockUser(req: Request, res: Response) {
    // const id  = "65e13f12ff714f29188f0290";
    return UserService.blockUser(AdminServiceController.AdminId, res);
  }
}

export {
  AdminServiceController
};