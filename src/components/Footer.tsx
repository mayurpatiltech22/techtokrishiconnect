import { Sprout } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="border-t bg-muted/30">
      <div className="container px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center">
                <Sprout className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="font-bold">KrishiConnect</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Empowering Maharashtra farmers with direct access to resources and information.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Services</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-primary transition-colors">Seeds & Fertilizers</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Labor Groups</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Equipment Rental</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Information</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-primary transition-colors">Weather Updates</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Market Prices</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Government Schemes</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-primary transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Contact Us</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Privacy Policy</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t pt-8 text-center text-sm text-muted-foreground">
          <p>© 2024 KrishiConnect Maharashtra. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
