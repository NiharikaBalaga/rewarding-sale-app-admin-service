import express from 'express';
import { AdminServiceController } from '../controller';
import passport from '../strategies/passport-strategy';
import { isAdmin, isSuperAdmin } from '../middlewares';
import { adminLogin, adminSetup, newAdmin, validateErrors } from './RequestValidations';
const router = express.Router();


function getRouter() {
  router.get('/hello', (req, res) => {
    res.send({ message: 'Hello=world' });
  });


  // super admin routes
  router.post('/api/admin/sadmin/admin', [passport.authenticate('jwt-access-super-admin', { session: false }),
    isSuperAdmin, newAdmin(), validateErrors, AdminServiceController.createNewAdmin]);

  // First Time Admin Setup = new Password
  // @ts-ignore
  router.post('/api/admin/setup', [adminSetup(), validateErrors, AdminServiceController.adminSetup]);

  // @ts-ignore
  router.post('/api/admin/login', [adminLogin(), validateErrors, AdminServiceController.adminLogin]);


  // Get All Users
  router.get('/api/admin/users', [passport.authenticate('jwt-access-admin', { session: false }), isAdmin, AdminServiceController.getUsers]);

  router.put('/api/admin/user/block', [passport.authenticate('jwt-access-admin', { session: false }), isAdmin, AdminServiceController.blockUser]);


  // TODO Unblock User
  return router;
}

export const routes = getRouter();