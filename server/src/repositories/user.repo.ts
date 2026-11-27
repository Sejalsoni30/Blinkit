import { User, IUser } from '../models/User.js';

export class UserRepository {
  async findByEmail(email: string): Promise<IUser | null> {
    return User.findOne({ email: email.toLowerCase() });
  }

  async findById(id: string): Promise<IUser | null> {
    return User.findById(id).select('-passwordHash');
  }

  async create(data: Partial<IUser>): Promise<IUser> {
    return User.create(data);
  }

  async updateRefreshToken(id: string, refreshToken: string | null): Promise<void> {
    await User.findByIdAndUpdate(id, { refreshToken });
  }

  async count(): Promise<number> {
    return User.countDocuments();
  }
}

export const userRepo = new UserRepository();
