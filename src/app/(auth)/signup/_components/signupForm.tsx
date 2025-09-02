"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { GithubIcon, Mail, Lock, Eye, EyeOff, Loader, User } from "lucide-react";
import { useState, useTransition } from "react";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { OTPVerification } from "./otpVerification";

export function SignupForm() {
    const [githubPending, startGithubTransition] = useTransition();
    const [emailPending, startEmailTransition] = useTransition();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [showOTPVerification, setShowOTPVerification] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        agreeToTerms: false
    });
    const router = useRouter();

    async function signUpWithGitHub() {
        startGithubTransition(async () => {
            await authClient.signIn.social({
                provider: 'github',
                callbackURL: "/",
                fetchOptions: {
                    onSuccess: () => {
                        toast.success("Successfully signed up with GitHub!");
                    },
                    onError: (error) => {
                        toast.error(error.error.message);
                    },
                },
            });
        });
    }

    async function signUpWithEmail(e: React.FormEvent) {
        e.preventDefault();
        
        if (formData.password !== formData.confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        if (!formData.agreeToTerms) {
            toast.error("Please agree to the terms and conditions");
            return;
        }

        startEmailTransition(async () => {
            try {
                await authClient.signUp.email({
                    name: formData.name,
                    email: formData.email,
                    password: formData.password,
                    fetchOptions: {
                        onSuccess: () => {
                            toast.success("Account created! Please verify your email.");
                            setShowOTPVerification(true);
                        },
                        onError: (error) => {
                            toast.error(error.error.message || "Failed to create account");
                        },
                    },
                });
            } catch (error) {
                toast.error("Failed to create account");
            }
        });
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleBackToSignup = () => {
        setShowOTPVerification(false);
    };

    // Show OTP verification if needed
    if (showOTPVerification) {
        return (
            <OTPVerification 
                email={formData.email} 
                onBack={handleBackToSignup}
            />
        );
    }

    return (
        <Card className="shadow-lg border-0 bg-card/50 backdrop-blur-sm">
            <CardHeader className="space-y-3 text-center">
                <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-2xl font-semibold">Create your account</CardTitle>
                <CardDescription className="text-muted-foreground">
                    Sign up to get started with our platform
                </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
                <Button
                    disabled={githubPending}
                    onClick={signUpWithGitHub} 
                    variant="outline" 
                    className="w-full h-11 gap-3 hover:bg-accent/50 transition-colors"
                >
                    {githubPending ? (
                        <>
                            <Loader className="size-4 animate-spin"/>
                            <span>Signing up...</span>
                        </>
                    ) : (
                        <>
                            <GithubIcon className="w-5 h-5" />
                            Continue with GitHub
                        </>
                    )}
                </Button>
                
                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-border" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-card px-3 text-muted-foreground font-medium">
                            Or continue with email
                        </span>
                    </div>
                </div>

                <form onSubmit={signUpWithEmail} className="space-y-4">
                    <div className="space-y-2">
                        <label htmlFor="name" className="text-sm font-medium text-foreground">
                            Full name
                        </label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input 
                                id="name"
                                name="name"
                                type="text" 
                                placeholder="Enter your full name"
                                className="pl-10 h-11"
                                value={formData.name}
                                onChange={handleInputChange}
                                required
                                minLength={2}
                                maxLength={50}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="email" className="text-sm font-medium text-foreground">
                            Email address
                        </label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input 
                                id="email"
                                name="email"
                                type="email" 
                                placeholder="Enter your email"
                                className="pl-10 h-11"
                                value={formData.email}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="password" className="text-sm font-medium text-foreground">
                            Password
                        </label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input 
                                id="password"
                                name="password"
                                type={showPassword ? "text" : "password"}
                                placeholder="Create a password"
                                className="pl-10 pr-10 h-11"
                                value={formData.password}
                                onChange={handleInputChange}
                                required
                                minLength={8}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                            >
                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="confirmPassword" className="text-sm font-medium text-foreground">
                            Confirm password
                        </label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input 
                                id="confirmPassword"
                                name="confirmPassword"
                                type={showConfirmPassword ? "text" : "password"}
                                placeholder="Confirm your password"
                                className="pl-10 pr-10 h-11"
                                value={formData.confirmPassword}
                                onChange={handleInputChange}
                                required
                                minLength={8}
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                            >
                                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                    </div>

                    <div className="flex items-start space-x-2">
                        <Checkbox 
                            id="agreeToTerms" 
                            name="agreeToTerms"
                            checked={formData.agreeToTerms}
                            onCheckedChange={(checked) => 
                                setFormData(prev => ({ ...prev, agreeToTerms: checked as boolean }))
                            }
                            className="mt-1"
                        />
                        <label htmlFor="agreeToTerms" className="text-sm text-muted-foreground leading-relaxed">
                            I agree to the{" "}
                            <Link href="/terms" className="text-primary hover:text-primary/80 font-medium transition-colors">
                                Terms of Service
                            </Link>{" "}
                            and{" "}
                            <Link href="/privacy" className="text-primary hover:text-primary/80 font-medium transition-colors">
                                Privacy Policy
                            </Link>
                        </label>
                    </div>

                    <Button 
                        type="submit" 
                        className="w-full h-11 font-medium"
                        disabled={emailPending}
                    >
                        {emailPending ? (
                            <>
                                <Loader className="size-4 animate-spin mr-2"/>
                                Creating account...
                            </>
                        ) : (
                            "Create account"
                        )}
                    </Button>
                </form>

                <div className="text-center text-sm text-muted-foreground">
                    Already have an account?{" "}
                    <Link href="/login" className="text-primary hover:text-primary/80 font-medium transition-colors">
                        Sign in
                    </Link>
                </div>
            </CardContent>
        </Card>
    );
}