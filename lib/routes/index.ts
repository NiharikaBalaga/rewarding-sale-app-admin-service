import express from 'express';
import passport from "passport";
import {isBlocked, tokenBlacklist} from "../middlewares";
import {AdminServiceController} from "../controller";
import {newAdmin, validateErrors} from "./RequestValidations";

const router = express.Router();


function getRouter() {
  router.get('/hello', (req, res) => {
    res.send({ message: 'Hello=world' });
  });

  // TODO: check if the token validations should be in UserService or in AdminService
  // Get Users
  //router.get('/api/admin/user', [passport.authenticate('jwt-access', { session: false }), isBlocked, tokenBlacklist, AdminServiceController.getUsers]);
  router.get('/api/admin/user', AdminServiceController.getUsers);

  // Block User
  //router.put('/api/admin/user/block', [passport.authenticate('jwt-access', { session: false }), isBlocked, tokenBlacklist, AdminServiceController.blockUser]);
  router.put('/api/admin/user/block', AdminServiceController.blockUser);

  // Get Admins
  //router.post('/api/admin/', [passport.authenticate('jwt-access', { session: false }), isBlocked, tokenBlacklist, newAdmin(), validateErrors, AdminServiceController.getAdmins]);
  router.get('/api/admin/', AdminServiceController.getAdmins);

  // TODO: Check how to create new admins, which fields should we use and how should we manage the token?
  // Create Admin
  //router.post('/api/admin/', [passport.authenticate('jwt-access', { session: false }), isBlocked, tokenBlacklist, newAdmin(), validateErrors, AdminServiceController.newAdmin]);
  router.post('/api/admin/', AdminServiceController.createAdmin);

  // Update Admin
  //router.post('/api/admin/', [passport.authenticate('jwt-access', { session: false }), isBlocked, tokenBlacklist, newAdmin(), validateErrors, AdminServiceController.updateAdmin]);
  router.put('/api/admin/', AdminServiceController.updateAdmin);

  // Block Admin
  //router.post('/api/admin/', [passport.authenticate('jwt-access', { session: false }), isBlocked, tokenBlacklist, newAdmin(), validateErrors, AdminServiceController.newAdmin]);
  router.put('/api/admin/block', AdminServiceController.blockAdmin);

  // Delete Admin
  //router.post('/api/admin/', [passport.authenticate('jwt-access', { session: false }), isBlocked, tokenBlacklist, newAdmin(), validateErrors, AdminServiceController.newAdmin]);
  router.delete('/api/admin/', AdminServiceController.deleteAdmin);

  return router;
}

export const routes = getRouter();