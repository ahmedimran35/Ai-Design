
import { Palette } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="border-t border-border/40 bg-background">
      <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-4 py-8 sm:flex-row sm:px-6 lg:px-8">
        <div className="flex items-center gap-2">
          <Palette className="h-6 w-6 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Design Alchemist</span>
        </div>
        <p className="text-center text-sm text-muted-foreground">
          &copy; {currentYear} Design Alchemist. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
