import mongoose, { Document, Schema } from "mongoose";

// Interface for User document
export interface IUser extends Document {
  _id: string;
  name: string;
  email: string;
  password?: string; // Optional for social login users
  image?: string;
  emailVerified?: boolean;
  role?: string; // User role, defaults to 'user', admins have 'admin'
  banned?: boolean; // Indicates whether the user is banned
  banReason?: string; // The reason for the user's ban
  banExpires?: Date; // The date when the user's ban will expire
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
    password: {
      type: String,
      required: false, // Optional for social login users
      minlength: 8,
    },
    image: {
      type: String,
      default: null,
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      default: "user",
      enum: ["user", "admin"],
    },
    banned: {
      type: Boolean,
      default: false,
    },
    banReason: {
      type: String,
      required: false,
    },
    banExpires: {
      type: Date,
      required: false,
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