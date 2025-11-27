import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Sprout, Menu } from "lucide-react";
import { useState } from "react";

export const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setMobileMenuOpen(false);
    }
  };

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
          <button onClick={() => scrollToSection('services')} className="text-sm font-medium hover:text-primary transition-colors">Services</button>
          <button onClick={() => scrollToSection('weather')} className="text-sm font-medium hover:text-primary transition-colors">Weather</button>
          <button onClick={() => scrollToSection('schemes')} className="text-sm font-medium hover:text-primary transition-colors">Schemes</button>
          <button onClick={() => scrollToSection('equipment')} className="text-sm font-medium hover:text-primary transition-colors">Equipment</button>
          <Button variant="default" size="sm" className="bg-gradient-primary" onClick={() => scrollToSection('cta')}>
            Sign In
          </Button>
        </nav>
        
        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[300px]">
            <nav className="flex flex-col gap-4 mt-8">
              <button onClick={() => scrollToSection('services')} className="text-lg font-medium hover:text-primary transition-colors text-left">Services</button>
              <button onClick={() => scrollToSection('weather')} className="text-lg font-medium hover:text-primary transition-colors text-left">Weather</button>
              <button onClick={() => scrollToSection('schemes')} className="text-lg font-medium hover:text-primary transition-colors text-left">Schemes</button>
              <button onClick={() => scrollToSection('equipment')} className="text-lg font-medium hover:text-primary transition-colors text-left">Equipment</button>
              <Button variant="default" className="bg-gradient-primary mt-4" onClick={() => scrollToSection('cta')}>
                Sign In
              </Button>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
};
