import mongoose from 'mongoose';
import type { Document, Model } from 'mongoose';

export interface ISuperAdmin extends Document {
  phoneNumber: string,
  email: string,
  password: string,
  firstName: string,
  lastName: string,
  isBlocked: boolean,
}

const SuperAdminSchema: mongoose.Schema = new mongoose.Schema({
  phoneNumber: {
    type: String,
    required: true,
    match: /^\d{3}-\d{3}-\d{4}$/,
    unique: true,
    index: true,
  },

  email: {
    unique: true,
    index: true,
    type: String,
  },

  password: {
    type: String,
  },

  firstName: {
    type: String,
  },

  lastName: {
    type: String,
  },

  isBlocked: {
    type: Boolean,
    default: false
  },
}, {
  collection: 'SuperAdmin',
  timestamps: true,
  id: true,
});

const SuperAdminModel: Model<ISuperAdmin> = mongoose.model<ISuperAdmin>('SuperAdmin', SuperAdminSchema);

export default SuperAdminModel;