import SuperAdminModel from '../DB/Models/SuperAdmin';
import * as argon2 from 'argon2';
import { TokenService } from '../services/Token';
import mongoose from 'mongoose';

const password = 'neha@001';
const email =  'neha22oct97@gmail.com';


(async () => {
  try {

    await mongoose.connect('mongodb://adminService:adminService@mongodb_admin_service:27017',{
      dbName: 'adminDB',
    });

    console.log('Connected to Mongodb successfully');
    const existingSuperAdmin = await SuperAdminModel.findOne({
      email
    });
    if (!existingSuperAdmin) throw new Error('Admin Does not exist');

    const passwordMatches = await argon2.verify(
      existingSuperAdmin.password,
      password
    );


    if (!passwordMatches) throw new Error('Password Does not match');

    const { accessToken } = await TokenService.getSuperAdminToken(existingSuperAdmin.id, existingSuperAdmin.phoneNumber);

    return console.log(`Super Admin Login Successful \n Admin Id: ${existingSuperAdmin.id} \n Email: ${existingSuperAdmin.email} \n accessToken: ${accessToken}`);
  } catch (error) {
    console.error('error-in-script', error);
  }
})();