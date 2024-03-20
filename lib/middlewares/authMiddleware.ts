import passport from '../strategies/passport-strategy';
import type { Request, Response, NextFunction } from 'express';

interface AdminUser {
  userId: string;
  phoneNumber: string;
  iat: number;
  exp: number;
  accessToken: string;
}

const authenticateAdminOrSuperAdmin = (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate('jwt-access-admin', { session: false }, (err: Error | null, admin: AdminUser | false) => {
    if (err || !admin) {
      passport.authenticate('jwt-access-super-admin', { session: false }, (err: Error | null, superAdmin: AdminUser | false) => {
        console.log('Super Admin:', superAdmin);
        if (err || !superAdmin)
          return res.status(401).send('Unauthorized');

        req.user = superAdmin;
        return next();
      })(req, res, next);
    } else {
      req.user = admin;
      return next();
    }
  })(req, res, next);
};

export { authenticateAdminOrSuperAdmin };
