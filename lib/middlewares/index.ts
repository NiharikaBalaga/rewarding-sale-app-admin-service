import type { Request, Response, NextFunction } from 'express';
import { AdminService } from '../services/Admin';
import { SuperAdminService } from '../services/SuperAdmin';
import { httpCodes } from '../constants/http-status-code';

async function isAdmin(req: Request, res: Response, next: NextFunction) {
  try {
    // @ts-ignore
    const adminId = req.user?.userId;

    if (!adminId) return res.sendStatus(401);

    const admin = await AdminService.findById(adminId);

    if (!admin || admin.isBlocked) return res.sendStatus(401);

    if (!admin.signedUp) return res.status(httpCodes.badRequest).send('Please Complete Signup First');

    // @ts-ignore
    req['currentAdmin'] = admin;
    next();
  } catch (error) {
    console.error('Error in isBlocked:', error);
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


export  {
  isAdmin,
  isSuperAdmin
};