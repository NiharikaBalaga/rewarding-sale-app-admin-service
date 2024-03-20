import type { Response } from 'express';
import AdminModel from '../DB/Models/Admin';
import { httpCodes } from '../constants/http-status-code';
import * as argon2 from 'argon2';
import { TokenService } from './Token';
import { SNSService } from './SNS';

class AdminService {

  static async findById(id: string) {
    return AdminModel.findById(id);
  }

  static async findByEmail(email: string) {
    return AdminModel.findOne({
      email
    });
  }

  static async create(email: string, firstName: string, lastName: string, phoneNumber: string) {
    try {
      const existingAdmin = await this.findByEmail(email);
      if (existingAdmin) throw new Error('Admin Exists Already');
      const randomPassword = (Math.random() + 1).toString(36).substring(7);
      const hashedRandomPassword = await argon2.hash(randomPassword);
      const admin = new AdminModel({
        phoneNumber,
        email,
        password: hashedRandomPassword,
        firstName,
        lastName,
        signedUp: false,
        isBlocked: false,
      });

      await admin.save();

      console.log('One time Password: ', randomPassword);

      await SNSService.sendAdminLoginDetailsToPhone(phoneNumber, randomPassword);
    } catch (error) {
      throw error;
    }
  }

  static async setUp(email: string, phoneNumber: string, oneTimePassword: string, password: string, res: Response) {
    try {
      const admin = await AdminModel.findOne({
        email,
        phoneNumber
      });
      console.log('setUp');
      console.log('admin', admin);
      console.log('email', email);
      console.log('phoneNumber', phoneNumber);
      console.log('oneTimePassword', oneTimePassword);
      console.log('password', password);

      if (admin) {
        // Should not be signedUp already to setup account
        if (admin.signedUp)
          return res.status(httpCodes.badRequest).send('Account Already done setup');

        const passwordMatches = await argon2.verify(
          admin.password,
          oneTimePassword
        );

        if (!passwordMatches)
          return res.status(httpCodes.badRequest).send('Wrong Password');

        // password Matches
        // store user entered password as hashed password into DB
        const hashedPassword = await argon2.hash(password);
        console.log('hashedPassword', hashedPassword);
        console.log('--------------------------------------------');
        console.log('');
        await AdminModel.findByIdAndUpdate(admin.id, {
          password: hashedPassword,
          signedUp: true
        });

        const { accessToken } = await TokenService.getAdminToken(admin.id, admin.phoneNumber);
        return res.status(httpCodes.ok).send({
          accessToken
        });

      } else {
        return res.status(httpCodes.badRequest).send('User Does not exist');
      }
    } catch (error) {
      console.error('setUp-Admin-service-error', error);
      return res.status(httpCodes.serverError).send('Server Error');
    }
  }

  static async login(email: string, password: string, res: Response) {
    try {

      const admin = await AdminModel.findOne({
        email
      });

      console.log('login');
      console.log('admin', admin);
      console.log('email', email);
      console.log('password', password);
      console.log('--------------------------------------------');
      console.log('');

      if (admin) {
        if (!admin.signedUp)
          return res.status(httpCodes.badRequest).send('Please Setup Account Before Login');
        const passwordMatches = await argon2.verify(
          admin.password,
          password
        );

        if (!passwordMatches)
          return res.status(httpCodes.badRequest).send('Wrong Password');

        const { accessToken } = await TokenService.getAdminToken(admin.id, admin.phoneNumber);
        return res.status(httpCodes.ok).send({
          accessToken
        });

      } else {
        return res.status(httpCodes.badRequest).send('User Does not exist');
      }
    } catch (error) {
      console.error('login-Admin-service-error', error);
      return res.status(httpCodes.serverError).send('Server Error');
    }
  }

  /* static async findAdminByEmail(email: string) {
    return AdminModel.findOne({
      email
    });
  }   */

  /* public static async createAdmin(adminObject: Partial<IAdmin>, res: Response) {
    try {
      // Check that the email doesn't exist in db
      const existingAdmin = await AdminModel.findOne({ email: adminObject.email });
      if (existingAdmin) {
        return res.status(httpCodes.conflict).send({
          message: 'Email already exists',
          status: httpCodes.conflict
        });
      }

      // Add a password and hash it
      if (!adminObject.password) {
        return res.status(httpCodes.badRequest).send({
          message: 'Password is required',
          status: httpCodes.badRequest
        });
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(adminObject.password, 10); // 10 is the salt rounds
      const newAdminData = { ...adminObject, password: hashedPassword };

      // Create new Admin
      const newAdmin = new AdminModel(newAdminData);
      await newAdmin.save();

      // send updated serialised admin in response
      return res.send({
        message: 'Admin created Successfully',
        status: AdminStatus.created,
        newAdmin: newAdmin
      });
    } catch (logoutError) {
      console.error('createAdmin-AdminService', logoutError);
      return res.sendStatus(httpCodes.serverError);
    }
  } */
}

export {
  AdminService
};