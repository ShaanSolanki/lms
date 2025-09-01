export interface AuthUser {
  id: string;
  name: string;
  email: string;
  image?: string;
  emailVerified?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthSession {
  user: AuthUser;
  session: {
    id: string;
    userId: string;
    expiresAt: Date;
    token: string;
    ipAddress?: string;
    userAgent?: string;
  };
}

export interface AuthError {
  message: string;
  code?: string;
  status?: number;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
}

export interface SocialLoginOptions {
  provider: "github";
  callbackURL?: string;
}