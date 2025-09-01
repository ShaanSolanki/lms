import mongoose, { Document, Schema } from "mongoose";

// Interface for User document
export interface IUser extends Document {
  _id: string;
  name: string;
  email: string;
  image?: string;
  emailVerified?: boolean;
  createdAt: Date;
  updatedAt: Date;
  // Better Auth specific fields
  accounts?: Array<{
    id: string;
    accountId: string;
    providerId: string;
    userId: string;
    accessToken?: string;
    refreshToken?: string;
    expiresAt?: Date;
    scope?: string;
  }>;
  sessions?: Array<{
    id: string;
    userId: string;
    expiresAt: Date;
    token: string;
    ipAddress?: string;
    userAgent?: string;
  }>;
}

// User schema
const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    image: {
      type: String,
      default: null,
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    collection: "users",
  }
);

// Indexes for better performance
userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ createdAt: 1 });

// Export the model
export const User = mongoose.models.User || mongoose.model<IUser>("User", userSchema);