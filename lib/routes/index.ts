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
  // Get users
  router.get('/api/admin/user', [passport.authenticate('jwt-access', { session: false }), isBlocked, tokenBlacklist, AdminServiceController.getUsers]);

  // Create user
  router.post('/api/admin/user', [passport.authenticate('jwt-access', { session: false }), isBlocked, tokenBlacklist, AdminServiceController.getUsers]);

  // Edit user
  router.put('/api/admin/user', [passport.authenticate('jwt-access', { session: false }), isBlocked, tokenBlacklist, AdminServiceController.updateUser]);

  // Delete user
  router.delete('/api/admin/user', [passport.authenticate('jwt-access', { session: false }), isBlocked, tokenBlacklist, AdminServiceController.deleteUser]);

  // Block user
  router.put('/api/admin/user/block', [passport.authenticate('jwt-access', { session: false }), isBlocked, tokenBlacklist, AdminServiceController.blockUser]);

  // TODO: Check how to create new admins, which fields should we use and how should we manage the token?
  // Create new admin
  router.post('/api/admin/', [passport.authenticate('jwt-access', { session: false }), isBlocked, tokenBlacklist, newAdmin(), validateErrors, AdminServiceController.newAdmin]);

  return router;
}

export const routes = getRouter();