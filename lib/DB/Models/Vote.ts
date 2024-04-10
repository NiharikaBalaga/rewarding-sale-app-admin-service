import mongoose from 'mongoose';
import type { Document, Model } from 'mongoose';
import UserModel from './User';
import PostModel from './Post';

export interface IVote extends Document {
  userId: mongoose.Types.ObjectId,
  postId: mongoose.Types.ObjectId,
  type: string
}

const VoteSchema: mongoose.Schema = new mongoose.Schema({
  userId: {
    type: mongoose.Types.ObjectId,
    ref: UserModel, // Connection user collection - useful during popular operations
    required: true,
    index: true,
  },

  postId: {
    type: mongoose.Types.ObjectId,
    ref: PostModel, // Connection user collection - useful during popular operations
    required: true,
    index: true,
  },
}, {
  collection: 'Votes',
  timestamps: true,
  id: true,
});

const VoteModel: Model<IVote> = mongoose.model<IVote>('Vote', VoteSchema);

export default VoteModel;