import { Button } from "@/components/ui/button";
import { Sprout, Menu } from "lucide-react";

export const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-lg bg-gradient-primary flex items-center justify-center">
            <Sprout className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-bold text-lg">KrishiConnect</h1>
            <p className="text-xs text-muted-foreground">Maharashtra Agriculture</p>
          </div>
        </div>
        
        <nav className="hidden md:flex items-center gap-6">
          <a href="#services" className="text-sm font-medium hover:text-primary transition-colors">Services</a>
          <a href="#weather" className="text-sm font-medium hover:text-primary transition-colors">Weather</a>
          <a href="#market" className="text-sm font-medium hover:text-primary transition-colors">Market</a>
          <a href="#equipment" className="text-sm font-medium hover:text-primary transition-colors">Equipment</a>
          <Button variant="default" size="sm" className="bg-gradient-primary">
            Sign In
          </Button>
        </nav>
        
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-6 w-6" />
        </Button>
      </div>
    </header>
  );
};
