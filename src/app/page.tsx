"use client"
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/themeToggle";
import { authClient } from "@/lib/auth-client"
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default  function Home() {
  const router = useRouter();
  const { 
        data: session, 
        isPending, //loading state
        error, //error object
        refetch //refetch the session
    } = authClient.useSession()

  async function signOut() {
   await authClient.signOut({
  fetchOptions: {
    onSuccess: () => {
      router.push("/"); // redirect to login page
      toast.success("Successfully logged out");
    },
  },
});
  }

  return (
    <div>
      <h1>Home Page</h1>
      <ThemeToggle />
      {session ?(
        <div><p>{session.user.name}</p>
        <button onClick={signOut}>logout</button></div>
      ):(<button>login</button>)
    }
    </div>
  );
}
