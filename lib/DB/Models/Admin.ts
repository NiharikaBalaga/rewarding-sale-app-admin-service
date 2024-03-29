import mongoose from 'mongoose';
import type { Document, Model } from 'mongoose';

export interface IAdmin extends Document {
  phoneNumber: string,
  email: string,
  password: string
  firstName: string,
  lastName: string,
  signedUp: boolean,
  isBlocked: boolean,
}

const AdminSchema: mongoose.Schema = new mongoose.Schema({
  phoneNumber: {
    type: String,
    required: true,
    match: /^\d{3}-\d{3}-\d{4}$/,
    unique: true,
    index: true,
  },

  email: {
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

  signedUp: {
    type: Boolean,
    default: false
  },

  isBlocked: {
    type: Boolean,
    default: false
  },
}, {
  collection: 'Admin',
  timestamps: true,
  id: true,
});

const AdminModel: Model<IAdmin> = mongoose.model<IAdmin>('Admin', AdminSchema);

export default AdminModel;