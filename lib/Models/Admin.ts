import mongoose from 'mongoose';
import type { Document, Model } from 'mongoose';

export interface IAdmin extends Document {
    phoneNumber: string,
    email: string,
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

    refreshToken: {
        type: String
    },
}, {
    collection: 'Admins',
    timestamps: true,
    id: true,
});

AdminSchema.index({ lastLocation: '2dsphere' });
const AdminModel: Model<IAdmin> = mongoose.model<IAdmin>('Admin', AdminSchema);

export default AdminModel;