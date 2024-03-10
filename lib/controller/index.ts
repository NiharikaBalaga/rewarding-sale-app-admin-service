import mongoose from "mongoose";
import type { Request, Response } from 'express';
import {UserService} from "../services/User";
import {AdminService} from "../services/Admin";
import {AuthService} from "../services/Auth";
import {IAdmin} from "../DB/Models/Admin";
import {PostService} from "../services/Post";

interface RequestValidatedByPassport extends Request {
    admin: {
        email: string;
        accessToken: string;
        iat: number,
        exp: number,
        refreshToken: string
    }
}

interface RequestInterferedByIsBlocked extends RequestValidatedByPassport {
    currentAdmin: IAdmin
}

class AdminServiceController {

    public static verifyAdmin(req: Request, res: Response) {
        const { matchedData: { email, password } } = req.body;
        return AuthService.verifyAdmin(email, password, res);
    }

    public static getUsers(req: RequestInterferedByIsBlocked, res: Response) {
        return UserService.getUsers(res);
    }

    public static blockUser(req: RequestInterferedByIsBlocked, res: Response) {
        const { userId } = req.body.matchedData;
        return UserService.blockUser(userId, res);
    }

    public static getPosts(req: RequestInterferedByIsBlocked, res: Response) {
        return PostService.getPosts(res);
    }

    public static updatePostAdmin(req: RequestInterferedByIsBlocked, res: Response) {
        const { matchedData  } = req.body;
        const postId  = matchedData.postId;
        return PostService.updatePostAdmin(postId, matchedData, res);
    }

    public static blockPost(req: RequestInterferedByIsBlocked, res: Response) {
        const { matchedData  } = req.body;
        const postId  = matchedData.postId;
        return PostService.blockPost(postId, res);
    }

    public static getAdmins(req: RequestInterferedByIsBlocked, res: Response) {
        return AdminService.getAdmins(res);
    }

    /*public static createAdmin(req: RequestInterferedByIsBlocked, res: Response) {
        const { matchedData } = req.body;
        return AdminService.createAdmin(matchedData, res);
    }*/
    public static createAdmin(req: Request, res: Response) {
        const { matchedData } = req.body;
        return AdminService.createAdmin(matchedData, res);
    }

    public static updateAdmin(req: RequestInterferedByIsBlocked, res: Response) {
        const { adminId }  = req.body.matchedData;
        const { matchedData  } = req.body;
        return AdminService.updateAdmin(adminId, matchedData, res);
    }

    public static blockAdmin(req: RequestInterferedByIsBlocked, res: Response) {
        const { adminId }  = req.body.matchedData;
        return AdminService.blockAdmin(adminId, res);
    }

    public static deleteAdmin(req: RequestInterferedByIsBlocked, res: Response) {
        const { adminId }  = req.body.matchedData;
        const objectId = new mongoose.Types.ObjectId(adminId);
        return AdminService.deleteAdmin(objectId, res);
    }
}

export  {
    AdminServiceController
};