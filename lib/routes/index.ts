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

  // Get Users
  router.get('/api/admin/user', [passport.authenticate('jwt-access', { session: false }), isBlocked, tokenBlacklist, AdminServiceController.getUsers]);

  // Edit user
  //router.put('/api/admin/user', [passport.authenticate('jwt-access', { session: false }), isBlocked, tokenBlacklist, AdminServiceController.getUsers]);

  // Delete user
  //router.delete('/api/admin/user', [passport.authenticate('jwt-access', { session: false }), isBlocked, tokenBlacklist, AdminServiceController.getUsers]);

  // Block user
  //router.put('/api/admin/user/block', [passport.authenticate('jwt-access', { session: false }), isBlocked, tokenBlacklist, AdminServiceController.getUsers]);

  //TODO: Create newAdmin() and validateErrors
  // Create new Admin
  //router.post('/api/admin/', [passport.authenticate('jwt-access', { session: false }), isBlocked, tokenBlacklist, newAdmin(), validateErrors, AdminServiceController.newAdmin]);
  router.post('/api/admin', newAdmin(), validateErrors, AdminServiceController.newAdmin);

  return router;
}

export const routes = getRouter();