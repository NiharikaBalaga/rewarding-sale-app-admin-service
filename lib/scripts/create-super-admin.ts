import SuperAdminModel from '../DB/Models/SuperAdmin';
import * as argon2 from 'argon2';
import { TokenService } from '../services/Token';
import mongoose from 'mongoose';

const password = 'neha@001';
const email =  'neha22oct97@gmail.com';
const phoneNumber =  '437-556-2948';
const firstName = 'Niharika';
const lastName = 'Balaga';


(async () => {
  try {

    await mongoose.connect('mongodb://adminService:adminService@mongodb_admin_service:27017',{
      dbName: 'adminDB',
    });

    console.log('Connected to Mongodb successfully');

    const existingSuperAdmin = await SuperAdminModel.findOne({
      email
    });
    if (existingSuperAdmin) throw new Error('Existing Admin');

    const newSuperAdmin = new SuperAdminModel({
      email,
      phoneNumber,
      password: await argon2.hash(password),
      firstName,
      lastName,
    });
    await newSuperAdmin.save();

    const { accessToken } = await TokenService.getSuperAdminToken(newSuperAdmin.id, phoneNumber);

    return console.log(`Super Admin Created Successfully \n Admin Id: ${newSuperAdmin.id} \n Email: ${newSuperAdmin.email} \n accessToken: ${accessToken}`);
  } catch (error) {
    console.error('error-in-script', error);
  }
})();