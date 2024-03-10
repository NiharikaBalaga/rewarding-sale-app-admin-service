import type { Request, Response, NextFunction } from 'express';
import { UserService } from "../services/User";
import {AdminService} from "../services/Admin";

async function isBlocked(req: Request, res: Response, next: NextFunction) {
    try {
        // @ts-ignore
        const adminEmail = req.user?.email;

        if (!adminEmail) return res.sendStatus(401);

        const admin = await AdminService.findAdminByEmail(adminEmail);

        if (!admin || admin.isBlocked) return res.sendStatus(401);

        // @ts-ignore
        req['currentAdmin'] = admin;
        next();
    } catch (error) {
        console.error('Error in IsBlockedGuard:', error);
        res.sendStatus(500);
    }
}

async function tokenBlacklist(req: Request, res: Response, next: NextFunction) {
    try {
        // @ts-ignore
        const accessToken = req.user?.accessToken;

        const tokenInBlackList =  await AdminService.tokenInBlackList(accessToken);

        if (tokenInBlackList) return res.sendStatus(401);

        next();
    } catch (error) {
        console.error('Error in TokenBlacklistGuard:', error);
        res.sendStatus(500);
    }
}

export  {
    isBlocked,
    tokenBlacklist
};