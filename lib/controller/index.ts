import mongoose from "mongoose";
import type { Request, Response } from 'express';
import {UserService} from "../services/User";
import {AdminService} from "../services/Admin";
import type { IUser } from '../DB/Models/User';
import {PostService} from "../services/Post";

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

interface RequestInterferedByIsBlocked extends RequestValidatedByPassport {
    currentUser: IUser
}

class AdminServiceController {

    //Temporal Id - It must be removed when token is set up
    static AdminId  = "65e8ec7e9a564e67935a873c";
    static UserId  = "65e8ec7e9a564e67935a873c";

    public static getUsers(req: Request, res: Response) {
        return UserService.getUsers(res);
    }

    /*public static blockUser(req: RequestInterferedByIsBlocked, res: Response) {
        const { id }  = req.currentUser;
        return UserService.blockUser(id, res);
    }*/
    public static blockUser(req: Request, res: Response) {
        //const id  = "65e13f12ff714f29188f0290";
        const { userId } = req.body.matchedData;
        return UserService.blockUser(userId, res);
    }

    public static getPosts(req: Request, res: Response) {
        return PostService.getPosts(res);
    }

    /*public static updatePost(req: RequestInterferedByIsBlocked, res: Response) {
        const { matchedData  } = req.body;
        const id  = matchedData._id;
        return PostService.updatePostAdmin(id, matchedData);
    }*/
    public static updatePostAdmin(req: Request, res: Response) {
        const { matchedData  } = req.body;
        const postId  = matchedData.postId;
        console.log("updatePostAdmin");
        console.log("matchedData: ", matchedData);
        console.log("postId: ", postId);
        console.log("----------------------------------------");
        console.log("");
        return PostService.updatePostAdmin(postId, matchedData, res);
    }

    /*public static blockPost(req: RequestInterferedByIsBlocked, res: Response) {
        const { id }  = req.currentUser;
        return UserService.blockUser(id, res);
    }*/
    public static blockPost(req: Request, res: Response) {
        const { matchedData  } = req.body;
        const postId  = matchedData.postId;
        console.log("blockPost");
        console.log("matchedData: ", matchedData);
        console.log("postId: ", postId);
        console.log("----------------------------------------");
        console.log("");
        return PostService.blockPost(postId, res);
    }

    public static getAdmins(req: Request, res: Response) {
        return AdminService.getAdmins(res);
    }

    public static createAdmin(req: Request, res: Response) {
        const { matchedData } = req.body;
        return AdminService.createAdmin(matchedData, res);
    }

    /*public static updateAdmin(req: RequestInterferedByIsBlocked, res: Response) {
        const { id }  = req.currentUser;
        const { matchedData  } = req.body;
        return AdminService.updateAdmin(id, matchedData);
    }*/
    public static updateAdmin(req: Request, res: Response) {
        //const id  = "65e134474406939a9d20c77f";
        const { matchedData  } = req.body;
        return AdminService.updateAdmin(AdminServiceController.AdminId, matchedData, res);
    }

    /*public static blockAdmin(req: RequestInterferedByIsBlocked, res: Response) {
        const { id }  = req.currentUser;
        return UserService.blockUser(id, res);
    }*/
    public static blockAdmin(req: Request, res: Response) {
        //const id  = "65e13f12ff714f29188f0290";
        return AdminService.blockAdmin(AdminServiceController.AdminId, res);
    }

    /*public static deleteAdmin(req: RequestInterferedByIsBlocked, res: Response) {
        const { id }  = req.currentUser;
        const objectId = new mongoose.Types.ObjectId(id);
        return UserService.deleteUser(objectId, res);
    }*/
    public static deleteAdmin(req: Request, res: Response) {
        const { adminId } = req.body.matchedData;
        const objectId = new mongoose.Types.ObjectId(adminId);
        console.log("deleteAdmin controller");
        console.log("adminId: ", adminId);
        console.log("objectId: ", objectId);
        return AdminService.deleteAdmin(objectId, res);
    }
}

export  {
    AdminServiceController
};