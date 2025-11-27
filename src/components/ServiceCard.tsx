import { LucideIcon } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ServiceCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action: string;
}

export const ServiceCard = ({ icon: Icon, title, description, action }: ServiceCardProps) => {
  return (
    <Card className="h-full transition-all duration-300 hover:shadow-elevated hover:-translate-y-1 border-2">
      <CardHeader>
        <div className="w-14 h-14 rounded-xl bg-gradient-primary flex items-center justify-center mb-4">
          <Icon className="h-7 w-7 text-primary-foreground" />
        </div>
        <CardTitle className="text-xl">{title}</CardTitle>
        <CardDescription className="text-base">{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Button 
          variant="outline" 
          className="w-full border-2 hover:bg-primary hover:text-primary-foreground transition-colors"
          onClick={() => {
            const sectionMap: Record<string, string> = {
              'Browse Products': 'services',
              'Find Workers': 'services',
              'View Schemes': 'schemes',
              'Check Weather': 'weather',
              'View Prices': 'weather',
              'Rent Equipment': 'equipment'
            };
            const targetSection = sectionMap[action] || 'services';
            document.getElementById(targetSection)?.scrollIntoView({ behavior: 'smooth' });
          }}
        >
          {action}
        </Button>
      </CardContent>
    </Card>
  );
};
