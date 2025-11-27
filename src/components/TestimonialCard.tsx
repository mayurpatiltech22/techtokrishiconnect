import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";

interface TestimonialCardProps {
  name: string;
  location: string;
  text: string;
  rating: number;
}

export const TestimonialCard = ({ name, location, text, rating }: TestimonialCardProps) => {
  return (
    <Card className="h-full border-2 bg-card hover:shadow-elevated transition-all">
      <CardContent className="pt-6">
        <div className="flex gap-1 mb-4">
          {[...Array(rating)].map((_, i) => (
            <Star key={i} className="h-4 w-4 fill-accent text-accent" />
          ))}
        </div>
        <p className="text-muted-foreground mb-4 italic">"{text}"</p>
        <div>
          <p className="font-semibold">{name}</p>
          <p className="text-sm text-muted-foreground">{location}</p>
        </div>
      </CardContent>
    </Card>
  );
};
