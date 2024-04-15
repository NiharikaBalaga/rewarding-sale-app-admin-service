import mongoose from 'mongoose';
import type { Request, Response } from 'express';
import { UserService } from '../services/User';
import { AdminService } from '../services/Admin';
import type { ISuperAdmin } from '../DB/Models/SuperAdmin';
import { SuperAdminService } from '../services/SuperAdmin';
import { PostService } from '../services/Post';
import { VoteService } from '../services/Vote';
import { ReportService } from '../services/Report';
import { PointsService } from '../services/PointsService';



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
    const { matchedData: { email, password, superAdmin } } = req.body;
    return AdminService.login(email, password, superAdmin, res);
  }

  public static adminLogut(req: RequestInterferedByIsSuperAdmin, res: Response) {
    const { accessToken } = req.user;
    return AdminService.logout(accessToken, res);
  }

  /* public static verifyAdmin(req: Request, res: Response) {
      const { matchedData: { email, password } } = req.body;
      return AuthService.verifyAdmin(email, password, res);
  } */

  public static getUsers(req: RequestInterferedByIsSuperAdmin, res: Response) {
    return UserService.getUsers(res);
  }

  public static blockUser(req: RequestInterferedByIsSuperAdmin, res: Response) {
    const { userId, blockUser } = req.body.matchedData;
    return UserService.blockUser(userId, blockUser, res);
  }

  public static updateUserPostPoints(req: RequestInterferedByIsSuperAdmin, res: Response) {
    const { userId, postId, userPoints, oldPostPoints, newPostPoints } = req.body.matchedData;
    return PointsService.updateUserPostPoints(userId, postId, userPoints, oldPostPoints, newPostPoints, res);
  }

  public static getUserPostsPoints(req: RequestInterferedByIsSuperAdmin, res: Response) {
    const { userId } = req.params;
    return PointsService.getUserPostsPoints(userId, res);
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
    const blockPost = matchedData.blockPost;
    return PostService.blockPost(postId, blockPost, res);
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
    const { adminId, blockAdmin } = req.body.matchedData;
    return SuperAdminService.blockAdmin(adminId, blockAdmin, res);
  }

  public static deleteAdmin(req: RequestInterferedByIsSuperAdmin, res: Response) {
    const { adminId } = req.body.matchedData;
    const objectId = new mongoose.Types.ObjectId(adminId);
    return SuperAdminService.deleteAdmin(objectId, res);
  }

  public static postsVotesReportsCount(req: RequestInterferedByIsSuperAdmin, res: Response) {
    return AdminService.postsVotesReportsCount(res);
  }

  public static postVoteCount(req: RequestInterferedByIsSuperAdmin, res: Response) {
    const { matchedData: { postId } } = req.body;
    return VoteService.postVoteCount(postId, res);
  }

  public static postsVoteCount(req: RequestInterferedByIsSuperAdmin, res: Response) {
    return VoteService.postsVoteCount(res);
  }

  public static postReportCount(req: RequestInterferedByIsSuperAdmin, res: Response) {
    const { matchedData: { postId } } = req.body;

    return ReportService.getPostReportCounts(postId, res);
  }

  public static postsReportCount(req: RequestInterferedByIsSuperAdmin, res: Response) {
    return ReportService.getPostsReportCounts(res);
  }

}

export {
  AdminServiceController
};