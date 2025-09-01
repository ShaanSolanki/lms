"use client";

import { useSession, signIn, signOut } from "@/lib/auth-client";

export function useAuth() {
  const { data: session, isPending, error } = useSession();

  const loginWithGithub = async () => {
    try {
      await signIn.social({
        provider: "github",
        callbackURL: "/dashboard",
      });
    } catch (error) {
      console.error("GitHub login error:", error);
      throw error;
    }
  };

  const loginWithEmail = async (email: string, password: string) => {
    try {
      await signIn.email({
        email,
        password,
        callbackURL: "/dashboard",
      });
    } catch (error) {
      console.error("Email login error:", error);
      throw error;
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      await signUp.email({
        name,
        email,
        password,
        callbackURL: "/dashboard",
      });
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut({
        fetchOptions: {
          onSuccess: () => {
            window.location.href = "/";
          },
        },
      });
    } catch (error) {
      console.error("Logout error:", error);
      throw error;
    }
  };

  return {
    user: session?.user,
    session,
    isLoading: isPending,
    error,
    loginWithGithub,
    loginWithEmail,
    register,
    logout,
    isAuthenticated: !!session?.user,
  };
}