import { betterAuth, email } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { emailOTP } from "better-auth/plugins"
//import { github } from "better-auth/providers";
import { client, connectDB } from "./db";
import { resend } from "./resend";
await connectDB();

// pick database name (from env or fallback)
const dbName = process.env.MONGODB_DB;

export const auth = betterAuth({
  database: mongodbAdapter(client.db(dbName)),
  emailAndPassword: {
    enabled: true,
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

plugins: [
  emailOTP({
      async sendVerificationOTP({email, otp}){
   await resend.emails.send({
    from: 'SkillWindow <onboarding@resend.dev>',
    to: [email],
    subject: 'SkillWindow - verify your email',
    html: `<h1>Your verification code is: ${otp}</h1>`,
  });
  }
  })
]

});
