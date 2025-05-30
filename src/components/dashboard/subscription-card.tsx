
"use client";

import *
as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/auth-context";
import { CheckCircle, Star, Zap, Loader2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { loadStripe } from "@stripe/stripe-js";

const FREE_TIER_LIMIT = 3;

// The Stripe Publishable Key is loaded from an environment variable.
// It should be set in your .env file as NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
// Ensure you have a .env file in your project root with:
// NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="your_actual_stripe_publishable_key_here"
// This variable is accessed in the `handleStripeCheckout` function.
const STRIPE_PUBLIC_KEY = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY; 

export function SubscriptionCard() {
  const { isPaidUser, usageCount, upgradeToPaid } = useAuth();
  const { toast } = useToast();
  const [isUpgradeDialogOpen, setIsUpgradeDialogOpen] = React.useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = React.useState(false);

  const handleStripeCheckout = async () => {
    setIsProcessingPayment(true);
    setIsUpgradeDialogOpen(false); // Close dialog

    if (!STRIPE_PUBLIC_KEY || STRIPE_PUBLIC_KEY === "your_actual_stripe_publishable_key_here") {
      toast({
        variant: "destructive",
        title: "Configuration Error",
        description: "Stripe public key is not configured. Admin: Please set NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY in your .env file and restart your development server.",
      });
      console.error("Stripe public key is not set or is using the placeholder in environment variables (NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY).");
      setIsProcessingPayment(false);
      return;
    }

    toast({
      title: "Initializing Payment...",
      description: "Please wait while we prepare the secure checkout.",
    });

    try {
      const stripe = await loadStripe(STRIPE_PUBLIC_KEY);
      if (!stripe) {
        toast({
          variant: "destructive",
          title: "Initialization Error",
          description: "Could not load payment gateway. Please try again later.",
        });
        setIsProcessingPayment(false);
        return;
      }
      
      // ==========================================================================================
      // CRITICAL STEP: Fetch a REAL Stripe Checkout Session ID from YOUR BACKEND
      // The line below is a PLACEHOLDER. You MUST replace this with an API call
      // to your server, which uses your Stripe SECRET KEY to create a Checkout Session.
      // Example:
      //   const response = await fetch('/api/create-checkout-session', { method: 'POST' });
      //   if (!response.ok) {
      //     const errorData = await response.json();
      //     throw new Error(errorData.error || 'Failed to create checkout session on backend');
      //   }
      //   const { sessionId } = await response.json(); // Use 'sessionId' from your backend
      //   const sessionIdToUse = sessionId; 
      // ==========================================================================================
      
      // For demonstration, this remains a placeholder. REPLACE IT!
      toast({ title: "Fetching Checkout Session from Backend (Simulated)...", description: "Ensure this is replaced with a real backend call."});
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network latency for backend call
      const sessionIdToUse: string | null = `cs_test_MUST_BE_REPLACED_BY_REAL_BACKEND_ID_${Date.now().toString(36)}`;
      // ==========================================================================================


      // Check if the session ID is still the placeholder or empty
      if (!sessionIdToUse || sessionIdToUse.includes("MUST_BE_REPLACED_BY_REAL_BACKEND_ID")) {
        console.error("CRITICAL ERROR: A valid Stripe Checkout Session ID was not provided by the backend. Value received:", sessionIdToUse);
        toast({
          variant: "destructive",
          title: "Backend Error: Invalid Session ID",
          description: "The application did not receive a valid Checkout Session ID from the backend. Please ensure your backend is correctly creating and returning a Stripe session ID.",
          duration: 10000, 
        });
        setIsProcessingPayment(false);
        return;
      }

      toast({
        title: "Redirecting to Payment...",
        description: "You will be redirected to Stripe to complete your payment.",
      });

      console.log("Attempting to redirect to Stripe with Session ID:", sessionIdToUse);
      const { error } = await stripe.redirectToCheckout({ sessionId: sessionIdToUse });

      if (error) {
        console.error("Stripe redirectToCheckout error:", error);
        let description = error.message || "Could not redirect to Stripe. Please try again.";
        if (error.message && error.message.includes("Failed to set a named property 'href' on 'Location'")) {
            description = "Could not redirect to Stripe, possibly due to running in a sandboxed iframe (common in development previews). Please test in a standalone browser window or after deployment. Also, ensure a real Stripe Session ID from your backend is being used.";
        } else if (error.message && (error.message.toLowerCase().includes("invalid session id") || error.message.toLowerCase().includes("no such checkout session"))) {
            description = "The provided Stripe Session ID is invalid or expired. Please ensure your backend is generating a correct and active Session ID. Check the browser console for the ID used.";
        }
        toast({ 
            variant: "destructive", 
            title: "Redirection Error", 
            description: description,
            duration: 10000,
        });
        setIsProcessingPayment(false);
        return;
      }

      // If redirectToCheckout is successful, the user is navigated away from this page.
      // Code here will likely not execute unless there was an immediate issue with the redirect call.
      // The actual `upgradeToPaid()` and success messages should be handled on your
      // success_url page (configured in your Stripe Checkout Session on the backend),
      // after Stripe confirms the payment and redirects the user back.
      // Or, more robustly, via a Stripe webhook processed by your backend.

    } catch (error: any) {
      console.error("Stripe Checkout Process Error:", error);
      toast({
        variant: "destructive",
        title: "Payment Process Failed",
        description: error.message || "An unexpected error occurred during the payment process. Check console for details.",
        duration: 10000,
      });
      setIsProcessingPayment(false);
    }
  };

  return (
    <Card className="w-full shadow-lg bg-gradient-to-br from-background via-card to-background">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl">
          {isPaidUser ? <Star className="h-7 w-7 text-yellow-400 fill-yellow-400" /> : <Zap className="h-7 w-7 text-primary" />}
          Subscription Status
        </CardTitle>
        <CardDescription>
          Manage your Design Alchemist plan and features.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {isPaidUser ? (
          <div className="p-6 bg-primary/10 rounded-lg border border-primary/20 text-center">
            <CheckCircle className="h-12 w-12 text-primary mx-auto mb-3" />
            <h3 className="text-xl font-semibold text-primary">Premium Activated!</h3>
            <p className="text-muted-foreground mt-1">
              You have unlimited access to design analysis. Enjoy refining your masterpieces!
            </p>
          </div>
        ) : (
          <div className="p-6 bg-muted/50 rounded-lg border border-border text-center">
            <h3 className="text-xl font-semibold text-foreground">Free Tier</h3>
            <p className="text-muted-foreground mt-1">
              You have{" "}
              <span className="font-bold text-primary">
                {Math.max(0, FREE_TIER_LIMIT - usageCount)}/{FREE_TIER_LIMIT}
              </span>{" "}
              free analyses remaining.
            </p>

            <AlertDialog open={isUpgradeDialogOpen} onOpenChange={setIsUpgradeDialogOpen}>
              <AlertDialogTrigger asChild>
                <Button 
                  className="mt-6 w-full sm:w-auto shadow-md hover:shadow-lg transition-shadow" 
                  size="lg"
                  onClick={() => setIsUpgradeDialogOpen(true)}
                  disabled={isProcessingPayment || !STRIPE_PUBLIC_KEY || STRIPE_PUBLIC_KEY === "your_actual_stripe_publishable_key_here"} 
                >
                  {isProcessingPayment ? (
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  ) : (
                    <Zap className="mr-2 h-5 w-5" />
                  )}
                  {isProcessingPayment ? "Processing..." : "Upgrade to Premium"}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Confirm Premium Upgrade</AlertDialogTitle>
                  <AlertDialogDescription>
                    You will be redirected to Stripe to complete your payment securely.
                    Ensure your backend is set up to create a Stripe Checkout Session and provide its ID.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel onClick={() => setIsUpgradeDialogOpen(false)} disabled={isProcessingPayment}>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleStripeCheckout} disabled={isProcessingPayment}>
                    {isProcessingPayment ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : null}
                    {isProcessingPayment ? "Processing..." : "Proceed to Checkout"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            {(!STRIPE_PUBLIC_KEY || STRIPE_PUBLIC_KEY === "your_actual_stripe_publishable_key_here") && (
              <p className="text-xs text-destructive mt-2">
                Stripe payments are not configured correctly. Admin: Please set NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY in your .env file.
              </p>
            )}
             {STRIPE_PUBLIC_KEY && STRIPE_PUBLIC_KEY !== "your_actual_stripe_publishable_key_here" && (
              <p className="text-xs text-muted-foreground mt-3">
                Click "Upgrade to Premium" to proceed with a secure Stripe payment. Ensure backend integration for session ID.
              </p>
            )}
          </div>
        )}
        
        <div className="pt-4">
            <h4 className="font-semibold text-lg mb-2">Why Go Premium?</h4>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li><span className="font-medium text-foreground">Unlimited Analyses:</span> Never worry about quotas again.</li>
                <li><span className="font-medium text-foreground">Priority Support:</span> Get faster help when you need it.</li>
                <li><span className="font-medium text-foreground">Advanced Features:</span> Access to future premium-only tools.</li>
            </ul>
        </div>
      </CardContent>
    </Card>
  );
}

    