import express from 'express';
import { AdminServiceController } from '../controller';
import passport from '../strategies/passport-strategy';
import { isAdminOrSuperAdmin, isSuperAdmin } from '../middlewares';
import {
  adminLogin,
  adminSetup,
  blockDeleteAdmin,
  blockPost,
  blockUser,
  newAdmin,
  updateAdmin,
  updatePost,
  validateErrors
} from './RequestValidations';
import { authenticateAdminOrSuperAdmin } from '../middlewares/authMiddleware';
const router = express.Router();


function getRouter() {
  router.get('/hello', (req, res) => {
    res.send({ message: 'Hello=world' });
  });

  // Admin Login
  // Todo jacobo: Check the error of the first commented line
  // Mine
  // router.post('/api/admin/auth', [adminLogin(), validateErrors, AdminServiceController.verifyAdmin]);
  // router.post('/api/admin/auth', [...adminLogin(), validateErrors, AdminServiceController.verifyAdmin]);
  // router.post('/api/admin/auth', AdminServiceController.verifyAdmin);
  // Niharika
  // First Time Admin Setup = new Password
  // @ts-ignore
  router.post('/api/admin/setup', [adminSetup(), validateErrors, AdminServiceController.adminSetup]);

  // @ts-ignore
  router.post('/api/admin/login', [adminLogin(), validateErrors, AdminServiceController.adminLogin]);

  // Get Users
  router.get('/api/admin/users', [authenticateAdminOrSuperAdmin, isAdminOrSuperAdmin, AdminServiceController.getUsers]);

  // Block User
  // @ts-ignore
  router.put('/api/admin/user/block', [authenticateAdminOrSuperAdmin, isAdminOrSuperAdmin, blockUser(), validateErrors, AdminServiceController.blockUser]);

  // Get Posts
  // @ts-ignore
  router.get('/api/admin/post', [authenticateAdminOrSuperAdmin, isAdminOrSuperAdmin, AdminServiceController.getPosts]);

  // Update Post
  // @ts-ignore
  router.put('/api/admin/post/', [authenticateAdminOrSuperAdmin, isAdminOrSuperAdmin, updatePost(), validateErrors, AdminServiceController.updatePostAdmin]);

  // Block Post
  // @ts-ignore
  router.put('/api/admin/post/block', [authenticateAdminOrSuperAdmin, isAdminOrSuperAdmin, blockPost(), validateErrors, AdminServiceController.blockPost]);

  // Get Admins
  // @ts-ignore
  router.get('/api/admin/', [authenticateAdminOrSuperAdmin, isAdminOrSuperAdmin, AdminServiceController.getAdmins]);

  // Create Admin
  // Todo jacobo: Check how to handle the admin creation
  // Mine
  // router.post('/api/admin/', [passport.authenticate('jwt-access-admin', { session: false }), isAdminOrSuperAdmin, newAdmin(), validateErrors, AdminServiceController.createAdmin]);
  // router.post('/api/admin/', AdminServiceController.createAdmin);
  // Niharika
  // super admin routes
  router.post('/api/admin/sadmin/admin', [passport.authenticate('jwt-access-super-admin', { session: false }),
    isSuperAdmin, newAdmin(), validateErrors, AdminServiceController.createNewAdmin]);

  // Update Admin
  router.put('/api/admin/', [passport.authenticate('jwt-access-super-admin', { session: false }), isAdminOrSuperAdmin, updateAdmin(), validateErrors, AdminServiceController.updateAdmin]);

  // Block Admin
  router.put('/api/admin/block', [passport.authenticate('jwt-access-super-admin', { session: false }), isAdminOrSuperAdmin, blockDeleteAdmin(), validateErrors, AdminServiceController.blockAdmin]);

  // Delete Admin
  router.delete('/api/admin/', [passport.authenticate('jwt-access-super-admin', { session: false }), isAdminOrSuperAdmin, blockDeleteAdmin(), validateErrors, AdminServiceController.deleteAdmin]);

  //

  // TODO Unblock User
  return router;
}

export const routes = getRouter();