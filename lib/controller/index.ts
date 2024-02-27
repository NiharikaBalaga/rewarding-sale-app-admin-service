import mongoose from "mongoose";
import type { Request, Response } from 'express';
import {UserService} from "../services/User";
import {AdminService} from "../services/Admin";

// TODO: Do I need to create those methods here?
/*interface RequestValidatedByPassport extends Request {
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
}*/

class AdminServiceController {

    public static getUsers(req: Request, res: Response) {
        return UserService.getUsers(res);
    }

    public static newAdmin(req: Request, res: Response) {
        const { matchedData } = req.body;
        console.log("------------------------- newAdmin -------------------------")
        console.log("matchedData: ", matchedData)
        return AdminService.newAdmin(matchedData, res);
    }
}

export  {
    AdminServiceController
};