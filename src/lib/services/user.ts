import { User, IUser } from "../models/user";
import { connectDB } from "../db";
import { UserRegistration, UserProfileUpdate } from "../schemas/user";

export class UserService {
  static async createUser(userData: UserRegistration): Promise<IUser> {
    await connectDB();
    
    const existingUser = await User.findOne({ email: userData.email });
    if (existingUser) {
      throw new Error("User with this email already exists");
    }

    const user = new User(userData);
    return await user.save();
  }

  static async getUserById(id: string): Promise<IUser | null> {
    await connectDB();
    return await User.findById(id);
  }

  static async getUserByEmail(email: string): Promise<IUser | null> {
    await connectDB();
    return await User.findOne({ email });
  }

  static async updateUser(id: string, updateData: UserProfileUpdate): Promise<IUser | null> {
    await connectDB();
    return await User.findByIdAndUpdate(
      id,
      { ...updateData, updatedAt: new Date() },
      { new: true, runValidators: true }
    );
  }

  static async deleteUser(id: string): Promise<boolean> {
    await connectDB();
    const result = await User.findByIdAndDelete(id);
    return !!result;
  }

  static async getAllUsers(page: number = 1, limit: number = 10): Promise<{
    users: IUser[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    await connectDB();
    
    const skip = (page - 1) * limit;
    const users = await User.find({})
      .select("-__v")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    const total = await User.countDocuments();
    const totalPages = Math.ceil(total / limit);

    return {
      users,
      total,
      page,
      totalPages,
    };
  }

  static async verifyEmail(email: string): Promise<IUser | null> {
    await connectDB();
    return await User.findOneAndUpdate(
      { email },
      { emailVerified: true },
      { new: true }
    );
  }
}