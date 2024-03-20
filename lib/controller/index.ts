import mongoose from 'mongoose';
import type { Request, Response } from 'express';
import { UserService } from '../services/User';
import { AdminService } from '../services/Admin';
import type { ISuperAdmin } from '../DB/Models/SuperAdmin';
import { SuperAdminService } from '../services/SuperAdmin';
import { PostService } from '../services/Post';


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
  public static adminSetup(req: Request, res: Response) {
    const { matchedData: { email, oneTimePassword, phoneNumber, password } } = req.body;
    return AdminService.setUp(email, phoneNumber, oneTimePassword, password, res);
  }

  public static adminLogin(req: Request, res: Response) {
    const { matchedData: { email, password } } = req.body;
    return AdminService.login(email, password, res);
  }

  /* public static verifyAdmin(req: Request, res: Response) {
      const { matchedData: { email, password } } = req.body;
      return AuthService.verifyAdmin(email, password, res);
  } */

  public static getUsers(req: Request, res: Response) {
    return UserService.getUsers(res);
  }

  public static blockUser(req: Request, res: Response) {
    const { userId } = req.body.matchedData;
    return UserService.blockUser(userId, res);
  }

  public static getPosts(req: Request, res: Response) {
    return PostService.getPosts(res);
  }

  public static updatePostAdmin(req: Request, res: Response) {
    const { matchedData } = req.body;
    console.log('updatePostAdmin');
    console.log('matchedData: ', matchedData);
    const postId = matchedData.postId;
    return PostService.updatePostAdmin(postId, matchedData, res);
  }

  public static blockPost(req: Request, res: Response) {
    const { matchedData } = req.body;
    const postId = matchedData.postId;
    return PostService.blockPost(postId, res);
  }

  public static getAdmins(req: RequestInterferedByIsSuperAdmin, res: Response) {
    return SuperAdminService.getAdmins(res);
  }

  // Mine
  /* public static createAdmin(req: RequestValidatedByPassport, res: Response) {
      const { matchedData } = req.body;
      return AdminService.createAdmin(matchedData, res);
  }*/
  /* public static createAdmin(req: Request, res: Response) {
    const { matchedData } = req.body;
    return AdminService.createAdmin(matchedData, res);
  } */
  // Niharika
  public static createNewAdmin(req: RequestInterferedByIsSuperAdmin, res: Response) {
    const { matchedData: { email, firstName, lastName, phoneNumber } } = req.body;
    return SuperAdminService.createNewAdmin(email, firstName, lastName, phoneNumber, res);
  }

  public static updateAdmin(req: RequestInterferedByIsSuperAdmin, res: Response) {
    const { adminId } = req.body.matchedData;
    const { matchedData } = req.body;
    return SuperAdminService.updateAdmin(adminId, matchedData, res);
  }

  public static blockAdmin(req: RequestInterferedByIsSuperAdmin, res: Response) {
    const { adminId } = req.body.matchedData;
    return SuperAdminService.blockAdmin(adminId, res);
  }

  public static deleteAdmin(req: RequestInterferedByIsSuperAdmin, res: Response) {
    const { adminId } = req.body.matchedData;
    const objectId = new mongoose.Types.ObjectId(adminId);
    return SuperAdminService.deleteAdmin(objectId, res);
  }
}

export {
  AdminServiceController
};