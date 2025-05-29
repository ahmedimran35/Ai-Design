
"use client";

import * as React from "react";
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
        description: "Stripe public key is not configured correctly. Please set NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY in your .env file.",
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
      
      // STEP 1: Call your backend to create a Checkout Session
      // ========================================================
      // This is a SIMULATED backend call. In a real application, you would
      // fetch this from an endpoint on your server, e.g., /api/create-checkout-session
      // Your backend would use your Stripe SECRET KEY to create the session.
      // ========================================================
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network latency
      const simulatedSessionId = `cs_test_FAKE_${Date.now().toString(36)}`; // IMPORTANT: This is a FAKE session ID
      // In a real app, replace `simulatedSessionId` with `sessionId` from your backend.
      // const response = await fetch('/api/create-checkout-session', { method: 'POST' });
      // if (!response.ok) throw new Error('Failed to create checkout session');
      // const { sessionId } = await response.json();
      // toast({ title: "Checkout Session Created", description: "Redirecting to Stripe..."});
      // ========================================================

      toast({
        title: "Redirecting to Payment...",
        description: "You will be redirected to Stripe to complete your payment.",
      });

      // STEP 2: Redirect to Stripe Checkout
      // ========================================================
      // This will redirect the user to Stripe's hosted checkout page.
      // Ensure `simulatedSessionId` is replaced with the actual session ID from your backend.
      // ========================================================
      const { error } = await stripe.redirectToCheckout({ sessionId: simulatedSessionId });
      // ========================================================

      if (error) {
        // This error is typically if `redirectToCheckout` itself fails (e.g., network issue,
        // misconfiguration before even reaching Stripe, or an issue with the session ID format passed).
        // If the session ID is invalid in a way Stripe can detect client-side, or if there's an issue
        // with your Stripe account configuration related to Checkout, this might be caught.
        console.error("Stripe redirectToCheckout error:", error);
        toast({ 
            variant: "destructive", 
            title: "Redirection Error", 
            description: error.message || "Could not redirect to Stripe. Please try again." 
        });
        setIsProcessingPayment(false);
        return;
      }

      // IMPORTANT: If redirectToCheckout is successful, the user is navigated away from this page.
      // Code here will likely not execute unless there was an immediate issue with the redirect call.
      // The actual `upgradeToPaid()` and success messages should be handled on your
      // success_url page, after Stripe confirms the payment and redirects the user back.
      // Or, more robustly, via a Stripe webhook processed by your backend.

    } catch (error: any) {
      console.error("Stripe Checkout Process Error:", error);
      toast({
        variant: "destructive",
        title: "Payment Process Failed",
        description: error.message || "An unexpected error occurred during the payment process.",
      });
      setIsProcessingPayment(false);
    }
    // `setIsProcessingPayment(false)` is primarily handled in error cases above,
    // as a successful redirect means the user leaves this page.
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
                    Ensure your backend is set up to create a Stripe Checkout Session.
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
                Click "Upgrade to Premium" to proceed with a secure Stripe payment.
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
