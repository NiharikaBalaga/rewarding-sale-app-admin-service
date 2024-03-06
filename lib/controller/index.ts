import mongoose from "mongoose";
import type { Request, Response } from 'express';
import {UserService} from "../services/User";
import {AdminService} from "../services/Admin";
import type { IUser } from '../DB/Models/User';

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
    static AdminId  = "65e14c9aaeba468189905fd2";

    public static getUsers(req: Request, res: Response) {
        return UserService.getUsers(res);
    }

    /*public static blockUser(req: RequestInterferedByIsBlocked, res: Response) {
        const { id }  = req.currentUser;
        return UserService.blockUser(id, res);
    }*/
    public static blockUser(req: Request, res: Response) {
        //const id  = "65e13f12ff714f29188f0290";
        return UserService.blockUser(AdminServiceController.AdminId, res);
    }

    public static getAdmins(req: Request, res: Response) {
        return AdminService.getAdmins(res);
    }

    public static createAdmin(req: Request, res: Response) {
        const { matchedData } = req.body;
        return AdminService.createAdmin(matchedData, res);
    }

    /*public static updateUser(req: RequestInterferedByIsBlocked, res: Response) {
        const { id }  = req.currentUser;
        const { matchedData  } = req.body;
        return UserService.updateUser(id, matchedData);
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