
"use client";

import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/auth-context";
import { CheckCircle, Star, Zap } from "lucide-react";
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

const FREE_TIER_LIMIT = 3;

export function SubscriptionCard() {
  const { isPaidUser, usageCount, upgradeToPaid } = useAuth();
  const [isUpgradeDialogOpen, setIsUpgradeDialogOpen] = React.useState(false);

  const handleSimulatedUpgrade = () => {
    upgradeToPaid();
    setIsUpgradeDialogOpen(false); // Close dialog after upgrade
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
                >
                  <Zap className="mr-2 h-5 w-5" />
                  Upgrade to Premium
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Simulate Premium Upgrade</AlertDialogTitle>
                  <AlertDialogDescription>
                    This is a simulated upgrade for demonstration purposes. No real payment will be processed.
                    Do you want to activate Premium features for this session?
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel onClick={() => setIsUpgradeDialogOpen(false)}>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleSimulatedUpgrade}>
                    Yes, Upgrade
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            <p className="text-xs text-muted-foreground mt-3">
              Click "Upgrade to Premium" to simulate activating paid features.
            </p>
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
