import type { Request, Response, NextFunction } from 'express';
import { AdminService } from '../services/Admin';
import { SuperAdminService } from '../services/SuperAdmin';
import { httpCodes } from '../constants/http-status-code';
import { UserService } from '../services/User';

async function isAdminOrSuperAdmin(req: Request, res: Response, next: NextFunction) {
  try {
    // @ts-ignore
    const userId = req.user?.userId;

    if (!userId) return res.sendStatus(401);

    let user = await AdminService.findById(userId);

    if (!user || user.isBlocked) {
      // @ts-ignore
      user = await SuperAdminService.findById(userId);
      if (!user || user.isBlocked) return res.sendStatus(401);
    } else {
      if (!user.signedUp) return res.status(httpCodes.badRequest).send('Please Complete Signup First');
    }

    // @ts-ignore
    req['currentUser'] = user;
    next();
  } catch (error) {
    console.error('Error in isAdminOrSuperAdmin:', error);
    res.sendStatus(500);
  }
}


async function isSuperAdmin(req: Request, res: Response, next: NextFunction) {
  try {
    // @ts-ignore
    const superAdminId = req.user?.userId;

    if (!superAdminId) return res.sendStatus(401);

    const superAdmin = await SuperAdminService.findById(superAdminId);

    if (!superAdmin || superAdmin.isBlocked) return res.sendStatus(401);

    // @ts-ignore
    req['superAdmin'] = superAdmin;
    next();
  } catch (error) {
    console.error('Error in isSuperAdmin:', error);
    res.sendStatus(500);
  }
}

async function isBlocked(req: Request, res: Response, next: NextFunction) {
  try {
    // @ts-ignore
    const userId = req.user?.userId;

    if (!userId) return res.sendStatus(401);

    const user = await AdminService.findById(userId);

    if (!user || user.isBlocked) return res.sendStatus(401);

    // @ts-ignore
    req['currentUser'] = user;
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
  isAdminOrSuperAdmin,
  isSuperAdmin,
  isBlocked,
  tokenBlacklist
};