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

    public static getUsers(req: Request, res: Response) {
        return UserService.getUsers(res);
    }

    public static createUser(req: RequestInterferedByIsBlocked, res: Response) {
        const { id }  = req.currentUser;
        const { matchedData  } = req.body;
        return UserService.createUser(id, matchedData, res);
    }

    public static updateUser(req: RequestInterferedByIsBlocked, res: Response) {
        const { id }  = req.currentUser;
        const { matchedData  } = req.body;
        return UserService.updateUser(id, matchedData);
    }

    public static deleteUser(req: RequestInterferedByIsBlocked, res: Response) {
        const { id }  = req.currentUser;
        const objectId = new mongoose.Types.ObjectId(id);
        return UserService.deleteUser(objectId, res);
    }

    public static blockUser(req: RequestInterferedByIsBlocked, res: Response) {
        const { id }  = req.currentUser;
        return UserService.blockUser(id, res);
    }

    public static newAdmin(req: Request, res: Response) {
        const { matchedData } = req.body;
        return AdminService.newAdmin(matchedData, res);
    }
}

export  {
    AdminServiceController
};