
"use client";

import { LoginForm } from "@/components/auth/login-form";
import Link from "next/link";
import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

export default function LoginPage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(true);


  useEffect(() => {
    if (typeof window !== "undefined") {
        const storedAuth = localStorage.getItem("isAuthenticated");
        if (storedAuth === "true") {
            router.replace("/dashboard");
        } else {
            setIsLoading(false);
        }
    }
  }, [router]);

  // Fallback check based on context, in case localStorage interaction is delayed or fails
   useEffect(() => {
    if (isAuthenticated) {
      router.replace("/dashboard");
    } else {
      // If not authenticated by context either, definitely done loading
      setIsLoading(false); 
    }
  }, [isAuthenticated, router]);


  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)] py-12">
      <LoginForm />
      <p className="mt-6 text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="font-medium text-primary hover:underline">
          Sign up
        </Link>
      </p>
    </div>
  );
}
