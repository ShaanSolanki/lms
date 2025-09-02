import { SignupForm } from "./_components/signupForm";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function SignupPage() {
    const session = await auth.api.getSession({
        headers: await headers(),
    })
    
    if (session) {
        return redirect("/");
    }

    return (
        <SignupForm />
    );
}