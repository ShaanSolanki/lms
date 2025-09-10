import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { emailOTP } from "better-auth/plugins";
import { admin } from "better-auth/plugins";
import { MongoClient } from "mongodb";
import { resend } from "./resend";

// MongoDB connection
const client = new MongoClient(process.env.MONGODB_URI!);
const dbName = process.env.MONGODB_DB;

export const auth = betterAuth({
  database: mongodbAdapter(client.db(dbName)),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
  },
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
  },
  schema: {
    user: {
      fields: {
        role: {
          type: "string",
          required: false,
          defaultValue: "user",
        },
        banned: {
          type: "boolean",
          required: false,
        },
        banReason: {
          type: "string",
          required: false,
        },
        banExpires: {
          type: "date",
          required: false,
        },
      },
    },
    session: {
      fields: {
        impersonatedBy: {
          type: "string",
          required: false,
        },
      },
    },
  },
  plugins: [
    emailOTP({
      async sendVerificationOTP({ email, otp }) {
        try {
          await resend.emails.send({
            from: 'SkillWindow <onboarding@resend.dev>',
            to: [email],
            subject: 'SkillWindow - Verify your email',
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h1 style="color: #333; text-align: center;">Email Verification</h1>
                <p style="color: #666; font-size: 16px;">Welcome to SkillWindow! Please verify your email address by entering the following code:</p>
                <div style="background-color: #f5f5f5; padding: 20px; text-align: center; margin: 20px 0; border-radius: 8px;">
                  <h2 style="color: #333; font-size: 32px; letter-spacing: 4px; margin: 0;">${otp}</h2>
                </div>
                <p style="color: #666; font-size: 14px;">This code will expire in 10 minutes. If you didn't request this verification, please ignore this email.</p>
                <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
                <p style="color: #999; font-size: 12px; text-align: center;">© 2024 SkillWindow. All rights reserved.</p>
              </div>
            `,
          });
        } catch (error) {
          console.error("Failed to send OTP email:", error);
          throw new Error("Failed to send verification email");
        }
      },
      otpLength: 6,
      expiresIn: 60 * 10, // 10 minutes
    }),
    admin(),
  ],
});
