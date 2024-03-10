import express from 'express';
import passport from '../strategies/passport-strategy';
import { isBlocked, tokenBlacklist } from '../middlewares';
import { AdminServiceController } from "../controller";
import {
  adminLogin,
  blockDeleteAdmin, blockUpdatePost,
  blockUser,
  newAdmin,
  updateAdmin,
  validateErrors
} from "./RequestValidations";

const router = express.Router();


function getRouter() {
  router.get('/hello', (req, res) => {
    res.send({ message: 'Hello=world' });
  });

  // Admin Login
  //Todo jacobo: Check the error of the first commented line
  //router.post('/api/admin/auth', [adminLogin(), validateErrors, AdminServiceController.verifyAdmin]);
  router.post('/api/admin/auth', [...adminLogin(), validateErrors, AdminServiceController.verifyAdmin]);
  //router.post('/api/admin/auth', AdminServiceController.verifyAdmin);

  // Get Users
  router.get('/api/admin/user', [passport.authenticate('jwt-access', { session: false }), isBlocked, tokenBlacklist, AdminServiceController.getUsers]);

  // Block User
  router.put('/api/admin/user/block', [passport.authenticate('jwt-access', { session: false }), isBlocked, tokenBlacklist, blockUser(), validateErrors, AdminServiceController.blockUser]);

  // Get Posts
  router.get('/api/admin/post', [passport.authenticate('jwt-access', { session: false }), isBlocked, tokenBlacklist, AdminServiceController.getPosts]);

  // Update Post
  router.put('/api/admin/post/', [passport.authenticate('jwt-access', { session: false }), isBlocked, tokenBlacklist, blockUpdatePost(), validateErrors, AdminServiceController.updatePostAdmin]);

  // Block Post
  router.put('/api/admin/post/block', [passport.authenticate('jwt-access', { session: false }), isBlocked, tokenBlacklist, blockUpdatePost(), validateErrors, AdminServiceController.blockPost]);

  // Get Admins
  router.get('/api/admin/', [passport.authenticate('jwt-access', { session: false }), isBlocked, tokenBlacklist, AdminServiceController.getAdmins]);

  // Create Admin
  //Todo jacobo: Check how to handle the admin creation
  //router.post('/api/admin/', [passport.authenticate('jwt-access', { session: false }), isBlocked, tokenBlacklist, newAdmin(), validateErrors, AdminServiceController.createAdmin]);
  router.post('/api/admin/', AdminServiceController.createAdmin);

  // Update Admin
  router.put('/api/admin/', [passport.authenticate('jwt-access', { session: false }), isBlocked, tokenBlacklist, updateAdmin(), validateErrors, AdminServiceController.updateAdmin]);

  // Block Admin
  router.put('/api/admin/block', [passport.authenticate('jwt-access', { session: false }), isBlocked, tokenBlacklist, blockDeleteAdmin(), validateErrors, AdminServiceController.blockAdmin]);

  // Delete Admin
  router.delete('/api/admin/', [passport.authenticate('jwt-access', { session: false }), isBlocked, tokenBlacklist, blockDeleteAdmin(), validateErrors, AdminServiceController.deleteAdmin]);

  return router;
}

export const routes = getRouter();