"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { GithubIcon, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useState } from "react";

export default function LoginPage() {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <Card className="shadow-lg border-0 bg-card/50 backdrop-blur-sm">
            <CardHeader className="space-y-3 text-center">
                <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <Lock className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-2xl font-semibold">Welcome back</CardTitle>
                <CardDescription className="text-muted-foreground">
                    Sign in to your account to continue
                </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
                <Button variant="outline" className="w-full h-11 gap-3 hover:bg-accent/50 transition-colors">
                    <GithubIcon className="w-5 h-5" />
                    Continue with GitHub
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

                <div className="space-y-4">
                    <div className="space-y-2">
                        <label htmlFor="email" className="text-sm font-medium text-foreground">
                            Email address
                        </label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input 
                                id="email"
                                type="email" 
                                placeholder="Enter your email"
                                className="pl-10 h-11"
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
                                type={showPassword ? "text" : "password"}
                                placeholder="Enter your password"
                                className="pl-10 pr-10 h-11"
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

                    <div className="flex items-center justify-between text-sm">
                        <label className="flex items-center space-x-2 cursor-pointer">
                            <Checkbox id="remember" />
                            <span className="text-muted-foreground">Remember me</span>
                        </label>
                        <a href="#" className="text-primary hover:text-primary/80 font-medium transition-colors">
                            Forgot password?
                        </a>
                    </div>

                    <Button className="w-full h-11 font-medium">
                        Sign in
                    </Button>
                </div>

                <div className="text-center text-sm text-muted-foreground">
                    Don't have an account?{" "}
                    <a href="#" className="text-primary hover:text-primary/80 font-medium transition-colors">
                        Sign up
                    </a>
                </div>
            </CardContent>
        </Card>
    );
}