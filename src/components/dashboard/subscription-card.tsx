
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
// IMPORTANT: This key will be loaded from an environment variable.
const STRIPE_PUBLIC_KEY = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY; 

export function SubscriptionCard() {
  const { isPaidUser, usageCount, upgradeToPaid } = useAuth();
  const { toast } = useToast();
  const [isUpgradeDialogOpen, setIsUpgradeDialogOpen] = React.useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = React.useState(false);

  const handleStripeCheckout = async () => {
    setIsProcessingPayment(true);
    setIsUpgradeDialogOpen(false); // Close dialog

    if (!STRIPE_PUBLIC_KEY) {
      toast({
        variant: "destructive",
        title: "Configuration Error",
        description: "Stripe public key is not configured. Please contact support.",
      });
      console.error("Stripe public key is not set in environment variables (NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY).");
      setIsProcessingPayment(false);
      return;
    }

    toast({
      title: "Initializing Upgrade...",
      description: "Please wait while we prepare the secure checkout.",
    });

    try {
      // Step 1: Load Stripe.js
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
      
      // Simulate a brief delay as if contacting backend
      await new Promise(resolve => setTimeout(resolve, 1000)); 

      // Step 2: Simulate fetching a Checkout Session ID from your backend
      // In a real application, this is where you'd call your backend API:
      //   const response = await fetch('/api/create-checkout-session', { method: 'POST' });
      //   if (!response.ok) throw new Error('Failed to create checkout session');
      //   const { sessionId } = await response.json();
      //   toast({ title: "Session Created", description: "Redirecting to Stripe..."});
      const simulatedSessionId = `cs_test_${Date.now().toString(36)}`; // Dynamic placeholder
      
      console.info("SIMULATION: Backend call to create Stripe Checkout session would happen here.");
      console.info(`SIMULATION: Received simulated Checkout Session ID: ${simulatedSessionId}`);
      
      toast({
        title: "Redirecting to Payment...",
        description: "You will be redirected to Stripe to complete your payment. (This is simulated)",
      });
      
      // Simulate delay for redirection and payment processing
      await new Promise(resolve => setTimeout(resolve, 2000)); 

      // Step 3: Simulate redirect to Stripe Checkout and successful return
      // In a real app, Stripe.js handles the redirect:
      //   const { error } = await stripe.redirectToCheckout({ sessionId });
      //   if (error) {
      //     toast({ variant: "destructive", title: "Stripe Error", description: error.message || "Redirection failed." });
      //     setIsProcessingPayment(false);
      //     return;
      //   }
      // If redirectToCheckout is successful, the user is navigated away.
      // They return to a success_url or cancel_url you configure in Stripe & your backend.
      // The actual upgradeToPaid() would ideally be triggered by a webhook from Stripe to your backend,
      // which then updates the user's status in your database, and the frontend reflects this change.
      
      console.info("SIMULATION: User would be redirected to Stripe Checkout now.");
      console.info("SIMULATION: Stripe processes payment and redirects back to your success_url.");
      console.info("SIMULATION: Your success_url page/handler verifies payment and updates user status.");

      // Step 4: Simulate successful payment confirmation & update context
      upgradeToPaid(); // This updates the local state to reflect "Premium"
      
      toast({
        variant: "default",
        title: "Upgrade Successful! (Simulated)",
        description: "You now have Premium access. Thank you!",
        className: "bg-primary text-primary-foreground"
      });

    } catch (error: any) {
      console.error("Simulated Stripe Checkout Error:", error);
      toast({
        variant: "destructive",
        title: "Upgrade Failed (Simulated)",
        description: error.message || "An unexpected error occurred during the simulated upgrade.",
      });
    } finally {
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
                  disabled={isProcessingPayment || !STRIPE_PUBLIC_KEY} // Disable if key not set
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
                    This is a real payment flow setup (frontend part).
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
            {!STRIPE_PUBLIC_KEY && (
              <p className="text-xs text-destructive mt-2">
                Stripe payments are not configured. Admin: Please set NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY.
              </p>
            )}
            {STRIPE_PUBLIC_KEY && (
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
                <li><span className="font-medium text-foreground">Priority Support:</span> Get faster help when you need it (simulated).</li>
                <li><span className="font-medium text-foreground">Advanced Features:</span> Access to future premium-only tools (simulated).</li>
            </ul>
        </div>
      </CardContent>
    </Card>
  );
}

