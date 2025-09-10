import mongoose, { Document, Schema } from "mongoose";

// Interface for Session document
export interface ISession extends Document {
    _id: string;
    userId: string;
    expiresAt: Date;
    token: string;
    ipAddress?: string;
    userAgent?: string;
    impersonatedBy?: string; // The ID of the admin that is impersonating this session
    createdAt: Date;
    updatedAt: Date;
}

// Session schema
const sessionSchema = new Schema<ISession>(
    {
        userId: {
            type: String,
            required: true,
            ref: "User",
        },
        expiresAt: {
            type: Date,
            required: true,
        },
        token: {
            type: String,
            required: true,
            unique: true,
        },
        ipAddress: {
            type: String,
            required: false,
        },
        userAgent: {
            type: String,
            required: false,
        },
        impersonatedBy: {
            type: String,
            required: false,
            ref: "User",
        },
    },
    {
        timestamps: true,
        collection: "sessions",
    }
);

// Indexes for better performance
sessionSchema.index({ token: 1 }, { unique: true });
sessionSchema.index({ userId: 1 });
sessionSchema.index({ expiresAt: 1 });
sessionSchema.index({ impersonatedBy: 1 });

// Export the model
export const Session = mongoose.models.Session || mongoose.model<ISession>("Session", sessionSchema);