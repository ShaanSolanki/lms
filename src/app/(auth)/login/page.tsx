
//import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
//import { Button } from "@/components/ui/button";
//import { Input } from "@/components/ui/input";
//import { Checkbox } from "@/components/ui/checkbox";
//import { GithubIcon, Mail, Lock, Eye, EyeOff, Loader } from "lucide-react";
//import { useState } from "react";
//import { Label } from "@/components/ui/label";
//import { authClient } from "@/lib/auth-client"
//import { toast } from "sonner";
//import { useTransition } from "react";
import { LoginForm } from "./_components/loginForm";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function LoginPage() {
    const session = await auth.api.getSession({
        headers: await headers(),
    })
    
    if (session) {
        return redirect("/");
    }

    return (
    <LoginForm />
    );
}