import { createAuthClient } from "better-auth/react";
import { emailOTPClient } from "better-auth/client/plugins"

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL ,
});

export const {
  signIn,
  signOut,
  signUp,
  useSession,
  getSession,
} = authClient;


export const authClientWithEmailOTP = createAuthClient({ plugins: [emailOTPClient()] });