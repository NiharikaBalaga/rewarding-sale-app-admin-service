import express from 'express';
import { AdminServiceController } from '../controller';
import passport from '../strategies/passport-strategy';
import { isAdminOrSuperAdmin, isBlocked, isSuperAdmin, tokenBlacklist } from '../middlewares';
import {
  adminLogin,
  adminSetup,
  blockDeleteAdmin,
  blockPost,
  blockUser,
  newAdmin, postId,
  updateAdmin,
  updatePost, updateUserPoints,
  validateErrors,
} from './RequestValidations';
import { authenticateAdminOrSuperAdmin } from '../middlewares/authMiddleware';
const router = express.Router();


function getRouter() {
  router.get('/hello', (req, res) => {
    res.send({ message: 'Hello=world' });
  });

  // Admin Login
  // First Time Admin Setup = new Password
  // @ts-ignore
  router.post('/api/admin/setup', [adminSetup(), validateErrors, AdminServiceController.adminSetup]);

  // @ts-ignore
  router.post('/api/admin/login', [adminLogin(), validateErrors, AdminServiceController.adminLogin]);

  // Admin Logout
  // @ts-ignore
  router.get('/api/admin/logout', [authenticateAdminOrSuperAdmin, isAdminOrSuperAdmin, isBlocked, tokenBlacklist, AdminServiceController.adminLogut]);

  // Get Users
  // @ts-ignore
  router.get('/api/admin/users', [authenticateAdminOrSuperAdmin, isAdminOrSuperAdmin, isBlocked, tokenBlacklist, AdminServiceController.getUsers]);

  // Block User
  // @ts-ignore
  router.put('/api/admin/user/block', [authenticateAdminOrSuperAdmin, isAdminOrSuperAdmin, blockUser(), validateErrors, AdminServiceController.blockUser]);

  // Update User points
  // @ts-ignore
  router.put('/api/admin/user/points', [authenticateAdminOrSuperAdmin, isAdminOrSuperAdmin, updateUserPoints(), validateErrors, AdminServiceController.updateUserPoints]);

  // Get Posts
  // @ts-ignore
  router.get('/api/admin/post', [authenticateAdminOrSuperAdmin, isAdminOrSuperAdmin, isBlocked, tokenBlacklist, AdminServiceController.getPosts]);

  // Update Post
  // @ts-ignore
  router.put('/api/admin/post/', [authenticateAdminOrSuperAdmin, isAdminOrSuperAdmin, isBlocked, tokenBlacklist, updatePost(), validateErrors, AdminServiceController.updatePostAdmin]);

  // Block Post
  // @ts-ignore
  router.put('/api/admin/post/block', [authenticateAdminOrSuperAdmin, isAdminOrSuperAdmin, isBlocked, tokenBlacklist, blockPost(), validateErrors, AdminServiceController.blockPost]);

  // Posts Votes Reports Count
  // @ts-ignore
  router.get('/api/admin/post/votes/reports/count', [authenticateAdminOrSuperAdmin, isAdminOrSuperAdmin, isBlocked, tokenBlacklist, AdminServiceController.postsVotesReportsCount]);

  // Post Votes Count
  // @ts-ignore
  router.get('/api/admin/post/:postId/votes/count', [authenticateAdminOrSuperAdmin, isAdminOrSuperAdmin, isBlocked, tokenBlacklist, postId(), validateErrors, AdminServiceController.postVoteCount]);

  // Posts Votes Count
  // @ts-ignore
  router.get('/api/admin/post/votes/count', [authenticateAdminOrSuperAdmin, isAdminOrSuperAdmin, isBlocked, tokenBlacklist, AdminServiceController.postsVoteCount]);

  // Post report Count
  // @ts-ignore
  router.get('/api/admin/post/:postId/reports/count', [authenticateAdminOrSuperAdmin, isAdminOrSuperAdmin, isBlocked, tokenBlacklist, postId(), validateErrors, AdminServiceController.postReportCount]);

  // Posts report Count
  // @ts-ignore
  router.get('/api/admin/post/reports/count', [authenticateAdminOrSuperAdmin, isAdminOrSuperAdmin, isBlocked, tokenBlacklist, AdminServiceController.postsReportCount]);

  // Super admin routes

  // Get Admins
  // @ts-ignore
  router.get('/api/admin/', [authenticateAdminOrSuperAdmin, isAdminOrSuperAdmin, AdminServiceController.getAdmins]);

  // Create Admin
  router.post('/api/admin/sadmin/admin', [passport.authenticate('jwt-access-super-admin', { session: false }),
    isSuperAdmin, newAdmin(), validateErrors, AdminServiceController.createNewAdmin]);

  // Update Admin
  router.put('/api/admin/', [passport.authenticate('jwt-access-super-admin', { session: false }), isAdminOrSuperAdmin, updateAdmin(), validateErrors, AdminServiceController.updateAdmin]);

  // Block Admin
  router.put('/api/admin/block', [passport.authenticate('jwt-access-super-admin', { session: false }), isAdminOrSuperAdmin, blockDeleteAdmin(), validateErrors, AdminServiceController.blockAdmin]);

  // Delete Admin
  router.delete('/api/admin/', [passport.authenticate('jwt-access-super-admin', { session: false }), isAdminOrSuperAdmin, blockDeleteAdmin(), validateErrors, AdminServiceController.deleteAdmin]);

  // TODO Unblock User
  return router;
}

export const routes = getRouter();