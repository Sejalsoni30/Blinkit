import { Schema, model } from 'mongoose';

export type UserRole = 'ADMIN' | 'MANAGER' | 'ANALYST';

export interface IUser {
  _id?: any;
  name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  storeId?: string;
  refreshToken?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    passwordHash: { type: String, required: true },
    role: {
      type: String,
      enum: ['ADMIN', 'MANAGER', 'ANALYST'],
      default: 'ANALYST',
      index: true,
    },
    storeId: { type: String, index: true },
    refreshToken: { type: String },
  },
  { timestamps: true }
);

export const User = model<IUser>('User', UserSchema);
