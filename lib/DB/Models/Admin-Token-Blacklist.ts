import mongoose from 'mongoose';
import type { Document, Model } from 'mongoose';

export interface IAdminTokenBlacklist extends Document {
  token: string
}

const AdminTokenBlacklistSchema: mongoose.Schema  = new mongoose.Schema({
  token: {
    type: String,
    required: true,
    unique: true,
    index: true,
  }
}, {
  collection: 'AdminTokenBlacklist',
  timestamps: true,
  id: true,
});

const AdminTokenBlacklistModel: Model<IAdminTokenBlacklist> = mongoose.model<IAdminTokenBlacklist>('AdminTokenBlacklist', AdminTokenBlacklistSchema);

export default AdminTokenBlacklistModel;